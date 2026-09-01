/* ==========================================================================
   PORTFOLIO WEBSITE DOM RENDERER (INTERACTIVE PERSONAL SITE)
   ========================================================================== */

const PortfolioRenderer = {
  /**
   * Main render function that updates the #portfolio-preview-container DOM
   */
  render(data, container) {
    if (!container) return;

    const p = data.personal || {};
    const exp = data.experience || [];
    const edu = data.education || [];
    const skills = data.skills || {};
    const projects = data.projects || [];
    const certs = data.certifications || [];

    const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

    container.innerHTML = `
      <div class="portfolio-site">
        <!-- Portfolio Sticky Navbar -->
        <nav class="pf-navbar">
          <div class="pf-nav-inner">
            <a href="#pf-hero" class="pf-logo">
              <span class="pf-logo-dot"></span>
              <span>${this.escape(p.fullName || "Developer Portfolio")}</span>
            </a>
            <ul class="pf-nav-links">
              <li><a href="#pf-about">About</a></li>
              ${(skills.technical?.length || skills.tools?.length) ? `<li><a href="#pf-skills">Skills</a></li>` : ''}
              ${projects.length ? `<li><a href="#pf-projects">Projects</a></li>` : ''}
              ${exp.length ? `<li><a href="#pf-experience">Experience</a></li>` : ''}
              <li><a href="#pf-contact">Contact</a></li>
            </ul>
            <div>
              <a href="#pf-contact" class="btn btn-primary btn-sm">Let's Connect</a>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <section id="pf-hero" class="pf-hero">
          <div class="pf-hero-content">
            <div class="pf-hero-badge">
              <span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;"></span>
              Available for New Opportunities
            </div>
            <h1 class="pf-hero-title">
              Hi, I'm <span class="text-gradient">${this.escape(p.fullName || "Your Name")}</span>
            </h1>
            <div class="pf-hero-subtitle">
              ${this.escape(p.jobTitle || "Full Stack Engineer & Problem Solver")}
            </div>
            <p class="pf-hero-bio">
              ${this.escape(p.summary || "Passionate about creating modern, high-impact digital experiences.")}
            </p>
            
            <div class="pf-hero-actions">
              <a href="#pf-contact" class="btn btn-primary btn-lg">
                <i data-lucide="mail"></i> Get In Touch
              </a>
              <button onclick="ExportManager.downloadPDF()" class="btn btn-secondary btn-lg">
                <i data-lucide="download"></i> Download Resume
              </button>
            </div>

            <div class="pf-social-links">
              ${p.github ? `
                <a href="${this.formatUrl(p.github)}" target="_blank" class="pf-social-btn" title="GitHub">
                  <i data-lucide="github"></i>
                </a>
              ` : ''}
              ${p.linkedin ? `
                <a href="${this.formatUrl(p.linkedin)}" target="_blank" class="pf-social-btn" title="LinkedIn">
                  <i data-lucide="linkedin"></i>
                </a>
              ` : ''}
              ${p.email ? `
                <a href="mailto:${this.escape(p.email)}" class="pf-social-btn" title="Email Me">
                  <i data-lucide="mail"></i>
                </a>
              ` : ''}
              ${p.website ? `
                <a href="${this.formatUrl(p.website)}" target="_blank" class="pf-social-btn" title="Personal Website">
                  <i data-lucide="globe"></i>
                </a>
              ` : ''}
            </div>
          </div>

          <div class="pf-avatar-card">
            <div class="pf-avatar-img-wrapper">
              <img src="${this.escape(p.avatar || defaultAvatar)}" alt="${this.escape(p.fullName)}" />
            </div>
          </div>
        </section>

        <!-- About & Quick Stats Section -->
        <section id="pf-about" class="pf-section">
          <div class="pf-section-header">
            <span class="pf-section-tag">About Me</span>
            <h2 class="pf-section-title">Background & Core Focus</h2>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:36px;max-width:900px;margin:0 auto;line-height:1.7;">
            <p style="font-size:1.1rem;color:var(--text-secondary);margin-bottom:24px;">
              ${this.escape(p.summary || "Experienced in delivering robust, user-centric software solutions from conceptual architecture to cloud deployment.")}
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:20px;padding-top:20px;border-top:1px solid var(--border-color);">
              <div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">Location</div>
                <div style="font-weight:700;font-size:1.05rem;">${this.escape(p.location || "Remote / Global")}</div>
              </div>
              <div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">Experience</div>
                <div style="font-weight:700;font-size:1.05rem;">${exp.length ? `${exp.length}+ Industry Roles` : 'Experienced'}</div>
              </div>
              <div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">Key Projects</div>
                <div style="font-weight:700;font-size:1.05rem;">${projects.length ? `${projects.length} Showcased` : 'Multiple Releases'}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills Section -->
        ${(skills.technical?.length || skills.tools?.length || skills.soft?.length) ? `
          <section id="pf-skills" class="pf-section">
            <div class="pf-section-header">
              <span class="pf-section-tag">Expertise</span>
              <h2 class="pf-section-title">Skills &amp; Technologies</h2>
            </div>
            <div class="pf-skills-container">
              ${skills.technical?.length ? `
                <div class="pf-skill-card">
                  <h4><i data-lucide="code-2"></i> Technical Core</h4>
                  <div class="pf-skill-tags">
                    ${skills.technical.map(s => `<span class="pf-skill-tag">${this.escape(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${skills.tools?.length ? `
                <div class="pf-skill-card">
                  <h4><i data-lucide="cloud"></i> Tools &amp; Infrastructure</h4>
                  <div class="pf-skill-tags">
                    ${skills.tools.map(s => `<span class="pf-skill-tag">${this.escape(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${skills.soft?.length ? `
                <div class="pf-skill-card">
                  <h4><i data-lucide="sparkles"></i> Professional Strengths</h4>
                  <div class="pf-skill-tags">
                    ${skills.soft.map(s => `<span class="pf-skill-tag">${this.escape(s)}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </section>
        ` : ''}

        <!-- Featured Projects Section -->
        ${projects.length ? `
          <section id="pf-projects" class="pf-section">
            <div class="pf-section-header">
              <span class="pf-section-tag">Portfolio</span>
              <h2 class="pf-section-title">Featured Projects</h2>
            </div>
            <div class="pf-projects-grid">
              ${projects.map(proj => `
                <div class="pf-project-card">
                  <div class="pf-project-body">
                    <h3 class="pf-project-title">${this.escape(proj.title)}</h3>
                    <p class="pf-project-desc">${this.escape(proj.description)}</p>
                    
                    ${proj.techStack?.length ? `
                      <div class="pf-project-tech">
                        ${(Array.isArray(proj.techStack) ? proj.techStack : proj.techStack.split(",")).map(t => `
                          <span class="pf-tech-badge">${this.escape(t.trim())}</span>
                        `).join('')}
                      </div>
                    ` : ''}

                    <div class="pf-project-footer">
                      ${proj.liveLink ? `
                        <a href="${this.formatUrl(proj.liveLink)}" target="_blank" class="btn btn-primary btn-sm">
                          <i data-lucide="external-link"></i> Live Demo
                        </a>
                      ` : ''}
                      ${proj.githubLink ? `
                        <a href="${this.formatUrl(proj.githubLink)}" target="_blank" class="btn btn-secondary btn-sm">
                          <i data-lucide="github"></i> Source Code
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Experience & Education Timeline -->
        ${(exp.length || edu.length) ? `
          <section id="pf-experience" class="pf-section">
            <div class="pf-section-header">
              <span class="pf-section-tag">Trajectory</span>
              <h2 class="pf-section-title">Experience &amp; Education</h2>
            </div>
            <div class="pf-timeline">
              ${exp.map(e => `
                <div class="pf-timeline-item">
                  <div class="pf-timeline-dot"></div>
                  <div class="pf-timeline-content">
                    <div class="pf-timeline-header">
                      <div class="pf-timeline-role">${this.escape(e.role)}</div>
                      <div class="pf-timeline-meta">${this.escape(e.startDate)} – ${e.current ? 'Present' : this.escape(e.endDate || 'Present')}</div>
                    </div>
                    <div class="pf-timeline-company">${this.escape(e.company)} ${e.location ? `• ${this.escape(e.location)}` : ''}</div>
                    ${e.bullets?.length ? `
                      <ul class="pf-timeline-bullets">
                        ${e.bullets.map(b => `<li>${this.escape(b)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                </div>
              `).join('')}

              ${edu.map(ed => `
                <div class="pf-timeline-item">
                  <div class="pf-timeline-dot" style="background:#06b6d4;box-shadow:0 0 10px #06b6d4;"></div>
                  <div class="pf-timeline-content">
                    <div class="pf-timeline-header">
                      <div class="pf-timeline-role">${this.escape(ed.degree)}</div>
                      <div class="pf-timeline-meta">${this.escape(ed.gradYear)}</div>
                    </div>
                    <div class="pf-timeline-company">${this.escape(ed.school)} ${ed.location ? `• ${this.escape(ed.location)}` : ''}</div>
                    ${ed.details ? `<p style="font-size:0.9rem;color:var(--text-secondary);margin-top:6px;">${this.escape(ed.details)}</p>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Contact Section -->
        <section id="pf-contact" class="pf-section">
          <div class="pf-contact-card">
            <span class="pf-section-tag">Let's Work Together</span>
            <h2 class="pf-section-title" style="margin-bottom:12px;">Get In Touch</h2>
            <p style="color:var(--text-secondary);max-width:520px;margin:0 auto 24px;">
              Have an exciting project, open role, or just want to chat? Reach out directly via email or the form below.
            </p>

            <form class="pf-contact-form" onsubmit="PortfolioRenderer.handleContactSubmit(event, '${this.escape(p.email)}')">
              <div class="form-row">
                <input type="text" class="form-control" placeholder="Your Name" required />
                <input type="email" class="form-control" placeholder="Your Email" required />
              </div>
              <input type="text" class="form-control" placeholder="Subject" required />
              <textarea class="form-control" placeholder="Your Message..." rows="4" required></textarea>
              <button type="submit" class="btn btn-primary btn-lg" style="margin-top:8px;">
                <i data-lucide="send"></i> Send Message
              </button>
            </form>
          </div>
        </section>

        <!-- Portfolio Footer -->
        <footer class="pf-footer">
          <p>© ${new Date().getFullYear()} ${this.escape(p.fullName || "Portfolio Owner")}. Powered by AI Resume &amp; Portfolio Builder.</p>
        </footer>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  handleContactSubmit(e, email) {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:${email}?subject=Inquiry%20from%20Portfolio&body=Hello%20there!`;
    }
    if (window.App) {
      App.showToast("Message sent successfully!", "success");
    } else {
      alert("Message simulated! Opening mail client.");
    }
  },

  escape(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  formatUrl(url) {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  }
};
