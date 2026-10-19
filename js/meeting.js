/**
 * ZoomBank: Virtual Meeting & Video Banking Room Controller
 * Inspired by Zoom Meeting UI and Enterprise Video Banking.
 * Handles WebRTC camera streams, AI officer voice synthesis, live subtitles,
 * audio meters, meeting timers, view layout modes, and in-call chat.
 */

class MeetingController {
  constructor() {
    this.audioMuted = false;
    this.videoMuted = false;
    this.mediaStream = null;
    this.meetingStartTime = Date.now();
    this.timerInterval = null;
    this.isAiSpeaking = false;
    this.speechSynthesisAvailable = 'speechSynthesis' in window;
    this.selectedVoice = null;
    this.currentViewMode = 'gallery'; // 'gallery' | 'speaker' | 'document'
    this.activeDrawer = 'orchestrator'; // 'orchestrator' | 'chat' | 'participants' | null

    this.initVoice();
  }

  initVoice() {
    if (!this.speechSynthesisAvailable) return;
    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for natural sounding female English voices (e.g., Google UK English Female, Microsoft Zira, Samantha, etc.)
      this.selectedVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny')) && 
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
    }
  }

  init() {
    this.startMeetingTimer();
    this.initCamera();
    this.simulateAudioLevels();
  }

  // --------------------------------------------------------------------------
  // Camera & Audio Streaming
  // --------------------------------------------------------------------------
  async initCamera() {
    const videoEl = document.getElementById('borrower-video-feed');
    const fallbackCanvas = document.getElementById('borrower-fallback-canvas');
    if (!videoEl) return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
        videoEl.srcObject = this.mediaStream;
        videoEl.play();
        if (fallbackCanvas) fallbackCanvas.style.display = 'none';
        videoEl.style.display = 'block';
      } else {
        this.startSyntheticBorrowerFeed();
      }
    } catch (err) {
      console.warn('Webcam permission not granted or device unavailable. Running high-fidelity synthetic borrower video feed:', err);
      this.startSyntheticBorrowerFeed();
    }
  }

  startSyntheticBorrowerFeed() {
    const videoEl = document.getElementById('borrower-video-feed');
    const fallbackCanvas = document.getElementById('borrower-fallback-canvas');
    if (videoEl) videoEl.style.display = 'none';
    if (!fallbackCanvas) return;

    fallbackCanvas.style.display = 'block';
    const ctx = fallbackCanvas.getContext('2d');
    let frame = 0;

    const renderSynthetic = () => {
      frame++;
      const w = fallbackCanvas.width = fallbackCanvas.parentElement?.clientWidth || 400;
      const h = fallbackCanvas.height = fallbackCanvas.parentElement?.clientHeight || 300;

      // Realistic office gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle breathing motion
      const breathing = Math.sin(frame * 0.04) * 3;

      // Borrower Silhouette Avatar
      const cx = w / 2;
      const cy = h / 2 + breathing;

      // Shoulders
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 90, 95, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 42, 54, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glasses outline
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 32, cy - 10, 26, 16);
      ctx.strokeRect(cx + 6, cy - 10, 26, 16);
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 2);
      ctx.lineTo(cx + 6, cy - 2);
      ctx.stroke();

      // Synthetic simulation badge
      ctx.fillStyle = 'rgba(11, 92, 255, 0.2)';
      ctx.fillRect(10, 10, 150, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('● SYNTHETIC VIDEO FEED', 18, 26);

      requestAnimationFrame(renderSynthetic);
    };
    renderSynthetic();
  }

  toggleAudio() {
    this.audioMuted = !this.audioMuted;
    const btn = document.getElementById('toolbar-btn-audio');
    const label = document.getElementById('toolbar-label-audio');
    const icon = document.getElementById('toolbar-icon-audio');

    if (this.audioMuted) {
      if (btn) btn.classList.add('tool-danger');
      if (label) label.textContent = 'Unmute';
      if (icon) icon.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
        </svg>
      `;
    } else {
      if (btn) btn.classList.remove('tool-danger');
      if (label) label.textContent = 'Mute';
      if (icon) icon.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
      `;
    }
  }

  toggleVideo() {
    this.videoMuted = !this.videoMuted;
    const btn = document.getElementById('toolbar-btn-video');
    const label = document.getElementById('toolbar-label-video');
    const videoFeed = document.getElementById('borrower-video-feed');
    const fallback = document.getElementById('borrower-fallback-canvas');

    if (this.videoMuted) {
      if (btn) btn.classList.add('tool-danger');
      if (label) label.textContent = 'Start Video';
      if (videoFeed) videoFeed.style.opacity = '0';
      if (fallback) fallback.style.opacity = '0';
    } else {
      if (btn) btn.classList.remove('tool-danger');
      if (label) label.textContent = 'Stop Video';
      if (videoFeed) videoFeed.style.opacity = '1';
      if (fallback) fallback.style.opacity = '1';
    }
  }

  // --------------------------------------------------------------------------
  // AI Loan Officer Speech Synthesis & Live Subtitles
  // --------------------------------------------------------------------------
  speak(text) {
    if (!text) return;
    this.showCaptions(text);

    const agentTile = document.getElementById('agent-video-tile');
    if (agentTile) agentTile.classList.add('ai-speaking');

    if (this.speechSynthesisAvailable) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (agentTile) agentTile.classList.remove('ai-speaking');
        setTimeout(() => this.hideCaptions(), 3000);
      };

      utterance.onerror = () => {
        if (agentTile) agentTile.classList.remove('ai-speaking');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (agentTile) agentTile.classList.remove('ai-speaking');
        setTimeout(() => this.hideCaptions(), 4000);
      }, text.length * 60);
    }
  }

  showCaptions(text) {
    const captionBar = document.getElementById('live-caption-bar');
    const captionText = document.getElementById('caption-text-content');
    if (captionBar && captionText) {
      captionText.textContent = text;
      captionBar.classList.remove('hidden');
    }
  }

  hideCaptions() {
    const captionBar = document.getElementById('live-caption-bar');
    if (captionBar) captionBar.classList.add('hidden');
  }

  // --------------------------------------------------------------------------
  // Meeting Timer & Audio Levels
  // --------------------------------------------------------------------------
  startMeetingTimer() {
    const timerEl = document.getElementById('meeting-timer-display');
    this.timerInterval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - this.meetingStartTime) / 1000);
      const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
      const secs = String(elapsedSec % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  simulateAudioLevels() {
    const bars = document.querySelectorAll('.audio-bar');
    setInterval(() => {
      bars.forEach(bar => {
        const h = Math.floor(Math.random() * 12 + 3);
        bar.style.height = `${h}px`;
      });
    }, 150);
  }

  // --------------------------------------------------------------------------
  // Layout Modes
  // --------------------------------------------------------------------------
  setViewMode(mode) {
    this.currentViewMode = mode;
    const grid = document.getElementById('video-stage-grid');
    const presContainer = document.getElementById('presentation-container');
    const btnGallery = document.getElementById('view-btn-gallery');
    const btnSpeaker = document.getElementById('view-btn-speaker');
    const btnDocument = document.getElementById('view-btn-document');

    if (!grid) return;

    grid.className = 'video-grid';
    [btnGallery, btnSpeaker, btnDocument].forEach(b => b?.classList.remove('active'));

    if (mode === 'gallery') {
      grid.classList.add('gallery-mode');
      if (btnGallery) btnGallery.classList.add('active');
      if (presContainer) presContainer.classList.remove('active');
    } else if (mode === 'speaker') {
      grid.classList.add('speaker-mode');
      if (btnSpeaker) btnSpeaker.classList.add('active');
      if (presContainer) presContainer.classList.remove('active');
    } else if (mode === 'document') {
      grid.classList.add('document-mode');
      if (btnDocument) btnDocument.classList.add('active');
      if (presContainer) presContainer.classList.add('active');
    }
  }

  // --------------------------------------------------------------------------
  // Side Drawers (Orchestrator, Chat, Participants)
  // --------------------------------------------------------------------------
  toggleDrawer(drawerName) {
    const drawer = document.getElementById('main-side-drawer');
    const orchestratorContent = document.getElementById('drawer-orchestrator-content');
    const chatContent = document.getElementById('drawer-chat-content');
    const participantsContent = document.getElementById('drawer-participants-content');
    const titleEl = document.getElementById('drawer-header-title');

    if (this.activeDrawer === drawerName && !drawer.classList.contains('collapsed')) {
      // Collapse
      drawer.classList.add('collapsed');
      this.activeDrawer = null;
      return;
    }

    drawer.classList.remove('collapsed');
    this.activeDrawer = drawerName;

    // Switch view inside drawer
    if (orchestratorContent) orchestratorContent.style.display = drawerName === 'orchestrator' ? 'flex' : 'none';
    if (chatContent) chatContent.style.display = drawerName === 'chat' ? 'flex' : 'none';
    if (participantsContent) participantsContent.style.display = drawerName === 'participants' ? 'flex' : 'none';

    if (titleEl) {
      if (drawerName === 'orchestrator') titleEl.textContent = 'Antigravity Orchestration Hub';
      else if (drawerName === 'chat') titleEl.textContent = 'In-Meeting Banking Chat';
      else if (drawerName === 'participants') titleEl.textContent = 'Room Participants (2)';
    }
  }

  // --------------------------------------------------------------------------
  // In-Meeting Chat
  // --------------------------------------------------------------------------
  sendChatMessage(message) {
    if (!message || !message.trim()) return;
    const list = document.getElementById('chat-messages-list');
    if (!list) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user-msg';
    userMsg.innerHTML = `
      <div class="chat-sender-label">You (Borrower)</div>
      <div>${this.escapeHtml(message)}</div>
    `;
    list.appendChild(userMsg);
    list.scrollTop = list.scrollHeight;

    // AI Officer response logic
    setTimeout(() => {
      this.generateAiChatResponse(message);
    }, 800);
  }

  generateAiChatResponse(userMsg) {
    const lower = userMsg.toLowerCase();
    let reply = "I am tracking your video verification in real time. Our Antigravity agents are continuously analyzing credentials for instant decisioning.";

    if (lower.includes('rate') || lower.includes('apr')) {
      reply = "Our Tier-1 Prime fixed rate is currently 6.85% APR for terms up to 60 months with zero origination fees.";
    } else if (lower.includes('penalty') || lower.includes('prepay')) {
      reply = "There are absolutely no prepayment penalties. You can pay down the principal at any time without fees.";
    } else if (lower.includes('disburse') || lower.includes('fund') || lower.includes('when')) {
      reply = "Funds are disbursed immediately upon digital e-signature via FedNow instant rails directly to your verified bank account.";
    } else if (lower.includes('document') || lower.includes('passport') || lower.includes('id')) {
      reply = "You can present your Passport, California Driver's License, or Corporate Paystub using our Document Presentation tab.";
    }

    const list = document.getElementById('chat-messages-list');
    if (!list) return;

    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-bubble ai-msg';
    aiMsg.innerHTML = `
      <div class="chat-sender-label" style="color:#60a5fa;">Sophia Vance (AI Officer)</div>
      <div>${reply}</div>
    `;
    list.appendChild(aiMsg);
    list.scrollTop = list.scrollHeight;
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Export singleton
window.meetingController = new MeetingController();
