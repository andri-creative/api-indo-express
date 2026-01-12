# 🔐 Relasi Database - API Indonesia Express

## Struktur Database & Relasi

### 1️⃣ **Collection `users`**

```typescript
{
  _id: ObjectId,           // Primary Key
  email: string,           // Email dari Google OAuth
  name: string,            // Nama lengkap user
  provider: "google",      // Provider OAuth
  photo?: string,          // URL foto profil Google
  role: "user",            // Role user (user/admin)
  createdAt: Date          // Tanggal registrasi
}
```

**Contoh Data:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google",
  "photo": "https://lh3.googleusercontent.com/a/...",
  "role": "user",
  "createdAt": "2024-01-13T00:00:00.000Z"
}
```

---

### 2️⃣ **Collection `api_keys`**

```typescript
{
  _id: ObjectId,           // Primary Key
  key: string,             // API Key (base64 encoded)
  userId: ObjectId,        // Foreign Key → users._id
  createdAt: Date          // Tanggal pembuatan key
}
```

**Contoh Data:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "key": "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW5vcA==",
  "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-13T00:10:00.000Z"
}
```

---

## 📊 Relasi Antar Collection

```
┌─────────────────────────────┐
│        USERS                │
│  _id (PK)                   │◄────────────┐
│  email                      │             │
│  name                       │             │
│  provider                   │             │ RELASI: 1:N
│  photo                      │             │ (1 User → N API Keys)
│  role                       │             │
│  createdAt                  │             │
└─────────────────────────────┘             │
                                            │
                                            │
┌─────────────────────────────┐             │
│        API_KEYS             │             │
│  _id (PK)                   │             │
│  key                        │             │
│  userId (FK) ───────────────┼─────────────┘
│  createdAt                  │
└─────────────────────────────┘
```

**Penjelasan:**
- **1 User** bisa memiliki **banyak API Keys** (relasi One-to-Many)
- Field `userId` di collection `api_keys` adalah **Foreign Key** yang merujuk ke `_id` di collection `users`
- Maksimal 1 API key per user (dibatasi di logic service)

---

## 🔄 Flow Data Setelah Login

### **1. User Login via Google OAuth**

```
GET /auth/google
  ↓
[Google OAuth Page]
  ↓
GET /auth/google/callback?code=xxx
  ↓
[Backend verifikasi dengan Google]
  ↓
[Simpan/Update user di database]
  ↓
[Generate JWT Token]
  ↓
Redirect ke: /auth/callback?token=JWT_TOKEN
```

---

### **2. Frontend Mendapatkan Data User**

```
GET /auth/me
Header: Authorization: Bearer JWT_TOKEN
  ↓
[Decode & Verify JWT]
  ↓
[Ambil data user dari database]
  ↓
[Ambil API keys berdasarkan userId] ← RELASI KEY
  ↓
Response:
{
  "success": true,
  "user": {
    "_id": "xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "photo": "https://...",
    "role": "user"
  },
  "apiKeys": [
    {
      "_id": "yyy",
      "key": "base64_encoded_key",
      "createdAt": "2024-01-13T00:10:00.000Z"
    }
  ]
}
```

---

## 🎯 Endpoint & Data yang Dikembalikan

### **GET `/auth/me`** (Protected)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "ObjectId",
    "email": "string",
    "name": "string",
    "photo": "string",
    "role": "user"
  },
  "apiKeys": [
    {
      "_id": "ObjectId",
      "key": "string (base64)",
      "createdAt": "Date"
    }
  ]
}
```

**Field yang Ditampilkan:**

| Field | Tipe | Sumber | Keterangan |
|-------|------|--------|------------|
| `user._id` | ObjectId | users collection | ID unik user |
| `user.email` | string | users collection | Email dari Google |
| `user.name` | string | users collection | Nama lengkap |
| `user.photo` | string | users collection | URL foto profil |
| `user.role` | string | users collection | Role user |
| `apiKeys[].\_id` | ObjectId | api_keys collection | ID API key |
| `apiKeys[].key` | string | api_keys collection | API key (base64) |
| `apiKeys[].createdAt` | Date | api_keys collection | Tanggal pembuatan |

---

## 🔧 Cara Menggunakan API Key

Setelah mendapatkan API key dari response `/auth/me`, gunakan untuk akses endpoint region:

```bash
GET /regions/provinces
Header: Authorization: Bearer <API_KEY>
```

**Contoh:**
```bash
curl -H "Authorization: Bearer YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODkw..." \
     https://api.example.com/regions/provinces
```

---

## 📝 Catatan Penting

1. **JWT Token** digunakan untuk autentikasi user (login)
2. **API Key** digunakan untuk akses endpoint region data
3. Setiap user maksimal punya **1 API key** (check di `apiKey.service.ts`)
4. API key di-generate menggunakan `crypto.randomBytes(32)` lalu di-encode base64
5. Relasi `userId` di `api_keys` collection menghubungkan ke `_id` di `users` collection

---

## 🚀 Development Notes

- Database: **MongoDB**
- Authentication: **JWT + Passport Google OAuth**
- API Key Storage: **MongoDB Collection `api_keys`**
- Relasi: **Manual reference** (bukan populate seperti Mongoose)
