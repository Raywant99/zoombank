# ZoomBank: Video-Verified Instant Loan Portal

> A virtual video-banking web application inspired by Zoom, designed for remote personal loan consultations, real-time credential verification, and instant disbursement.

---

## 🌟 Executive Overview & Key Features

ZoomBank simulates an enterprise-grade virtual branch experience where borrowers connect directly with an AI-assisted loan underwriting officer (**Sophia Vance**) inside a secure, video-verified consultation room.

1. **Integrated Virtual Meeting Interface (Zoom-Inspired Chrome & WebRTC)**
   - **Authentic Zoom Stage**: Top encrypted session badge (`256-BIT AES SECURED`), regulatory compliance recording indicator (`REC COMPLIANCE`), live meeting timer, and meeting controls.
   - **Dual Interactive Feeds**:
     - **AI Underwriting Officer Sophia Vance**: Dynamic financial officer avatar with speaking speech pulse waves, audio level bars, and browser-native voice synthesis (`SpeechSynthesisUtterance`) with live synchronized closed captions.
     - **Borrower Video Feed**: Direct WebRTC webcam streaming with automated fallback to synthetic video feed, combined with real-time biometric HUD overlay (68 facial landmark mesh, 99.4% liveness detection, and anti-spoofing certification).
   - **View Switchers**: One-click toggling between **Gallery View** (split screen), **Speaker View** (officer dominant), and **Review Stage** (collaborative document & contract inspection).

2. **Automated Document Scanning, OCR Extraction & Credit-Risk Scoring**
   - **Laser Scanning Simulation**: High-tech laser sweep animation across credential previews with real-time bounding box annotations on detected attributes.
   - **Preset Credential Templates**:
     - *US Passport* (Sarah Mitchell — \$9,800/mo net income)
     - *California Driver's License* (Alex Chen — \$12,500/mo net income)
     - *Corporate W2 / Earnings Advice* (Ray Walker — \$14,200/mo gross pay)
   - **Custom Upload Support**: Ingest custom IDs, driver's licenses, or paystubs with instant field segmentation.
   - **Instant Credit Risk Engine**:
     - Interactive SVG Credit Gauge meter (300 to 850 score range) with animated needle and dynamic risk tier coloring (Tier-1 Prime, Tier-2 Standard, Fair, Subprime).
     - Tri-bureau score aggregation (Equifax, Experian, TransUnion).
     - Real-time Debt-to-Income (DTI) computation and identity fraud risk scoring.

3. **Digital E-Signature Pipeline & Instant FedNow Disbursement**
   - **Interactive Loan Customizer**:
     - Principal amount slider from **\$1,000 to \$50,000**.
     - Loan duration selector: 12, 24, 36, 48, or 60 months.
     - Dynamic calculation of monthly installments, APR, finance charge, and total amortized repayment.
   - **Truth in Lending Act (TILA) Note**: Automatically compiles legally structured promissory note with borrower details, APR, and cryptographic verification hash.
   - **Dual-Mode Signature Pad**:
     - Smooth Bezier curve drawing pad on HTML5 Canvas with mouse and touch support.
     - Typed signature mode rendering legal cursive typography.
   - **Instant FedNow Rails Simulation**:
     - Finalizing the agreement generates an immutable SHA-256 audit token and triggers a FedNow instant disbursement certificate modal with transaction reference and printable/downloadable PDF agreement format.

4. **Antigravity Multi-Agent Orchestration Architecture**
   - Coordinates 4 specialized agents working in consensus:
     - 👁️ **`BioVerify-AGY`**: Real-time video face matching against ID photo, liveness verification, and AML/OFAC sanction check.
     - 📄 **`DocuParser-AGY`**: Neural OCR segmentation, credential extraction, and tamper detection.
     - 🛡️ **`RiskGuard-AGY`**: Credit bureau pull simulation, DTI computation, and maximum eligible limit sizing.
     - ⚡ **`UIForge-AGY`**: Dynamically generates personalized loan sliders, contract clauses, and the cryptographic signature docket.
   - **Live JSON-RPC Stream**: Telemetry drawer displays real-time inter-agent messaging bus with timestamps, latency, and JSON RPC event payloads.

---

## 🚀 How to Launch and Run

### Option 1: One-Click PowerShell Launcher
Open PowerShell in the `zoombank` directory and execute:
```powershell
.\Start-ZoomBank.ps1
```
This automatically starts a lightweight local HTTP server and opens ZoomBank in your default web browser (Edge, Chrome, or Opera).

### Option 2: Direct Browser Launch
ZoomBank is completely zero-dependency and self-contained. You can double-click or open `index.html` directly in any modern browser:
```powershell
Start-Process "c:\New folder\zoombank\index.html"
```

---

## 📁 Project Structure

```
c:\New folder\zoombank\
├── index.html              # Main ZoomBank web application interface
├── Start-ZoomBank.ps1      # Lightweight local HTTP server launcher
├── README.md               # Architecture and user guide
├── css/
│   └── styles.css          # Zoom aesthetic styling, glassmorphism, animations, print rules
└── js/
    ├── agents.js           # Antigravity 4-agent orchestration engine & JSON-RPC bus
    ├── ocr-scanner.js      # Neural OCR scanner, SVG document templates & credit gauge
    ├── signature.js        # Smooth HTML5 canvas signature pad, cryptographic stamp & FedNow modal
    ├── meeting.js          # Zoom room controller, WebRTC webcam, speech synthesis & subtitles
    └── app.js              # Master wiring connecting meeting UI, agents, and loan pipeline
```

---

## 🔒 Security & Compliance Standards
- **ESIGN Act Compliant**: Adheres to 15 U.S. Code § 7001 for electronic signature validity.
- **TILA Disclosures**: Federal Truth in Lending Act schedule generation.
- **Biometric Anti-Spoofing**: Simulated ISO 30107-3 liveness protocol.
- **FedNow Network**: Simulated real-time gross settlement (RTGS) payment rails.
