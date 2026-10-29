# AICTE APAAR Platform
### National Academic Identity (APAAR) Student Data Management, Intake Audit & Verification System

[![Status](https://img.shields.io/badge/status-active_production-success.svg)](#)
[![Compliance](https://img.shields.io/badge/compliance-DPDP_Act_2023-blue.svg)](#)
[![Validation](https://img.shields.io/badge/validation-ISO_7064_Verhoeff-indigo.svg)](#)
[![Cryptographic](https://img.shields.io/badge/security-ECDSA_SHA256_Hashchain-slate.svg)](#)

An integrated digital platform for AICTE-approved institutions and the central regulatory council that leverages **APAAR ID (Automated Permanent Academic Account Registry)** as a unique academic identifier. Proactively tracks sanctioned vs actual intakes, eliminates ghost & dual regular degree enrollments across technical institutions, and issues consent-gated verifiable academic passes.

---

## 🏛️ Regulatory Context & Problem Resolution

1. **Intake Cap Violations:** Technical colleges historically report gross statistical headcounts during the annual approval process rather than real-time student-level seat allocations. Supernumerary quotas (TFWS, PMSSS, NRI, OCI, FN) frequently exceeded caps unnoticed.
2. **Ghost & Dual Enrolments:** Absence of a synchronized unique national academic identifier allowed students to hold full-time regular degree seats in multiple institutions simultaneously.
3. **Third-Party Verification Friction:** Employers and embassies lack an authoritative, zero-latency verification mechanism directly tied to the national academic identity without violating student privacy under the DPDP Act 2023.

---

## ⚡ 6 Flagship Features

### 1. Intake Guard (Live Seat Ledger)
- Real-time seat counter per programme split by **General**, **Supernumerary (TFWS, PMSSS)**, **NRI**, **OCI**, and **Foreign National (FN)**.
- Warns at **90%** capacity; automatically blocks/escalates when intake would be exceeded before registration occurs.
- Interactive admission validator enforcing the **ISO-7064 Verhoeff Mod 11,10 algorithm** for 12-digit APAAR numbers.

### 2. Ghost Enrolment Radar
- **Cross-Campus Collision Topology:** Highlights concurrent full-time regular degree collisions across states (with distance calculation and detection confidence metrics).
- **Zero-Knowledge Privacy:** Uses privacy-preserving **HMAC-SHA256** hashed matching so candidate PII is never exposed during cross-institutional deduplication queries.
- **Ghost Dormancy Tracker:** Flags enrolled students with zero academic activity/exams for >180 days.

### 3. Explainable Anomaly Engine & Institution Trust Score
- Unsupervised statistical models detecting **late-cycle bulk admissions** (e.g., 48 admissions in the final 3 hours before cutoff), **unnatural NRI surges**, and **category-ratio drift**.
- **Plain-language diagnostic reasoning** for every incident with empirical baseline deviations.
- **Institutional Compliance Index (Trust Score):** Transparent 0–100 score classifying institutions into Grade A+, Grade A, Grade B, and High Risk.
- **"AI Flags; Human Officers Decide" Workflow:** Regulatory adjudication interface with formal show-cause issuance.

### 4. Consent-Gated Verifiable Student Pass
- Official credential layout with AICTE watermark and canvas-rendered cryptographic QR code.
- **Selective Disclosure Toggles (DPDP Act 2023):** Students grant time-limited consent (24h, 7d, 30d) and choose which attributes to disclose (masking CGPA, caste/quota, or guardian details while proving official AICTE enrollment).
- **Instant Revocation Switch:** Immediately invalidates the verification token.
- **Public & Employer Verifier Desk:** Dedicated search & verification portal for recruiters, universities, and regulatory councils.

### 5. Tamper-Evident Audit Chain
- Cryptographic hash-chained immutable ledger.
- Every batch upload, student registration, and intake modification generates a block linked to the previous block hash with signed ECDSA receipts.
- Built-in **Chain Integrity Verifier** checking recursive parent hashes.

### 6. Pre-Submission Dry-Run & Data Health Score
- Pre-flight batch validator for institutional CSV/ERP uploads.
- Calculates an instant **Data Health Score (0–100%)** before central database commit.
- Row-level diagnostics with **one-click "Auto-Fix"** buttons for Verhoeff check-digit mismatches, missing visa documentation, and duplicates.
- Course intake impact projections before committing to the AICTE central repository.

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 18, TypeScript 5, Vite 6.
- **Design System:** Custom GovTech Enterprise Design Tokens (`index.css`) — Deep Navy (`#0B1A2E`), Slate (`#0F172A`), high information density, WCAG 2.1 AA contrast.
- **Icons:** `lucide-react`.
- **Validation & Cryptography:** Custom implementations of the ISO-7064 Verhoeff algorithm, HMAC-SHA256 hashing, and sequential block chaining in `src/services/validationEngine.ts`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/bhavesh2148/aicte-apaar-portal.git

# Navigate into the project directory
cd aicte-apaar-portal

# Install dependencies
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏛️ Statutory Alignment

- **National Education Policy (NEP 2020):** APAAR integration for unified student academic tracking.
- **AICTE Approval Process Handbook (APH):** Enforces statutory intake limits and supernumerary caps.
- **Digital Personal Data Protection (DPDP) Act 2023:** Selective disclosure, student consent lifecycle management, and privacy-preserving hashed matching.
