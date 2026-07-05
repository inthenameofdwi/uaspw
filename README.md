# 🎬 Bioskop App - Sistem Pemesanan Tiket Bioskop

## 📋 Deskripsi Proyek

**Bioskop App** adalah aplikasi web untuk sistem pemesanan tiket bioskop yang dirancang khusus untuk **kasir bioskop**. Aplikasi ini memungkinkan kasir untuk:

- Mengelola data film (CRUD)
- Mengelola jadwal tayang
- Melakukan pemesanan tiket dengan pemilihan kursi interaktif
- Melihat daftar pembeli
- Memantau statistik penjualan melalui dashboard

Aplikasi ini dibangun dengan **React.js** sebagai frontend dan **Express.js** sebagai backend, dengan database **MySQL**.

---

## 👤 Pengguna Aplikasi

| Role | Username | Password | Deskripsi |
|------|----------|----------|-----------|
| Admin/Kasir | `admin` | `admin123` | Pengelola utama yang dapat mengakses semua fitur |

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Database
- **JWT** - Autentikasi
- **Bcrypt** - Enkripsi password
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React.js** - Library UI
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Boxicons** - Icon library
- **Neobrutalism** - Custom design theme

---

## 📁 Struktur Proyek

```
bioskop-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Konfigurasi database
│   ├── controllers/
│   │   ├── authController.js     # Autentikasi
│   │   ├── filmController.js     # CRUD Film
│   │   ├── jadwalController.js   # CRUD Jadwal
│   │   ├── pembeliController.js  # Data pembeli
│   │   ├── pemesananController.js# Pemesanan tiket
│   │   └── tiketController.js    # Manajemen tiket
│   ├── middleware/
│   │   └── auth.js               # Middleware autentikasi
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── filmRoutes.js
│   │   ├── jadwalRoutes.js
│   │   ├── pembeliRoutes.js
│   │   ├── pemesananRoutes.js
│   │   └── tiketRoutes.js
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point backend
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingSelectFilm.jsx
│   │   │   ├── BookingSelectSchedule.jsx
│   │   │   ├── Confirmation.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FilmDetail.jsx
│   │   │   ├── FilmManage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JadwalManage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderForm.jsx
│   │   │   ├── PembeliList.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── styles/
│   │   │   └── neobrutalism.css  # Tema kustom
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── db_bioskop.sql                # Database dump
```

---

## 📦 Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

1. **Node.js** (versi 16 atau lebih tinggi)
   - Download: https://nodejs.org/
   - Cek versi: `node --version`

2. **MySQL** (versi 5.7 atau lebih tinggi)
   - Download: https://www.mysql.com/downloads/
   - Cek versi: `mysql --version`

3. **Git** (opsional, untuk clone)
   - Download: https://git-scm.com/

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Clone atau Download Proyek

```bash
# Clone repository (jika menggunakan Git)
git clone <repository-url>
cd bioskop-app

# Atau download ZIP dan ekstrak
```

### 2. Import Database

#### 2.1. Buat database baru di MySQL

Buka terminal/command prompt dan login ke MySQL:

```bash
mysql -u root -p
```

Kemudian jalankan perintah:

```sql
CREATE DATABASE db_bioskop;
EXIT;
```

#### 2.2. Import database

```bash
mysql -u root -p db_bioskop < db_bioskop.sql
```

Atau bisa juga melalui phpMyAdmin atau MySQL Workbench dengan meng-import file `db_bioskop.sql`.

### 3. Konfigurasi Backend

#### 3.1. Masuk ke folder backend

```bash
cd backend
```

#### 3.2. Install dependencies

```bash
npm install
```

#### 3.3. Buat file `.env`

Buat file `.env` di folder `backend` dengan isi:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=db_bioskop
PORT=5000
JWT_SECRET=your_secret_key_here
```

> **Catatan:** Ganti `your_mysql_password` dengan password MySQL Anda, dan `your_secret_key_here` dengan kunci rahasia untuk JWT.

#### 3.4. Jalankan backend

```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 4. Konfigurasi Frontend

#### 4.1. Buka terminal baru, masuk ke folder frontend

```bash
cd frontend
```

#### 4.2. Install dependencies

```bash
npm install
```

#### 4.3. Jalankan frontend

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 5. Akses Aplikasi

1. Buka browser dan akses: `http://localhost:5173`
2. Login menggunakan:
   - **Username:** `admin`
   - **Password:** `admin123`

---

## 🎯 Fitur-Fitur Aplikasi

### Halaman Publik (Tanpa Login)

| Halaman | Deskripsi |
|---------|-----------|
| **Home** | Menampilkan daftar semua film yang tersedia beserta informasi detail (judul, genre, durasi, harga, batasan usia) |
| **Film Detail** | Menampilkan detail film dan jadwal tayang yang tersedia |

### Halaman Admin (Setelah Login)

| Halaman | Deskripsi |
|---------|-----------|
| **Dashboard** | Menampilkan statistik: total film, total pemesanan, total pendapatan, total pembeli |
| **Manajemen Film** | CRUD (Tambah, Edit, Hapus) data film |
| **Manajemen Jadwal** | CRUD jadwal tayang film |
| **Daftar Pembeli** | Melihat semua data pembeli yang telah melakukan pemesanan |
| **Booking Tiket** | Proses pemesanan tiket: pilih film → pilih jadwal → pilih kursi (layout 5x5) → isi data pembeli → konfirmasi |

### Validasi Khusus

- **Batasan Usia:** Setiap film memiliki batasan usia minimal. Jika pembeli berusia di bawah batas usia film, akan muncul modal peringatan dan pemesanan tidak dapat dilanjutkan.
- **Kursi:** Kursi yang sudah dipesan tidak dapat dipilih lagi oleh pengguna lain.

---

## 📸 Preview Fitur

### Dashboard Kasir
Menampilkan ringkasan statistik dan navigasi menu.

### Booking Tiket
1. Pilih film dari daftar film yang memiliki jadwal
2. Pilih jadwal tayang
3. Pilih kursi dari layout 5x5
4. Isi data pembeli
5. Konfirmasi pemesanan

### Manajemen Film
Tambah, edit, dan hapus data film dengan mudah.

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
**Solusi:** Jalankan `npm install` di folder backend

### Error: "Failed to resolve import 'react-router-dom'"
**Solusi:** Jalankan `npm install` di folder frontend

### Error: "Access denied for user 'root'@'localhost'"
**Solusi:** 
- Pastikan password MySQL di file `.env` sudah benar
- Pastikan MySQL server sedang berjalan

### Error: "Connection refused" atau "Network Error"
**Solusi:**
- Pastikan backend berjalan di port 5000
- Cek koneksi internet/network

### Error: "Token tidak valid" atau "401 Unauthorized"
**Solusi:** Login ulang dengan username dan password yang benar

### Port 5000 atau 5173 sudah digunakan
**Solusi:**
- Hentikan proses yang menggunakan port tersebut
- Atau ubah port di file `.env` (backend) dan `vite.config.js` (frontend)

---

## 🛠️ Perintah Berguna

```bash
# Jalankan backend (development)
cd backend && npm run dev

# Jalankan backend (production)
cd backend && npm start

# Jalankan frontend (development)
cd frontend && npm run dev

# Build frontend untuk production
cd frontend && npm run build

# Preview build frontend
cd frontend && npm run preview
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Ujian Akhir Semester (UAS) Pemrograman Web 2**.

---

## 👨‍💻 Pengembang

- **Nama:** [Nama Anda]
- **Kelas:** [Kelas Anda]
- **Mata Kuliah:** Pemrograman Web 2

---

## 📝 Catatan Tambahan

### Cara Menambahkan Admin Baru

Untuk menambahkan admin baru, jalankan query SQL berikut:

```sql
-- Password di-hash dengan bcrypt, contoh untuk 'admin123'
INSERT INTO admin (username, password) VALUES ('admin2', '$2b$10$YQx3VgZ9QvNc8VYQx3VgZ9QvNc8VYQx3VgZ9QvNc8VYQx3VgZ9QvNc8');
```

> **Catatan:** Gunakan tool bcrypt online atau script Node.js untuk generate hash password.

### Cara Reset Database

```bash
# Drop database
mysql -u root -p -e "DROP DATABASE db_bioskop;"

# Buat database baru
mysql -u root -p -e "CREATE DATABASE db_bioskop;"

# Import ulang database
mysql -u root -p db_bioskop < db_bioskop.sql
```
---

**Selamat mencoba!** 🎉 Jika ada pertanyaan atau kendala, silakan hubungi pengembang.
