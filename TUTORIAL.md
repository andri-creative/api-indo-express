# 📚 Tutorial Lengkap API Express Indonesia

## 📖 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Teknologi Yang Digunakan](#-teknologi-yang-digunakan)
- [Persiapan Awal](#-persiapan-awal)
- [Instalasi](#-instalasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Struktur Project](#-struktur-project)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Endpoint API](#-endpoint-api)
- [Autentikasi & Authorization](#-autentikasi--authorization)
- [Database & Model](#-database--model)
- [Penggunaan API Key](#-penggunaan-api-key)
- [Testing API](#-testing-api)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tentang Project

**API Express Indonesia** adalah RESTful API yang menyediakan data wilayah Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan) beserta fitur autentikasi menggunakan Google OAuth 2.0.

### Fitur Utama:

- ✅ Data wilayah Indonesia lengkap (Provinsi, Kab/Kota, Kecamatan, Kelurahan)
- ✅ Google OAuth 2.0 Authentication
- ✅ JWT Token untuk authorization
- ✅ API Key management
- ✅ MongoDB database
- ✅ Firebase Admin integration
- ✅ TypeScript untuk type safety
- ✅ CORS enabled

---

## 🛠 Teknologi Yang Digunakan

### Backend Framework & Runtime

- **Node.js** - JavaScript runtime
- **Express.js v5.2.1** - Web framework
- **TypeScript v5.9.3** - Type-safe JavaScript

### Database & Storage

- **MongoDB v7.0.0** - NoSQL database
- **MongoDB Atlas** - Cloud database hosting

### Authentication & Security

- **Passport.js v0.7.0** - Authentication middleware
- **Passport Google OAuth 2.0** - Google login strategy
- **JWT (jsonwebtoken v9.0.3)** - Token-based authentication
- **Firebase Admin v13.6.0** - Firebase services

### Utilities

- **dotenv v17.2.3** - Environment variables
- **cors v2.8.5** - Cross-Origin Resource Sharing
- **ts-node-dev v2.0.0** - Development server dengan hot reload

---

## 📋 Persiapan Awal

### 1. Install Node.js

Pastikan Node.js versi 18+ sudah terinstall di komputer Anda.

```bash
# Cek versi Node.js
node --version

# Cek versi npm
npm --version
```

### 2. Install MongoDB

Anda bisa menggunakan MongoDB Atlas (cloud) atau install MongoDB Community Edition di lokal.

**MongoDB Atlas (Recommended):**

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster gratis
3. Whitelist IP address Anda
4. Buat database user
5. Dapatkan connection string

### 3. Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Aktifkan Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URIs: `http://localhost:8090/api/v1/auth/google/callback`
6. Simpan Client ID dan Client Secret

### 4. Setup Firebase (Optional)

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru
3. Buka Project Settings > Service Accounts
4. Generate new private key
5. Download file JSON dan simpan informasinya

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd api-express-indo
```

### 2. Install Dependencies

```bash
npm install
```

Perintah ini akan menginstall semua dependencies yang ada di `package.json`:

**Dependencies:**

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `mongodb` - MongoDB driver
- `passport` - Authentication
- `passport-google-oauth20` - Google OAuth strategy
- `jsonwebtoken` - JWT tokens
- `firebase-admin` - Firebase services

**Dev Dependencies:**

- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server
- `@types/*` - TypeScript type definitions

---

## ⚙️ Konfigurasi Environment

### 1. Buat File .env

Buat file `.env` di root directory project:

```bash
# Copy dari .env.example (jika ada)
cp .env.example .env
```

### 2. Isi Konfigurasi .env

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=api-indo

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8090/api/v1/auth/google/callback
```

### 3. Penjelasan Environment Variables

| Variable                | Deskripsi                      | Contoh                                              |
| ----------------------- | ------------------------------ | --------------------------------------------------- |
| `FIREBASE_PROJECT_ID`   | ID project Firebase            | `my-project-12345`                                  |
| `FIREBASE_CLIENT_EMAIL` | Email service account Firebase | `firebase@project.iam.gserviceaccount.com`          |
| `FIREBASE_PRIVATE_KEY`  | Private key dari Firebase      | `-----BEGIN PRIVATE KEY-----...`                    |
| `JWT_SECRET`            | Secret key untuk JWT           | `my-super-secret-key-2024`                          |
| `MONGODB_URI`           | Connection string MongoDB      | `mongodb+srv://...`                                 |
| `DB_NAME`               | Nama database                  | `api-indo`                                          |
| `GOOGLE_CLIENT_ID`      | Client ID dari Google Console  | `123456.apps.googleusercontent.com`                 |
| `GOOGLE_CLIENT_SECRET`  | Client secret dari Google      | `GOCSPX-...`                                        |
| `GOOGLE_CALLBACK_URL`   | Callback URL untuk OAuth       | `http://localhost:8090/api/v1/auth/google/callback` |

---

## 📁 Struktur Project

```
api-express-indo/
├── src/
│   ├── config/                 # Konfigurasi aplikasi
│   │   ├── firebase-admin.ts   # Setup Firebase Admin
│   │   ├── jwt.ts              # JWT utilities
│   │   ├── mongo.ts            # MongoDB connection
│   │   └── passport.ts         # Passport strategies
│   │
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts  # Auth handlers
│   │   └── region.controller.ts # Region data handlers
│   │
│   ├── data/                   # Data files (JSON)
│   │   ├── provinces.json
│   │   ├── regencies.json
│   │   ├── districts.json
│   │   └── villages.json
│   │
│   ├── middlewares/            # Custom middlewares
│   │   ├── apiKey.middleware.ts # API key validation
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   └── error.middleware.ts  # Error handling
│   │
│   ├── models/                 # Data models
│   │   ├── apiKey.model.ts     # API Key model
│   │   └── user.model.ts       # User model
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.routes.ts      # Authentication routes
│   │   └── region.routes.ts    # Region data routes
│   │
│   ├── services/               # Business logic
│   │   ├── apiKey.service.ts   # API Key service
│   │   ├── auth.service.ts     # Auth service
│   │   └── region.service.ts   # Region service
│   │
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Entry point
│
├── .env                        # Environment variables
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript config
├── http.http                   # HTTP testing file
├── login.html                  # Frontend login page
├── style.css                   # Frontend styles
├── script.js                   # Frontend JavaScript
└── ikn-logo.png                # Logo image
```

### Penjelasan Detail Folder:

#### 📂 `src/config/`

Berisi file konfigurasi untuk berbagai service:

- **`firebase-admin.ts`**: Inisialisasi Firebase Admin SDK
- **`jwt.ts`**: Fungsi untuk generate dan verify JWT token
- **`mongo.ts`**: Connection ke MongoDB database
- **`passport.ts`**: Konfigurasi Passport.js strategies (Google OAuth)

#### 📂 `src/controllers/`

Handler untuk request HTTP:

- **`auth.controller.ts`**: Handle login, callback, profile
- **`region.controller.ts`**: Handle get provinces, regencies, etc.

#### 📂 `src/middlewares/`

Middleware untuk validasi dan security:

- **`apiKey.middleware.ts`**: Validasi API key
- **`auth.middleware.ts`**: Validasi JWT token
- **`error.middleware.ts`**: Central error handling

#### 📂 `src/models/`

Schema dan interface untuk data:

- **`apiKey.model.ts`**: Interface untuk API Key
- **`user.model.ts`**: Interface untuk User data

#### 📂 `src/routes/`

Definisi endpoint API:

- **`auth.routes.ts`**: Routes untuk authentication
- **`region.routes.ts`**: Routes untuk data wilayah

#### 📂 `src/services/`

Business logic dan interaksi dengan database:

- **`apiKey.service.ts`**: CRUD API keys
- **`auth.service.ts`**: Handle authentication logic
- **`region.service.ts`**: Fetch region data

---

## ▶️ Menjalankan Aplikasi

### Mode Development (Hot Reload)

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8090` dengan auto-reload saat ada perubahan code.

Output yang akan muncul:

```
Server running on http://localhost:8090
MongoDB connected successfully
```

### Mode Production

#### 1. Build TypeScript ke JavaScript

```bash
npm run build
```

Perintah ini akan compile semua file `.ts` menjadi `.js` di folder `dist/`.

#### 2. Jalankan Production Build

```bash
npm start
```

Server akan berjalan dari folder `dist/`.

---

## 🌐 Endpoint API

### Base URL

```
http://localhost:8090/api/v1
```

### 1. Authentication Endpoints

#### 🔐 Login dengan Google

```http
GET /api/v1/auth/google
```

**Deskripsi:** Redirect ke halaman login Google OAuth

**Response:** Redirect ke Google login page

---

#### 🔐 Google OAuth Callback

```http
GET /api/v1/auth/google/callback
```

**Deskripsi:** Endpoint callback setelah login Google berhasil

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "googleId": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

---

#### 👤 Get User Profile

```http
GET /api/v1/auth/profile
```

**Headers:**

```
Authorization: Bearer your-jwt-token
```

**Response:**

```json
{
  "success": true,
  "user": {
    "googleId": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Region Data Endpoints

#### 🗺️ Get All Provinces

```http
GET /api/v1/provinces
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "11",
      "name": "ACEH"
    },
    {
      "id": "12",
      "name": "SUMATERA UTARA"
    }
    // ... data provinsi lainnya
  ]
}
```

---

#### 🏙️ Get Regencies by Province ID

```http
GET /api/v1/provinces/{provinceId}/regencies
```

**Parameters:**

- `provinceId` (string): ID provinsi (contoh: "11" untuk Aceh)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1101",
      "province_id": "11",
      "name": "KABUPATEN SIMEULUE"
    },
    {
      "id": "1102",
      "province_id": "11",
      "name": "KABUPATEN ACEH SINGKIL"
    }
    // ... data kabupaten/kota lainnya
  ]
}
```

---

#### 🏘️ Get Districts by Regency ID

```http
GET /api/v1/regencies/{regencyId}/districts
```

**Parameters:**

- `regencyId` (string): ID kabupaten/kota (contoh: "1101")

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1101010",
      "regency_id": "1101",
      "name": "TEUPAH SELATAN"
    },
    {
      "id": "1101020",
      "regency_id": "1101",
      "name": "SIMEULUE TIMUR"
    }
    // ... data kecamatan lainnya
  ]
}
```

---

#### 🏡 Get Villages by District ID

```http
GET /api/v1/districts/{districtId}/villages
```

**Parameters:**

- `districtId` (string): ID kecamatan (contoh: "1101010")

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1101010001",
      "district_id": "1101010",
      "name": "LATIUNG"
    },
    {
      "id": "1101010002",
      "district_id": "1101010",
      "name": "LABUHAN BAJAU"
    }
    // ... data kelurahan/desa lainnya
  ]
}
```

---

### 3. Home Endpoint

#### 🏠 API Information

```http
GET /
```

**Response:**

```json
{
  "data": {
    "status": 200,
    "version": "1.0.0",
    "message": "Welcome to API Indonesia - Free Indonesian Data API",
    "free": "API Indonesia",
    "framework": "Express + TS + CORS",
    "github": "https://github.com/andri-creative",
    "author": "Andri Creative",
    "database": {
      "status": "connected",
      "collections": ["users", "apiKeys"]
    }
  }
}
```

---

## 🔐 Autentikasi & Authorization

### Flow Autentikasi

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Client  │─────▶│  Google  │─────▶│  API    │─────▶│ Database │
│         │      │  OAuth   │      │ Server  │      │ MongoDB  │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
    │                  │                 │                 │
    │ 1. GET /auth/google                │                 │
    ├──────────────────▶                 │                 │
    │                  │                 │                 │
    │ 2. Redirect to Google Login        │                 │
    │◀─────────────────                  │                 │
    │                  │                 │                 │
    │ 3. User Login    │                 │                 │
    ├─────────────────▶│                 │                 │
    │                  │                 │                 │
    │ 4. Redirect with code              │                 │
    │◀─────────────────┤                 │                 │
    │                  │                 │                 │
    │ 5. GET /auth/google/callback?code  │                 │
    ├────────────────────────────────────▶                 │
    │                  │                 │                 │
    │                  │ 6. Exchange code for user info    │
    │                  │◀────────────────┤                 │
    │                  │                 │                 │
    │                  │                 │ 7. Save/Update user
    │                  │                 ├────────────────▶│
    │                  │                 │                 │
    │                  │                 │ 8. Generate JWT │
    │                  │                 │◀────────────────┤
    │                  │                 │                 │
    │ 9. Return JWT + User Info          │                 │
    │◀────────────────────────────────────┤                 │
    │                  │                 │                 │
    │ 10. Store JWT in localStorage      │                 │
    │                  │                 │                 │
    │ 11. GET /auth/profile (with JWT)   │                 │
    ├────────────────────────────────────▶                 │
    │                  │                 │                 │
    │                  │                 │ 12. Verify JWT  │
    │                  │                 │                 │
    │ 13. Return user profile            │                 │
    │◀────────────────────────────────────┤                 │
```

### Menggunakan JWT Token

Setelah login berhasil, Anda akan mendapat JWT token. Simpan token ini dan kirimkan di header setiap request yang memerlukan autentikasi:

```javascript
// JavaScript/Fetch API
fetch("http://localhost:8090/api/v1/auth/profile", {
  headers: {
    Authorization: "Bearer your-jwt-token-here",
  },
});
```

```bash
# cURL
curl -H "Authorization: Bearer your-jwt-token-here" \
  http://localhost:8090/api/v1/auth/profile
```

---

## 🗄️ Database & Model

### MongoDB Collections

#### 1. Collection: `users`

**Schema:**

```typescript
interface User {
  googleId: string; // ID dari Google
  email: string; // Email user
  name: string; // Nama lengkap
  picture?: string; // URL foto profil
  createdAt: Date; // Tanggal registrasi
  updatedAt?: Date; // Tanggal update terakhir
}
```

**Contoh Document:**

```json
{
  "_id": "ObjectId('...')",
  "googleId": "123456789",
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Collection: `apiKeys`

**Schema:**

```typescript
interface ApiKey {
  key: string; // API key string
  userId: string; // _id dari user
  name: string; // Nama/deskripsi API key
  isActive: boolean; // Status aktif/nonaktif
  createdAt: Date; // Tanggal dibuat
  expiresAt?: Date; // Tanggal kadaluarsa (opsional)
}
```

**Contoh Document:**

```json
{
  "_id": "ObjectId('...')",
  "key": "api_123456789abcdef",
  "userId": "ObjectId('...')",
  "name": "Production API Key",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2025-01-01T00:00:00.000Z"
}
```

---

### Koneksi ke MongoDB

File konfigurasi: `src/config/mongo.ts`

```typescript
import { MongoClient, Db } from "mongodb";

let cachedDb: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();

  const db = client.db(process.env.DB_NAME);
  cachedDb = db;

  console.log("MongoDB connected successfully");
  return db;
}
```

---

## 🔑 Penggunaan API Key

### Membuat API Key (Future Feature)

API Key digunakan untuk rate-limiting dan tracking penggunaan API. Saat ini, fitur ini masih dalam development.

### Flow API Key:

1. User login dengan Google OAuth
2. User request API key melalui dashboard
3. System generate API key unik
4. User menggunakan API key di header:

```http
GET /api/v1/provinces
X-API-Key: api_123456789abcdef
```

---

## 🧪 Testing API

### Menggunakan HTTP File

File `http.http` sudah disediakan untuk testing. Anda bisa menggunakan extension **REST Client** di VS Code.

**Contoh isi `http.http`:**

```http
### Test Home Endpoint
GET http://localhost:8090/

### Test Get Provinces
GET http://localhost:8090/api/v1/provinces

### Test Get Regencies (Aceh)
GET http://localhost:8090/api/v1/provinces/11/regencies

### Test Get Districts
GET http://localhost:8090/api/v1/regencies/1101/districts

### Test Get Villages
GET http://localhost:8090/api/v1/districts/1101010/villages

### Test Google OAuth Login
GET http://localhost:8090/api/v1/auth/google

### Test Get Profile (need JWT token)
GET http://localhost:8090/api/v1/auth/profile
Authorization: Bearer your-jwt-token-here
```

---

### Menggunakan cURL

```bash
# Test home endpoint
curl http://localhost:8090/

# Test get provinces
curl http://localhost:8090/api/v1/provinces

# Test get regencies
curl http://localhost:8090/api/v1/provinces/11/regencies

# Test get profile (with JWT)
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:8090/api/v1/auth/profile
```

---

### Menggunakan Postman

1. Import collection dari file `http.http`
2. Buat environment variable:
   - `base_url`: `http://localhost:8090`
   - `jwt_token`: (isi setelah login)
3. Test setiap endpoint

---

## 🚀 Deployment

### Deploy ke Vercel

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login ke Vercel

```bash
vercel login
```

#### 3. Build Project

```bash
npm run build
```

#### 4. Deploy

```bash
vercel
```

#### 5. Set Environment Variables di Vercel Dashboard

Buka Vercel Dashboard > Project Settings > Environment Variables, lalu tambahkan semua variable dari `.env`.

---

### Deploy ke Railway

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Login

```bash
railway login
```

#### 3. Init Project

```bash
railway init
```

#### 4. Add MongoDB Plugin

```bash
railway add mongodb
```

#### 5. Deploy

```bash
railway up
```

---

### Deploy ke Heroku

#### 1. Install Heroku CLI

Download dari [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

#### 2. Login

```bash
heroku login
```

#### 3. Create App

```bash
heroku create api-express-indo
```

#### 4. Set Environment Variables

```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
# ... set semua variable lainnya
```

#### 5. Deploy

```bash
git push heroku main
```

---

## 🔧 Troubleshooting

### 1. Error: MongoDB Connection Failed

**Masalah:**

```
MongoServerError: bad auth : Authentication failed
```

**Solusi:**

- Cek username dan password di `MONGODB_URI`
- Pastikan IP address sudah di-whitelist di MongoDB Atlas
- Cek network connectivity

---

### 2. Error: Google OAuth Redirect URI Mismatch

**Masalah:**

```
Error 400: redirect_uri_mismatch
```

**Solusi:**

- Buka Google Cloud Console
- Pergi ke Credentials > OAuth 2.0 Client IDs
- Tambahkan `http://localhost:8090/api/v1/auth/google/callback` di Authorized redirect URIs
- Pastikan URL sama persis (termasuk protocol http/https)

---

### 3. Error: JWT Token Invalid

**Masalah:**

```
401 Unauthorized: Invalid token
```

**Solusi:**

- Pastikan token dikirim di header dengan format: `Bearer <token>`
- Cek apakah token sudah expired
- Pastikan `JWT_SECRET` di `.env` sama dengan yang digunakan saat generate token

---

### 4. Error: CORS Policy

**Masalah:**

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solusi:**

- Pastikan CORS middleware sudah di-enable di `app.ts`
- Jika butuh specific origin, update CORS config:

```typescript
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

---

### 5. Error: Module Not Found

**Masalah:**

```
Error: Cannot find module 'express'
```

**Solusi:**

```bash
# Delete node_modules dan reinstall
rm -rf node_modules
npm install
```

---

### 6. Error: Port Already in Use

**Masalah:**

```
Error: listen EADDRINUSE: address already in use :::8090
```

**Solusi:**

**Windows:**

```bash
# Cari process yang menggunakan port 8090
netstat -ano | findstr :8090

# Kill process (ganti PID dengan ID yang muncul)
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
# Cari process
lsof -i :8090

# Kill process
kill -9 <PID>
```

---

### 7. TypeScript Compilation Errors

**Masalah:**

```
error TS2304: Cannot find name '...'
```

**Solusi:**

```bash
# Install missing @types
npm install --save-dev @types/node @types/express

# Rebuild
npm run build
```

---

## 📝 Best Practices

### 1. Security

- ✅ Jangan commit file `.env` ke git
- ✅ Gunakan environment variables untuk semua sensitive data
- ✅ Set JWT expiration time yang wajar (contoh: 7 days)
- ✅ Implementasi rate limiting untuk production
- ✅ Validate dan sanitize semua input

### 2. Code Quality

- ✅ Gunakan TypeScript untuk type safety
- ✅ Buat interface untuk semua data models
- ✅ Pisahkan business logic ke services
- ✅ Gunakan consistent naming conventions
- ✅ Tambahkan comments untuk code yang kompleks

### 3. Performance

- ✅ Cache database connections
- ✅ Gunakan indexes di MongoDB
- ✅ Implement pagination untuk large datasets
- ✅ Compress responses dengan gzip
- ✅ Monitor memory usage

### 4. Error Handling

- ✅ Gunakan try-catch di semua async operations
- ✅ Return consistent error responses
- ✅ Log errors untuk debugging
- ✅ Jangan expose internal errors ke client

---

## 📚 Resources & Links

### Official Documentation

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)

### Tutorials

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🤝 Contributing

Jika Anda ingin berkontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📞 Support

Jika mengalami masalah atau punya pertanyaan:

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/andri-creative/api-express-indo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/andri-creative/api-express-indo/discussions)

---

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail.

---

## 👨‍💻 Author

**Andri Creative**

- GitHub: [@andri-creative](https://github.com/andri-creative)
- Website: [your-website.com](https://your-website.com)

---

**Happy Coding! 🚀**
