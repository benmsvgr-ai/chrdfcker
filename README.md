# CHORD ATLAS v6 — Audio to MIDI + Fixed 88 Keys

## Update di GitHub Pages

Upload file dan folder dari ZIP FULL ke root repository (tempat `index.html`), menggantikan versi sebelumnya. `styles.css?v=6.0.1` dan `app.js?v=6.0.1` memakai parameter versi agar browser tidak menampilkan cache lama. Jika memakai ZIP FIX SAJA, timpa `index.html`, `styles.css`, `app.js` (file `audio-bank.js` versi v5 tetap dipakai).

## Cara tangkap audio tab YouTube / Instagram

1. Buka CHORD ATLAS melalui GitHub Pages (alamat `https://...`), lalu buka video dalam tab Chrome lain.
2. Menu **Transkripsi Lagu** → **Tangkap Audio Tab**.
3. Pada dialog Chrome pilih **Chrome Tab**, pilih tab YouTube/Instagram dan aktifkan **Share tab audio / Bagikan audio tab**. Jangan pilih **Entire Screen / Seluruh Layar**.
4. Putar video; selesai merekam klik **Selesai & Deteksi**. Audio ditangkap hanya setelah izin diberikan.
5. Pilih **Melodi utama** atau **Piano & chord (perkiraan beberapa nada)**; lalu tekan **Deteksi Audio → MIDI** bila ingin memproses ulang.
6. Hasilnya masuk ke **Piano Roll Jatuh**. Tekan **↓ MIDI** untuk mengunduh, atau **Editor nada** untuk memperbaiki nada.

Aplikasi tidak mendownload audio dari link YouTube/Instagram secara otomatis. Yang dibaca adalah audio tab yang dibagikan pengguna dengan izin browser. Pengambilan audio langsung dari iframe YouTube/Instagram dibatasi browser/platform.

## Perbaikan v6

- Merekam audio Chrome Tab dengan MediaRecorder tanpa jalur monitor yang memutar audio dua kali/bergema.
- Menampilkan pesan jika tab tidak memiliki audio track. Rekaman audio diteruskan ke deteksi nada lalu dapat diekspor menjadi .mid.
- Dua metode deteksi on-device: melodi utama, serta estimasi beberapa nada simultan (eksperimental).
- Piano dan piano roll 88 tuts A0–C8 **mengisi lebar panel** tanpa scroll horizontal.
- Sidebar bisa dilipat untuk memenuhi layar dan pilihan disimpan di browser.
- Tampilan transkripsi menggunakan panel selebar konten, bukan dua kolom dengan ruang kosong.
- Tidak memerlukan backend, API berbayar, atau layanan eksternal untuk analisis audio. Sampel audio grand piano terintegrasi melalui `audio-bank.js`.

## Batasan penting

Analisis otomatis sederhana ini tidak setara model pemisahan instrumen. Untuk piano solo dan melodi yang jelas hasilnya lebih baik. Lagu fusion dengan gitar, bass, sax, drum, dan instrumen tumpang tindih bisa menghasilkan nada salah, nada hilang, atau chord tidak lengkap. MIDI adalah *hasil perkiraan* dan bisa disunting. Tanpa pemisahan instrumen/ML yang lebih kuat, tidak ada jaminan transkripsi sempurna.

Pengujian otomatis: audio uji A4 440 Hz dan C5 523 Hz berhasil terbaca, file MIDI dapat diunduh, simulasi MediaRecorder audio tab berhasil, tuts utama dan piano roll 88 buah masing-masing, sidebar collapse, tidak ada JS page errors. Streaming langsung dari YouTube sebenarnya tetap harus dites di Chrome pengguna karena browser meminta pilihan tab secara manual.

Licensing: see LICENSE and audio/CREDITS.txt for audio attribution. All code and samples remain subject to respective source licenses.
