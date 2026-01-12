# 📚 API Documentation - User Management Endpoints

## Endpoint Overview

Setelah login, tersedia beberapa endpoint untuk mengelola data user beserta relasi API keys-nya.

---

## 📋 **1. Get All Users**

Mendapatkan semua user beserta API keys yang dimiliki (relasi `userId`).

### **Request**
```http
GET /auth/all
```

### **Response Success (200)**
```json
{
  "message": "Users found",
  "total": 2,
  "users": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "user1@gmail.com",
      "name": "User One",
      "provider": "google",
      "photo": "https://lh3.googleusercontent.com/...",
      "role": "user",
      "createdAt": "2024-01-13T00:00:00.000Z",
      "apiKeys": [
        {
          "key": "YWJjZGVmZ2hpamts...",
          "createdAt": "2024-01-13T01:00:00.000Z"
        }
      ]
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "email": "user2@gmail.com",
      "name": "User Two",
      "provider": "google",
      "photo": "https://lh3.googleusercontent.com/...",
      "role": "user",
      "createdAt": "2024-01-13T01:00:00.000Z",
      "apiKeys": []
    }
  ]
}
```

### **Response Error (500)**
```json
{
  "message": "Failed to fetch users"
}
```

---

## 🔍 **2. Get User By ID**

Mendapatkan user spesifik berdasarkan ID beserta semua API keys yang dimiliki.

### **Request**
```http
GET /auth/:id
```

### **URL Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User ID (ObjectId format) |

### **Example**
```http
GET /auth/65a1b2c3d4e5f6g7h8i9j0k1
```

### **Response Success (200)**
```json
{
  "success": true,
  "message": "User found",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@gmail.com",
    "name": "John Doe",
    "provider": "google",
    "photo": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "createdAt": "2024-01-13T00:00:00.000Z",
    "apiKeys": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "key": "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODkw...",
        "createdAt": "2024-01-13T01:00:00.000Z"
      }
    ]
  }
}
```

### **Response Not Found (404)**
```json
{
  "success": false,
  "message": "User not found"
}
```

### **Response Invalid ID (400)**
```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

### **Response Error (500)**
```json
{
  "success": false,
  "message": "Failed to fetch user"
}
```

---

## 🗑️ **3. Delete User**

Menghapus user beserta **semua API keys yang dimiliki** (cascade delete).

### **Request**
```http
DELETE /auth/:id
```

### **URL Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User ID (ObjectId format) |

### **Example**
```http
DELETE /auth/65a1b2c3d4e5f6g7h8i9j0k1
```

### **Response Success (200)**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### **Response Not Found (404)**
```json
{
  "success": false,
  "message": "User not found"
}
```

### **Response Invalid ID (400)**
```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

### **Response Error (500)**
```json
{
  "success": false,
  "message": "Failed to delete user"
}
```

### **⚠️ Important Notes**
- Saat user dihapus, **semua API keys milik user tersebut juga akan dihapus** (cascade delete)
- Operasi ini **tidak bisa di-undo**
- Pastikan ID yang diberikan valid (format ObjectId MongoDB)

---

## 🔄 **Relasi Data**

Semua endpoint di atas menggunakan **MongoDB Aggregation** dengan `$lookup` untuk menggabungkan data user dengan API keys berdasarkan relasi `userId`:

```javascript
// Relasi
users._id === api_keys.userId
```

### **Contoh Query Internal:**
```javascript
db.collection("users").aggregate([
  {
    $lookup: {
      from: "api_keys",           // Join dengan collection api_keys
      localField: "_id",           // Field _id di users
      foreignField: "userId",      // Field userId di api_keys
      as: "apiKeys"                // Array hasil join
    }
  }
])
```

---

## 📊 **Data yang Ditampilkan Setelah Login**

Berdasarkan endpoint yang tersedia, berikut data yang bisa diakses:

### **Dari Collection `users`:**
- `_id` - User ID (ObjectId)
- `email` - Email dari Google OAuth
- `name` - Nama lengkap user
- `provider` - OAuth provider ("google")
- `photo` - URL foto profil Google
- `role` - Role user ("user" atau "admin")
- `createdAt` - Tanggal registrasi

### **Dari Collection `api_keys` (relasi):**
- `_id` - API Key ID (ObjectId)
- `key` - API key string (base64 encoded)
- `createdAt` - Tanggal pembuatan key

---

## 🧪 **Testing dengan cURL**

### **1. Get All Users**
```bash
curl http://localhost:3000/auth/all
```

### **2. Get User By ID**
```bash
curl http://localhost:3000/auth/65a1b2c3d4e5f6g7h8i9j0k1
```

### **3. Delete User**
```bash
curl -X DELETE http://localhost:3000/auth/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## 🔒 **Security Notes**

⚠️ **Endpoint ini belum dilindungi dengan authentication!**

Untuk production, sebaiknya tambahkan:
1. **Authentication middleware** pada semua endpoint admin
2. **Role-based access control** (hanya admin yang bisa akses)
3. **Rate limiting** untuk prevent abuse
4. **Audit log** untuk tracking siapa yang delete user

### **Contoh Implementasi (Rekomendasi):**
```typescript
// Tambahkan authMiddleware + roleCheck
router.get("/all", authMiddleware, roleCheck("admin"), getAllUsers);
router.get("/:id", authMiddleware, roleCheck("admin"), getUserById);
router.delete("/:id", authMiddleware, roleCheck("admin"), deleteUser);
```

---

## 📈 **Summary**

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/auth/all` | GET | ❌ No | Get semua user + API keys |
| `/auth/:id` | GET | ❌ No | Get user spesifik by ID + API keys |
| `/auth/:id` | DELETE | ❌ No | Delete user + cascade delete API keys |
| `/auth/me` | GET | ✅ Yes (JWT) | Get current logged-in user + API keys |
| `/auth/google` | GET | ❌ No | Google OAuth login |
| `/auth/google/callback` | GET | ❌ No | Google OAuth callback |
| `/auth/logout` | POST | ✅ Yes (JWT) | Logout user |

---

## 🎯 **Next Steps**

1. ✅ Implementasi getById dan delete - **DONE**
2. ⏳ Tambahkan authentication untuk endpoint admin
3. ⏳ Tambahkan role-based access control
4. ⏳ Implementasi endpoint untuk manage API keys
5. ⏳ Tambahkan pagination untuk `/auth/all`
6. ⏳ Tambahkan search/filter functionality
