# Security Policy

## 🔒 Supported Versions

Kami memberikan security updates untuk versi-versi berikut:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🛡️ Reporting a Vulnerability

Keamanan adalah prioritas kami. Jika Anda menemukan vulnerability, mohon **JANGAN** melaporkannya secara publik di GitHub Issues.

### Cara Melaporkan

1. **Email** ke: security@yourdomain.com (gunakan email Anda yang sebenarnya)
2. **Subject:** `[SECURITY] Brief description of the issue`
3. **Include:**
   - Deskripsi detail vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)
   - Your contact information

### Response Timeline

- **Initial Response:** Dalam 48 jam
- **Assessment:** Dalam 5 hari kerja
- **Fix & Patch:** Tergantung severity (1-30 hari)
- **Public Disclosure:** Setelah patch dirilis

### Severity Levels

| Level        | Description                                 | Response Time |
| ------------ | ------------------------------------------- | ------------- |
| **Critical** | Remote code execution, data breach          | 1-3 days      |
| **High**     | Privilege escalation, authentication bypass | 3-7 days      |
| **Medium**   | XSS, CSRF, information disclosure           | 7-14 days     |
| **Low**      | Minor security issues                       | 14-30 days    |

---

## 🔐 Security Best Practices

### For Users

#### 1. Environment Variables

Jangan pernah commit file `.env` ke repository:

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

#### 2. JWT Secret

Gunakan strong, random JWT secret:

```bash
# Generate strong secret dengan Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. MongoDB URI

- Jangan expose MongoDB URI di code
- Gunakan strong password
- Enable IP whitelisting di MongoDB Atlas
- Gunakan read-only user jika hanya perlu read access

#### 4. Google OAuth

- Simpan Client Secret dengan aman
- Hanya whitelist authorized redirect URIs
- Rotate secrets secara berkala
- Enable 2FA untuk Google Cloud Console

#### 5. Production Deployment

```bash
# Set NODE_ENV ke production
NODE_ENV=production

# Gunakan HTTPS (bukan HTTP)
# Enable rate limiting
# Implement proper logging
# Use strong CORS policies
```

### For Contributors

#### 1. Dependencies

- Gunakan `npm audit` secara rutin
- Update dependencies yang vulnerable
- Review dependency changes

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

#### 2. Code Review

- Review security implications sebelum merge
- Check for hardcoded secrets
- Validate all user inputs
- Use parameterized queries

#### 3. Authentication

```typescript
// ✅ Good - Verify JWT properly
const token = req.headers.authorization?.split(" ")[1];
if (!token) {
  return res.status(401).json({ message: "No token provided" });
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  req.user = decoded;
} catch (error) {
  return res.status(401).json({ message: "Invalid token" });
}

// ❌ Bad - No verification
const token = req.headers.authorization?.split(" ")[1];
req.user = jwt.decode(token); // VULNERABLE!
```

#### 4. Input Validation

```typescript
// ✅ Good - Validate and sanitize
import validator from "validator";

const email = validator.normalizeEmail(req.body.email);
if (!validator.isEmail(email)) {
  return res.status(400).json({ message: "Invalid email" });
}

// ❌ Bad - No validation
const email = req.body.email;
await db.collection("users").findOne({ email });
```

---

## 🚨 Known Security Considerations

### Current Implementation

1. **CORS**
   - Currently allows all origins in development
   - **Action Required:** Restrict origins in production

```typescript
// Production CORS config
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
  })
);
```

2. **Rate Limiting**

   - **Status:** Not implemented yet
   - **Risk:** Potential for DoS attacks
   - **Planned:** v1.2.0

3. **Input Validation**

   - **Status:** Basic validation only
   - **Recommendation:** Use validation library (e.g., Joi, Zod)

4. **Logging**
   - **Status:** Minimal logging
   - **Recommendation:** Implement proper logging (winston, pino)

---

## 🔍 Security Checklist

### Before Production Deployment

- [ ] All secrets in environment variables
- [ ] Strong JWT secret (minimum 32 chars)
- [ ] CORS restricted to known origins
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies updated and audited
- [ ] MongoDB user has minimal required permissions
- [ ] Firebase service account has minimal permissions
- [ ] Logging configured (without sensitive data)
- [ ] MongoDB IP whitelist configured
- [ ] Google OAuth redirect URIs whitelisted
- [ ] Environment variables set in hosting platform

---

## 🛠️ Security Tools

### Recommended Tools

1. **npm audit** - Check for vulnerable dependencies

   ```bash
   npm audit
   ```

2. **Snyk** - Advanced security scanning

   ```bash
   npm install -g snyk
   snyk test
   ```

3. **ESLint Security Plugin**

   ```bash
   npm install --save-dev eslint-plugin-security
   ```

4. **Git Secrets** - Prevent committing secrets
   ```bash
   # Install git-secrets
   git secrets --install
   git secrets --register-aws
   ```

---

## 📚 Security Resources

### Official Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

### Additional Reading

- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
- [TypeScript Security](https://snyk.io/blog/typescript-security/)

---

## 🏆 Security Hall of Fame

Terima kasih kepada researcher yang telah membantu meningkatkan keamanan project ini:

<!-- Will be updated when we receive reports -->

- _No reports yet_

Want to be listed here? Report a valid security vulnerability!

---

## 📞 Contact

**Security Team:**

- 📧 Email: security@yourdomain.com
- 🔒 PGP Key: [Download](./pgp-key.asc) (optional)

**General Inquiries:**

- 📧 Email: your-email@example.com
- 🐛 GitHub Issues: [Report Here](https://github.com/andri-creative/api-express-indo/issues)

---

## 📄 Disclosure Policy

Kami mengikuti **Responsible Disclosure** policy:

1. **Reporter** melaporkan vulnerability secara private
2. **Team** acknowledge dalam 48 jam
3. **Team** bekerja untuk fix issue
4. **Patch** dirilis sesegera mungkin
5. **Public disclosure** setelah patch tersedia
6. **Credit** diberikan ke reporter (jika diinginkan)

### Timeline Example

```
Day 0:   Vulnerability reported
Day 2:   Acknowledged by team
Day 5:   Severity assessed
Day 10:  Patch developed
Day 12:  Patch tested
Day 14:  Patch released
Day 15:  Public disclosure
```

---

## ⚖️ Legal

Dengan melaporkan security vulnerability, Anda setuju untuk:

- Tidak mengeksploitasi vulnerability
- Tidak melakukan public disclosure sebelum patch
- Memberikan kami waktu untuk fix issue
- Tidak melakukan testing yang merusak

Kami berkomitmen untuk:

- Merespons laporan dengan serius
- Memberikan kredit kepada reporter
- Tidak mengambil tindakan hukum terhadap good-faith researchers
- Memprioritaskan keamanan user

---

**Last Updated:** January 12, 2026

**Note:** Security policy ini dapat berubah sewaktu-waktu. Cek halaman ini secara berkala untuk update terbaru.
