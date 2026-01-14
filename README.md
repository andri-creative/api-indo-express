# 🇮🇩 API Express Indonesia

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey)

> **RESTful API untuk data wilayah Indonesia dengan autentikasi Google OAuth 2.0**

API Express Indonesia menyediakan data lengkap wilayah Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan/Desa) dengan sistem autentikasi yang aman menggunakan Google OAuth dan JWT tokens.

---

## 🌐 Halaman Utama Frontend

<div align="center">
  <img src="./indonesia-creative.vercel.app.png" alt="Pratinjau Halaman Utama Frontend" />
</div>

---

## ✨ Fitur Utama

- 🗺️ **Data Wilayah Lengkap** - Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan/Desa
- 🔐 **Google OAuth 2.0** - Login menggunakan akun Google
- 🎫 **JWT Authentication** - Secure token-based authentication
- 🔑 **API Key Management** - Rate limiting dan tracking (coming soon)
- 💾 **MongoDB Database** - NoSQL database untuk scalability
- 🔥 **Firebase Integration** - Firebase Admin SDK support
- 📝 **TypeScript** - Type-safe development
- 🌐 **CORS Enabled** - Ready for frontend integration
- ⚡ **Hot Reload** - Fast development dengan ts-node-dev

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18 atau lebih tinggi
- npm atau yarn
- MongoDB Atlas account (atau MongoDB lokal)
- Google Cloud Console project (untuk OAuth)

### Instalasi

```bash
# 1. Clone repository
git clone <repository-url>
cd api-express-indo

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# 4. Jalankan development server
npm run dev
```

Server akan berjalan di `http://localhost:8090`

---

## 🛠️ Tech Stack

| Kategori           | Teknologi                     |
| ------------------ | ----------------------------- |
| **Runtime**        | Node.js 18+                   |
| **Framework**      | Express.js 5.2.1              |
| **Language**       | TypeScript 5.9.3              |
| **Database**       | MongoDB 7.0.0                 |
| **Authentication** | Passport.js, Google OAuth 2.0 |
| **Authorization**  | JWT (jsonwebtoken)            |
| **Cloud Services** | Firebase Admin                |
| **Development**    | ts-node-dev (hot reload)      |

---

## 📖 Dokumentasi

### Tutorial Lengkap

Untuk tutorial lengkap dan detail, silakan baca **[TUTORIAL.md](./TUTORIAL.md)** yang mencakup:

- ✅ Instalasi step-by-step
- ✅ Konfigurasi environment
- ✅ Struktur project detail
- ✅ Penjelasan setiap endpoint
- ✅ Flow autentikasi
- ✅ Database schema
- ✅ Deployment guide
- ✅ Troubleshooting

### Endpoint API

#### Authentication

```
GET  /api/v1/auth/google           # Login dengan Google OAuth
GET  /api/v1/auth/google/callback  # OAuth callback
GET  /api/v1/auth/profile          # Get user profile (protected)
```

#### Region Data

```
GET  /api/v1/provinces                        # Semua provinsi
GET  /api/v1/provinces/:id/regencies          # Kabupaten/Kota by provinsi
GET  /api/v1/regencies/:id/districts          # Kecamatan by kabupaten
GET  /api/v1/districts/:id/villages           # Kelurahan/Desa by kecamatan
```

### Contoh Response

**Get All Provinces:**

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
  ]
}
```

**Get User Profile:**

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

## ⚙️ Environment Variables

Buat file `.env` di root directory:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-email
FIREBASE_PRIVATE_KEY="your-private-key"

# JWT Configuration
JWT_SECRET=your-super-secret-key

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=api-indo

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8090/api/v1/auth/google/callback
```

Lihat [TUTORIAL.md](./TUTORIAL.md#-konfigurasi-environment) untuk penjelasan detail setiap variable.

---

## 📁 Struktur Project

```
api-express-indo/
├── src/
│   ├── config/              # Konfigurasi (MongoDB, Firebase, Passport, JWT)
│   ├── controllers/         # Request handlers
│   ├── data/                # Data JSON wilayah Indonesia
│   ├── middlewares/         # Custom middlewares (auth, error)
│   ├── models/              # TypeScript interfaces/models
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic
│   ├── app.ts               # Express app setup
│   └── index.ts             # Entry point
├── .env                     # Environment variables (git ignored)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── TUTORIAL.md              # Tutorial lengkap
└── README.md                # This file
```

---

## 🔐 Authentication Flow

```
User → Google OAuth → API → MongoDB
  │         │          │       │
  │    Login Page   Generate  Save
  │                   JWT     User
  │         │          │       │
  └─────────┴──────────┴───────┘
       Return JWT Token
```

1. User klik "Login with Google"
2. Redirect ke Google OAuth consent screen
3. User approve permissions
4. Google redirect kembali dengan authorization code
5. API exchange code untuk user info
6. API save/update user di MongoDB
7. API generate JWT token
8. Return JWT token + user data ke client
9. Client simpan JWT untuk request selanjutnya

---

## 🧪 Testing

### Menggunakan HTTP File

```http
### Test Get Provinces
GET http://localhost:8090/api/v1/provinces

### Test Get Profile (with JWT)
GET http://localhost:8090/api/v1/auth/profile
Authorization: Bearer your-jwt-token
```

### Menggunakan cURL

```bash
# Get all provinces
curl http://localhost:8090/api/v1/provinces

# Get profile with authentication
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:8090/api/v1/auth/profile
```

### Menggunakan JavaScript/Fetch

```javascript
// Get provinces
const provinces = await fetch("http://localhost:8090/api/v1/provinces").then(
  (res) => res.json()
);

// Get profile (authenticated)
const profile = await fetch("http://localhost:8090/api/v1/auth/profile", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
}).then((res) => res.json());
```

---

## 📦 NPM Scripts

| Command         | Deskripsi                                     |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Jalankan development server dengan hot reload |
| `npm run build` | Compile TypeScript ke JavaScript              |
| `npm start`     | Jalankan production build                     |

---

## 🚀 Deployment

### Recommended Platforms

#### Vercel (Recommended)

```bash
npm install -g vercel
npm run build
vercel
```

#### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Heroku

```bash
heroku create api-express-indo
heroku config:set MONGODB_URI=your-uri
git push heroku main
```

Lihat [TUTORIAL.md](./TUTORIAL.md#-deployment) untuk deployment guide lengkap.

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Cek MongoDB URI
# Pastikan IP address di-whitelist di MongoDB Atlas
# Cek username dan password
```

### Google OAuth Redirect URI Mismatch

```bash
# Tambahkan callback URL di Google Cloud Console:
# http://localhost:8090/api/v1/auth/google/callback
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8090
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8090
kill -9 <PID>
```

Lihat [TUTORIAL.md](./TUTORIAL.md#-troubleshooting) untuk troubleshooting lengkap.

---

## 📚 Resources

- [Tutorial Lengkap](./TUTORIAL.md)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JWT.io](https://jwt.io/)

---

## 🤝 Contributing

Kontribusi selalu diterima! Silakan:

1. Fork repository ini
2. Buat branch untuk feature Anda (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

Project ini menggunakan MIT License. Lihat file [LICENSE](./LICENSE) untuk detail.

---

## 👨‍💻 Author

**Andri Creative**

- GitHub: [@andri-creative](https://github.com/andri-creative)
- Email: your-email@example.com

---

## 🙏 Acknowledgments

- Data wilayah Indonesia dari berbagai sumber terpercaya
- Community Node.js dan TypeScript Indonesia
- Contributors dan users yang telah membantu improve project ini

---

## 📊 Project Status

- ✅ **v1.0.0** - Core API & Authentication
- 🚧 **v1.1.0** - API Key Management (Coming Soon)
- 🚧 **v1.2.0** - Rate Limiting (Coming Soon)
- 🚧 **v2.0.0** - Admin Dashboard (Planned)

---

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:

- 📧 Email: your-email@example.com
- 🐛 [Report Issues](https://github.com/andri-creative/api-express-indo/issues)
- 💬 [GitHub Discussions](https://github.com/andri-creative/api-express-indo/discussions)

---

**⭐ Jika project ini membantu, jangan lupa berikan star di GitHub! ⭐**

---

Made with ❤️ by [Andri Creative](https://github.com/andri-creative)
