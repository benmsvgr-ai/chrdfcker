# CHORD ATLAS v5 — Full 88-Key Piano + Audio Tab Capture

Aplikasi musik interaktif berbasis HTML/CSS/JavaScript, gratis, dapat dipasang di GitHub Pages tanpa backend dan tanpa API berbayar.

## Yang baru

- **88 tuts standar A0–C8** di piano utama dan piano roll ala Synthesia. Masing-masing terdiri dari 52 tuts putih dan 36 tuts hitam.
- Tiga tombol navigasi **Bass / Tengah / Treble**. Area piano dapat digeser dengan mouse, trackpad, atau jari. Area awal menampilkan oktaf tengah.
- Seluruh rentang piano roll dan editor manual diperpanjang ke A0–C8, termasuk impor MIDI nada rendah dan tinggi.
- **Tangkap Audio Tab** untuk menganalisis suara dari tab video YouTube/Instagram dengan izin pengguna di Chrome/Edge desktop. Rekaman disimpan sementara di browser dan langsung dianalisis jadi *perkiraan nada melodi*.
- Warna tuts menunjukkan bunyi saat dimainkan, bukan status permanen. Penanda chord kiri/kanan tetap opsional lewat "Lihat posisi chord".
- Menu lama: Piano Studio, Cheat Sheet, Circle of Fifths, Chord Journey, Belajar Notasi, transkripsi, impor/ekspor MIDI tetap dipertahankan.

## Pasang ke GitHub Pages

1. Ekstrak ZIP FULL.
2. Unggah **isi foldernya**, bukan ZIP-nya, ke root repository GitHub (`index.html`, `styles.css`, `app.js`, `audio-bank.js`, `favicon.svg`, folder `audio`, dan file lisensi).
3. Aktifkan Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
4. Setelah terbit, refresh situs dengan **Ctrl+F5** supaya file JavaScript/CSS lama tidak tersimpan di cache.

Untuk mengganti versi v4 yang sudah terpasang dan masih memiliki `audio-bank.js`, gunakan ZIP `FIX_SAJA` dan **timpa tiga file** `index.html`, `styles.css`, `app.js`.

Untuk mencoba **offline**, ekstrak ZIP `SATU_FILE` lalu buka `index.html` di Chrome/Edge. Audio piano tetap tersedia. Fitur menangkap audio tab paling andal jika aplikasi dibuka melalui **GitHub Pages (HTTPS)**.

## Cara memakai Tangkap Audio Tab

1. Buka **Transkripsi Lagu** di CHORD ATLAS.
2. Buka video YouTube/Instagram di tab Chrome/Edge lain.
3. Di aplikasi, klik **Tangkap Audio Tab**.
4. Pada dialog browser, pilih **Chrome Tab** (bukan Entire Screen), pilih tab video, lalu aktifkan **Share tab audio / Bagikan audio tab**.
5. Putar video dan biarkan audio berjalan. Kembali ke aplikasi, klik **Selesai & Deteksi**. Maksimal 5 menit per rekaman.
6. Nada hasil analisis dimuat ke Piano Roll Jatuh; tekan **Putar**. Perbaiki lewat Editor nada, dan ekspor ke MIDI jika perlu.

**Batasan:** link YouTube/Instagram tidak otomatis memberikan akses ke audio video. Tidak ada pengunduhan/pengambilan tersembunyi. Fitur Tab Capture meminta persetujuan pengguna. Algoritme deteksi nada lokal memperkirakan melodi dominan, **bukan** memisahkan seluruh instrumen atau menghasilkan chord yang selalu akurat. Gunakan MIDI untuk hasil polifonik lebih akurat. Rekam dan olah hanya materi yang boleh Anda gunakan.

## Mengetes piano

Klik **Tes suara**. Jika belum berbunyi, pastikan browser mengizinkan suara dan volume perangkat aktif. Sampel suara grand piano disimpan lokal dalam `audio-bank.js`, tanpa permintaan ke server audio.

## Lisensi audio

Bank sampel piano berasal dari TimGM6mb SoundFont, **GPL-2.0-only**. Lihat `audio/CREDITS.txt` dan `LICENSE`. Redistribusi bank sampel harus mempertahankan ketentuan lisensi tersebut. Paket ini menyertakan kredit dan teks lisensinya.
