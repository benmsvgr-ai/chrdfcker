# CHORD ATLAS v10 — Pilihan Instrumen

Pilih fokus **Piano akustik, Keyboard / Synth / Organ, Bass, Gitar, Sax / Melodi, Strings / Brass, Drum, atau Semua instrumen** di menu Transkripsi Lagu.

## Apa yang benar-benar bisa dilakukan

- **MIDI multi-track:** memilih instrumen berdasarkan program General MIDI, channel, dan label track. Hasilnya langsung difilter di piano roll dan ekspor MIDI mengikuti jalur terpilih. Kualitas mengikuti MIDI sumber. MIDI tanpa penandaan instrumen dapat terklasifikasi keliru; pilih *Semua instrumen* jika tidak ada jalur yang ditemukan.
- **Audio piano:** model Magenta Onsets & Frames tetap tersedia untuk rekaman piano relatif bersih. Memerlukan unduhan model saat pertama dipakai.
- **Audio synth / bass / gitar / melodi:** mode deteksi perkiraan (FFT) dibatasi register/fokus, **bukan instrument source separation**. Jangan mengandalkan akurasi pada audio full band. Untuk lebih rapi, unggah audio stem yang sudah dipisah di luar aplikasi.
- **Drum audio:** belum didukung. Drum tersedia hanya dari MIDI channel drum.

Fitur lain tetap: capture audio tab, piano 88 tuts, Piano Roll Jatuh, volume MIDI, Circle of Fifths, Chord Journey, Cheat Sheet, Belajar Notasi.

## Pemasangan

GitHub Pages: unggah seluruh isi ZIP FULL ke root repo. Alternatif: file FIX menggantikan `index.html`, `styles.css`, `app.js` di v9. Tekan `Ctrl+F5` setelah GitHub Pages selesai deploy.

**Catatan:** model transkripsi audio serbaguna yang dapat memisahkan setiap instrumen dari suara YouTube belum tersedia pada build statis ini. Jangan menganggap pilihan fokus instrumen sebagai hasil stem separation.
