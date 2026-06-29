# Tech Stack & Full-Stack Architecture Rules

## Core Technologies
* Framework: Next.js (App Router, TypeScript).
* Styling: Tailwind CSS, Lucide React, Framer Motion.
* Database ORM: Prisma.
* File Uploads: Implementasi API untuk mengunggah gambar dan file PDF.
* Security: Sistem autentikasi admin sederhana menggunakan Middleware dan JWT/Cookie yang divalidasi dengan `ADMIN_PASSWORD` dari file `.env`.

## Architecture & Data Flow
* DILARANG melakukan "hardcode" pada teks apa pun di antarmuka publik.
* Seluruh data (Nama, Bio, Tautan, Gambar, CV, Proyek) wajib dipanggil dari basis data.
* Buat dua area utama:
  1. Public Facing (`/`): Halaman portofolio utama (Hero dan Projects).
  2. Admin Dashboard (`/admin`): Halaman tertutup (protected route) berisi form CRUD untuk memperbarui bio, mengelola proyek, dan mengunggah file.

## UI/UX Design System
* Tema Portofolio Publik: Apple-Style, bersih, transisi mulus, hover-to-scale pada gambar proyek.
* Tema Admin Dashboard: Fungsional, tata letak grid untuk form, tabel untuk daftar proyek, dan status unggahan yang jelas.