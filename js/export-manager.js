/* ==========================================================================
   EXPORT & DOWNLOAD MANAGER (PDF, STANDALONE HTML, JSON BACKUP)
   ========================================================================== */

const ExportManager = {
  /**
   * Generates and downloads crisp, high-definition PDF resume
   */
  async downloadPDF() {
    const element = document.getElementById("resume-preview-container");
    if (!element) {
      if (window.App) App.showToast("Resume element not found", "info");
      return;
    }

    if (window.App) App.showToast("Preparing your high-definition PDF...", "info");

    const fullName = (window.App?.state?.personal?.fullName || "Resume")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${fullName}_Resume.pdf`;

    // If html2pdf is loaded, use it for direct download
    if (typeof html2pdf !== "undefined") {
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      try {
        await html2pdf().set(opt).from(element).save();
        if (window.App) {
          App.showToast("PDF downloaded successfully! 🎉", "success");
          if (typeof confetti === "function") {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
          }
        }
      } catch (err) {
        console.error("html2pdf failed, falling back to print preview:", err);
        window.print();
      }
    } else {
      // Native print fallback
      window.print();
    }
  },

  /**
   * Generates a completely standalone single-file portfolio HTML document
   */
  exportPortfolioHTML() {
    if (!window.App) return;
    const data = window.App.state;
    const name = data.personal?.fullName || "Portfolio";
    const filename = `${name.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}_Portfolio.html`;

    const container = document.getElementById("portfolio-preview-container");
    if (!container) return;

    const portfolioMarkup = container.innerHTML;

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personal?.fullName || 'Portfolio'} - Professional Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --bg-primary: #0a0d14;
      --bg-secondary: #111726;
      --bg-tertiary: #182238;
      --bg-card: rgba(22, 32, 54, 0.7);
      --bg-card-hover: rgba(30, 43, 72, 0.85);
      --bg-glass: rgba(17, 24, 39, 0.75);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-focus: rgba(99, 102, 241, 0.5);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-primary: #6366f1;
      --accent-secondary: #8b5cf6;
      --accent-emerald: #10b981;
      --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --radius-full: 9999px;
      --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.45);
      --shadow-glow: 0 0 30px rgba(99, 102, 241, 0.25);
      --font-main: 'Plus Jakarta Sans', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body { font-family: var(--font-main); background-color: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; font-weight: 600; border-radius: var(--radius-md); border: 1px solid transparent; cursor: pointer; text-decoration: none; }
    .btn-primary { background: var(--accent-gradient); color: #fff; }
    .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border-color: var(--border-color); }
    .btn-sm { padding: 6px 12px; font-size: 0.85rem; }
    .btn-lg { padding: 14px 28px; font-size: 1.05rem; border-radius: var(--radius-lg); }
    .text-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .form-control { width: 100%; padding: 10px 14px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    /* Embedded portfolio component styles */
    .portfolio-site { min-height: 100vh; position: relative; }
    .pf-navbar { position: sticky; top: 0; z-index: 50; background: var(--bg-glass); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-color); padding: 16px 32px; }
    .pf-nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .pf-logo { font-weight: 800; font-size: 1.3rem; color: var(--text-primary); text-decoration: none; display: flex; align-items: center; gap: 10px; }
    .pf-logo-dot { width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 50%; }
    .pf-nav-links { display: flex; align-items: center; gap: 24px; list-style: none; }
    .pf-nav-links a { color: var(--text-secondary); text-decoration: none; font-weight: 600; }
    .pf-hero { padding: 80px 24px 60px; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: center; gap: 48px; }
    .pf-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; }
    .pf-hero-title { font-size: 3.2rem; font-weight: 800; line-height: 1.15; margin-bottom: 16px; }
    .pf-hero-subtitle { font-size: 1.4rem; font-weight: 600; color: var(--accent-primary); margin-bottom: 20px; }
    .pf-hero-bio { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px; }
    .pf-hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
    .pf-social-links { display: flex; align-items: center; gap: 14px; }
    .pf-social-btn { width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); display: flex; align-items: center; justify-content: center; text-decoration: none; }
    .pf-avatar-img-wrapper { width: 280px; height: 280px; border-radius: var(--radius-xl); overflow: hidden; border: 2px solid var(--border-focus); background: var(--bg-secondary); }
    .pf-avatar-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .pf-section { padding: 70px 24px; max-width: 1100px; margin: 0 auto; }
    .pf-section-header { text-align: center; margin-bottom: 48px; }
    .pf-section-tag { font-size: 0.85rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; display: block; }
    .pf-section-title { font-size: 2.2rem; font-weight: 800; }
    .pf-skills-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .pf-skill-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; }
    .pf-skill-card h4 { font-size: 1.15rem; font-weight: 700; margin-bottom: 16px; color: var(--accent-primary); }
    .pf-skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .pf-skill-tag { background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.88rem; font-weight: 600; }
    .pf-projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; }
    .pf-project-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); overflow: hidden; display: flex; flex-direction: column; }
    .pf-project-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
    .pf-project-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
    .pf-project-desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 20px; flex: 1; }
    .pf-project-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .pf-tech-badge { background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); border: 1px solid rgba(99, 102, 241, 0.2); padding: 3px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
    .pf-project-footer { display: flex; align-items: center; gap: 12px; }
    .pf-timeline { position: relative; max-width: 800px; margin: 0 auto; padding-left: 30px; }
    .pf-timeline::before { content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px; background: var(--border-color); }
    .pf-timeline-item { position: relative; margin-bottom: 36px; }
    .pf-timeline-dot { position: absolute; left: -30px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent-primary); border: 3px solid var(--bg-primary); }
    .pf-timeline-content { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px; }
    .pf-timeline-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    .pf-timeline-role { font-size: 1.15rem; font-weight: 700; }
    .pf-timeline-meta { font-size: 0.85rem; color: var(--text-muted); }
    .pf-timeline-company { font-size: 0.95rem; font-weight: 600; color: var(--accent-primary); margin-bottom: 10px; }
    .pf-timeline-bullets { padding-left: 18px; font-size: 0.92rem; color: var(--text-secondary); }
    .pf-contact-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 40px; max-width: 700px; margin: 0 auto; text-align: center; }
    .pf-contact-form { display: flex; flex-direction: column; gap: 16px; text-align: left; margin-top: 24px; }
    .pf-footer { text-align: center; padding: 40px 20px; border-top: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.9rem; }
    @media (max-width: 768px) {
      .pf-hero { grid-template-columns: 1fr; text-align: center; gap: 32px; }
      .pf-hero-actions, .pf-social-links { justify-content: center; }
      .pf-nav-links { display: none; }
    }
  </style>
</head>
<body>
  ${portfolioMarkup}
  <script>
    lucide.createIcons();
  </script>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.showToast("Standalone Portfolio HTML exported! 🌐", "success");
  },

  /**
   * Exports the entire app state to a JSON backup file
   */
  exportJSON() {
    if (!window.App) return;
    const data = window.App.state;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Resume_Portfolio_Data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.showToast("Backup JSON file saved to disk!", "success");
  },

  /**
   * Imports a JSON backup file into the app
   */
  importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (window.App) {
          App.state = importedData;
          App.saveState();
          FormWizard.populateForm(App.state);
          App.updatePreviews();
          App.showToast("Resume data imported successfully!", "success");
        }
      } catch (err) {
        console.error(err);
        if (window.App) App.showToast("Invalid JSON file", "info");
      }
    };
    reader.readAsText(file);
  }
};
