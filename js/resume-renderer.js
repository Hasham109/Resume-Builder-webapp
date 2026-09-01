/* ==========================================================================
   RESUME DOM RENDERER (4 ATS TEMPLATES ENGINE)
   ========================================================================== */

const ResumeRenderer = {
  /**
   * Main render function that updates the #resume-preview-container DOM
   */
  render(data, container) {
    if (!container) return;

    const template = data.settings?.template || "template-modern-tech";
    const accentColor = data.settings?.accentColor || "#4f46e5";
    const fontFamily = data.settings?.fontFamily || "'Plus Jakarta Sans', sans-serif";

    // Set CSS custom variables on container
    container.style.setProperty("--resume-accent", accentColor);
    container.style.setProperty("--resume-font", fontFamily);
    container.className = `resume-paper-container ${template}`;

    // Render template-specific markup
    switch (template) {
      case "template-executive":
        container.innerHTML = this.renderExecutive(data);
        break;
      case "template-minimalist":
        container.innerHTML = this.renderMinimalist(data);
        break;
      case "template-developer":
        container.innerHTML = this.renderDeveloper(data);
        break;
      case "template-modern-tech":
      default:
        container.innerHTML = this.renderModernTech(data);
        break;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  /**
   * Helper: Escape HTML strings
   */
  escape(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  /**
   * Helper: Render Skill Badges
   */
  renderSkillBadges(skillsObj) {
    const all = [
      ...(skillsObj?.technical || []),
      ...(skillsObj?.tools || []),
      ...(skillsObj?.soft || [])
    ];
    return all.map(s => `<span class="skill-badge">${this.escape(s)}</span>`).join("");
  },

  /**
   * 1. Modern Tech Template (Two-Column Sidebar Layout)
   */
  renderModernTech(data) {
    const p = data.personal || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const projects = data.projects || [];
    const certs = data.certifications || [];
    const skills = data.skills || {};

    return `
      <aside class="modern-sidebar">
        ${p.avatar ? `
          <div class="profile-avatar-box">
            <img src="${this.escape(p.avatar)}" alt="${this.escape(p.fullName)}" />
          </div>
        ` : ''}

        <div class="sidebar-header">
          <h1>${this.escape(p.fullName || "Your Name")}</h1>
          <div class="job-title">${this.escape(p.jobTitle || "Professional Title")}</div>
        </div>

        <div class="contact-list">
          ${p.email ? `<div class="contact-item"><i data-lucide="mail" style="width:14px;height:14px;"></i><span>${this.escape(p.email)}</span></div>` : ''}
          ${p.phone ? `<div class="contact-item"><i data-lucide="phone" style="width:14px;height:14px;"></i><span>${this.escape(p.phone)}</span></div>` : ''}
          ${p.location ? `<div class="contact-item"><i data-lucide="map-pin" style="width:14px;height:14px;"></i><span>${this.escape(p.location)}</span></div>` : ''}
          ${p.website ? `<div class="contact-item"><i data-lucide="globe" style="width:14px;height:14px;"></i><span>${this.escape(p.website.replace(/^https?:\/\//, ''))}</span></div>` : ''}
          ${p.linkedin ? `<div class="contact-item"><i data-lucide="linkedin" style="width:14px;height:14px;"></i><span>${this.escape(p.linkedin)}</span></div>` : ''}
          ${p.github ? `<div class="contact-item"><i data-lucide="github" style="width:14px;height:14px;"></i><span>${this.escape(p.github)}</span></div>` : ''}
        </div>

        ${(skills.technical?.length || skills.tools?.length) ? `
          <div>
            <div class="resume-section-title"><i data-lucide="cpu" style="width:14px;height:14px;"></i> Skills</div>
            <div class="skill-badges-container">
              ${this.renderSkillBadges(skills)}
            </div>
          </div>
        ` : ''}

        ${edu.length ? `
          <div>
            <div class="resume-section-title"><i data-lucide="graduation-cap" style="width:14px;height:14px;"></i> Education</div>
            ${edu.map(e => `
              <div class="edu-item">
                <div class="edu-degree">${this.escape(e.degree)}</div>
                <div class="edu-school">${this.escape(e.school)}</div>
                <div class="edu-date">${this.escape(e.gradYear)} ${e.location ? `• ${this.escape(e.location)}` : ''}</div>
                ${e.details ? `<div style="font-size:7.8pt;color:#64748b;margin-top:2pt;">${this.escape(e.details)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${certs.length ? `
          <div>
            <div class="resume-section-title"><i data-lucide="award" style="width:14px;height:14px;"></i> Certifications</div>
            ${certs.map(c => `
              <div class="cert-item">
                <div class="edu-degree">${this.escape(c.name)}</div>
                <div class="edu-school">${this.escape(c.issuer)} ${c.year ? `(${this.escape(c.year)})` : ''}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </aside>

      <main class="modern-main">
        ${p.summary ? `
          <section class="main-section">
            <div class="resume-section-title"><i data-lucide="user" style="width:14px;height:14px;"></i> Profile Summary</div>
            <p class="summary-text">${this.escape(p.summary)}</p>
          </section>
        ` : ''}

        ${exp.length ? `
          <section class="main-section">
            <div class="resume-section-title"><i data-lucide="briefcase" style="width:14px;height:14px;"></i> Experience</div>
            ${exp.map(e => `
              <div class="experience-item">
                <div class="item-header">
                  <div>
                    <span class="item-title">${this.escape(e.role)}</span>
                    <span style="color:#94a3b8;margin:0 4pt;">•</span>
                    <span class="item-company">${this.escape(e.company)}</span>
                  </div>
                  <div class="item-meta">${this.escape(e.startDate)} – ${e.current ? 'Present' : this.escape(e.endDate || 'Present')}</div>
                </div>
                ${e.bullets && e.bullets.length ? `
                  <ul class="item-bullets">
                    ${e.bullets.map(b => `<li>${this.escape(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${projects.length ? `
          <section class="main-section">
            <div class="resume-section-title"><i data-lucide="layers" style="width:14px;height:14px;"></i> Featured Projects</div>
            ${projects.map(proj => `
              <div class="project-item">
                <div class="item-header">
                  <span class="item-title">${this.escape(proj.title)}</span>
                  ${proj.liveLink ? `<span class="item-meta" style="color:var(--resume-accent);">${this.escape(proj.liveLink.replace(/^https?:\/\//, ''))}</span>` : ''}
                </div>
                <div style="font-size:8.8pt;color:#475569;margin-top:2pt;">${this.escape(proj.description)}</div>
                ${proj.techStack && proj.techStack.length ? `
                  <div style="font-size:7.8pt;color:#64748b;margin-top:3pt;">
                    <strong>Tech:</strong> ${this.escape(Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack)}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}
      </main>
    `;
  },

  /**
   * 2. Executive Corporate Template (Classic Balance & ATS Preferred)
   */
  renderExecutive(data) {
    const p = data.personal || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const projects = data.projects || [];
    const skills = data.skills || {};
    const certs = data.certifications || [];

    return `
      <div class="template-executive">
        <header class="exec-header">
          <h1>${this.escape(p.fullName || "Your Name")}</h1>
          <div class="job-title">${this.escape(p.jobTitle || "Professional Title")}</div>
          <div class="exec-contacts">
            ${p.location ? `<span>${this.escape(p.location)}</span>` : ''}
            ${p.email ? `<span>${this.escape(p.email)}</span>` : ''}
            ${p.phone ? `<span>${this.escape(p.phone)}</span>` : ''}
            ${p.linkedin ? `<span>${this.escape(p.linkedin)}</span>` : ''}
            ${p.website ? `<span>${this.escape(p.website.replace(/^https?:\/\//, ''))}</span>` : ''}
          </div>
        </header>

        ${p.summary ? `
          <section>
            <div class="resume-section-title">Executive Summary</div>
            <p style="font-size:9.2pt;color:#334155;line-height:1.55;">${this.escape(p.summary)}</p>
          </section>
        ` : ''}

        ${(skills.technical?.length || skills.soft?.length) ? `
          <section>
            <div class="resume-section-title">Core Competencies & Expertise</div>
            <div class="exec-skills-grid">
              ${[...(skills.technical || []), ...(skills.tools || []), ...(skills.soft || [])].map(s => `
                <div>• ${this.escape(s)}</div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${exp.length ? `
          <section>
            <div class="resume-section-title">Professional Experience</div>
            ${exp.map(e => `
              <div class="experience-item" style="margin-bottom:12pt;">
                <div class="item-header">
                  <span class="item-title">${this.escape(e.role)}</span>
                  <span class="item-meta">${this.escape(e.startDate)} – ${e.current ? 'Present' : this.escape(e.endDate || 'Present')}</span>
                </div>
                <div class="item-company">${this.escape(e.company)}${e.location ? ` — ${this.escape(e.location)}` : ''}</div>
                ${e.bullets && e.bullets.length ? `
                  <ul class="item-bullets">
                    ${e.bullets.map(b => `<li>${this.escape(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${projects.length ? `
          <section>
            <div class="resume-section-title">Key Projects & Initiatives</div>
            ${projects.map(proj => `
              <div class="project-item" style="margin-bottom:8pt;">
                <div class="item-header">
                  <span class="item-title">${this.escape(proj.title)}</span>
                  ${proj.liveLink ? `<span class="item-meta">${this.escape(proj.liveLink)}</span>` : ''}
                </div>
                <div style="font-size:8.8pt;color:#334155;margin-top:2pt;">${this.escape(proj.description)}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${edu.length ? `
          <section>
            <div class="resume-section-title">Education & Credentials</div>
            ${edu.map(e => `
              <div style="margin-bottom:6pt;">
                <div class="item-header">
                  <span class="item-title">${this.escape(e.degree)}</span>
                  <span class="item-meta">${this.escape(e.gradYear)}</span>
                </div>
                <div style="font-size:9pt;color:#475569;">${this.escape(e.school)}${e.location ? `, ${this.escape(e.location)}` : ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  },

  /**
   * 3. Minimalist Slate Template (Ultra-Clean Single Column)
   */
  renderMinimalist(data) {
    const p = data.personal || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const projects = data.projects || [];
    const skills = data.skills || {};

    return `
      <div class="template-minimalist">
        <header class="min-header">
          <div class="min-header-left">
            <h1>${this.escape(p.fullName || "Your Name")}</h1>
            <div class="job-title">${this.escape(p.jobTitle || "Professional Title")}</div>
          </div>
          <div class="min-header-right">
            ${p.email ? `<div>${this.escape(p.email)}</div>` : ''}
            ${p.phone ? `<div>${this.escape(p.phone)}</div>` : ''}
            ${p.location ? `<div>${this.escape(p.location)}</div>` : ''}
            ${p.github ? `<div>${this.escape(p.github)}</div>` : ''}
          </div>
        </header>

        ${p.summary ? `
          <section>
            <div class="resume-section-title">ABOUT</div>
            <p style="font-size:9pt;color:#334155;line-height:1.5;">${this.escape(p.summary)}</p>
          </section>
        ` : ''}

        ${exp.length ? `
          <section>
            <div class="resume-section-title">EXPERIENCE</div>
            ${exp.map(e => `
              <div style="margin-bottom:10pt;">
                <div class="item-row">
                  <div>
                    <span class="item-title">${this.escape(e.role)}</span>
                    <span style="color:#cbd5e1;margin:0 4pt;">/</span>
                    <span class="item-company">${this.escape(e.company)}</span>
                  </div>
                  <span class="item-meta">${this.escape(e.startDate)} – ${e.current ? 'Present' : this.escape(e.endDate || 'Present')}</span>
                </div>
                ${e.bullets && e.bullets.length ? `
                  <ul class="item-bullets">
                    ${e.bullets.map(b => `<li>${this.escape(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${projects.length ? `
          <section>
            <div class="resume-section-title">PROJECTS</div>
            ${projects.map(proj => `
              <div style="margin-bottom:8pt;">
                <div class="item-row">
                  <span class="item-title">${this.escape(proj.title)}</span>
                  ${proj.liveLink ? `<span class="item-meta">${this.escape(proj.liveLink.replace(/^https?:\/\//, ''))}</span>` : ''}
                </div>
                <p style="font-size:8.8pt;color:#475569;margin-top:2pt;">${this.escape(proj.description)}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${(skills.technical?.length || skills.tools?.length) ? `
          <section>
            <div class="resume-section-title">SKILLS</div>
            <p style="font-size:9pt;color:#334155;line-height:1.6;">
              <strong>Technical:</strong> ${this.escape((skills.technical || []).join(", "))} <br>
              <strong>Tools & Platforms:</strong> ${this.escape((skills.tools || []).join(", "))}
            </p>
          </section>
        ` : ''}

        ${edu.length ? `
          <section>
            <div class="resume-section-title">EDUCATION</div>
            ${edu.map(e => `
              <div class="item-row" style="margin-bottom:4pt;">
                <div>
                  <span class="item-title">${this.escape(e.degree)}</span> — <span class="item-company">${this.escape(e.school)}</span>
                </div>
                <span class="item-meta">${this.escape(e.gradYear)}</span>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  },

  /**
   * 4. Developer Terminal Template (Modern Tech Accents & GitHub Tags)
   */
  renderDeveloper(data) {
    const p = data.personal || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const projects = data.projects || [];
    const skills = data.skills || {};

    return `
      <div class="template-developer">
        <header class="dev-header-banner">
          <div class="dev-header-left">
            <h1>${this.escape(p.fullName || "Your Name")}</h1>
            <div class="job-title">&gt; ${this.escape(p.jobTitle || "Full Stack Developer")}</div>
          </div>
          <div class="dev-contacts">
            ${p.email ? `<div>${this.escape(p.email)}</div>` : ''}
            ${p.github ? `<div>${this.escape(p.github)}</div>` : ''}
            ${p.website ? `<div>${this.escape(p.website.replace(/^https?:\/\//, ''))}</div>` : ''}
            ${p.location ? `<div>${this.escape(p.location)}</div>` : ''}
          </div>
        </header>

        ${p.summary ? `
          <section>
            <div class="resume-section-title">// SUMMARY</div>
            <p style="font-size:8.8pt;color:#334155;line-height:1.5;margin-top:4pt;">${this.escape(p.summary)}</p>
          </section>
        ` : ''}

        ${(skills.technical?.length || skills.tools?.length) ? `
          <section>
            <div class="resume-section-title">// TECH STACK & SKILLS</div>
            <div class="dev-skills-categorized" style="margin-top:4pt;">
              ${skills.technical?.length ? `
                <div class="skill-category-row">
                  <span class="category-label">Languages/Core:</span>
                  <span class="category-tags">${this.escape(skills.technical.join(" • "))}</span>
                </div>
              ` : ''}
              ${skills.tools?.length ? `
                <div class="skill-category-row">
                  <span class="category-label">DevOps/Cloud:</span>
                  <span class="category-tags">${this.escape(skills.tools.join(" • "))}</span>
                </div>
              ` : ''}
            </div>
          </section>
        ` : ''}

        ${exp.length ? `
          <section>
            <div class="resume-section-title">// WORK EXPERIENCE</div>
            ${exp.map(e => `
              <div style="margin-top:6pt;margin-bottom:10pt;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <strong style="font-size:9.8pt;color:#0f172a;">${this.escape(e.role)} @ <span style="color:var(--resume-accent);">${this.escape(e.company)}</span></strong>
                  <span style="font-size:8pt;color:#64748b;font-family:var(--font-mono);">${this.escape(e.startDate)} ~ ${e.current ? 'Present' : this.escape(e.endDate || 'Present')}</span>
                </div>
                ${e.bullets && e.bullets.length ? `
                  <ul class="item-bullets">
                    ${e.bullets.map(b => `<li>${this.escape(b)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${projects.length ? `
          <section>
            <div class="resume-section-title">// FEATURED REPOSITORIES & PROJECTS</div>
            <div style="margin-top:6pt;">
              ${projects.map(proj => `
                <div class="project-card-dev">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="font-size:9.2pt;color:#0f172a;">📦 ${this.escape(proj.title)}</strong>
                    <div class="project-links">
                      ${proj.githubLink ? `<span>[git] ${this.escape(proj.githubLink.replace(/^https?:\/\//, ''))}</span>` : ''}
                      ${proj.liveLink ? `<span>[live] ${this.escape(proj.liveLink.replace(/^https?:\/\//, ''))}</span>` : ''}
                    </div>
                  </div>
                  <div style="font-size:8.5pt;color:#475569;margin-top:2pt;">${this.escape(proj.description)}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${edu.length ? `
          <section>
            <div class="resume-section-title">// EDUCATION</div>
            ${edu.map(e => `
              <div style="display:flex;justify-content:space-between;margin-top:4pt;font-size:8.8pt;">
                <span><strong>${this.escape(e.degree)}</strong> — ${this.escape(e.school)}</span>
                <span style="color:#64748b;font-family:var(--font-mono);">${this.escape(e.gradYear)}</span>
              </div>
            `).join('')}
          </section>
        ` : ''}
      </div>
    `;
  }
};
