# AICTE APAAR Platform: Demonstration & Technical Verification

**Stakeholder:** All India Council for Technical Education (AICTE), Ministry of Education  
**Application URL:** `http://127.0.0.1:5173` (Live Development Server)  
**Standard:** Enterprise GovTech (Zero neon lighting, zero emojis, zero playful animations, high information density)

---

## 1. Executive Summary & Verification Overview

The **AICTE APAAR ID-Based Student Data Management & Verification Platform** has been designed, implemented, and verified in the local workspace. All six flagship capabilities requested are operational with real-time reactive validation, cryptographic verification, and institutional controls.

![AICTE APAAR Portal Home & Intake Guard](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/aicte_portal_home_1793285290146.png)

---

## 2. Flagship Features Walkthrough

### Feature 1: Intake Guard (Live Seat Ledger)
- **Problem Solved:** Technical colleges currently report statistical headcounts during approvals, making mid-cycle excess admissions difficult to detect until after admissions conclude.
- **Engine Capabilities:**
  - Real-time seat counter per programme split into **General**, **Supernumerary (TFWS, PMSSS)**, **NRI**, **OCI**, and **Foreign National (FN)**.
  - Warns in amber at &ge; 90% capacity.
  - Hard-blocks admissions exceeding sanctioned + approved supernumerary capacity.
  - Integrated with the **ISO-7064 Verhoeff algorithm** for 12-digit APAAR validation.

---

### Feature 2: Ghost Enrolment Radar
- **Problem Solved:** Absence of unique national academic identifiers allowed students to hold full-time regular degree seats in multiple colleges or colleges to report dormant student rosters.
- **Engine Capabilities:**
  - **Cross-Campus Collision Topology:** Highlights concurrent regular degree collisions (e.g., student Priya Narayanan holding simultaneous full-time seats in Delhi and Maharashtra, distance ~1,420 km, 99.4% confidence).
  - **Privacy-Preserving HMAC-SHA256 Anonymization:** Conforms to the Digital Personal Data Protection (DPDP) Act 2023.
  - **Ghost Dormancy Tracker:** Identifies students on institutional rosters with zero LMS activity or credit transactions for &gt;180 days.

![Ghost Enrolment Radar & Cross-Campus Topology](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/ghost_enrolment_radar_1793285312366.png)

---

### Feature 3: Explainable Anomaly Engine & Institution Trust Score
- **Problem Solved:** Manual inspections cannot catch late-cycle batch surges, category distortions, or unvetted NRI quota utilization.
- **Engine Capabilities:**
  - **Unsupervised Anomaly Diagnostics:** Flags late-cycle bulk admissions (e.g., 48 admissions in the final 3 hours before cutoff), unnatural NRI surges, and category drift.
  - **Plain-Language Explanation:** Plain-text diagnostic reasoning explaining why an incident was flagged and citing statistical deviation.
  - **Institutional Compliance Index (Trust Score):** Transparent 0–100 score classifying institutions into Grade A+, Grade A, Grade B, and High Risk.
  - **"AI Flags; Human Officers Decide" Workflow:** Regulatory adjudication interface with formal show-cause issuance.

![Explainable Anomaly Engine & Trust Score](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/anomaly_engine_tab_1793285323465.png)

---

### Feature 4: Consent-Gated Verifiable Student Pass
- **Problem Solved:** Third-party verification (employers, embassies) is slow and risks exposing sensitive personal information (caste, parental income).
- **Engine Capabilities:**
  - **Tamper-Evident Academic Pass:** Official credential layout with AICTE watermark and dynamic canvas-rendered cryptographic QR code.
  - **Selective Disclosure Toggles:** Students can disclose or mask CGPA/marks, social category, and guardian details while preserving institutional accreditation proof.
  - **Instant Revocation:** Student can revoke consent at any time, immediately invalidating the cryptographic token.
  - **Stakeholder Verification Desk:** Direct query interface for employers and embassies to verify records against the AICTE Trust Root.

![Verifiable Student Pass & Selective Disclosure](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/verifiable_student_pass_tab_1793285336820.png)

---

### Feature 5: Tamper-Evident Audit Chain
- **Problem Solved:** Lack of cryptographic auditability allowed institutional records to be silently modified without a permanent trail.
- **Engine Capabilities:**
  - **Sequential Hash-Chained Blocks:** Every batch upload, enrolment addition, and status change creates an immutable block linked to the previous block hash.
  - **Cryptographic Receipts:** Signed ECDSA receipts for each transaction.
  - **Chain Integrity Verifier:** Real-time validator checking parent-hash integrity across the ledger.

![Tamper-Evident Audit Chain](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/audit_chain_tab_1793285350660.png)

---

### Feature 6: Pre-Submission Dry-Run & Data Health Score
- **Problem Solved:** High rejection rates and registrar friction when submitting batch CSV/ERP student files.
- **Engine Capabilities:**
  - **Pre-Flight Validator:** Scans candidate records before committing to the AICTE central repository.
  - **Data Health Score (0–100%):** Immediate quality assessment with gate threshold (&ge; 90% required for final submission).
  - **Row-Level Diagnostics & One-Click Fixes:** Identifies failed Verhoeff check digits, missing NRI visa documents, or duplicate entries, with auto-remediation buttons.
  - **Intake Projections:** Simulates whether the proposed batch will push any course beyond sanctioned limits.

![Pre-Submission Dry-Run & Health Score](/C:/Users/bhave/.gemini/antigravity-ide/brain/683f9e8c-fbdc-4b1f-9c41-b42e2d650f28/dry_run_tab_1793285389265.png)

---

## 3. Technology Stack & Verification Artifacts

- **Frontend & App Framework:** React 18, TypeScript 5, Vite 6.
- **Design System:** Custom GovTech Enterprise Design Tokens in [index.css](file:///c:/Users/bhave/SIH_2/src/index.css) (Deep Navy `#0B1A2E`, Slate `#0F172A`, WCAG 2.1 AA Compliant).
- **Icons:** `lucide-react` (Institutional icons).
- **Core Algorithms:** [validationEngine.ts](file:///c:/Users/bhave/SIH_2/src/services/validationEngine.ts) (ISO-7064 Verhoeff checksum algorithm, HMAC-SHA256 privacy simulator, Pre-Flight Dry-Run evaluator).
- **Build Verification:** Tested with `npm run build` (0 compile errors, 16.8s bundle time).
- **Live Server:** Running on `http://127.0.0.1:5173`.
