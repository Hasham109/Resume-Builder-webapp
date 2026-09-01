/* ==========================================================================
   AI ASSISTANT ENGINE (SMART RESUME ENHANCEMENT, BULLET POLISHER & ATS AUDIT)
   ========================================================================== */

const AIAssistant = {
  // Action Verbs Dictionary for Bullet Rewriting
  actionVerbs: [
    "Architected", "Spearheaded", "Engineered", "Orchestrated", "Accelerated",
    "Streamlined", "Pioneered", "Implemented", "Revamped", "Maximized",
    "Generated", "Designed", "Consolidated", "Championed", "Optimized"
  ],

  // Role Keywords for ATS Optimization
  roleKeywords: {
    developer: ["Microservices", "RESTful APIs", "TypeScript", "CI/CD", "Cloud Architecture", "Docker", "Kubernetes", "Scalability", "Unit Testing", "Agile"],
    designer: ["Design Systems", "User Research", "Wireframing", "Figma", "Prototyping", "WCAG Accessibility", "Information Architecture", "Usability Testing"],
    manager: ["Strategic Planning", "Cross-Functional Leadership", "KPI Tracking", "Budget Management", "Stakeholder Alignment", "Agile Delivery", "Product Roadmap"],
    data: ["Machine Learning", "Data Pipelines", "Python", "SQL", "Predictive Modeling", "ETL", "Tableau", "Statistical Analysis", "Data Governance"]
  },

  /**
   * Generates tailored professional summaries based on role and tone
   */
  generateSummaries(role, currentSummary = "") {
    const cleanRole = role.trim() || "Professional";
    return [
      {
        tone: "Executive & High-Impact",
        badge: "Leadership",
        text: `Accomplished and strategic ${cleanRole} with a proven track record of architecting mission-critical initiatives and scaling cross-functional teams. Recognized for turning complex operational challenges into streamlined, high-yield solutions that consistently drive bottom-line business growth.`
      },
      {
        tone: "Metrics & Results-Driven (Recommended)",
        badge: "ATS Optimal",
        text: `Results-focused ${cleanRole} leveraging deep technical acumen to deliver high-performance solutions. Spearheaded end-to-end projects that boosted efficiency by 40%+ and optimized user engagement. Dedicated to continuous innovation, best-practice design, and seamless execution.`
      },
      {
        tone: "Modern & Agile",
        badge: "Growth",
        text: `Dynamic, forward-thinking ${cleanRole} passionate about building scalable, user-first products. Adept at bridging technical complexities with business strategy to deliver fast, reliable, and delightful experiences in fast-paced collaborative environments.`
      }
    ];
  },

  /**
   * Transforms raw bullet points into strong, Google X-Y-Z formula bullets
   */
  enhanceBulletPoint(rawBullet, role = "") {
    if (!rawBullet || rawBullet.trim().length < 5) {
      return [
        "Architected scalable infrastructure components, improving system throughput by 35% and reducing downtime.",
        "Spearheaded cross-functional delivery sprints, accelerating release velocity by 40% across key product milestones.",
        "Engineered automated testing and deployment pipelines, decreasing bug regression rates by 50%."
      ];
    }

    const clean = rawBullet.replace(/^[-•*]\s*/, '').trim();
    return [
      `Spearheaded the design and implementation of ${clean.toLowerCase()}, increasing overall operational efficiency by 38% and reducing error rates.`,
      `Architected end-to-end solutions for ${clean.toLowerCase()}, resulting in a 45% reduction in latency and elevated stakeholder satisfaction.`,
      `Orchestrated cross-team initiatives to optimize ${clean.toLowerCase()}, delivering critical milestones 2 weeks ahead of scheduled roadmap.`
    ];
  },

  /**
   * Calculates comprehensive ATS Score & Actionable Quality Checklist
   */
  calculateATSScore(resumeData) {
    let score = 0;
    const checks = [];

    // 1. Personal Information Completeness (20 pts)
    const { fullName, jobTitle, email, phone, location, summary } = resumeData.personal || {};
    if (fullName && email && phone && location) {
      score += 15;
      checks.push({ label: "Contact information is complete", passed: true });
    } else {
      score += 5;
      checks.push({ label: "Missing some contact fields (Email, Phone, Location)", passed: false });
    }

    if (summary && summary.length > 50) {
      score += 10;
      checks.push({ label: "Professional summary is impactful and detailed", passed: true });
    } else {
      checks.push({ label: "Professional summary is too short or missing", passed: false });
    }

    // 2. Experience & Metric Density (35 pts)
    const exp = resumeData.experience || [];
    if (exp.length >= 2) {
      score += 15;
      checks.push({ label: `Included ${exp.length} work experience entries`, passed: true });
    } else if (exp.length === 1) {
      score += 8;
      checks.push({ label: "Add at least 2 relevant experience entries for stronger profile", passed: false });
    } else {
      checks.push({ label: "No work experience added yet", passed: false });
    }

    // Check for quantifiable metrics in bullets (% or numbers)
    let totalBullets = 0;
    let metricBullets = 0;
    exp.forEach(e => {
      (e.bullets || []).forEach(b => {
        totalBullets++;
        if (/\d+%|\d+x|\$\d+|\d+\+|\b\d+\b/i.test(b)) {
          metricBullets++;
        }
      });
    });

    if (metricBullets >= 2) {
      score += 20;
      checks.push({ label: `Great use of measurable impact (${metricBullets} quantifiable metrics found)`, passed: true });
    } else if (metricBullets === 1) {
      score += 10;
      checks.push({ label: "Add more quantifiable metrics (e.g., 'reduced by 30%', 'managed 5 engineers')", passed: false });
    } else {
      checks.push({ label: "No numbers or metrics found in bullets. Use Google X-Y-Z formula", passed: false });
    }

    // 3. Skills Coverage (20 pts)
    const techSkills = resumeData.skills?.technical || [];
    const softSkills = resumeData.skills?.soft || [];
    const toolSkills = resumeData.skills?.tools || [];
    const totalSkills = techSkills.length + softSkills.length + toolSkills.length;

    if (totalSkills >= 8) {
      score += 20;
      checks.push({ label: `Strong skill diversity (${totalSkills} skills tagged across categories)`, passed: true });
    } else if (totalSkills >= 4) {
      score += 10;
      checks.push({ label: "Add more categorized skills (aim for at least 8-12 relevant skills)", passed: false });
    } else {
      checks.push({ label: "Skills section is sparse", passed: false });
    }

    // 4. Projects & Education (15 pts)
    const projects = resumeData.projects || [];
    if (projects.length >= 2) {
      score += 10;
      checks.push({ label: `Showcasing ${projects.length} featured projects`, passed: true });
    } else if (projects.length === 1) {
      score += 5;
      checks.push({ label: "Consider adding a second project to showcase versatility", passed: false });
    }

    const edu = resumeData.education || [];
    if (edu.length >= 1) {
      score += 5;
      checks.push({ label: "Education credentials provided", passed: true });
    }

    return {
      score: Math.min(100, Math.max(10, score)),
      checks: checks
    };
  },

  /**
   * Custom AI Rewrite Simulator with dynamic response
   */
  customRewrite(originalText, userPrompt) {
    const promptLower = (userPrompt || "").toLowerCase();
    
    if (promptLower.includes("leadership") || promptLower.includes("leader")) {
      return `Spearheaded cross-functional initiatives and empowered team members to execute high-impact strategies, accelerating delivery by 45% while maintaining exceptional quality standards.`;
    }
    if (promptLower.includes("concise") || promptLower.includes("short")) {
      return `Engineered high-performance systems and streamlined workflows, driving a 35% boost in efficiency.`;
    }
    if (promptLower.includes("metric") || promptLower.includes("number")) {
      return `Delivered scalable solutions resulting in a 52% reduction in operational latency, saving $140K+ annually across infrastructure overhead.`;
    }

    return `Orchestrated the strategic optimization of ${originalText.trim() || 'core project deliverables'}, resulting in enhanced system performance, 40% faster turnaround, and measurable organizational value.`;
  }
};
