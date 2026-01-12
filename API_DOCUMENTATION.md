# 📡 API Documentation - API Express Indonesia

Dokumentasi lengkap untuk semua endpoint yang tersedia di API Express Indonesia.

**Base URL:** `http://localhost:8090`  
**API Version:** `v1`  
**API Prefix:** `/api/v1`

---

## 📋 Table of Contents

- [Authentication](#authentication)
  - [Login with Google](#login-with-google)
  - [OAuth Callback](#oauth-callback)
  - [Get User Profile](#get-user-profile)
- [Region Data](#region-data)
  - [Get All Provinces](#get-all-provinces)
  - [Get Regencies by Province](#get-regencies-by-province)
  - [Get Districts by Regency](#get-districts-by-regency)
  - [Get Villages by District](#get-villages-by-district)
- [Utility](#utility)
  - [API Information](#api-information)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Login with Google

Initiates Google OAuth 2.0 authentication flow.

**Endpoint:**

```
GET /api/v1/auth/google
```

**Description:**  
Redirects user to Google's OAuth consent screen for authentication.

**Parameters:** None

**Response:**  
Redirect to Google OAuth consent page

**Example:**

```bash
curl -L http://localhost:8090/api/v1/auth/google
```

**Flow:**

1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. User approves permissions
4. Redirected back to callback URL

---

### OAuth Callback

Handles Google OAuth callback and issues JWT token.

**Endpoint:**

```
GET /api/v1/auth/google/callback
```

**Description:**  
Receives authorization code from Google, exchanges it for user information, and returns JWT token.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| code | string | Yes | Authorization code from Google |
| state | string | No | State parameter for CSRF protection |

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTc4OWFiY2RlZjEyMzQ1Njc4OTBhYiIsImdvb2dsZUlkIjoiMTIzNDU2Nzg5IiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTYyMzQ1Njc4OSwiZXhwIjoxNjI0MDYxNTg5fQ.abc123def456ghi789",
  "user": {
    "_id": "65a789abcdef1234567890ab",
    "googleId": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/a/default-user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**

**Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Authentication failed"
}
```

**Example:**

```javascript
// This endpoint is typically called automatically by OAuth flow
// After user approves, Google redirects to:
// http://localhost:8090/api/v1/auth/google/callback?code=abc123...
```

**Notes:**

- Save the JWT token securely (localStorage or httpOnly cookie)
- Token expires after 7 days by default
- Use token in Authorization header for protected routes

---

### Get User Profile

Retrieves authenticated user's profile information.

**Endpoint:**

```
GET /api/v1/auth/profile
```

**Description:**  
Returns the profile information of the currently authenticated user.

**Authentication:** Required (JWT)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:** None

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "user": {
    "_id": "65a789abcdef1234567890ab",
    "googleId": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/a/default-user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**Status Code:** `401 Unauthorized` (Missing token)

```json
{
  "success": false,
  "message": "No token provided"
}
```

**Status Code:** `401 Unauthorized` (Invalid token)

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Status Code:** `401 Unauthorized` (Expired token)

```json
{
  "success": false,
  "message": "Token expired"
}
```

**Examples:**

**cURL:**

```bash
curl -H "Authorization: Bearer eyJhbGci..." \
  http://localhost:8090/api/v1/auth/profile
```

**JavaScript/Fetch:**

```javascript
const response = await fetch("http://localhost:8090/api/v1/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
console.log(data.user);
```

**Axios:**

```javascript
const { data } = await axios.get("http://localhost:8090/api/v1/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
console.log(data.user);
```

---

## 🗺️ Region Data

### Get All Provinces

Retrieves list of all provinces in Indonesia.

**Endpoint:**

```
GET /api/v1/provinces
```

**Description:**  
Returns an array of all 38 provinces in Indonesia.

**Authentication:** Not required

**Parameters:** None

**Success Response:**

**Status Code:** `200 OK`

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
    },
    {
      "id": "13",
      "name": "SUMATERA BARAT"
    },
    {
      "id": "14",
      "name": "RIAU"
    },
    {
      "id": "15",
      "name": "JAMBI"
    },
    {
      "id": "16",
      "name": "SUMATERA SELATAN"
    }
    // ... 32 more provinces
  ],
  "total": 38
}
```

**Examples:**

**cURL:**

```bash
curl http://localhost:8090/api/v1/provinces
```

**JavaScript:**

```javascript
const provinces = await fetch("http://localhost:8090/api/v1/provinces").then(
  (res) => res.json()
);
console.log(provinces.data);
```

---

### Get Regencies by Province

Retrieves all regencies (kabupaten/kota) in a specific province.

**Endpoint:**

```
GET /api/v1/provinces/:provinceId/regencies
```

**Description:**  
Returns an array of regencies/cities within the specified province.

**Authentication:** Not required

**URL Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| provinceId | string | Yes | Province ID (2 digits) | `11` for Aceh |

**Success Response:**

**Status Code:** `200 OK`

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
    },
    {
      "id": "1103",
      "province_id": "11",
      "name": "KABUPATEN ACEH SELATAN"
    },
    {
      "id": "1171",
      "province_id": "11",
      "name": "KOTA BANDA ACEH"
    }
    // ... more regencies
  ],
  "total": 23,
  "province": {
    "id": "11",
    "name": "ACEH"
  }
}
```

**Error Response:**

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Province not found"
}
```

**Examples:**

**cURL:**

```bash
# Get regencies in Aceh (ID: 11)
curl http://localhost:8090/api/v1/provinces/11/regencies

# Get regencies in Jawa Barat (ID: 32)
curl http://localhost:8090/api/v1/provinces/32/regencies
```

**JavaScript:**

```javascript
const provinceId = "11"; // Aceh
const regencies = await fetch(
  `http://localhost:8090/api/v1/provinces/${provinceId}/regencies`
).then((res) => res.json());
console.log(regencies.data);
```

---

### Get Districts by Regency

Retrieves all districts (kecamatan) in a specific regency.

**Endpoint:**

```
GET /api/v1/regencies/:regencyId/districts
```

**Description:**  
Returns an array of districts within the specified regency/city.

**Authentication:** Not required

**URL Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| regencyId | string | Yes | Regency ID (4 digits) | `1101` for Kab. Simeulue |

**Success Response:**

**Status Code:** `200 OK`

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
    },
    {
      "id": "1101030",
      "regency_id": "1101",
      "name": "TELUK DALAM"
    }
    // ... more districts
  ],
  "total": 10,
  "regency": {
    "id": "1101",
    "name": "KABUPATEN SIMEULUE",
    "province_id": "11"
  }
}
```

**Error Response:**

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Regency not found"
}
```

**Examples:**

**cURL:**

```bash
# Get districts in Kabupaten Simeulue (ID: 1101)
curl http://localhost:8090/api/v1/regencies/1101/districts
```

**JavaScript:**

```javascript
const regencyId = "1101";
const districts = await fetch(
  `http://localhost:8090/api/v1/regencies/${regencyId}/districts`
).then((res) => res.json());
console.log(districts.data);
```

---

### Get Villages by District

Retrieves all villages (kelurahan/desa) in a specific district.

**Endpoint:**

```
GET /api/v1/districts/:districtId/villages
```

**Description:**  
Returns an array of villages/sub-districts within the specified district.

**Authentication:** Not required

**URL Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| districtId | string | Yes | District ID (7 digits) | `1101010` for Teupah Selatan |

**Success Response:**

**Status Code:** `200 OK`

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
    },
    {
      "id": "1101010003",
      "district_id": "1101010",
      "name": "AIR PINANG"
    }
    // ... more villages
  ],
  "total": 25,
  "district": {
    "id": "1101010",
    "name": "TEUPAH SELATAN",
    "regency_id": "1101"
  }
}
```

**Error Response:**

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "District not found"
}
```

**Examples:**

**cURL:**

```bash
# Get villages in Teupah Selatan (ID: 1101010)
curl http://localhost:8090/api/v1/districts/1101010/villages
```

**JavaScript:**

```javascript
const districtId = "1101010";
const villages = await fetch(
  `http://localhost:8090/api/v1/districts/${districtId}/villages`
).then((res) => res.json());
console.log(villages.data);
```

---

## 🏠 Utility

### API Information

Get API information and health status.

**Endpoint:**

```
GET /
```

**Description:**  
Returns API metadata, version, and database connection status.

**Authentication:** Not required

**Parameters:** None

**Success Response:**

**Status Code:** `200 OK`

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

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "data": {
    "status": 500,
    "message": "Database not connected"
  }
}
```

**Example:**

```bash
curl http://localhost:8090/
```

---

## ❌ Error Responses

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (only in development)"
}
```

### HTTP Status Codes

| Code | Status                | Description                       |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | Request successful                |
| 201  | Created               | Resource created successfully     |
| 400  | Bad Request           | Invalid request parameters        |
| 401  | Unauthorized          | Missing or invalid authentication |
| 403  | Forbidden             | Insufficient permissions          |
| 404  | Not Found             | Resource not found                |
| 429  | Too Many Requests     | Rate limit exceeded               |
| 500  | Internal Server Error | Server error                      |

### Common Error Examples

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Invalid province ID format"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Province with ID '99' not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## ⏱️ Rate Limiting

**Status:** Coming Soon (v1.1.0)

Rate limiting will be implemented to prevent abuse:

- **Anonymous requests:** 100 requests per hour
- **Authenticated requests:** 1000 requests per hour
- **With API Key:** 10,000 requests per hour

Rate limit headers will be included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## 📊 Response Times

Average response times for each endpoint:

| Endpoint                     | Avg Response Time |
| ---------------------------- | ----------------- |
| GET /provinces               | ~50ms             |
| GET /provinces/:id/regencies | ~75ms             |
| GET /regencies/:id/districts | ~100ms            |
| GET /districts/:id/villages  | ~150ms            |
| POST /auth/google            | ~200ms (redirect) |
| GET /auth/profile            | ~50ms             |

---

## 🔄 Pagination

**Status:** Coming Soon (v1.2.0)

Future versions will support pagination for large datasets:

```
GET /api/v1/provinces?page=1&limit=10
```

Response will include pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 38,
    "totalPages": 4
  }
}
```

---

## 🔍 Filtering & Search

**Status:** Planned (v2.0.0)

Future support for filtering and searching:

```
GET /api/v1/provinces?search=jawa
GET /api/v1/regencies?province=11&type=kota
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All text data is in uppercase (ACEH, JAKARTA, etc.)
3. ID formats:

   - Province: 2 digits (11, 12, 13, ...)
   - Regency: 4 digits (1101, 1102, ...)
   - District: 7 digits (1101010, 1101020, ...)
   - Village: 10 digits (1101010001, ...)

4. CORS is enabled for all origins in development
5. API responses are always JSON
6. Content-Type header should be `application/json`

---

## 🧪 Testing Collection

Import this Postman collection for quick testing:

**Postman Collection:** [Download](./postman_collection.json)

Or use the provided `http.http` file with REST Client extension in VS Code.

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/andri-creative/api-express-indo/issues)
- 📖 Full Documentation: [TUTORIAL.md](./TUTORIAL.md)

---

**Last Updated:** January 12, 2026  
**API Version:** 1.0.0
