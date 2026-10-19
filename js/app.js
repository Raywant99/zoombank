/**
 * ZoomBank: Main Application Orchestrator
 * Integrates:
 *   - Video Banking Meeting Room
 *   - Antigravity 4-Agent Orchestration Telemetry
 *   - Real-time OCR Document Scanner
 *   - Credit Risk Scoring Model
 *   - Digital E-Signature Pipeline & FedNow Disbursement
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subsystems
  window.meetingController.init();
  window.signaturePipeline.init('signature-canvas');
  window.ocrScanner.renderDocument('passport');
  window.ocrScanner.renderCreditGauge(754);

  // 2. Setup Antigravity Orchestrator Subscriptions
  setupOrchestratorTelemetry();

  // 3. Bind UI Interactivity & Event Handlers
  bindToolbarActions();
  bindPresentationTabs();
  bindDocumentPresets();
  bindLoanSliders();
  bindSignatureActions();
  bindChatEvents();

  // 4. Initial AI Officer Welcome Message
  setTimeout(() => {
    window.meetingController.speak(
      "Welcome to ZoomBank instant video underwriting. I'm Sophia Vance. Please hold up your identity document or select a credential preset to begin automated Antigravity risk verification."
    );
  }, 1200);
});

// --------------------------------------------------------------------------
// Antigravity Orchestrator Telemetry & Stream Bindings
// --------------------------------------------------------------------------
function setupOrchestratorTelemetry() {
  const orchestrator = window.antigravityOrchestrator;
  const streamContainer = document.getElementById('agent-telemetry-stream');

  orchestrator.subscribe((event, state, agents) => {
    // 1. Update Agent Status Cards in Orchestrator Drawer
    updateAgentCard('docuParser', agents.docuParser);
    updateAgentCard('riskGuard', agents.riskGuard);
    updateAgentCard('bioVerify', agents.bioVerify);
    updateAgentCard('uiForge', agents.uiForge);

    // 2. Append event to live RPC event stream
    if (streamContainer) {
      const row = document.createElement('div');
      row.className = 'stream-event-row';

      let details = '';
      if (event.eventType === 'INTER_AGENT_RPC') {
        details = `<span class="stream-agent-sender">${event.from} ➔ ${event.to}</span> <span style="color:#60a5fa;">[${event.method}]</span>`;
        if (event.payload) {
          details += `<br><span style="color:#94a3b8;">${JSON.stringify(event.payload).substring(0, 85)}...</span>`;
        }
      } else if (event.eventType === 'AGENT_STATUS_CHANGE') {
        details = `<span style="color:#34d399;">${event.agentId}: ${event.message}</span>`;
      } else if (event.eventType === 'CONTRACT_GENERATED') {
        details = `<span style="color:#c084fc;">Docket #${event.docketId} compiled for ${event.borrowerName}</span>`;
      } else {
        details = `<span style="color:#cbd5e1;">${event.message || event.eventType}</span>`;
      }

      row.innerHTML = `
        <div class="stream-meta">
          <span>${event.timestamp}</span>
          <span>${event.eventType}</span>
        </div>
        <div class="stream-payload">${details}</div>
      `;

      streamContainer.insertBefore(row, streamContainer.firstChild);
      while (streamContainer.children.length > 30) {
        streamContainer.removeChild(streamContainer.lastChild);
      }
    }

    // 3. React to State Changes
    if (event.eventType === 'CONTRACT_GENERATED') {
      renderContractAgreement(event);
    }
  });
}

function updateAgentCard(id, agent) {
  const card = document.getElementById(`agent-card-${id}`);
  const statePill = document.getElementById(`agent-state-${id}`);
  const taskText = document.getElementById(`agent-task-${id}`);

  if (card) {
    card.className = `agent-status-card ${agent.status}`;
  }
  if (statePill) {
    statePill.className = `agent-state-pill state-${agent.status}`;
    statePill.textContent = agent.status.toUpperCase();
  }
  if (taskText) {
    taskText.textContent = agent.lastMessage;
  }
}

// --------------------------------------------------------------------------
// Presentation View Tabs (Doc Scanner, Risk Matrix, Loan Terms, E-Sign)
// --------------------------------------------------------------------------
function bindPresentationTabs() {
  const tabs = document.querySelectorAll('.pres-tab-btn');
  const sections = {
    'tab-doc-scanner': document.getElementById('sec-doc-scanner'),
    'tab-risk-matrix': document.getElementById('sec-risk-matrix'),
    'tab-loan-terms': document.getElementById('sec-loan-terms'),
    'tab-e-sign': document.getElementById('sec-e-sign')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.id;
      Object.keys(sections).forEach(k => {
        if (sections[k]) {
          sections[k].style.display = k === targetId ? 'block' : 'none';
        }
      });

      // Special resize if canvas tab clicked
      if (targetId === 'tab-e-sign') {
        setTimeout(() => window.signaturePipeline.resizeCanvas(), 50);
      }
    });
  });
}

// --------------------------------------------------------------------------
// Document Presets & Trigger Scan
// --------------------------------------------------------------------------
function bindDocumentPresets() {
  const presetChips = document.querySelectorAll('.preset-chip');
  presetChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      const docType = chip.getAttribute('data-doc');
      window.ocrScanner.renderDocument(docType);
      await window.ocrScanner.triggerScanAnimation();

      // Trigger multi-agent pipeline with selected persona
      window.antigravityOrchestrator.runFullVerificationWorkflow(docType);

      // Contextual voice prompt
      window.meetingController.speak(
        `I have ingested the ${docType.replace('_', ' ')}. Our DocuParser and RiskGuard agents are validating identity and creditworthiness.`
      );
    });
  });

  const uploadInput = document.getElementById('doc-file-upload');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        window.ocrScanner.handleCustomFileUpload(file);
        window.antigravityOrchestrator.runFullVerificationWorkflow('custom');
      }
    });
  }

  const runAllAgentsBtn = document.getElementById('btn-run-all-agents');
  if (runAllAgentsBtn) {
    runAllAgentsBtn.addEventListener('click', () => {
      window.antigravityOrchestrator.runFullVerificationWorkflow();
    });
  }
}

// --------------------------------------------------------------------------
// Loan Slider & Economic Recalculation
// --------------------------------------------------------------------------
function bindLoanSliders() {
  const amountSlider = document.getElementById('loan-amount-slider');
  const amountDisplay = document.getElementById('loan-amount-display');
  const termChips = document.querySelectorAll('.term-chip-btn');
  let selectedTerm = 36;

  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      termChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedTerm = parseInt(chip.getAttribute('data-term'), 10);
      recalculate();
    });
  });

  if (amountSlider) {
    amountSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (amountDisplay) amountDisplay.textContent = `$${val.toLocaleString()}`;
      recalculate();
    });
  }

  function recalculate() {
    const principal = parseInt(amountSlider.value, 10);
    const updated = window.antigravityOrchestrator.recalculateLoan(principal, selectedTerm);

    const monthlyEl = document.getElementById('summary-monthly-val');
    const totalEl = document.getElementById('summary-total-val');
    const interestEl = document.getElementById('summary-interest-val');
    const aprEl = document.getElementById('summary-apr-val');

    if (monthlyEl) monthlyEl.textContent = `$${updated.monthlyPayment.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${updated.totalRepayment.toFixed(2)}`;
    if (interestEl) interestEl.textContent = `$${(updated.totalRepayment - updated.amount).toFixed(2)}`;
    if (aprEl) aprEl.textContent = `${updated.apr}% Fixed`;

    // Also update contract preview if rendered
    renderContractAgreement(window.antigravityOrchestrator.state.generatedContract);
  }
}

// --------------------------------------------------------------------------
// Contract Legal Text Synthesis
// --------------------------------------------------------------------------
function renderContractAgreement(contract) {
  const preview = document.getElementById('contract-preview-body');
  if (!preview) return;

  const data = contract || {
    docketId: 'ZB-NOTE-892102',
    borrowerName: 'Sarah Mitchell',
    borrowerAddress: '1200 Avenue of the Americas, New York, NY',
    principal: 15000,
    termMonths: 36,
    annualPercentageRate: 6.85,
    monthlyPayment: 462.15,
    totalRepayable: 16637.40,
    disbursementMethod: 'FedNow Instant Rails',
    sha256VerificationHash: '8f4c2e6b9a8109d7e391b45c'
  };

  preview.innerHTML = `
    <h3>ZOOMBANK PROMISSORY NOTE &amp; TRUTH IN LENDING DISCLOSURE</h3>
    <p style="text-align:center; color:#64748b; font-size:10.5px; margin-bottom:12px;">
      Docket ID: <strong>${data.docketId}</strong> | Federal Lending Registration #ZB-FED-2026-9901
    </p>

    <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px; margin-bottom:12px;">
      <h4 style="font-size:11px; text-transform:uppercase; color:#0f172a; margin-bottom:6px;">Federal Truth in Lending Act (TILA) Disclosures</h4>
      <table style="width:100%; font-size:11px;">
        <tr>
          <th>ANNUAL PERCENTAGE RATE</th>
          <th>FINANCE CHARGE</th>
          <th>AMOUNT FINANCED</th>
          <th>TOTAL OF PAYMENTS</th>
        </tr>
        <tr>
          <td style="font-weight:bold; color:#0284c7;">${data.annualPercentageRate}% Fixed</td>
          <td>$${(data.totalRepayable - data.principal).toFixed(2)}</td>
          <td style="font-weight:bold;">$${data.principal.toLocaleString()}.00</td>
          <td style="font-weight:bold; color:#16a34a;">$${data.totalRepayable.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p>
      <strong>1. BORROWER PROMISE TO PAY:</strong> For value received through ZoomBank Video Verification Room #842-990-112, Borrower (<strong>${data.borrowerName}</strong>, residing at ${data.borrowerAddress}) promises to pay ZoomBank Financial NA the principal sum of <strong>$${data.principal.toLocaleString()}.00</strong> with interest at the fixed rate of ${data.annualPercentageRate}% per annum in <strong>${data.termMonths}</strong> consecutive monthly installments of <strong>$${data.monthlyPayment}</strong>.
    </p>
    <p style="margin-top:8px;">
      <strong>2. BIOMETRIC VERIFICATION &amp; E-SIGNATURE CONSENT:</strong> The Borrower confirms their identity has been verified via the Antigravity BioVerify-AGY real-time facial mesh scan and AML/OFAC clearance. Under the federal ESIGN Act (15 U.S.C. § 7001), the digital signature appended below constitutes an irrevocable legal execution.
    </p>
    <p style="margin-top:8px;">
      <strong>3. DISBURSEMENT PROTOCOL:</strong> Loan proceeds shall be disbursed instantly via <strong>${data.disbursementMethod}</strong> directly to Borrower's account upon completion of e-signature.
    </p>

    <div style="margin-top:14px; padding-top:10px; border-top:1px dashed #cbd5e1; font-family:monospace; font-size:10px; color:#64748b;">
      AUDIT TRAIL: ${data.sha256VerificationHash} | SEC-E2EE: 256-BIT-AES | ANTIGRAVITY AGENT CONSENSUS: OK
    </div>
  `;
}

// --------------------------------------------------------------------------
// Signature Pipeline Actions
// --------------------------------------------------------------------------
function bindSignatureActions() {
  const tabDraw = document.getElementById('sig-tab-draw');
  const tabType = document.getElementById('sig-tab-type');
  const btnClear = document.getElementById('sig-btn-clear');
  const btnFinalize = document.getElementById('btn-finalize-loan');
  const btnCloseModal = document.getElementById('modal-close-btn');
  const btnPrintAgreement = document.getElementById('modal-print-btn');

  if (tabDraw) tabDraw.addEventListener('click', () => window.signaturePipeline.setMode('draw'));
  if (tabType) tabType.addEventListener('click', () => window.signaturePipeline.setMode('type'));
  if (btnClear) btnClear.addEventListener('click', () => window.signaturePipeline.clearCanvas());

  if (btnFinalize) {
    btnFinalize.addEventListener('click', () => {
      window.signaturePipeline.finalizeAgreement();
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      const modal = document.getElementById('disbursement-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  if (btnPrintAgreement) {
    btnPrintAgreement.addEventListener('click', () => {
      window.print();
    });
  }
}

// --------------------------------------------------------------------------
// Zoom Toolbar Action Buttons
// --------------------------------------------------------------------------
function bindToolbarActions() {
  // Audio & Video Toggles
  const btnAudio = document.getElementById('toolbar-btn-audio');
  const btnVideo = document.getElementById('toolbar-btn-video');
  if (btnAudio) btnAudio.addEventListener('click', () => window.meetingController.toggleAudio());
  if (btnVideo) btnVideo.addEventListener('click', () => window.meetingController.toggleVideo());

  // Layout View Switchers
  const btnGallery = document.getElementById('view-btn-gallery');
  const btnSpeaker = document.getElementById('view-btn-speaker');
  const btnDoc = document.getElementById('view-btn-document');
  if (btnGallery) btnGallery.addEventListener('click', () => window.meetingController.setViewMode('gallery'));
  if (btnSpeaker) btnSpeaker.addEventListener('click', () => window.meetingController.setViewMode('speaker'));
  if (btnDoc) btnDoc.addEventListener('click', () => window.meetingController.setViewMode('document'));

  // Screen Share / Document Review Shortcut
  const btnShare = document.getElementById('toolbar-btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      window.meetingController.setViewMode('document');
      const tabDoc = document.getElementById('tab-doc-scanner');
      if (tabDoc) tabDoc.click();
    });
  }

  // Drawers Toggles
  const btnOrchestratorPill = document.getElementById('header-antigravity-pill');
  const btnOrchestrator = document.getElementById('toolbar-btn-orchestrator');
  const btnChat = document.getElementById('toolbar-btn-chat');
  const btnParticipants = document.getElementById('toolbar-btn-participants');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');

  if (btnOrchestratorPill) btnOrchestratorPill.addEventListener('click', () => window.meetingController.toggleDrawer('orchestrator'));
  if (btnOrchestrator) btnOrchestrator.addEventListener('click', () => window.meetingController.toggleDrawer('orchestrator'));
  if (btnChat) btnChat.addEventListener('click', () => window.meetingController.toggleDrawer('chat'));
  if (btnParticipants) btnParticipants.addEventListener('click', () => window.meetingController.toggleDrawer('participants'));
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => window.meetingController.toggleDrawer(null));

  // Leave Meeting Button
  const btnLeave = document.getElementById('toolbar-btn-leave');
  if (btnLeave) {
    btnLeave.addEventListener('click', () => {
      if (confirm('Leave ZoomBank Verification Room? Any active verification session will be saved to your compliance log.')) {
        window.location.reload();
      }
    });
  }
}

// --------------------------------------------------------------------------
// In-Meeting Chat Form
// --------------------------------------------------------------------------
function bindChatEvents() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-text-input');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        window.meetingController.sendChatMessage(text);
        input.value = '';
      }
    });
  }
}
