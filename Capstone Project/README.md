# CipherSense: AI-Powered Cryptanalysis & Security Assessment Toolkit

[![Security Rating](https://img.shields.io/badge/Security%20Score-87%2F100-emerald.svg)](https://ciphersense.io)
[![FIPS 140-3](https://img.shields.io/badge/Compliance-FIPS%20140--3%20%7C%20NIST%20SP%20800--57-blue.svg)](https://nist.gov)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%7C%20Node.js%20%7C%20MongoDB-cyan.svg)](https://github.com)

**CipherSense** is an enterprise-grade cybersecurity SaaS web application built as a flagship capstone project. It bridges the gap between theoretical cryptography, statistical cryptanalysis, automated vulnerability detection, and AI-driven cipher suite recommendations.

Designed specifically with a **Security Operations Center (SOC)** aesthetic, CipherSense provides security analysts with real-time Shannon entropy metrics, Index of Coincidence (IoC) distribution, character frequencies, hardware-accelerated encryption/decryption benchmarks, and exportable PDF audit dossiers.

---

## 🚀 Key Modules & Architecture

```
                               ┌────────────────────────────────┐
                               │     Analyst Data Ingestion     │
                               │  (Plaintext / Ciphertext / File)│
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  Preprocessing & Validation    │
                               │  (Hex, Base64, Size, Sampling) │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                               │
                       ▼                                               ▼
        ┌─────────────────────────────┐                 ┌─────────────────────────────┐
        │  AI Recommendation Engine   │                 │   Cryptanalysis Engine      │
        │  (Sensitivity, Throughput,  │                 │  (Shannon Entropy, IoC,     │
        │   Threat Model, Key Matrix) │                 │   Chi-Square, ECB Detection)│
        └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                       │                                               │
                       └───────────────────────┬───────────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  Quantitative Security Scoring │
                               │  (0 - 100 Score & CWE Mapping) │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  Hardware Crypto & Benchmarks  │
                               │  (AES-GCM, ChaCha20, RSA-2048) │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  Executive Reports & Dossiers  │
                               │  (PDF Download & JSON Export)  │
                               └────────────────────────────────┘
```

---

## 🛡️ Core Capabilities

1. **Module 1: User Input & Data Management (`/data-analysis`)**
   - Ingest raw plaintexts, hexadecimal/base64 ciphertexts, or binary files (`.enc`, `.bin`, `.pdf`, `.csv`, `.txt`).
   - Real-time client & server-side entropy pre-validation.
   - Optional cryptographic parameter declarations (algorithm claims, IVs, keys).

2. **Module 2: AI Cryptographic Recommendation Engine (`/ai-recommendations`)**
   - Multi-criteria decision engine evaluating data sensitivity (Low to Critical), target domain (Database, Wire, File, Text), and performance budgets (High Throughput vs Embedded IoT).
   - Algorithm fitness scoring with side-by-side alternative comparisons (AES-256, ChaCha20-Poly1305, RSA-2048, 3DES, Blowfish).

3. **Module 3: Deep Cryptanalysis & Statistical Inspection (`/cryptanalysis`)**
   - Mathematical Shannon Entropy ($H(X) = -\sum P(x) \log_2 P(x)$) evaluated up to 8.0 bits/byte.
   - Index of Coincidence (IoC) and Chi-Square goodness-of-fit.
   - 16-byte block alignment and Electronic Codebook (ECB) repetition leakage detection.
   - Automated CWE mapping (`CWE-312`, `CWE-326`, `CWE-327`) with step-by-step remediation.

4. **Module 4: Hardware-Accelerated Cryptographic Engine (`/encryption`)**
   - High-performance AES-256-GCM / CBC, AES-128, ChaCha20-Poly1305, Triple-DES, and RSA-2048 key generation & OAEP padding.
   - Precise microsecond execution timing and throughput benchmarks.
   - Strict Zero Key Retention policy: keys and plaintexts are never permanently written to database logs.

5. **Module 5: Security Assessment Reports (`/reports`)**
   - Generates comprehensive, audit-ready compliance reports.
   - Direct PDF generation via `pdfkit` and downloadable JSON schemas.
   - Browser printing support.

6. **Threat Intelligence & Visual SOC Dashboard (`/dashboard` & `/security-dashboard`)**
   - Circular SVG gauge with dynamic severity color tokens.
   - Recharts-powered graphs for score trends, vulnerability distributions, and cipher throughput.

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 (Custom Dark SOC Cyber Palette)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Bearer Interceptors

### Backend
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) with 7-day expiration
- **Password Security**: bcryptjs password hashing
- **File Uploads**: Multer with 10MB limit
- **Document Generation**: PDFKit

---

## 📦 Project Directory Structure

```
ciphersense/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Route business controllers
│   │   ├── middleware/      # JWT auth, validation, Multer upload
│   │   ├── models/          # Mongoose schemas (User, Analysis, Report, etc.)
│   │   ├── routes/          # Express REST endpoint routers
│   │   ├── seed/            # Demo database seeder
│   │   └── services/        # Cryptanalysis, Crypto, Recommendation, PDF logic
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client & typed endpoint functions
│   │   ├── components/      # Reusable UI cards, gauges, charts, modals
│   │   ├── contexts/        # AuthContext & Session management
│   │   ├── hooks/           # useAuth, useToast
│   │   ├── pages/           # 13 dedicated application views
│   │   ├── router/          # AppRoutes & ProtectedRoute wrapper
│   │   └── types/           # TypeScript data contracts
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## ⚙️ Quick Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB community instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI (Note: The backend gracefully operates with memory fallbacks for offline demo presentations).

### 2. Backend Setup
```bash
cd backend
npm install
```

Create or verify `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ciphersense
JWT_SECRET=ciphersense_super_secret_jwt_key_2026_soc_toolkit_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(Optional)* Seed realistic initial SOC demo records:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
*Backend runs on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Demo Login Credentials

For quick viva or capstone presentation evaluations, you can click the **"Fill Capstone Demo Credentials"** button on the Login page or use:

- **Email**: `analyst@ciphersense.io`
- **Password**: `CyberSec2026!`

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Create a new security analyst account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer token | No |
| `GET` | `/api/auth/me` | Fetch authenticated analyst context | Yes |
| `GET` | `/api/dashboard/stats` | Retrieve aggregated SOC telemetry & charts | Yes |
| `POST` | `/api/analysis` | Ingest and validate plaintexts, ciphertexts, files | Yes |
| `GET` | `/api/analysis/history` | List previous audit records with search & filters | Yes |
| `DELETE`| `/api/analysis/:id` | Delete specific audit record | Yes |
| `POST` | `/api/ai/recommend` | Generate AI algorithm recommendation | Yes |
| `POST` | `/api/cryptanalysis` | Execute deep Shannon entropy & pattern scan | Yes |
| `POST` | `/api/encryption/encrypt` | Encrypt payload with AES/ChaCha20/RSA | Yes |
| `POST` | `/api/encryption/decrypt` | Decrypt ciphertext and measure latency | Yes |
| `GET` | `/api/encryption/benchmarks`| Fetch live cryptographic benchmarks | Yes |
| `POST` | `/api/reports` | Create security assessment report | Yes |
| `GET` | `/api/reports/:id/pdf` | Download formatted PDF security dossier | Yes |
| `GET` | `/api/reports/:id/json`| Export structured JSON audit data | Yes |

---

## 🎓 Capstone Presentation & Viva Highlights

- **Distinction Between Decryption & Cryptanalysis**: Clarifies that statistical cryptanalysis identifies byte distributions, key weaknesses, and pattern leakage without making unrealistic claims of breaking AES-256 ciphertext without the key.
- **Zero Key Retention**: Emphasizes cryptographic compliance (GDPR/HIPAA) where keys are processed strictly in ephemeral memory buffers.
- **Modern AEAD Ciphers**: Recommends authenticated Galois/Counter Mode (AES-GCM) and ChaCha20-Poly1305 to stop bit-flipping chosen-ciphertext attacks.

---

*CipherSense © 2026 — Advanced Agentic Cybersecurity Full-Stack Project.*
