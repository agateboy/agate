# Database Schema & Data Models

## 1. Environment Variables (.env)
* `ADMIN_PASSWORD`: Kata sandi tunggal untuk masuk ke halaman `/admin`.
* `DATABASE_URL`: String koneksi basis data.

## 2. Prisma Schema Definition
Bangun skema Prisma dengan dua model utama:

* Model `Profile`:
  - id (String, default uuid)
  - name (String)
  - role (String)
  - description (Text)
  - profile_image_url (String, nullable)
  - cv_file_url (String, nullable)
  - github_url (String, nullable)
  - linkedin_url (String, nullable)
  - updated_at (DateTime)

* Model `Project`:
  - id (String, default uuid)
  - title (String)
  - year (String)
  - description (Text)
  - tech_stack (String) // Bisa disimpan sebagai string pisah koma
  - image_url (String, nullable)
  - reference_url (String, nullable)
  - created_at (DateTime)

## 3. Upload Mechanism
* Buat logika pengunggahan file melalui Server Actions atau Route Handlers.
* Simpan URL/path file yang berhasil diunggah ke dalam field URL pada basis data di atas.