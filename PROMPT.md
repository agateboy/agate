# Execution Prompt

Baca `RULES.md` dan `DATA.md`. Kita akan membangun arsitektur Full-Stack (UI, Database, dan Admin Dashboard) secara iteratif.

ATURAN EKSEKUSI:
Selesaikan HANYA SATU langkah, lalu berhenti. Berikan pesan: "Langkah [X] selesai. Ketik 'Lanjut' untuk meneruskan."

Urutan Langkah:
1. Inisialisasi Prisma (`npx prisma init`). Konfigurasikan file `schema.prisma` menggunakan SQLite (untuk tahap pengembangan lokal) berdasarkan model di `DATA.md`. Jalankan migrasi awal (`npx prisma db push`).
2. Bangun sistem Autentikasi. Buat halaman login `/admin/login`, dan pasang Middleware Next.js untuk memblokir akses ke `/admin/*` kecuali pengguna memiliki cookie sesi yang valid dari kata sandi di `.env`.
3. Bangun API Routes atau Server Actions untuk operasi CRUD pada tabel `Profile` dan `Project`. Termasuk logika pengunggahan file (simpan ke direktori `/public/uploads` sementara untuk pengembangan lokal).
4. Bangun UI Halaman Admin (`/admin`). Buat form terpadu untuk mengedit Profil (Nama, Bio, Tautan, unggah Foto, unggah CV) dan form untuk menambah/menghapus Proyek (Judul, Tahun, Deskripsi, unggah Gambar Pratinjau).
5. Bersihkan `src/app/page.tsx`.
6. Bangun komponen UI Publik (`Hero.tsx` dan `Projects.tsx`). Tarik seluruh data secara dinamis dari basis data Prisma. Jika data kosong, tampilkan *skeleton loading* atau nilai *fallback*.
7. Terapkan desain visual (Tailwind CSS, Framer Motion, hover effects) pada halaman publik agar sesuai standar estetika minimalis modern.