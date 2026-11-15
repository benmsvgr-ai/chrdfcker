# CHORD ATLAS v4 — Falling Piano Roll

Web aplikasi musik untuk GitHub Pages, HTML/CSS/JavaScript tanpa backend atau API berbayar.

## Perbaikan v4

- Piano utama **normal saat tidak dimainkan**. Tidak ada tombol yang tampak ditekan saat diam.
- Tekan **Lihat posisi chord** jika ingin menampilkan penanda biru/oranye untuk LH/RH. Ini panduan opsional, bukan tanda nada sedang berbunyi.
- Menu **Transkripsi Lagu** menampilkan *Piano Roll Jatuh*: balok bergerak dari atas ke keyboard dan tuts menyala saat nada mencapai garis main.
- Rentang visual C2–C6, termasuk nada bass tangan kiri, sampai 49 tuts.
- Mode contoh melodi dua tangan, pause/lanjutkan/stop, kecepatan 0.5x hingga 1.5x, seek, serta editor piano roll lama yang dapat dibuka bila diperlukan.
- Impor MIDI, deteksi melodi dari audio unggahan, dan ekspor MIDI tetap ada.
- Suara tetap dari sampel Grand Piano offline yang dipaketkan.

## Menjalankan

**Pilihan paling gampang:** buka ZIP `CHORD_ATLAS_v4_1_FILE.zip`, ekstrak, lalu klik dua kali `index.html` di Chrome/Edge. Semua kode dan suara piano sudah tertanam di satu file.

**Untuk GitHub Pages:** ekstrak `CHORD_ATLAS_v4_FULL_GITHUB.zip`, unggah seluruh isi ke root repository (`index.html`, `styles.css`, `app.js`, `audio-bank.js`, dll.). Di Settings → Pages pilih deploy dari branch `main` / root.

**Perbaikan saja:** dari ZIP `CHORD_ATLAS_v4_FIX_SAJA.zip`, timpa `index.html`, `styles.css`, `app.js`. `audio-bank.js` v3 yang lama tetap dipakai tanpa perubahan.

## Mencoba piano roll

Buka **Transkripsi Lagu** → **Contoh** → **Putar**. Nada akan turun mengikuti waktu dan berbunyi ketika menyentuh tuts. Coba impor `.mid` untuk menampilkan lagu sendiri, atau unggah rekaman sendiri untuk perkiraan melodi tunggal.

Untuk koreksi manual, klik **Editor nada**. Chord dan melodi dengan banyak nada yang sudah ada di file MIDI ditampilkan bersama, tetapi algoritme analisis audio lokal **bukan** pemisah instrumen multi-track. Link YouTube/Instagram hanya untuk referensi tontonan: tidak otomatis disedot menjadi file audio/piano roll.

## Audio

Audio piano disimpan sebagai sampel dan tetap bisa dimainkan offline. Kualitas/respons dipengaruhi browser dan pengaturan suara perangkat. Jika browser membatasi audio awal, klik **Tes suara** sekali.
