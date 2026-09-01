/* ==========================================================================
   FORM WIZARD CONTROLLER (STEP-BY-STEP BUILDER & DYNAMIC FIELDS)
   ========================================================================== */

const FormWizard = {
  currentStep: 1,
  totalSteps: 7,

  init() {
    this.bindEvents();
    this.updateStepUI();
  },

  bindEvents() {
    // Stepper navigation buttons
    document.querySelectorAll(".step-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const step = parseInt(btn.dataset.step, 10);
        if (step) this.goToStep(step);
      });
    });

    document.getElementById("btn-prev-step")?.addEventListener("click", () => {
      if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
    });

    document.getElementById("btn-next-step")?.addEventListener("click", () => {
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      } else {
        // Finished wizard -> switch to portfolio or celebrate
        if (window.App) {
          App.showToast("Resume & Portfolio setup complete! 🎉", "success");
          if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
        }
      }
    });

    // Add Dynamic Entry Buttons
    document.getElementById("btn-add-experience")?.addEventListener("click", () => this.addExperienceEntry());
    document.getElementById("btn-add-education")?.addEventListener("click", () => this.addEducationEntry());
    document.getElementById("btn-add-project")?.addEventListener("click", () => this.addProjectEntry());
    document.getElementById("btn-add-certification")?.addEventListener("click", () => this.addCertificationEntry());

    // Skills inputs enter key handlers
    ["tech-skills-input", "tools-skills-input", "soft-skills-input"].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            this.handleSkillTagAdd(id, input.value);
            input.value = "";
          }
        });
      }
    });

    // Form live input binding (delegation)
    document.getElementById("wizard-form-container")?.addEventListener("input", () => {
      if (window.App) {
        App.syncFromForm();
      }
    });
    document.getElementById("wizard-form-container")?.addEventListener("change", () => {
      if (window.App) {
        App.syncFromForm();
      }
    });
  },

  goToStep(step) {
    this.currentStep = step;
    this.updateStepUI();
  },

  updateStepUI() {
    // Update step panels visibility
    document.querySelectorAll(".wizard-step-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const currentPanel = document.getElementById(`step-panel-${this.currentStep}`);
    if (currentPanel) currentPanel.classList.add("active");

    // Update Stepper Tabs
    document.querySelectorAll(".step-tab-btn").forEach(btn => {
      const s = parseInt(btn.dataset.step, 10);
      btn.classList.remove("active");
      if (s === this.currentStep) {
        btn.classList.add("active");
      }
      if (s < this.currentStep) {
        btn.classList.add("completed");
      }
    });

    // Update Progress Bar
    const progressFill = document.querySelector(".step-progress-fill");
    if (progressFill) {
      const pct = ((this.currentStep) / this.totalSteps) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Update Buttons
    const prevBtn = document.getElementById("btn-prev-step");
    const nextBtn = document.getElementById("btn-next-step");
    if (prevBtn) prevBtn.disabled = this.currentStep === 1;
    if (nextBtn) {
      if (this.currentStep === this.totalSteps) {
        nextBtn.innerHTML = `Complete &amp; Finish <i data-lucide="check"></i>`;
      } else {
        nextBtn.innerHTML = `Next Step <i data-lucide="arrow-right"></i>`;
      }
      if (window.lucide) lucide.createIcons();
    }
  },

  /**
   * Populate Form with App state data
   */
  populateForm(data) {
    const p = data.personal || {};

    // Personal Info Fields
    this.setVal("input-full-name", p.fullName);
    this.setVal("input-job-title", p.jobTitle);
    this.setVal("input-email", p.email);
    this.setVal("input-phone", p.phone);
    this.setVal("input-location", p.location);
    this.setVal("input-website", p.website);
    this.setVal("input-linkedin", p.linkedin);
    this.setVal("input-github", p.github);
    this.setVal("input-avatar", p.avatar);
    this.setVal("input-summary", p.summary);

    // Dynamic Experience
    const expContainer = document.getElementById("experience-list-container");
    if (expContainer) {
      expContainer.innerHTML = "";
      (data.experience || []).forEach(e => this.addExperienceEntry(e));
    }

    // Dynamic Education
    const eduContainer = document.getElementById("education-list-container");
    if (eduContainer) {
      eduContainer.innerHTML = "";
      (data.education || []).forEach(ed => this.addEducationEntry(ed));
    }

    // Skills
    this.renderSkillTags("tech-skills-tags", data.skills?.technical || [], "technical");
    this.renderSkillTags("tools-skills-tags", data.skills?.tools || [], "tools");
    this.renderSkillTags("soft-skills-tags", data.skills?.soft || [], "soft");

    // Dynamic Projects
    const projContainer = document.getElementById("projects-list-container");
    if (projContainer) {
      projContainer.innerHTML = "";
      (data.projects || []).forEach(proj => this.addProjectEntry(proj));
    }

    // Dynamic Certifications
    const certContainer = document.getElementById("certifications-list-container");
    if (certContainer) {
      certContainer.innerHTML = "";
      (data.certifications || []).forEach(c => this.addCertificationEntry(c));
    }

    // Customization Settings
    const templateSelect = document.getElementById("select-resume-template");
    if (templateSelect && data.settings?.template) {
      templateSelect.value = data.settings.template;
    }
    const fontSelect = document.getElementById("select-resume-font");
    if (fontSelect && data.settings?.fontFamily) {
      fontSelect.value = data.settings.fontFamily;
    }

    // Highlight active color swatch
    document.querySelectorAll(".color-swatch").forEach(swatch => {
      if (swatch.dataset.color === (data.settings?.accentColor || "#4f46e5")) {
        swatch.classList.add("active");
      } else {
        swatch.classList.remove("active");
      }
    });

    if (window.lucide) lucide.createIcons();
  },

  setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  },

  // -------------------------------------------------------------
  // DYNAMIC EXPERIENCE BUILDER
  // -------------------------------------------------------------
  addExperienceEntry(data = {}) {
    const container = document.getElementById("experience-list-container");
    if (!container) return;

    const id = data.id || `exp-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const bulletsText = (data.bullets || []).join("\n");

    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.dataset.id = id;

    card.innerHTML = `
      <div class="card-header-bar">
        <div class="card-header-title">
          <i data-lucide="briefcase" style="width:16px;height:16px;color:var(--accent-primary);"></i>
          <span class="entry-title-display">${data.role || "New Experience"}</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm btn-icon-only" onclick="FormWizard.removeCard(this)" title="Remove Entry">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Job Title / Role</label>
          <input type="text" class="form-control exp-role" value="${data.role || ''}" placeholder="e.g. Lead Full Stack Engineer" />
        </div>
        <div class="form-group">
          <label class="form-label">Company / Organization</label>
          <input type="text" class="form-control exp-company" value="${data.company || ''}" placeholder="e.g. Google / TechCorp" />
        </div>
      </div>

      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="text" class="form-control exp-start" value="${data.startDate || ''}" placeholder="e.g. 2022-03" />
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="text" class="form-control exp-end" value="${data.endDate || ''}" placeholder="e.g. Present" />
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control exp-loc" value="${data.location || ''}" placeholder="e.g. San Francisco, CA" />
        </div>
      </div>

      <div class="form-group" style="margin-bottom:0;">
        <div class="form-label">
          <span>Responsibilities &amp; Achievements (1 per line)</span>
          <button type="button" class="btn btn-ai btn-sm" onclick="App.openAIBulletEnhancer(this)">
            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI Polish Bullet
          </button>
        </div>
        <textarea class="form-control exp-bullets" placeholder="• Spearheaded design of microservices resulting in 35% speedup&#10;• Led team of 6 engineers across sprints">${bulletsText}</textarea>
      </div>
    `;

    container.appendChild(card);
    if (window.lucide) lucide.createIcons();
    if (window.App) App.syncFromForm();
  },

  // -------------------------------------------------------------
  // DYNAMIC EDUCATION BUILDER
  // -------------------------------------------------------------
  addEducationEntry(data = {}) {
    const container = document.getElementById("education-list-container");
    if (!container) return;

    const id = data.id || `edu-${Date.now()}`;
    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.dataset.id = id;

    card.innerHTML = `
      <div class="card-header-bar">
        <div class="card-header-title">
          <i data-lucide="graduation-cap" style="width:16px;height:16px;color:var(--accent-primary);"></i>
          <span class="entry-title-display">${data.degree || "New Degree"}</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm btn-icon-only" onclick="FormWizard.removeCard(this)" title="Remove Entry">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree / Field of Study</label>
          <input type="text" class="form-control edu-degree" value="${data.degree || ''}" placeholder="e.g. B.S. in Computer Science" />
        </div>
        <div class="form-group">
          <label class="form-label">School / University</label>
          <input type="text" class="form-control edu-school" value="${data.school || ''}" placeholder="e.g. UC Berkeley" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Graduation Year</label>
          <input type="text" class="form-control edu-year" value="${data.gradYear || ''}" placeholder="e.g. 2021" />
        </div>
        <div class="form-group">
          <label class="form-label">Location / GPA (Optional)</label>
          <input type="text" class="form-control edu-details" value="${data.details || ''}" placeholder="e.g. GPA 3.8 / Honors" />
        </div>
      </div>
    `;

    container.appendChild(card);
    if (window.lucide) lucide.createIcons();
    if (window.App) App.syncFromForm();
  },

  // -------------------------------------------------------------
  // DYNAMIC PROJECTS BUILDER
  // -------------------------------------------------------------
  addProjectEntry(data = {}) {
    const container = document.getElementById("projects-list-container");
    if (!container) return;

    const id = data.id || `proj-${Date.now()}`;
    const techStr = Array.isArray(data.techStack) ? data.techStack.join(", ") : (data.techStack || "");

    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.dataset.id = id;

    card.innerHTML = `
      <div class="card-header-bar">
        <div class="card-header-title">
          <i data-lucide="layers" style="width:16px;height:16px;color:var(--accent-primary);"></i>
          <span class="entry-title-display">${data.title || "New Project"}</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm btn-icon-only" onclick="FormWizard.removeCard(this)" title="Remove Entry">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Title</label>
          <input type="text" class="form-control proj-title" value="${data.title || ''}" placeholder="e.g. OmniAI Code Workspace" />
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack (comma separated)</label>
          <input type="text" class="form-control proj-tech" value="${techStr}" placeholder="e.g. React, Node.js, Docker" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Live Demo URL</label>
          <input type="text" class="form-control proj-live" value="${data.liveLink || ''}" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label class="form-label">GitHub / Repo URL</label>
          <input type="text" class="form-control proj-github" value="${data.githubLink || ''}" placeholder="https://github.com/..." />
        </div>
      </div>

      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Project Description</label>
        <textarea class="form-control proj-desc" placeholder="Brief overview of features, architecture, and impact...">${data.description || ''}</textarea>
      </div>
    `;

    container.appendChild(card);
    if (window.lucide) lucide.createIcons();
    if (window.App) App.syncFromForm();
  },

  // -------------------------------------------------------------
  // DYNAMIC CERTIFICATIONS BUILDER
  // -------------------------------------------------------------
  addCertificationEntry(data = {}) {
    const container = document.getElementById("certifications-list-container");
    if (!container) return;

    const id = data.id || `cert-${Date.now()}`;
    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.dataset.id = id;

    card.innerHTML = `
      <div class="card-header-bar">
        <div class="card-header-title">
          <i data-lucide="award" style="width:16px;height:16px;color:var(--accent-primary);"></i>
          <span class="entry-title-display">${data.name || "New Certification"}</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm btn-icon-only" onclick="FormWizard.removeCard(this)">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Certification Name</label>
          <input type="text" class="form-control cert-name" value="${data.name || ''}" placeholder="e.g. AWS Solutions Architect" />
        </div>
        <div class="form-group">
          <label class="form-label">Issuer &amp; Year</label>
          <input type="text" class="form-control cert-issuer" value="${data.issuer || ''}" placeholder="e.g. Amazon Web Services (2023)" />
        </div>
      </div>
    `;

    container.appendChild(card);
    if (window.lucide) lucide.createIcons();
    if (window.App) App.syncFromForm();
  },

  removeCard(btn) {
    const card = btn.closest(".dynamic-item-card");
    if (card) {
      card.remove();
      if (window.App) App.syncFromForm();
    }
  },

  // -------------------------------------------------------------
  // SKILL TAGS HANDLERS
  // -------------------------------------------------------------
  handleSkillTagAdd(inputId, value) {
    if (!value || !value.trim()) return;
    const cleanSkill = value.trim().replace(/,+$/, "");

    let category = "technical";
    let containerId = "tech-skills-tags";

    if (inputId === "tools-skills-input") {
      category = "tools";
      containerId = "tools-skills-tags";
    } else if (inputId === "soft-skills-input") {
      category = "soft";
      containerId = "soft-skills-tags";
    }

    if (!window.App.state.skills[category]) {
      window.App.state.skills[category] = [];
    }

    if (!window.App.state.skills[category].includes(cleanSkill)) {
      window.App.state.skills[category].push(cleanSkill);
      this.renderSkillTags(containerId, window.App.state.skills[category], category);
      App.updatePreviews();
      App.saveState();
    }
  },

  renderSkillTags(containerId, skillList, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = (skillList || []).map(s => `
      <span class="badge" style="background:var(--bg-tertiary);border:1px solid var(--border-color);padding:6px 10px;font-size:0.82rem;display:inline-flex;align-items:center;gap:6px;margin:4px;">
        <span>${s}</span>
        <i data-lucide="x" style="width:12px;height:12px;cursor:pointer;" onclick="FormWizard.removeSkillTag('${category}', '${s.replace(/'/g, "\\'")}')"></i>
      </span>
    `).join("");

    if (window.lucide) lucide.createIcons();
  },

  removeSkillTag(category, skillName) {
    if (window.App?.state?.skills?.[category]) {
      window.App.state.skills[category] = window.App.state.skills[category].filter(s => s !== skillName);
      const containerId = category === "technical" ? "tech-skills-tags" : (category === "tools" ? "tools-skills-tags" : "soft-skills-tags");
      this.renderSkillTags(containerId, window.App.state.skills[category], category);
      App.updatePreviews();
      App.saveState();
    }
  }
};
