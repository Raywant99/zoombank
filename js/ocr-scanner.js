/**
 * ZoomBank: Document OCR Scanner & Credit Risk Visualizer
 * Simulates high-precision neural OCR with animated laser sweeping,
 * live bounding boxes, preset document templates, custom file parsing,
 * and dynamic credit risk gauge animations.
 */

class OCRScanner {
  constructor() {
    this.container = null;
    this.isScanning = false;
    this.currentDocument = 'passport';
    this.subscribers = [];

    // Pre-rendered high-res SVG document templates so the app works standalone with no external image dependencies!
    this.presetTemplates = {
      passport: {
        id: 'passport',
        name: 'US Passport (Sarah Mitchell)',
        type: 'United States Passport',
        svg: this.generatePassportSvg('Sarah Mitchell', 'P72941088', '1992-11-03', 'USA', '2031-10-18'),
        fields: [
          { key: 'fullName', label: 'Legal Full Name', value: 'Sarah Mitchell', box: { top: '38%', left: '32%', width: '38%', height: '8%' }, confidence: '99.8%' },
          { key: 'idNumber', label: 'Passport No.', value: 'P72941088', box: { top: '22%', left: '72%', width: '22%', height: '7%' }, confidence: '99.5%' },
          { key: 'dob', label: 'Date of Birth', value: '1992-11-03', box: { top: '50%', left: '32%', width: '26%', height: '7%' }, confidence: '99.2%' },
          { key: 'nationality', label: 'Nationality', value: 'UNITED STATES OF AMERICA', box: { top: '44%', left: '32%', width: '42%', height: '6%' }, confidence: '99.9%' },
          { key: 'expiryDate', label: 'Expiration Date', value: '2031-10-18', box: { top: '64%', left: '56%', width: '26%', height: '7%' }, confidence: '99.4%' },
          { key: 'employer', label: 'Verified Employer', value: 'Beacon Healthcare Analytics', box: { top: '78%', left: '10%', width: '45%', height: '6%' }, confidence: '98.5%' },
          { key: 'monthlyIncome', label: 'Verified Monthly Income', value: '$9,800.00 / mo', box: { top: '86%', left: '10%', width: '35%', height: '6%' }, confidence: '98.9%' }
        ]
      },
      drivers_license: {
        id: 'drivers_license',
        name: "California Driver License (Alex Chen)",
        type: "State Driver's License",
        svg: this.generateDriversLicenseSvg('Alex Chen', 'D89410291', '1990-08-14', '452 Pine Valley Rd, San Jose, CA', '2028-08-14'),
        fields: [
          { key: 'fullName', label: 'Legal Full Name', value: 'Alex Chen', box: { top: '34%', left: '34%', width: '35%', height: '9%' }, confidence: '99.4%' },
          { key: 'idNumber', label: 'License DL No.', value: 'D89410291', box: { top: '24%', left: '34%', width: '28%', height: '8%' }, confidence: '99.7%' },
          { key: 'dob', label: 'DOB', value: '1990-08-14', box: { top: '46%', left: '34%', width: '24%', height: '7%' }, confidence: '99.1%' },
          { key: 'address', label: 'Residential Address', value: '452 Pine Valley Rd, San Jose, CA', box: { top: '55%', left: '34%', width: '58%', height: '10%' }, confidence: '98.6%' },
          { key: 'employer', label: 'Employer', value: 'CloudScale Technologies Inc.', box: { top: '72%', left: '10%', width: '45%', height: '6%' }, confidence: '98.2%' },
          { key: 'monthlyIncome', label: 'Monthly Income', value: '$12,500.00 / mo', box: { top: '82%', left: '10%', width: '35%', height: '6%' }, confidence: '99.0%' }
        ]
      },
      paystub: {
        id: 'paystub',
        name: 'Corporate Earnings Statement / W2',
        type: 'Earnings Statement',
        svg: this.generatePaystubSvg('Ray Walker', 'OmniVanguard Financial', '$14,200.00', 'XXX-XX-6821'),
        fields: [
          { key: 'fullName', label: 'Employee Name', value: 'Ray Walker', box: { top: '22%', left: '12%', width: '32%', height: '8%' }, confidence: '99.8%' },
          { key: 'employer', label: 'Employer Entity', value: 'OmniVanguard Financial Systems', box: { top: '12%', left: '12%', width: '45%', height: '8%' }, confidence: '99.4%' },
          { key: 'idNumber', label: 'SSN (Masked)', value: 'XXX-XX-6821', box: { top: '32%', left: '12%', width: '25%', height: '7%' }, confidence: '99.9%' },
          { key: 'monthlyIncome', label: 'Gross Pay (Monthly)', value: '$14,200.00', box: { top: '55%', left: '60%', width: '28%', height: '9%' }, confidence: '99.7%' },
          { key: 'netIncome', label: 'Net Take-Home', value: '$10,850.40', box: { top: '68%', left: '60%', width: '28%', height: '9%' }, confidence: '99.5%' }
        ]
      }
    };
  }

  // Generate crisp SVG graphic for US Passport
  generatePassportSvg(name, passNo, dob, nat, exp) {
    return `
      <svg viewBox="0 0 500 330" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,0.6);">
        <!-- Document Background -->
        <defs>
          <linearGradient id="passGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="eagleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <rect width="500" height="330" rx="12" fill="url(#passGrad)" stroke="#334155" stroke-width="2"/>
        
        <!-- Passport Security Guilloche & Header -->
        <rect x="15" y="15" width="470" height="45" rx="6" fill="#1e3a8a" opacity="0.6"/>
        <text x="250" y="34" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc" text-anchor="middle" letter-spacing="2">PASSPORT / PASSEPORT</text>
        <text x="250" y="50" font-family="sans-serif" font-size="10" fill="#93c5fd" text-anchor="middle" letter-spacing="1.5">UNITED STATES OF AMERICA</text>
        
        <!-- Photo Box -->
        <rect x="25" y="75" width="115" height="150" rx="6" fill="#334155" stroke="#475569" stroke-width="2"/>
        <!-- Silhouette -->
        <circle cx="82" cy="130" r="28" fill="#94a3b8"/>
        <path d="M 45 200 Q 82 170 120 200 Z" fill="#94a3b8"/>
        <text x="82" y="218" font-family="sans-serif" font-size="8" fill="#cbd5e1" text-anchor="middle">OFFICIAL BIOMETRIC</text>

        <!-- Fields -->
        <text x="160" y="90" font-family="monospace" font-size="9" fill="#94a3b8">TYPE / TYPE</text>
        <text x="160" y="104" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">P</text>

        <text x="260" y="90" font-family="monospace" font-size="9" fill="#94a3b8">PASSPORT NO. / NO. DU PASSEPORT</text>
        <text x="260" y="105" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8">${passNo}</text>

        <text x="160" y="128" font-family="monospace" font-size="9" fill="#94a3b8">SURNAME / NOM</text>
        <text x="160" y="143" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">${name.split(' ')[1] || 'MITCHELL'}</text>

        <text x="160" y="165" font-family="monospace" font-size="9" fill="#94a3b8">GIVEN NAMES / PRENOMS</text>
        <text x="160" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">${name.split(' ')[0] || 'SARAH'}</text>

        <text x="160" y="202" font-family="monospace" font-size="9" fill="#94a3b8">NATIONALITY / NATIONALITE</text>
        <text x="160" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff">${nat}</text>

        <text x="320" y="202" font-family="monospace" font-size="9" fill="#94a3b8">DATE OF BIRTH / DATE DE NAISSANCE</text>
        <text x="320" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff">${dob}</text>

        <!-- Machine Readable Zone (MRZ) -->
        <rect x="15" y="245" width="470" height="70" rx="4" fill="#0f172a" stroke="#1e293b"/>
        <text x="25" y="272" font-family="monospace" font-size="12" fill="#38bdf8" letter-spacing="3.5">P&lt;USAMITCHELL&lt;&lt;SARAH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
        <text x="25" y="295" font-family="monospace" font-size="12" fill="#38bdf8" letter-spacing="3.5">${passNo}4USA9211038F3110182&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</text>
      </svg>
    `;
  }

  // Generate crisp SVG for Driver's License
  generateDriversLicenseSvg(name, dlNo, dob, addr, exp) {
    return `
      <svg viewBox="0 0 500 315" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,0.6);">
        <rect width="500" height="315" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <!-- State Header Bar -->
        <rect x="0" y="0" width="500" height="52" rx="14" fill="#0284c7"/>
        <rect x="0" y="38" width="500" height="14" fill="#0284c7"/>
        <text x="25" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#fff" letter-spacing="1">CALIFORNIA</text>
        <text x="475" y="32" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fef08a" text-anchor="end">REAL ID ★</text>

        <!-- Photo -->
        <rect x="25" y="70" width="110" height="145" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="80" cy="120" r="28" fill="#64748b"/>
        <path d="M 45 190 Q 80 160 115 190 Z" fill="#64748b"/>
        <text x="80" y="205" font-family="sans-serif" font-size="8" fill="#475569" text-anchor="middle">VERIFIED DL</text>

        <!-- DL Number -->
        <text x="155" y="80" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626">DL ${dlNo}</text>
        <text x="350" y="80" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e293b">EXP ${exp}</text>

        <!-- Name & Details -->
        <text x="155" y="105" font-family="sans-serif" font-size="9" fill="#64748b">LN/FN</text>
        <text x="155" y="122" font-family="sans-serif" font-size="14" font-weight="800" fill="#0f172a">${name.toUpperCase()}</text>

        <text x="155" y="145" font-family="sans-serif" font-size="9" fill="#64748b">ADDRESS</text>
        <text x="155" y="160" font-family="sans-serif" font-size="11" font-weight="600" fill="#1e293b">${addr}</text>

        <text x="155" y="185" font-family="sans-serif" font-size="9" fill="#64748b">DOB</text>
        <text x="155" y="200" font-family="sans-serif" font-size="12" font-weight="700" fill="#0f172a">${dob}</text>

        <text x="270" y="185" font-family="sans-serif" font-size="9" fill="#64748b">CLASS</text>
        <text x="270" y="200" font-family="sans-serif" font-size="12" font-weight="700" fill="#0f172a">C (NONCOMMERCIAL)</text>

        <!-- Barcode band -->
        <rect x="25" y="235" width="450" height="55" rx="4" fill="#0f172a"/>
        <text x="250" y="268" font-family="monospace" font-size="14" fill="#38bdf8" text-anchor="middle" letter-spacing="4">|||||| ||||| |||||||| |||| |||||||||||| ||||||</text>
      </svg>
    `;
  }

  // Generate crisp SVG for Paystub / W2
  generatePaystubSvg(name, employer, gross, ssn) {
    return `
      <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,0.6);">
        <rect width="500" height="320" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="0" y="0" width="500" height="42" fill="#0f172a"/>
        <text x="20" y="26" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">${employer.toUpperCase()}</text>
        <text x="480" y="26" font-family="sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="end">BI-WEEKLY EARNINGS ADVICE</text>

        <line x1="20" y1="95" x2="480" y2="95" stroke="#e2e8f0" stroke-width="1.5"/>

        <text x="20" y="65" font-family="sans-serif" font-size="9" fill="#64748b">EMPLOYEE NAME</text>
        <text x="20" y="80" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">${name}</text>

        <text x="240" y="65" font-family="sans-serif" font-size="9" fill="#64748b">IDENTIFIER</text>
        <text x="240" y="80" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a">${ssn}</text>

        <text x="370" y="65" font-family="sans-serif" font-size="9" fill="#64748b">PAY PERIOD END</text>
        <text x="370" y="80" font-family="sans-serif" font-size="11" font-weight="600" fill="#0f172a">2026-10-15</text>

        <!-- Earnings Table -->
        <rect x="20" y="110" width="460" height="140" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="35" y="132" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569">EARNINGS CATEGORY</text>
        <text x="260" y="132" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569">RATE / HRS</text>
        <text x="440" y="132" font-family="sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="end">CURRENT TOTAL</text>
        <line x1="20" y1="142" x2="480" y2="142" stroke="#e2e8f0"/>

        <text x="35" y="165" font-family="sans-serif" font-size="11" fill="#1e293b">Regular Salary</text>
        <text x="260" y="165" font-family="sans-serif" font-size="11" fill="#1e293b">Salaried (80.00)</text>
        <text x="440" y="165" font-family="monospace" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="end">${gross}</text>

        <text x="35" y="190" font-family="sans-serif" font-size="11" fill="#1e293b">Federal & State Withholdings</text>
        <text x="260" y="190" font-family="sans-serif" font-size="11" fill="#1e293b">Standard 28%</text>
        <text x="440" y="190" font-family="monospace" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="end">- $3,349.60</text>

        <line x1="20" y1="205" x2="480" y2="205" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="35" y="228" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">NET DIRECT DEPOSIT</text>
        <text x="440" y="228" font-family="monospace" font-size="15" font-weight="bold" fill="#16a34a" text-anchor="end">$10,850.40</text>

        <!-- Watermark -->
        <rect x="20" y="265" width="460" height="35" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
        <text x="250" y="287" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">✓ VERIFIED BY ZOOMBANK AUTOMATED PAYROLL OCR EXTRACTOR</text>
      </svg>
    `;
  }

  // Render document into stage container
  renderDocument(docKey = 'passport') {
    const doc = this.presetTemplates[docKey] || this.presetTemplates.passport;
    this.currentDocument = docKey;

    const previewContainer = document.getElementById('doc-preview-target');
    const boundingLayer = document.getElementById('ocr-bounding-layer');
    const fieldsList = document.getElementById('ocr-fields-list');

    if (previewContainer) {
      previewContainer.innerHTML = doc.svg;
    }

    if (boundingLayer) {
      boundingLayer.innerHTML = '';
      doc.fields.forEach(f => {
        const box = document.createElement('div');
        box.className = 'ocr-box';
        box.style.top = f.box.top;
        box.style.left = f.box.left;
        box.style.width = f.box.width;
        box.style.height = f.box.height;

        const label = document.createElement('span');
        label.className = 'ocr-box-label';
        label.textContent = `${f.key.toUpperCase()} (${f.confidence})`;
        box.appendChild(label);

        boundingLayer.appendChild(box);
      });
    }

    if (fieldsList) {
      fieldsList.innerHTML = '';
      doc.fields.forEach(f => {
        const item = document.createElement('div');
        item.className = 'field-box';
        item.innerHTML = `
          <div class="field-label">
            <span>${f.label}</span>
            <span class="field-confidence">${f.confidence}</span>
          </div>
          <input type="text" class="field-value" value="${f.value}" data-key="${f.key}">
        `;
        fieldsList.appendChild(item);
      });
    }
  }

  // Handle custom user image upload
  handleCustomFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewContainer = document.getElementById('doc-preview-target');
      if (previewContainer) {
        previewContainer.innerHTML = `
          <img src="${e.target.result}" style="max-width:100%;max-height:100%;border-radius:10px;object-fit:contain;box-shadow:0 12px 35px rgba(0,0,0,0.6);" alt="Uploaded Document"/>
        `;
      }
      // Trigger scan animation
      this.triggerScanAnimation();
    };
    reader.readAsDataURL(file);
  }

  // Laser scanning animation trigger
  async triggerScanAnimation() {
    const wrapper = document.getElementById('doc-viewport-card');
    if (!wrapper) return;

    wrapper.classList.add('scanning');
    await new Promise(r => setTimeout(r, 2200));
    wrapper.classList.remove('scanning');
  }

  // Render Credit Score Gauge with animated needle and gradient arc
  renderCreditGauge(score = 754) {
    const needle = document.getElementById('gauge-needle');
    const scoreVal = document.getElementById('gauge-score-value');
    const tierVal = document.getElementById('gauge-score-tier');

    if (scoreVal) scoreVal.textContent = score;

    // Convert score (300 - 850) to rotation angle (-90deg to +90deg)
    const minScore = 300;
    const maxScore = 850;
    const clamped = Math.max(minScore, Math.min(maxScore, score));
    const percentage = (clamped - minScore) / (maxScore - minScore);
    const rotation = -90 + (percentage * 180);

    if (needle) {
      needle.style.transform = `rotate(${rotation}deg)`;
    }

    if (tierVal) {
      if (score >= 750) {
        tierVal.textContent = 'Excellent / Tier-1 Prime';
        tierVal.style.color = '#22c55e';
      } else if (score >= 670) {
        tierVal.textContent = 'Good / Tier-2 Standard';
        tierVal.style.color = '#38bdf8';
      } else if (score >= 580) {
        tierVal.textContent = 'Fair / Conditional Approval';
        tierVal.style.color = '#f59e0b';
      } else {
        tierVal.textContent = 'Subprime / Review Required';
        tierVal.style.color = '#ef4444';
      }
    }
  }
}

// Export singleton
window.ocrScanner = new OCRScanner();
