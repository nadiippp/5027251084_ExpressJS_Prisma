# Tugas Pemrograman Web - ExpressJS & Prisma (PostgreSQL)

Lanjutan tugas API Produk menggunakan **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

## Struktur Project

```text
├── controllers/
│   └── productController.js   # Logika CRUD produk menggunakan Prisma Client
├── lib/
│   └── prisma.js              # Inisialisasi PrismaClient dengan adapter PostgreSQL
├── prisma/
│   ├── schema.prisma          # Definisi model Product
│   └── seed.js                # Script untuk mengisi data awal (Buku, Pulpen)
├── routes/
│   └── productRoutes.js       # Definisi endpoint GET, POST, PUT, DELETE
├── .env.example               # Contoh konfigurasi environment variable
├── app.js                     # Entry point aplikasi Express
├── package.json
└── prisma.config.js           # Konfigurasi Prisma 7
```

## Cara Menjalankan Project

1. **Konfigurasi Database (`.env`)**
   Pastikan PostgreSQL berjalan dan sesuaikan `DATABASE_URL` di file `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/product_db?schema=public"
   PORT=3000
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Migration & Generate Prisma Client**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **(Opsional) Isi Data Awal (Seed)**
   ```bash
   npm run seed
   ```

5. **Jalankan Server Express**
   ```bash
   npm start
   ```

6. **(Opsional) Buka Prisma Studio untuk Melihat Isi Database (Before - After)**
   ```bash
   npx prisma studio
   ```

---

## Daftar Endpoint & Skenario Pengujian (Postman / Bruno / Hoppscotch)

### 1. GET `/products` — Menampilkan Seluruh Data
- **Method:** `GET`
- **URL:** `http://localhost:3000/products`
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "name": "Buku",
      "price": 15000,
      "createdAt": "2026-11-07T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Pulpen",
      "price": 5000,
      "createdAt": "2026-11-07T10:00:00.000Z"
    }
  ]
  ```

### 2. GET `/products/:id` — Menampilkan Satu Produk Berdasarkan ID
- **Skenario Success (`200 OK`):** `GET http://localhost:3000/products/1`
- **Skenario Tidak Ditemukan (`404 Not Found`):** `GET http://localhost:3000/products/999`
- **Skenario ID Tidak Valid (`400 Bad Request`):** `GET http://localhost:3000/products/abc`

### 3. POST `/products` — Membuat Data Baru
- **Method:** `POST`
- **URL:** `http://localhost:3000/products`
- **Skenario Success (`201 Created`):**
  ```json
  {
    "name": "Spidol",
    "price": 8000
  }
  ```
- **Skenario Kesalahan Validasi - Field Kosong (`400 Bad Request`):**
  ```json
  {
    "name": "Spidol"
  }
  ```
- **Skenario Kesalahan Validasi - Harga Negatif / Bukan Angka (`400 Bad Request`):**
  ```json
  {
    "name": "Spidol",
    "price": -5000
  }
  ```

### 4. PUT `/products` — Mengupdate Data yang Sudah Ada
*(Mendukung pengiriman `id` di dalam JSON body sesuai spesifikasi tugas, maupun melalui URL `/products/:id`)*
- **Method:** `PUT`
- **URL:** `http://localhost:3000/products`
- **Skenario Success (`200 OK`):**
  ```json
  {
    "id": 1,
    "name": "Buku Tulis Kampus",
    "price": 18000
  }
  ```
- **Skenario Kesalahan Validasi - Tanpa ID atau Tanpa Name/Price (`400 Bad Request`):**
  ```json
  {
    "id": 1,
    "name": ""
  }
  ```
- **Skenario Data Tidak Ditemukan (`404 Not Found`):**
  ```json
  {
    "id": 999,
    "name": "Buku Tulis Kampus",
    "price": 18000
  }
  ```

### 5. DELETE `/products/:id` (atau `DELETE /products`) — Menghapus Data Berdasarkan ID
*(Mendukung penghapusan lewat parameter URL `/products/:id` maupun lewat JSON body `{ "id": 1 }` di `/products`)*
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/products/3` *(atau `http://localhost:3000/products` dengan body `{ "id": 3 }`)*
- **Skenario Success (`200 OK`):**
  ```json
  {
    "message": "Produk berhasil dihapus",
    "data": {
      "id": 3,
      "name": "Spidol",
      "price": 8000,
      "createdAt": "2026-11-07T10:05:00.000Z"
    }
  }
  ```
- **Skenario Data Tidak Ditemukan (`404 Not Found`):**
  `DELETE http://localhost:3000/products/999`
