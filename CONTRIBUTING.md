# 🤝 Contributing to API Express Indonesia

Terima kasih atas minat Anda untuk berkontribusi pada **API Express Indonesia**! Kami menyambut kontribusi dari siapa saja, baik pemula maupun developer berpengalaman.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Project Structure](#project-structure)

---

## 📜 Code of Conduct

Project ini mengikuti kode etik kontributor. Dengan berpartisipasi, Anda diharapkan untuk menjaga lingkungan yang ramah dan inklusif.

### Prinsip Umum:

- ✅ Bersikap hormat dan profesional
- ✅ Menerima kritik konstruktif dengan lapang dada
- ✅ Fokus pada apa yang terbaik untuk komunitas
- ❌ Tidak melakukan trolling atau serangan pribadi
- ❌ Tidak menggunakan bahasa atau gambar yang tidak pantas

---

## 🎯 Cara Berkontribusi

Ada banyak cara untuk berkontribusi pada project ini:

### 1. 🐛 Melaporkan Bugs

Jika menemukan bug, buat issue baru dengan:

- Deskripsi jelas tentang masalahnya
- Langkah-langkah untuk mereproduksi bug
- Expected vs actual behavior
- Screenshot atau error logs (jika ada)
- Environment info (OS, Node version, etc.)

### 2. 💡 Mengusulkan Fitur Baru

Punya ide untuk fitur baru? Buat issue dengan:

- Deskripsi lengkap fitur yang diusulkan
- Use case dan manfaatnya
- Mockup atau contoh implementasi (jika ada)

### 3. 📝 Memperbaiki Dokumentasi

- Perbaiki typo atau kesalahan
- Tambahkan contoh code
- Lengkapi penjelasan yang kurang jelas
- Terjemahkan ke bahasa lain

### 4. 💻 Menulis Code

- Fix bugs yang ada di issues
- Implementasi fitur baru
- Improve performance
- Refactor code

### 5. 🧪 Testing

- Tambahkan unit tests
- Tambahkan integration tests
- Test di berbagai environment

---

## 🛠️ Development Setup

### Prerequisites

- Node.js v18 atau lebih tinggi
- npm atau yarn
- Git
- MongoDB (lokal atau Atlas account)
- Google Cloud Console account

### Setup Local Environment

1. **Fork repository ini**

   ```bash
   # Klik tombol "Fork" di GitHub
   ```

2. **Clone fork Anda**

   ```bash
   git clone https://github.com/YOUR_USERNAME/api-express-indo.git
   cd api-express-indo
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/andri-creative/api-express-indo.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi Anda
   ```

6. **Jalankan development server**

   ```bash
   npm run dev
   ```

7. **Verify setup**

   ```bash
   # Buka browser dan akses:
   http://localhost:8090

   # Atau test dengan cURL:
   curl http://localhost:8090/api/v1/provinces
   ```

---

## 📏 Coding Standards

### TypeScript

- Gunakan TypeScript untuk semua file baru
- Definisikan interface untuk semua data models
- Hindari penggunaan `any` type
- Gunakan strict mode

**Contoh:**

```typescript
// ✅ Good
interface User {
  googleId: string;
  email: string;
  name: string;
}

async function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
async function getUser(id: any): Promise<any> {
  // ...
}
```

### Naming Conventions

**Variables & Functions:**

```typescript
// camelCase untuk variables dan functions
const userName = "John";
function getUserProfile() {}
```

**Classes & Interfaces:**

```typescript
// PascalCase untuk classes dan interfaces
class UserService {}
interface ApiResponse {}
```

**Constants:**

```typescript
// UPPER_SNAKE_CASE untuk constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "/api/v1";
```

**Files:**

```typescript
// kebab-case untuk file names
user.service.ts;
auth.controller.ts;
region.routes.ts;
```

### Code Style

1. **Indentation:** 2 spaces (no tabs)
2. **Quotes:** Double quotes untuk strings
3. **Semicolons:** Selalu gunakan semicolons
4. **Line Length:** Max 100 characters
5. **Trailing Commas:** Gunakan untuk arrays/objects multi-line

**Contoh:**

```typescript
// ✅ Good
const user = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
};

// ❌ Bad
const user = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
};
```

### Error Handling

Selalu gunakan try-catch untuk async operations:

```typescript
// ✅ Good
async function getProvinces() {
  try {
    const provinces = await db.collection("provinces").find().toArray();
    return { success: true, data: provinces };
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return { success: false, message: "Failed to fetch provinces" };
  }
}

// ❌ Bad
async function getProvinces() {
  const provinces = await db.collection("provinces").find().toArray();
  return provinces;
}
```

### Comments

Gunakan comments untuk menjelaskan **MENGAPA**, bukan **APA**:

```typescript
// ✅ Good
// Cache connection to avoid creating new connection on every request
let cachedDb: Db | null = null;

// ❌ Bad
// Set variable to null
let cachedDb: Db | null = null;
```

---

## 📝 Commit Guidelines

Kami mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

### Format Commit Message

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Deskripsi                            |
| ---------- | ------------------------------------ |
| `feat`     | Fitur baru                           |
| `fix`      | Bug fix                              |
| `docs`     | Dokumentasi                          |
| `style`    | Formatting, missing semicolons, etc. |
| `refactor` | Code refactoring                     |
| `test`     | Menambahkan tests                    |
| `chore`    | Maintenance tasks                    |
| `perf`     | Performance improvements             |

### Examples

```bash
# Fitur baru
git commit -m "feat(auth): add email/password login"

# Bug fix
git commit -m "fix(region): resolve district ID mismatch"

# Dokumentasi
git commit -m "docs(readme): add installation guide"

# Refactor
git commit -m "refactor(services): extract database logic to separate service"
```

### Commit Message Best Practices

1. **Subject line:**

   - Max 50 characters
   - Imperative mood ("add" not "added")
   - No period at the end

2. **Body:**

   - Wrap at 72 characters
   - Explain WHAT and WHY, not HOW
   - Separate from subject with blank line

3. **Examples:**

```
feat(api): add pagination support

Added pagination to provinces endpoint to improve performance
when dealing with large datasets. Default limit is 10 items.

Closes #123
```

---

## 🔄 Pull Request Process

### Before Submitting PR

1. **Sync dengan upstream**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Write clean, documented code
   - Follow coding standards
   - Add tests if applicable

4. **Test your changes**

   ```bash
   npm run dev
   # Test manually or run tests
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting PR

1. **Go to GitHub** dan create Pull Request
2. **Fill in PR template:**

   - Clear title and description
   - Reference related issues
   - Add screenshots/videos if UI changes
   - List breaking changes if any

3. **PR Template:**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Related Issues

Closes #123

## Testing

- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No breaking changes (or listed above)
```

### PR Review Process

1. **Automated checks** akan berjalan (jika sudah setup CI/CD)
2. **Maintainer akan review** code Anda
3. **Respond to feedback** dengan melakukan changes jika diperlukan
4. **Once approved**, PR akan di-merge

### Setelah PR Dimerge

1. **Delete branch**

   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Sync dengan upstream**
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Cek [existing issues](https://github.com/andri-creative/api-express-indo/issues)
2. Pastikan bukan configuration issue
3. Test di environment yang clean

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g. Windows 11]
- Node version: [e.g. 18.17.0]
- npm version: [e.g. 9.8.1]
- Browser (if applicable): [e.g. Chrome 120]

## Error Logs
```

Paste error logs here

```

## Screenshots
[Add screenshots if applicable]

## Additional Context
Any other relevant information
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature

## Problem it Solves

What problem does this feature solve?

## Proposed Solution

How should it work?

## Alternatives Considered

Other solutions you've considered

## Use Cases

Real-world scenarios where this is useful

## Implementation Ideas

Optional: Ideas on how to implement

## Additional Context

Mockups, examples, references
```

---

## 📂 Project Structure

Memahami struktur project akan membantu Anda berkontribusi:

```
api-express-indo/
├── src/
│   ├── config/           # Configuration files
│   │   ├── firebase-admin.ts
│   │   ├── jwt.ts
│   │   ├── mongo.ts
│   │   └── passport.ts
│   │
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   └── region.controller.ts
│   │
│   ├── middlewares/      # Express middlewares
│   │   ├── apiKey.middleware.ts
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── models/           # Data models/interfaces
│   │   ├── apiKey.model.ts
│   │   └── user.model.ts
│   │
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   └── region.routes.ts
│   │
│   ├── services/         # Business logic
│   │   ├── apiKey.service.ts
│   │   ├── auth.service.ts
│   │   └── region.service.ts
│   │
│   └── data/             # Static data files
│       ├── provinces.json
│       ├── regencies.json
│       ├── districts.json
│       └── villages.json
│
├── docs/                 # Documentation
│   ├── README.md
│   ├── TUTORIAL.md
│   └── API_DOCUMENTATION.md
│
└── tests/                # Test files (coming soon)
    ├── unit/
    └── integration/
```

### Menambahkan File Baru

**Controller:**

```typescript
// src/controllers/new.controller.ts
import { Request, Response } from "express";

export const newHandler = async (req: Request, res: Response) => {
  // Implementation
};
```

**Route:**

```typescript
// src/routes/new.routes.ts
import { Router } from "express";
import { newHandler } from "../controllers/new.controller";

const router = Router();
router.get("/new", newHandler);

export default router;
```

**Service:**

```typescript
// src/services/new.service.ts
export class NewService {
  async doSomething(): Promise<void> {
    // Implementation
  }
}
```

---

## 🧪 Testing (Coming Soon)

Saat ini project belum memiliki automated tests. Kontribusi untuk menambahkan tests sangat diterima!

### Testing Stack (Planned)

- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **MongoDB Memory Server** - In-memory database untuk testing

### Contoh Test:

```typescript
// tests/unit/services/region.service.test.ts
import { RegionService } from "../../../src/services/region.service";

describe("RegionService", () => {
  let service: RegionService;

  beforeEach(() => {
    service = new RegionService();
  });

  test("should get all provinces", async () => {
    const provinces = await service.getAllProvinces();
    expect(provinces).toHaveLength(38);
  });
});
```

---

## 📞 Getting Help

Butuh bantuan? Ada beberapa cara:

1. **GitHub Discussions** - Q&A dan diskusi umum
2. **GitHub Issues** - Bug reports dan feature requests
3. **Email** - your-email@example.com

---

## 🎉 Recognition

Semua contributors akan:

- Tercantum di [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mendapat credit di release notes
- Badge contributor di GitHub profile

---

## 📄 License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License yang sama dengan project ini.

---

**Terima kasih atas kontribusi Anda! 🙏**

Setiap kontribusi, sekecil apapun, sangat berarti untuk project ini.

Happy Contributing! 🚀
