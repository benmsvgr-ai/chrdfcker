# CHORD ATLAS v11 — Piano AI Studio

**Tambahan untuk CHORD ATLAS v10**, tanpa mengganti Circle of Fifths, Piano Studio, Chord Journey, Cheat Sheet, Belajar Notasi, dan Piano Roll 88 tuts.

## Apa yang tersedia

1. **Ambil suara video:** tempel link YouTube di `Transkripsi Lagu`, putar video di sana, klik **Rekam Video Ini**, lalu pilih **This Tab + Bagikan audio tab** saat Chrome meminta izin. Atau unggah audio yang boleh kamu gunakan. Audio YouTube tidak diunduh langsung dari link maupun disadap otomatis.
2. **Pisahkan piano:** setelah merekam, pilih di panel **Piano AI Studio**: `Piano saja` (Demucs 6 stems), `Keyboard/Synth` (bagian *other*, bukan isolasi keyboard murni), atau `Audio piano sudah bersih` (tanpa pemisahan).
3. **Dengarkan piano:** rekaman terpisah muncul di pemutar dengan opsi unduh WAV. Basic Pitch mencoba mengubah stem menjadi not MIDI dan mengirimnya ke Piano Roll Jatuh.
4. **Kembangkan:** dari not di piano roll (bisa dari audio maupun impor MIDI), pilih **AI Lokal Ollama** untuk mencoba membuat variasi/kelanjutan, atau **Variasi otomatis (tanpa AI)**. Kedua hasil bisa dimainkan dan diekspor melalui tombol MIDI yang sudah ada. Tombol **Kembali ke hasil asli** memulihkan catatan sebelumnya.

## Instalasi Windows — dua bagian

**A. Web GitHub Pages**

Upload `index.html`, `styles.css`, `app.js`, `audio-bank.js`, `favicon.svg`, dan folder `audio/` ke root repo CHORD ATLAS. **Folder `engine/` boleh ikut di-repo, tetapi tidak berjalan di GitHub Pages.**

**B. Mesin AI lokal (gratis, jalan di komputer kamu)**

1. Pasang **Python 3.10 x64** dan **FFmpeg**. Di Windows 10/11, buka PowerShell, bisa gunakan `winget install Gyan.FFmpeg`; tutup dan buka terminal kembali hingga perintah `ffmpeg -version` bekerja.
2. Ekstrak ZIP ini. Buka folder `engine`, klik **`INSTALL_WINDOWS.bat`** (sekali instal). Model Demucs cukup besar dan butuh koneksi internet pada pemakaian pertama. Instalasi juga membutuhkan ruang disk dan RAM.
3. Klik **`START_WINDOWS.bat`** untuk menjalankan mesin. Biarkan jendela itu terbuka. Buka `http://127.0.0.1:8765/health`: semestinya tampil `"ok": true` dan `"transcription": true`.
4. Buka CHORD ATLAS di GitHub Pages → `Transkripsi Lagu` → lakukan rekaman atau upload → **Piano AI Studio** → **Cek mesin lokal** → **Pisahkan & baca not piano**.
5. Opsional untuk pengembangan menggunakan model AI: pasang **Ollama**, lalu `ollama pull qwen2.5:3b`. Tanpa Ollama, pilih **Variasi otomatis (tanpa AI)**.

Tidak ada biaya API, tetapi semua komputasi berat terjadi di komputer yang menjalankan mesin. Komputer lain yang membuka web GitHub Pages tidak otomatis punya akses ke mesin AI-mu.

## Batasan dan kejujuran hasil

- YouTube dan Instagram membatasi akses ke audio iframe. Aplikasi hanya memproses audio yang kamu tangkap setelah memberi izin browser atau file yang kamu unggah.
- **Demucs htdemucs_6s tidak memisahkan piano secara sempurna**, terutama musik band padat atau keyboard sintetis. Stem `other` bisa berisi beberapa instrumen, tidak hanya keyboard.
- **Basic Pitch** mampu membaca lebih dari satu nada dan berbagai instrumen, tetapi paling cocok untuk satu instrumen yang cukup bersih. Not/timing MIDI bisa salah dan perlu diedit.
- Generasi **Ollama** berbasis model bahasa lokal, bukan model khusus komposisi musik; hasilnya eksperimen dan tidak menjamin struktur musik bagus. Opsi Variasi otomatis adalah algoritma musik, **bukan AI**.
- Mode AI lokal belum bisa dioperasikan sepenuhnya hanya dari GitHub Pages tanpa proses lokal/server. Jangan mengekspos `engine/server.py` langsung ke internet. Server memang hanya mendengar `127.0.0.1`.
- Fitur sebelumnya tetap dapat berjalan offline. Mode piano AI perlu mesin lokal dan unduhan model pada pemakaian pertama.

## Kalau gagal

- **"Mesin belum jalan"**: jalankan `engine/START_WINDOWS.bat` dan cek `http://127.0.0.1:8765/health`.
- **"FFmpeg tidak ditemukan"**: pasang FFmpeg dan buka terminal baru.
- **Model gagal dipasang**: gunakan Python 3.10 x64, jalankan ulang INSTALL_WINDOWS.bat; lihat pesan di konsol.
- **Tidak ada stem piano / piano hilang**: coba upload audio piano solo yang lebih bersih; pemisahan lagu band belum stabil.
- **Ollama menolak model**: pastikan Ollama terbuka dan model tersedia (`ollama list`).
- **Catatan MIDI berantakan**: dengarkan audio stem dulu, lalu koreksi dengan editor nada. Tidak ada jaminan MIDI asli dari audio campuran.

### Sumber teknologi

- [Demucs — model enam sumber](https://github.com/facebookresearch/demucs)
- [Spotify Basic Pitch — audio to MIDI](https://github.com/spotify/basic-pitch)
- [Ollama — API generasi JSON lokal](https://docs.ollama.com/api)
