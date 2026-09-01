/* ==========================================================================
   APP MAIN CONTROLLER & STATE ORCHESTRATOR
   ========================================================================== */

const App = {
  // Global Application State
  state: {
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      avatar: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      tools: [],
      soft: []
    },
    projects: [],
    certifications: [],
    settings: {
      template: "template-modern-tech",
      accentColor: "#4f46e5",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }
  },

  viewMode: "resume", // "resume" | "portfolio"

  init() {
    this.loadState();
    this.bindGlobalEvents();
    FormWizard.init();
    FormWizard.populateForm(this.state);
    this.updatePreviews();
    this.updateATSScoreWidget();

    if (window.lucide) lucide.createIcons();
  },

  // -------------------------------------------------------------
  // STATE PERSISTENCE (LOCAL STORAGE)
  // -------------------------------------------------------------
  loadState() {
    const saved = localStorage.getItem("ai_resume_builder_state_v2");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        this.state = JSON.parse(JSON.stringify(sampleProfiles.softwareEngineer));
      }
    } else {
      // Default to Software Engineer sample
      this.state = JSON.parse(JSON.stringify(sampleProfiles.softwareEngineer));
    }
  },

  saveState() {
    localStorage.setItem("ai_resume_builder_state_v2", JSON.stringify(this.state));
  },

  // -------------------------------------------------------------
  // EVENT BINDINGS
  // -------------------------------------------------------------
  bindGlobalEvents() {
    // Navigation / View Switchers
    document.getElementById("btn-start-building")?.addEventListener("click", () => this.showWorkspace());
    document.getElementById("btn-load-demo-hero")?.addEventListener("click", () => {
      this.loadPreset("softwareEngineer");
      this.showWorkspace();
    });
    document.getElementById("nav-btn-workspace")?.addEventListener("click", () => this.showWorkspace());
    document.getElementById("nav-btn-landing")?.addEventListener("click", () => this.showLanding());

    // Mode switchers (Resume vs Portfolio)
    document.getElementById("tab-mode-resume")?.addEventListener("click", () => this.switchMode("resume"));
    document.getElementById("tab-mode-portfolio")?.addEventListener("click", () => this.switchMode("portfolio"));

    // Template Cards on Landing Page
    document.querySelectorAll(".template-card-preview").forEach(card => {
      card.addEventListener("click", () => {
        const t = card.dataset.template;
        if (t) {
          this.state.settings.template = t;
          this.showWorkspace();
          this.updatePreviews();
        }
      });
    });

    // Theme Toggle (Dark / Light)
    document.getElementById("btn-theme-toggle")?.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      localStorage.setItem("theme_mode", isLight ? "light" : "dark");
      this.showToast(isLight ? "Light mode enabled" : "Dark mode enabled", "info");
    });

    if (localStorage.getItem("theme_mode") === "light") {
      document.body.classList.add("light-theme");
    }

    // Resume Customization Toolbar Handlers
    document.getElementById("select-resume-template")?.addEventListener("change", (e) => {
      this.state.settings.template = e.target.value;
      this.updatePreviews();
      this.saveState();
    });

    document.getElementById("select-resume-font")?.addEventListener("change", (e) => {
      this.state.settings.fontFamily = e.target.value;
      this.updatePreviews();
      this.saveState();
    });

    // Accent Color Swatches
    document.querySelectorAll(".color-swatch").forEach(swatch => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
        swatch.classList.add("active");
        this.state.settings.accentColor = swatch.dataset.color;
        this.updatePreviews();
        this.saveState();
      });
    });

    // Preset Loaders
    document.getElementById("btn-preset-swe")?.addEventListener("click", () => this.loadPreset("softwareEngineer"));
    document.getElementById("btn-preset-designer")?.addEventListener("click", () => this.loadPreset("productDesigner"));

    // Export Buttons
    document.getElementById("btn-download-pdf")?.addEventListener("click", () => ExportManager.downloadPDF());
    document.getElementById("btn-export-portfolio")?.addEventListener("click", () => ExportManager.exportPortfolioHTML());
    document.getElementById("btn-export-json")?.addEventListener("click", () => ExportManager.exportJSON());
    
    // Import JSON File
    const jsonInput = document.getElementById("input-import-json");
    document.getElementById("btn-import-json")?.addEventListener("click", () => jsonInput?.click());
    jsonInput?.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        ExportManager.importJSON(e.target.files[0]);
      }
    });

    // AI Trigger Buttons
    document.getElementById("btn-ai-summary")?.addEventListener("click", () => this.openAISummaryModal());
    document.getElementById("btn-ai-audit")?.addEventListener("click", () => this.openAIAuditModal());
    document.getElementById("btn-ai-skills-suggest")?.addEventListener("click", () => this.suggestAISkills());

    // Modal Close buttons
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
      });
    });
  },

  // -------------------------------------------------------------
  // NAVIGATION CONTROLS
  // -------------------------------------------------------------
  showWorkspace() {
    document.getElementById("landing-section").style.display = "none";
    document.getElementById("workspace-section").classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.updatePreviews();
  },

  showLanding() {
    document.getElementById("workspace-section").classList.remove("active");
    document.getElementById("landing-section").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  switchMode(mode) {
    this.viewMode = mode;
    const resumeTab = document.getElementById("tab-mode-resume");
    const pfTab = document.getElementById("tab-mode-portfolio");
    const resumeCanvas = document.getElementById("resume-canvas-view");
    const pfCanvas = document.getElementById("portfolio-preview-container");
    const resumeControls = document.getElementById("resume-specific-controls");

    if (mode === "portfolio") {
      resumeTab?.classList.remove("active");
      pfTab?.classList.add("active");
      if (resumeCanvas) resumeCanvas.style.display = "none";
      if (pfCanvas) pfCanvas.classList.add("active");
      if (resumeControls) resumeControls.style.display = "none";
      PortfolioRenderer.render(this.state, pfCanvas);
    } else {
      pfTab?.classList.remove("active");
      resumeTab?.classList.add("active");
      if (pfCanvas) pfCanvas.classList.remove("active");
      if (resumeCanvas) resumeCanvas.style.display = "flex";
      if (resumeControls) resumeControls.style.display = "flex";
      ResumeRenderer.render(this.state, document.getElementById("resume-preview-container"));
    }
  },

  // -------------------------------------------------------------
  // SYNC & RENDER PIPELINE
  // -------------------------------------------------------------
  syncFromForm() {
    // Read personal info
    this.state.personal = {
      fullName: document.getElementById("input-full-name")?.value || "",
      jobTitle: document.getElementById("input-job-title")?.value || "",
      email: document.getElementById("input-email")?.value || "",
      phone: document.getElementById("input-phone")?.value || "",
      location: document.getElementById("input-location")?.value || "",
      website: document.getElementById("input-website")?.value || "",
      linkedin: document.getElementById("input-linkedin")?.value || "",
      github: document.getElementById("input-github")?.value || "",
      avatar: document.getElementById("input-avatar")?.value || "",
      summary: document.getElementById("input-summary")?.value || ""
    };

    // Read Experience cards
    const expList = [];
    document.querySelectorAll("#experience-list-container .dynamic-item-card").forEach(card => {
      const role = card.querySelector(".exp-role")?.value || "";
      const company = card.querySelector(".exp-company")?.value || "";
      const startDate = card.querySelector(".exp-start")?.value || "";
      const endDate = card.querySelector(".exp-end")?.value || "";
      const location = card.querySelector(".exp-loc")?.value || "";
      const bulletsRaw = card.querySelector(".exp-bullets")?.value || "";
      const bullets = bulletsRaw.split("\n").map(b => b.trim()).filter(Boolean);

      const titleDisplay = card.querySelector(".entry-title-display");
      if (titleDisplay) titleDisplay.textContent = role ? `${role} @ ${company || '...'}` : "New Experience";

      expList.push({
        id: card.dataset.id,
        role,
        company,
        startDate,
        endDate,
        current: /present/i.test(endDate),
        location,
        bullets
      });
    });
    this.state.experience = expList;

    // Read Education cards
    const eduList = [];
    document.querySelectorAll("#education-list-container .dynamic-item-card").forEach(card => {
      const degree = card.querySelector(".edu-degree")?.value || "";
      const school = card.querySelector(".edu-school")?.value || "";
      const gradYear = card.querySelector(".edu-year")?.value || "";
      const details = card.querySelector(".edu-details")?.value || "";

      const titleDisplay = card.querySelector(".entry-title-display");
      if (titleDisplay) titleDisplay.textContent = degree || "New Education";

      eduList.push({
        id: card.dataset.id,
        degree,
        school,
        gradYear,
        details
      });
    });
    this.state.education = eduList;

    // Read Projects cards
    const projList = [];
    document.querySelectorAll("#projects-list-container .dynamic-item-card").forEach(card => {
      const title = card.querySelector(".proj-title")?.value || "";
      const techStr = card.querySelector(".proj-tech")?.value || "";
      const techStack = techStr.split(",").map(t => t.trim()).filter(Boolean);
      const liveLink = card.querySelector(".proj-live")?.value || "";
      const githubLink = card.querySelector(".proj-github")?.value || "";
      const description = card.querySelector(".proj-desc")?.value || "";

      const titleDisplay = card.querySelector(".entry-title-display");
      if (titleDisplay) titleDisplay.textContent = title || "New Project";

      projList.push({
        id: card.dataset.id,
        title,
        techStack,
        liveLink,
        githubLink,
        description
      });
    });
    this.state.projects = projList;

    // Read Certifications cards
    const certList = [];
    document.querySelectorAll("#certifications-list-container .dynamic-item-card").forEach(card => {
      const name = card.querySelector(".cert-name")?.value || "";
      const issuer = card.querySelector(".cert-issuer")?.value || "";

      const titleDisplay = card.querySelector(".entry-title-display");
      if (titleDisplay) titleDisplay.textContent = name || "New Certification";

      certList.push({
        id: card.dataset.id,
        name,
        issuer
      });
    });
    this.state.certifications = certList;

    this.updatePreviews();
    this.updateATSScoreWidget();
    this.saveState();
  },

  updatePreviews() {
    const resumeContainer = document.getElementById("resume-preview-container");
    const pfContainer = document.getElementById("portfolio-preview-container");

    if (this.viewMode === "resume" && resumeContainer) {
      ResumeRenderer.render(this.state, resumeContainer);
    } else if (this.viewMode === "portfolio" && pfContainer) {
      PortfolioRenderer.render(this.state, pfContainer);
    }
  },

  loadPreset(key) {
    if (sampleProfiles[key]) {
      this.state = JSON.parse(JSON.stringify(sampleProfiles[key]));
      this.saveState();
      FormWizard.populateForm(this.state);
      this.updatePreviews();
      this.updateATSScoreWidget();
      this.showToast(`Loaded ${key === 'softwareEngineer' ? 'Software Engineer' : 'Product Designer'} profile!`, "success");
    }
  },

  // -------------------------------------------------------------
  // AI ASSISTANT MODAL & FEATURE LOGIC
  // -------------------------------------------------------------
  openAISummaryModal() {
    const modal = document.getElementById("modal-ai-summary");
    if (!modal) return;

    const role = this.state.personal?.jobTitle || "Professional";
    const summaries = AIAssistant.generateSummaries(role, this.state.personal?.summary);

    const listContainer = document.getElementById("ai-summary-options-list");
    if (listContainer) {
      listContainer.innerHTML = summaries.map((s, idx) => `
        <div class="ai-suggestion-box" onclick="App.applyAISummary('${s.text.replace(/'/g, "\\'")}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <strong style="color:var(--text-primary);">${s.tone}</strong>
            <span class="badge badge-ai">${s.badge}</span>
          </div>
          <p style="font-size:0.92rem;color:var(--text-secondary);line-height:1.5;">${s.text}</p>
          <div style="margin-top:10px;text-align:right;">
            <span class="btn btn-primary btn-sm">Use This Summary <i data-lucide="check" style="width:12px;height:12px;"></i></span>
          </div>
        </div>
      `).join("");
    }

    modal.classList.add("active");
    if (window.lucide) lucide.createIcons();
  },

  applyAISummary(text) {
    const summaryInput = document.getElementById("input-summary");
    if (summaryInput) {
      summaryInput.value = text;
      this.syncFromForm();
      document.getElementById("modal-ai-summary")?.classList.remove("active");
      this.showToast("AI Summary applied to your profile! ✨", "ai");
    }
  },

  openAIBulletEnhancer(triggerBtn) {
    const card = triggerBtn.closest(".dynamic-item-card");
    const textarea = card.querySelector(".exp-bullets");
    if (!textarea) return;

    const lines = textarea.value.split("\n").filter(Boolean);
    const targetLine = lines[0] || "Developed core web application features";

    const enhancedOptions = AIAssistant.enhanceBulletPoint(targetLine, this.state.personal?.jobTitle);

    const modal = document.getElementById("modal-ai-bullet");
    if (!modal) return;

    const listContainer = document.getElementById("ai-bullet-options-list");
    if (listContainer) {
      listContainer.innerHTML = enhancedOptions.map(opt => `
        <div class="ai-suggestion-box" onclick="App.applyEnhancedBullet(this, '${opt.replace(/'/g, "\\'")}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span class="badge badge-ai">Google X-Y-Z Formula</span>
            <span style="font-size:0.8rem;color:var(--accent-emerald);">High ATS Impact</span>
          </div>
          <p style="font-size:0.92rem;color:var(--text-secondary);line-height:1.5;">${opt}</p>
          <div style="margin-top:8px;text-align:right;">
            <button type="button" class="btn btn-primary btn-sm">Insert Bullet</button>
          </div>
        </div>
      `).join("");
    }

    this._activeTargetTextarea = textarea;
    modal.classList.add("active");
  },

  applyEnhancedBullet(elem, bulletText) {
    if (this._activeTargetTextarea) {
      const current = this._activeTargetTextarea.value.trim();
      this._activeTargetTextarea.value = current ? `${current}\n• ${bulletText}` : `• ${bulletText}`;
      this.syncFromForm();
      document.getElementById("modal-ai-bullet")?.classList.remove("active");
      this.showToast("Polished bullet added! ✨", "ai");
    }
  },

  openAIAuditModal() {
    const modal = document.getElementById("modal-ai-audit");
    if (!modal) return;

    const audit = AIAssistant.calculateATSScore(this.state);

    const circle = modal.querySelector(".score-circle");
    if (circle) circle.style.setProperty("--score-pct", audit.score);

    const val = modal.querySelector(".score-value");
    if (val) val.textContent = `${audit.score}%`;

    const checklist = document.getElementById("ats-checklist-items");
    if (checklist) {
      checklist.innerHTML = audit.checks.map(c => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color);">
          <i data-lucide="${c.passed ? 'check-circle-2' : 'alert-circle'}" style="color:${c.passed ? '#10b981' : '#f59e0b'};width:18px;height:18px;"></i>
          <span style="font-size:0.92rem;color:${c.passed ? 'var(--text-primary)' : 'var(--text-secondary)'};">${c.label}</span>
        </div>
      `).join("");
    }

    modal.classList.add("active");
    if (window.lucide) lucide.createIcons();
  },

  updateATSScoreWidget() {
    const audit = AIAssistant.calculateATSScore(this.state);
    const scoreBadge = document.getElementById("ats-score-badge-val");
    if (scoreBadge) {
      scoreBadge.textContent = `${audit.score}%`;
    }
  },

  suggestAISkills() {
    const title = (this.state.personal?.jobTitle || "").toLowerCase();
    let recommended = ["Git", "System Design", "Agile", "Problem Solving", "CI/CD"];

    if (title.includes("design") || title.includes("ux") || title.includes("ui")) {
      recommended = ["Figma", "User Research", "Design Systems", "Prototyping", "WCAG 2.1", "Micro-interactions"];
    } else if (title.includes("data") || title.includes("ai") || title.includes("machine")) {
      recommended = ["Python", "PyTorch", "SQL", "Pandas", "LLM Fine-Tuning", "Data Pipelines", "Docker"];
    } else {
      recommended = ["TypeScript", "React", "Node.js", "Docker", "REST APIs", "PostgreSQL", "Cloud Computing"];
    }

    recommended.forEach(skill => {
      if (!this.state.skills.technical.includes(skill) && !this.state.skills.tools.includes(skill)) {
        this.state.skills.technical.push(skill);
      }
    });

    FormWizard.renderSkillTags("tech-skills-tags", this.state.skills.technical, "technical");
    this.updatePreviews();
    this.saveState();
    this.showToast("Injected hot in-demand skills for your role! ⚡", "ai");
  },

  // -------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // -------------------------------------------------------------
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "info";
    if (type === "success") icon = "check-circle";
    if (type === "ai") icon = "sparkles";

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width:18px;height:18px;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => App.init());
