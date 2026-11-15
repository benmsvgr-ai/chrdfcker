# CHORD ATLAS v8 — Volume MIDI diperbesar

Tambahan di atas seluruh fitur v7:

- Volume playback MIDI di piano roll default 200%, bisa diatur 50–250%.
- Volume yang dipilih disimpan lokal, tanpa mengubah timing atau nada.
- Ekspor MIDI kini mengikuti level velocity dari slider (default 110, bukan 85).
- Menggunakan compressor audio yang sudah ada untuk membantu menahan lonjakan volume saat banyak not berbunyi bersamaan.
- Meningkatkan volume tidak memperbaiki nada transkripsi yang salah. Mode AI Piano masih lebih sesuai untuk piano yang jernih daripada musik band penuh.

Upload semua file FULL ke root GitHub Pages, atau timpa `index.html`, `styles.css`, `app.js` dengan FIX SAJA. Lalu Ctrl+F5.

---

# CHORD ATLAS v7 — AI Piano Solo + Audio to MIDI

Versi ini mempertahankan seluruh menu v6: Piano Studio, Cheat Sheet, Circle of Fifths, Chord Journey, Belajar Notasi, tangkap audio tab, editor, dan piano roll 88 tuts.

## Apa yang diperbaiki

v6 mengandalkan FFT/harmonic salience yang sering menganggap harmonik bass atau drum sebagai not piano. **v7 menambahkan mode baru AI Piano Solo (Magenta Onsets & Frames)**, model terlatih untuk membaca permainan piano dua tangan, bukan sekadar puncak spektrum.

- `AI Piano Solo` (default) — memerlukan internet hanya untuk memuat skrip TensorFlow.js/Magenta dan checkpoint ±30 MB pada penggunaan pertama. Memproses audio lokal di browser (bukan diunggah ke API). Untuk audio piano yang relatif bersih.
- `Cepat: melodi sederhana` — FFT lama sebagai pembanding, bukan hasil profesional.
- `Eksperimen: chord` — FFT lama sebagai pembanding, tidak direkomendasikan untuk musik band campuran.
- Setelah `Selesai Rekam`, audio tidak otomatis dijadikan MIDI palsu. Pengguna memilih metode dan menekan **Analisis Audio → MIDI**.
- Pengaturan lama tetap: piano roll jatuh, editor not, impor/ekspor MIDI, audio samplenya, 88 tuts tanpa geser, sidebar lipat.

## Instalasi GitHub Pages

Upload semua isi ZIP FULL ke root repository GitHub Pages, timpa file sebelumnya, kemudian refresh halaman (`Ctrl+F5`). Untuk FIX SAJA, timpa **index.html, app.js, styles.css**. Pastikan audio-bank.js versi v6 tetap ada.

## Cara pakai

1. Ambil audio memakai **Tangkap Audio Tab** dengan izin Chrome (pilih tab yang benar dan centang Bagikan audio tab), atau upload WAV/MP3/M4A.
2. Klik **Selesai Rekam**. Saat audio diterima, pastikan pemutar audio bisa memainkannya.
3. Pilih **AI Piano Solo** dan durasi analisis: 30, 60, atau seluruh rekaman (maks. 4 menit).
4. Klik **Analisis Audio → MIDI**. Pertama kali online dan unduhan model ±30MB. Beri ruang RAM untuk browser.
5. Setelah hasil muncul, cocokkan dengan audio, edit manual seperlunya, lalu klik **↓ MIDI**.

## Batasan penting

**AI Piano Solo bukan pemisah instrumen.** T-Square/Casiopea berisi bass, drum, gitar, saksofon/keyboard; model tetap bisa menghasilkan nada keliru dari campuran penuh. Untuk hasil lebih baik, masukkan audio keyboard/piano yang sudah dipisah (stem), atau MIDI asli. Pemisahan piano lewat Demucs 6-stem juga tidak selalu bersih (pengembangnya menyatakan stem piano belum bekerja bagus). Hasil tidak dijamin sama dengan lagu asli.

GitHub Pages saja tidak bisa membaca audio YouTube iframe lintas-origin secara langsung; berbagi audio tab tetap memerlukan persetujuan browser.

## Dasar teknis

TensorFlow.js 1.7.4 + @magenta/music 1.23.1 dari jsDelivr (lazy-loaded), checkpoint `onsets_frames_uni_q2` resmi Magenta (~30 MB). Ketergantungan eksternal ini **tidak di-bundle** dalam ZIP agar halaman pertama tetap cepat dan paket ZIP kecil. Semua menu selain analisis AI tetap jalan offline. Fitur model AI membutuhkan koneksi internet dan dapat terpengaruh kebijakan CDN.

Lisensi dan kredit sumber aplikasi tetap di berkas LICENSE dan audio/CREDITS.txt.
