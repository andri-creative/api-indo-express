# 🔑 Auto-Generate API Key Setelah Login

## Problem
Sebelumnya, setelah user login via Google OAuth, **API key tidak ter-generate otomatis**. User harus manual request untuk membuat API key.

## Solution
Menambahkan **auto-generate API key** di dalam flow login Google OAuth.

---

## 🔄 Flow Login Sekarang

### **1. User Login via Google**
```
GET /auth/google
  ↓
[Google OAuth Authorization]
  ↓
GET /auth/google/callback?code=xxx
  ↓
[Backend Process - passport.ts]
```

### **2. Backend Process (auth.service.ts)**
```typescript
async loginWithGoogle(profile: GoogleProfile) {
  // 1. Cari user berdasarkan email
  let user = await usersCollection.findOne({ email });
  
  // 2. Jika user belum ada, create user baru
  if (!user) {
    const newUser = { email, name, provider, photo, role, createdAt };
    const result = await usersCollection.insertOne(newUser);
    user = { ...newUser, _id: result.insertedId };
  }
  
  // 3. ✅ AUTO-GENERATE API KEY (BARU!)
  if (user._id) {
    await createApiKeyIfAllowed(user._id);
  }
  
  return user;
}
```

### **3. Generate API Key (apiKey.service.ts)**
```typescript
async createApiKeyIfAllowed(userId: ObjectId) {
  // Cek apakah user sudah punya API key
  const apiKeys = await db.collection("api_keys")
    .find({ userId })
    .toArray();
  
  // Jika sudah punya, return existing keys
  if (apiKeys.length >= 1) {
    return apiKeys;
  }
  
  // Jika belum punya, generate API key baru
  const key = Buffer.from(
    crypto.randomBytes(32).toString("hex")
  ).toString("base64");
  
  await db.collection("api_keys").insertOne({
    key,
    userId,
    createdAt: new Date(),
  });
  
  return await db.collection("api_keys")
    .find({ userId })
    .toArray();
}
```

---

## ✅ Kapan API Key Ter-generate?

### **Scenario 1: User Baru (First Login)**
1. User login pertama kali via Google
2. System create user baru di database
3. **Langsung generate API key** untuk user tersebut
4. User mendapat JWT token
5. Call `/auth/me` → dapat data user + API key

### **Scenario 2: Existing User (Already Have API Key)**
1. User login lagi via Google
2. System find existing user di database
3. Cek apakah sudah punya API key
4. **Jika sudah ada (max 1 key), tidak generate lagi**
5. Return existing API key
6. User mendapat JWT token
7. Call `/auth/me` → dapat data user + API key yang sudah ada

### **Scenario 3: Existing User (No API Key)**
1. User login lagi via Google
2. System find existing user di database
3. Cek apakah sudah punya API key
4. **Jika belum ada, generate baru**
5. User mendapat JWT token
6. Call `/auth/me` → dapat data user + API key baru

---

## 📊 Data yang Didapat Setelah Login

### **Response dari `/auth/me`:**
```json
{
  "success": true,
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@gmail.com",
    "name": "John Doe",
    "photo": "https://lh3.googleusercontent.com/...",
    "role": "user"
  },
  "apiKeys": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "key": "MWFjZmNlYjk5YWY3MDg1YmI5NmE1NzJlNzljNWEwNzRlZjBlZTYx...",
      "createdAt": "2024-01-13T02:00:00.000Z"
    }
  ]
}
```

**✅ Sekarang `apiKeys` array sudah berisi API key yang ter-generate otomatis!**

---

## 🔒 Security & Limits

### **1. Maksimal 1 API Key Per User**
- User hanya bisa punya **maksimal 1 API key**
- Jika sudah punya, tidak akan generate lagi
- Ini untuk prevent abuse dan maintain simplicity

### **2. API Key Format**
```javascript
// Generate process:
crypto.randomBytes(32)           // 32 bytes random data
  .toString("hex")               // Convert to hex (64 chars)
  → Buffer.from(...)
  .toString("base64")            // Encode to base64 (88 chars)
```

**Contoh hasil:**
```
MWFjZmNlYjk5YWY3MDg1YmI5NmE1NzJlNzljNWEwNzRlZjBlZTYxMDQxYWU1MDZkOTFlYWIyNWI2MzhhY2M3Zg==
```

### **3. API Key Storage**
- Disimpan **plain text** di database (bukan hashed)
- Kenapa? Karena API key perlu di-compare exact match
- ⚠️ **Security Note:** Jangan expose API key di public logs!

---

## 🧪 Testing

### **1. Login Pertama Kali**
```bash
# 1. Login via Google
http://localhost:3000/auth/google

# 2. Setelah redirect, simpan JWT token
# Token ada di URL: /auth/callback?token=xxx

# 3. Get user data + API key
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:3000/auth/me
```

**Expected Response:**
```json
{
  "success": true,
  "user": { ... },
  "apiKeys": [
    {
      "_id": "...",
      "key": "...",  // ✅ API key sudah ter-generate!
      "createdAt": "..."
    }
  ]
}
```

### **2. Login Lagi (Existing User)**
```bash
# 1. Login via Google lagi
http://localhost:3000/auth/google

# 2. Get user data
curl -H "Authorization: Bearer <NEW_JWT_TOKEN>" \
     http://localhost:3000/auth/me
```

**Expected Response:**
```json
{
  "success": true,
  "user": { ... },
  "apiKeys": [
    {
      "_id": "...",
      "key": "...",  // ✅ Same API key as before (tidak generate baru)
      "createdAt": "..."
    }
  ]
}
```

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `src/services/auth.service.ts` | Added `createApiKeyIfAllowed()` call after login |
| `src/controllers/auth.controller.ts` | Updated `getCurrentUser()` to return API keys |

---

## 🎯 Benefits

✅ **User Experience:** User langsung dapat API key setelah login  
✅ **Automatic:** Tidak perlu manual request untuk generate API key  
✅ **Idempotent:** Login berkali-kali tidak akan generate key baru  
✅ **Relasi Data:** API key langsung ter-link ke user via `userId`  
✅ **Ready to Use:** Langsung bisa akses `/regions/*` endpoints  

---

## 🔄 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│  1. User Click "Login with Google"                   │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  2. Redirect to Google OAuth                         │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  3. User Authorize & Google Return Code              │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  4. Backend Exchange Code for User Profile           │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  5. Find or Create User in Database                  │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  6. ✅ AUTO-GENERATE API KEY (if not exists)         │
│     - Check existing API keys                        │
│     - If none, generate new one                      │
│     - If exists, return existing                     │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  7. Generate JWT Token                               │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  8. Redirect to Frontend with Token                  │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  9. Frontend Call /auth/me                           │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│ 10. Response: User Data + API Keys ✅                │
└──────────────────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **API Key bersifat permanent** - Tidak ada expiry date
2. **Maks 1 key per user** - Defined di `apiKey.service.ts` line 10
3. **Auto-generate saat login** - Baik user baru maupun existing
4. **Cascade delete** - Saat user dihapus, API key juga terhapus
5. **Relasi 1:N** - 1 User bisa punya banyak keys (tapi di-limit 1)

---

## 🚀 Next Steps (Optional)

Fitur tambahan yang bisa di-implement:
1. ⏳ **API Key Expiration** - Set expiry date untuk security
2. 🔄 **Regenerate API Key** - User bisa generate ulang key
3. 📊 **Usage Statistics** - Track berapa kali API key digunakan
4. 🔒 **Rate Limiting** - Limit request per API key
5. 🗑️ **Revoke API Key** - User bisa revoke/delete API key
6. 📝 **Multiple Keys** - Allow multiple API keys per user
7. 📧 **Email Notification** - Notify user saat API key ter-generate
