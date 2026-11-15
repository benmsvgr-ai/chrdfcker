"""CHORD ATLAS local Piano AI worker.

Runs ONLY on 127.0.0.1. It accepts audio supplied by the browser (uploaded or
user-approved tab recording); it intentionally does not bypass YouTube controls.

Optional heavyweight models are loaded only on explicit processing request.
"""
from __future__ import annotations

import json
import os
import random
import shutil
import subprocess
import sys
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any
from urllib import error, request

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

HERE = Path(__file__).resolve().parent
JOBS_DIR = HERE / "jobs"
JOBS_DIR.mkdir(exist_ok=True)
MAX_BYTES = 70 * 1024 * 1024

# No wildcard Origin on a local service. Set extra allowed Pages origins via env.
ALLOWED_ORIGINS = [
    "https://benmsvgr-ai.github.io", "http://localhost:8000", "http://127.0.0.1:8000",
    "http://localhost:5500", "http://127.0.0.1:5500", "null",
]
ALLOWED_ORIGINS += [x.strip() for x in os.getenv("ATLAS_ALLOWED_ORIGINS", "").split(",") if x.strip()]

app = FastAPI(title="CHORD ATLAS Piano AI Engine", version="11.0")
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["*"], expose_headers=["Content-Disposition"])

# Chrome may preflight local-network requests from an HTTPS page.
@app.middleware("http")
async def private_network_access(request_obj: Request, call_next):
    response = await call_next(request_obj)
    if request_obj.headers.get("access-control-request-private-network", "").lower() == "true":
        response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

jobs: dict[str, dict[str, Any]] = {}
lock = threading.Lock()
worker = ThreadPoolExecutor(max_workers=1, thread_name_prefix="chord-atlas-ai")


def set_job(job_id: str, **kwargs: Any) -> None:
    with lock:
        jobs[job_id].update(kwargs)


def run_command(cmd: list[str], cwd: Path | None = None) -> None:
    try:
        proc = subprocess.run(cmd, cwd=str(cwd) if cwd else None, stdout=subprocess.PIPE,
                              stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace", check=False)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Perintah tidak ditemukan: {cmd[0]}. Install FFmpeg dan cek PATH.") from exc
    if proc.returncode:
        tail = (proc.stdout or "")[-1600:]
        raise RuntimeError(f"Perintah gagal ({proc.returncode}). {tail}")


def note_events(midi_path: Path) -> list[dict[str, Any]]:
    try:
        import pretty_midi
    except ImportError as exc:
        raise RuntimeError("Paket pretty_midi belum terpasang. Jalankan INSTALL_WINDOWS.bat.") from exc
    parsed = pretty_midi.PrettyMIDI(str(midi_path))
    events = []
    for instrument in parsed.instruments:
        if instrument.is_drum:
            continue
        for n in instrument.notes:
            if n.end <= n.start or not 21 <= n.pitch <= 108:
                continue
            events.append({"midi": n.pitch, "start": round(max(0., n.start), 4),
                           "duration": round(n.end-n.start, 4), "velocity": n.velocity,
                           "source": "ai-transcribed"})
    return sorted(events, key=lambda n: (n["start"], n["midi"]))[:12000]


def process_job(job_id: str, mode: str, source_file: Path) -> None:
    directory = JOBS_DIR / job_id
    try:
        set_job(job_id, status="running", progress=8, stage="Membaca rekaman")
        if not shutil.which("ffmpeg"):
            raise RuntimeError("FFmpeg tidak ditemukan. Pasang FFmpeg terlebih dahulu, lalu jalankan ulang mesin lokal.")
        decoded = directory / "source.wav"
        run_command(["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", str(source_file),
                     "-t", "240", "-ar", "44100", "-ac", "2", str(decoded)])
        stem_file = decoded
        if mode in {"piano", "keyboard"}:
            set_job(job_id, progress=18, stage="Memisahkan instrumen memakai Demucs (model diunduh saat pertama kali)")
            out = directory / "separation"
            run_command([sys.executable, "-m", "demucs", "-n", "htdemucs_6s", "-o", str(out), str(decoded)])
            folder = out / "htdemucs_6s" / "source"
            target = "piano.wav" if mode == "piano" else "other.wav"
            stem_file = folder / target
            if not stem_file.is_file():
                raise RuntimeError(f"Stem {target} tidak ditemukan di keluaran Demucs. Periksa log instalasi.")
        set_job(job_id, progress=65, stage="Membaca not instrumen memakai Basic Pitch")
        stem_dest = directory / "isolated.wav"
        if stem_file != stem_dest:
            shutil.copy2(stem_file, stem_dest)
        midi_output = directory / "basic_pitch_output"
        midi_output.mkdir(exist_ok=True)
        # Basic Pitch command line produces *_basic_pitch.mid
        run_command([sys.executable, "-m", "basic_pitch.predict", str(midi_output), str(stem_dest)])
        paths = list(midi_output.glob("*.mid"))
        if not paths:
            paths = list(midi_output.rglob("*.mid"))
        if not paths:
            raise RuntimeError("Basic Pitch selesai, tetapi tidak menghasilkan file MIDI.")
        midi_file = directory / "transkripsi.mid"
        shutil.copy2(paths[0], midi_file)
        events = note_events(midi_file)
        set_job(job_id, status="done", progress=100, stage="Selesai; dengarkan stem dan periksa MIDI",
                notes=events, files={"stem": f"/api/assets/{job_id}/isolated.wav",
                                      "midi": f"/api/assets/{job_id}/transkripsi.mid"},
                warning=("Stem piano Demucs dapat bercampur instrumen lain. " if mode == "piano" else
                         "Stem 'other' bukan keyboard murni dan bisa mengandung gitar/synth lain. " if mode == "keyboard" else
                         "Sumber diperlakukan sebagai instrumen tunggal. ")+
                        "MIDI adalah perkiraan; periksa nada dan timing sebelum digunakan.")
    except Exception as exc:
        set_job(job_id, status="failed", progress=0, stage="Gagal", error=str(exc))


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "name": "CHORD ATLAS Piano AI Engine", "version": "11", "ffmpeg": bool(shutil.which("ffmpeg")),
            "separation": __import__("importlib").util.find_spec("demucs") is not None,
            "transcription": __import__("importlib").util.find_spec("basic_pitch") is not None}


@app.post("/api/process", status_code=202)
async def submit_process(audio: UploadFile = File(...), mode: str = Form("piano")) -> dict[str, str]:
    if mode not in ("piano", "keyboard", "clean"):
        raise HTTPException(422, "mode harus piano, keyboard, atau clean")
    if audio.content_type and not (audio.content_type.startswith("audio/") or audio.content_type in ("application/octet-stream", "video/webm", "video/mp4")):
        raise HTTPException(415, "Berkas bukan audio. Gunakan rekaman tab atau upload WAV/MP3/M4A.")
    jid = uuid.uuid4().hex
    job_dir = JOBS_DIR / jid
    job_dir.mkdir(parents=True, exist_ok=True)
    extension = (Path(audio.filename or "input.webm").suffix or ".webm").lower()
    if extension not in {".wav", ".mp3", ".m4a", ".aac", ".mp4", ".webm", ".ogg", ".flac"}:
        extension = ".webm"
    input_file = job_dir / f"input{extension}"
    bytes_count = 0
    with input_file.open("wb") as f:
        while True:
            block = await audio.read(1024 * 1024)
            if not block:
                break
            bytes_count += len(block)
            if bytes_count > MAX_BYTES:
                f.close()
                shutil.rmtree(job_dir, ignore_errors=True)
                raise HTTPException(413, "File terlalu besar (maksimum 70 MB). Rekam bagian yang ingin dikulik saja.")
            f.write(block)
    if bytes_count < 1024:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(422, "Audio kosong atau terlalu pendek.")
    with lock:
        jobs[jid] = {"id": jid, "status": "queued", "progress": 1, "stage": "Menunggu mesin", "notes": []}
    worker.submit(process_job, jid, mode, input_file)
    return {"job_id": jid, "message": "Audio diterima. Analisis lokal dimulai."}


@app.get("/api/jobs/{job_id}")
def read_job(job_id: str) -> dict[str, Any]:
    with lock:
        job = jobs.get(job_id)
        if job is None:
            raise HTTPException(404, "Pekerjaan tidak ditemukan di sesi mesin lokal ini.")
        return dict(job)


@app.get("/api/assets/{job_id}/{filename}")
def get_asset(job_id: str, filename: str):
    if job_id not in jobs or filename not in {"isolated.wav", "transkripsi.mid"}:
        raise HTTPException(404, "Berkas tidak ditemukan")
    path = JOBS_DIR / job_id / filename
    if not path.is_file():
        raise HTTPException(404, "Berkas belum tersedia")
    return FileResponse(path, media_type="audio/wav" if filename.endswith(".wav") else "audio/midi",
                        filename=filename if filename.endswith(".mid") else None)


class GenerateRequest(BaseModel):
    notes: list[dict[str, Any]] = Field(default_factory=list, max_length=5000)
    bpm: int = Field(default=110, ge=45, le=240)
    bars: int = Field(default=4, ge=2, le=16)
    style: str = Field(default="fusion", pattern="^(fusion|jazz|ballad|pop)$")
    method: str = Field(default="ollama", pattern="^(ollama|variation)$")
    model: str = Field(default="qwen2.5:3b", max_length=80)
    action: str = Field(default="continue", pattern="^(continue|variation)$")


def sanitize_notes(raw: list[dict[str, Any]], *, max_sec: float, start_offset: float = 0., source: str = "generated") -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    for n in raw[:1000]:
        if not isinstance(n, dict):
            continue
        try:
            pitch = int(n.get("midi", n.get("pitch", 0)))
            start = float(n.get("start", 0))
            duration = float(n.get("duration", 0.25))
            vel = int(n.get("velocity", 82))
        except (ValueError, TypeError):
            continue
        if not (36 <= pitch <= 96 and 0 <= start < max_sec and 0.07 <= duration <= 10):
            continue
        output.append({"midi": pitch, "start": round(start + start_offset, 4),
                       "duration": round(min(duration, max_sec - start), 4), "velocity": max(35, min(120, vel)), "source": source})
    return sorted(output, key=lambda n: (n["start"], n["midi"]))


def automatic_variation(source: list[dict[str, Any]], bpm: int, bars: int, style: str, action: str) -> list[dict[str, Any]]:
    """Transparent music-rule fallback, intentionally NOT advertised as AI."""
    if not source:
        raise ValueError("Piano roll masih kosong. Impor MIDI atau transkripsikan audio dulu.")
    beat = 60. / bpm
    bar_sec = beat * 4
    segment_sec = min(8 * bar_sec, max(bar_sec, bars * bar_sec))
    end_sec = max(float(n.get("start", 0)) + float(n.get("duration", .2)) for n in source)
    # Take the ending passage; replay / vary it over a new section.
    excerpt_begin = max(0., end_sec - segment_sec)
    recent = [n for n in source if float(n.get("start", 0)) >= excerpt_begin]
    if not recent:
        recent = source[-40:]
    rnd = random.Random(int(end_sec*1000) + bars*13 + sum(ord(x) for x in style))
    style_shift = {"fusion": [0,2,0,-2,5], "jazz": [0,0,2,-1,3],
                   "ballad": [0,0,0,-2], "pop": [0,0,2]}[style]
    result = []
    for source_note in recent[:500]:
        shifted = (float(source_note.get("start", 0)) - excerpt_begin) % (bars*bar_sec)
        if shifted >= bars * bar_sec:
            continue
        midi = int(source_note.get("midi", 60)) + rnd.choice(style_shift)
        if midi < 42 or midi > 90:
            midi = int(source_note.get("midi", 60))
        duration = max(.1, min(beat * (2 if style == "ballad" else 1.5), float(source_note.get("duration", .25)) * (1.25 if style == "ballad" else 1)))
        result.append({"midi": midi, "start": shifted, "duration": duration, "velocity": 85})
    # Space to make room for more than one excerpt if bars > excerpt length.
    if result:
        unit = max(x["start"] + x["duration"] for x in result)
        for i in range(1, min(8, int(bars*bar_sec/max(unit, .1))+1)):
            for n in result[:]:
                if n["start"] + unit*i >= bars*bar_sec:
                    continue
                result.append({**n,"start":n["start"] + unit*i})
    return sanitize_notes(result, max_sec=bars*bar_sec)


def generate_with_ollama(original: list[dict[str, Any]], bpm: int, bars: int, style: str, model: str, action: str) -> list[dict[str, Any]]:
    duration = bars * 4 * 60. / bpm
    sample = sorted(original, key=lambda n: float(n.get("start", 0)))[-90:]
    end = max([float(n.get("start", 0))+float(n.get("duration", .2)) for n in sample] or [0])
    digest = [{"pitch":int(n.get("midi",60)),"start":round(float(n.get("start", 0))-max(0,end-12),2),
               "duration":round(float(n.get("duration", .25)),2)} for n in sample]
    prompt = ("You compose an ORIGINAL piano MIDI continuation or alternative arrangement, not copy of the original composition. "
              f"Style: {style}; BPM: {bpm}; bars: {bars}; action: {action}. "
              f"Duration in seconds: {duration:.2f}. Make piano chords and melody with 2 hands, playable, "
              "voice-leading and rhythm; MIDI pitch 36..96. "
              "Return ONLY JSON object {\"notes\":[{\"midi\":60,\"start\":0.0,\"duration\":0.3,\"velocity\":85}]}. "
              "Note starts must be relative to ZERO, not the source. 24 to 120 notes total. "
              f"Reference pitches and rhythms (not exact continuation): {json.dumps(digest, separators=(',',':'))}")
    body = json.dumps({"model": model, "prompt": prompt, "format": "json", "stream": False,
                       "options": {"temperature": 0.65, "num_predict": 2400}}).encode()
    try:
        req = request.Request("http://127.0.0.1:11434/api/generate", data=body,
                              headers={"Content-Type": "application/json"}, method="POST")
        with request.urlopen(req, timeout=150) as resp:
            outer = json.loads(resp.read(3_000_000).decode("utf-8"))
        response = json.loads(outer.get("response", "{}"))
        generated = sanitize_notes(response.get("notes", []), max_sec=duration)
        if not generated:
            raise RuntimeError("Model tidak memberi not MIDI yang valid. Coba ulang atau gunakan Variasi otomatis.")
        return generated
    except error.HTTPError as exc:
        raise RuntimeError(f"Ollama menolak permintaan ({exc.code}). Cek nama model dan jalankan: ollama pull {model}.") from exc
    except error.URLError as exc:
        raise RuntimeError("Ollama belum berjalan. Jalankan Ollama, lalu unduh model yang dipilih (contoh: ollama pull qwen2.5:3b).") from exc


@app.post("/api/expand")
def expand_music(req: GenerateRequest) -> dict[str, Any]:
    if not req.notes:
        raise HTTPException(422, "Piano roll masih kosong. Isi dulu hasil transkripsi atau impor MIDI.")
    try:
        generated = (generate_with_ollama(req.notes, req.bpm, req.bars, req.style, req.model, req.action)
                     if req.method == "ollama" else automatic_variation(req.notes, req.bpm, req.bars, req.style, req.action))
    except Exception as exc:
        raise HTTPException(502, str(exc)) from exc
    end = max(float(n.get("start", 0)) + float(n.get("duration", .2)) for n in req.notes)
    beat = 60. / req.bpm
    offset = (int(end / (4 * beat)) + 1) * 4 * beat if req.action == "continue" else 0.
    return {"notes": [{**n, "start": round(n["start"] + offset, 4), "source": "ai-generated" if req.method == "ollama" else "arranged"} for n in generated],
            "method": req.method, "action": req.action,
            "warning": ("Hasil AI adalah kreasi baru, bukan nada asli lagu." if req.method == "ollama" else
                        "Ini variasi aturan musik, bukan generasi AI.")}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8765)
