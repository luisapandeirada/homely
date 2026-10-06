import { store } from "../store.js";
import { toast } from "../components.js";
import { t } from "../i18n.js";

// Helper to update active links in navigation bar
function setActiveNavLink(routeId) {
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("data-route") === routeId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * 1. LANDING PAGE - Premium Editorial Brand Story Architecture
 */
export function renderLandingView(container, navigateTo) {
  setActiveNavLink("home");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <!-- 01 — HERO SECTION -->
    <section class="editorial-hero" style="position:relative; width:100%; min-height:80vh; display:flex; align-items:flex-end; background:linear-gradient(180deg, rgba(28,26,23,0.2) 0%, rgba(28,26,23,0.85) 100%), url('assets/property_modern.png') center/cover no-repeat; color:#ffffff; padding:96px 64px 72px 64px; border-radius:24px; margin-top:16px; margin-bottom:120px; box-shadow:var(--shadow-premium);">
      <div style="max-width:880px; position:relative; z-index:2;">
        <p style="font-family:var(--font-sans); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:rgba(255,255,255,0.75); margin-bottom:24px;">
          ${t("hero_tag")}
        </p>
        <h1 style="color:#ffffff; font-family:var(--font-serif); font-size:clamp(44px, 6vw, 76px); font-weight:400; line-height:1.05; letter-spacing:-0.02em; margin-bottom:28px;">
          ${t("hero_headline")}
        </h1>
        <p style="color:rgba(255,255,255,0.88); font-family:var(--font-sans); font-size:19px; line-height:1.65; margin-bottom:44px; font-weight:400; max-width:640px;">
          ${t("hero_subline")}
        </p>
        <div class="cta-group" style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
          <button class="btn btn-primary" id="hero-cta-primary" style="padding:16px 36px; font-size:14px; font-weight:600; border-radius:30px; background:#ffffff; color:#1c1a17; border:none; letter-spacing:0.02em; cursor:pointer;">
            ${t("hero_cta_primary")}
          </button>
          <button class="btn btn-secondary" id="hero-cta-secondary" style="padding:16px 36px; font-size:14px; font-weight:500; border-radius:30px; background:rgba(255,255,255,0.15); color:#ffffff; border:1px solid rgba(255,255,255,0.35); backdrop-filter:blur(12px); cursor:pointer;">
            ${t("hero_cta_secondary")}
          </button>
        </div>
      </div>
    </section>

    <!-- 02 — BIG BRAND STATEMENT -->
    <section class="editorial-statement" style="padding:40px 24px; margin-bottom:140px; text-align:center; max-width:960px; margin-left:auto; margin-right:auto;">
      <p style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:var(--primary-color); margin-bottom:20px;">
        ${t("statement_eyebrow")}
      </p>
      <h2 style="font-family:var(--font-serif); font-size:clamp(34px, 4.5vw, 56px); font-weight:400; line-height:1.15; letter-spacing:-0.02em; color:var(--text-main); margin-bottom:28px;">
        "${t("statement_headline")}"
      </h2>
      <p style="font-family:var(--font-sans); font-size:18px; line-height:1.7; color:var(--text-muted); max-width:720px; margin:0 auto; font-weight:400;">
        ${t("statement_desc")}
      </p>
    </section>

    <!-- 03 — PRODUCT STORY (3 Alternating Editorial Rows) -->
    <section class="editorial-story" style="margin-bottom:140px; display:flex; flex-direction:column; gap:120px;">
      
      <!-- Row 1: Text Left / Image Right -->
      <div class="editorial-row" style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">
        <div style="padding-right:24px;">
          <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:16px;">
            ${t("story1_eyebrow")}
          </span>
          <h3 style="font-family:var(--font-serif); font-size:38px; font-weight:400; line-height:1.15; margin-bottom:20px; color:var(--text-main);">
            ${t("story1_title")}
          </h3>
          <p style="font-family:var(--font-sans); font-size:16px; line-height:1.7; color:var(--text-muted); margin-bottom:28px;">
            ${t("story1_desc")}
          </p>
          <a href="#/signup" style="font-family:var(--font-sans); font-size:13px; font-weight:600; color:var(--text-main); text-decoration:underline; text-underline-offset:6px;">
            Explore ledger tools &rarr;
          </a>
        </div>
        <div style="border-radius:16px; overflow:hidden; border:1px solid var(--glass-border); box-shadow:var(--shadow-premium);">
          <img src="assets/property_apartment.png" alt="Homely Financial Ledger" style="width:100%; height:400px; object-fit:cover; display:block;">
        </div>
      </div>

      <!-- Row 2: Image Left / Text Right -->
      <div class="editorial-row editorial-row-reverse" style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">
        <div style="border-radius:16px; overflow:hidden; border:1px solid var(--glass-border); box-shadow:var(--shadow-premium); order:1;">
          <img src="assets/property_loft.png" alt="Homely Resident Payments" style="width:100%; height:400px; object-fit:cover; display:block;">
        </div>
        <div style="padding-left:24px; order:2;">
          <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:16px;">
            ${t("story2_eyebrow")}
          </span>
          <h3 style="font-family:var(--font-serif); font-size:38px; font-weight:400; line-height:1.15; margin-bottom:20px; color:var(--text-main);">
            ${t("story2_title")}
          </h3>
          <p style="font-family:var(--font-sans); font-size:16px; line-height:1.7; color:var(--text-muted); margin-bottom:28px;">
            ${t("story2_desc")}
          </p>
          <a href="#/login" style="font-family:var(--font-sans); font-size:13px; font-weight:600; color:var(--text-main); text-decoration:underline; text-underline-offset:6px;">
            Tenant portal access &rarr;
          </a>
        </div>
      </div>

      <!-- Row 3: Full-Width Product Composition -->
      <div class="editorial-row-full" style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); border-radius:20px; padding:64px; text-align:center;">
        <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:16px;">
          ${t("story3_eyebrow")}
        </span>
        <h3 style="font-family:var(--font-serif); font-size:42px; font-weight:400; line-height:1.15; margin-bottom:20px; color:var(--text-main); max-width:740px; margin-left:auto; margin-right:auto;">
          ${t("story3_title")}
        </h3>
        <p style="font-family:var(--font-sans); font-size:16px; line-height:1.7; color:var(--text-muted); max-width:680px; margin:0 auto 40px auto;">
          ${t("story3_desc")}
        </p>
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--glass-border); box-shadow:var(--shadow-premium); max-width:900px; margin:0 auto;">
          <img src="assets/property_modern.png" alt="Homely Maintenance Board" style="width:100%; height:440px; object-fit:cover; display:block;">
        </div>
      </div>

    </section>

    <!-- 04 — PRODUCT VISUALS -->
    <section class="editorial-visuals" style="margin-bottom:140px; text-align:center;">
      <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:16px;">
        ${t("visuals_eyebrow")}
      </span>
      <h2 style="font-family:var(--font-serif); font-size:40px; font-weight:400; margin-bottom:16px; color:var(--text-main);">
        ${t("visuals_title")}
      </h2>
      <p style="font-family:var(--font-sans); font-size:16px; color:var(--text-muted); max-width:600px; margin:0 auto 48px auto;">
        ${t("visuals_desc")}
      </p>

      <div class="properties-showcase" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:32px; text-align:left;">
        <div class="glass-card property-card" style="padding:0; overflow:hidden; border-radius:16px; border:1px solid var(--glass-border); background:var(--glass-bg);">
          <div style="height:280px; overflow:hidden; position:relative;">
            <img src="assets/property_apartment.png" alt="Sunset Heights" style="width:100%; height:100%; object-fit:cover;">
            <span style="position:absolute; top:16px; left:16px; background:rgba(28,26,23,0.85); color:#ffffff; font-size:11px; font-weight:600; padding:6px 14px; border-radius:20px; backdrop-filter:blur(8px);">3 Units</span>
          </div>
          <div style="padding:28px;">
            <h3 style="font-family:var(--font-serif); font-size:24px; font-weight:400; margin-bottom:8px;">Sunset Heights Apartments</h3>
            <p style="font-size:14px; color:var(--text-muted); font-family:var(--font-sans);">742 Evergreen Terrace, Springfield</p>
          </div>
        </div>

        <div class="glass-card property-card" style="padding:0; overflow:hidden; border-radius:16px; border:1px solid var(--glass-border); background:var(--glass-bg);">
          <div style="height:280px; overflow:hidden; position:relative;">
            <img src="assets/property_loft.png" alt="Oakwood Lofts" style="width:100%; height:100%; object-fit:cover;">
            <span style="position:absolute; top:16px; left:16px; background:rgba(28,26,23,0.85); color:#ffffff; font-size:11px; font-weight:600; padding:6px 14px; border-radius:20px; backdrop-filter:blur(8px);">2 Units</span>
          </div>
          <div style="padding:28px;">
            <h3 style="font-family:var(--font-serif); font-size:24px; font-weight:400; margin-bottom:8px;">Oakwood Industrial Lofts</h3>
            <p style="font-size:14px; color:var(--text-muted); font-family:var(--font-sans);">1042 Industrial Pkwy, Sector 7G</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 05 — THE HOMELY APPROACH -->
    <section class="editorial-approach" style="margin-bottom:140px; padding:64px 0; border-top:1px solid var(--glass-border); border-bottom:1px solid var(--glass-border);">
      <div style="margin-bottom:48px;">
        <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:12px;">
          ${t("approach_eyebrow")}
        </span>
        <h2 style="font-family:var(--font-serif); font-size:38px; font-weight:400; color:var(--text-main);">
          ${t("approach_title")}
        </h2>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:40px;">
        <div>
          <span style="font-family:var(--font-serif); font-size:32px; color:var(--primary-color); display:block; margin-bottom:12px;">01</span>
          <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; margin-bottom:12px;">${t("approach1_title")}</h3>
          <p style="font-family:var(--font-sans); font-size:14px; line-height:1.7; color:var(--text-muted);">${t("approach1_desc")}</p>
        </div>

        <div>
          <span style="font-family:var(--font-serif); font-size:32px; color:var(--primary-color); display:block; margin-bottom:12px;">02</span>
          <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; margin-bottom:12px;">${t("approach2_title")}</h3>
          <p style="font-family:var(--font-sans); font-size:14px; line-height:1.7; color:var(--text-muted);">${t("approach2_desc")}</p>
        </div>

        <div>
          <span style="font-family:var(--font-serif); font-size:32px; color:var(--primary-color); display:block; margin-bottom:12px;">03</span>
          <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; margin-bottom:12px;">${t("approach3_title")}</h3>
          <p style="font-family:var(--font-sans); font-size:14px; line-height:1.7; color:var(--text-muted);">${t("approach3_desc")}</p>
        </div>
      </div>
    </section>

    <!-- 06 — TRUST / SOCIAL PROOF -->
    <section class="editorial-proof" style="margin-bottom:140px; background:var(--glass-bg-accent); border:1px solid var(--glass-border); border-radius:24px; padding:72px 56px; text-align:center;">
      <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:24px;">
        ${t("proof_eyebrow")}
      </span>
      <blockquote style="font-family:var(--font-serif); font-size:clamp(24px, 3vw, 34px); font-weight:400; line-height:1.4; color:var(--text-main); max-width:820px; margin:0 auto 32px auto;">
        ${t("proof_quote")}
      </blockquote>
      <div style="margin-bottom:48px;">
        <p style="font-family:var(--font-sans); font-size:15px; font-weight:700; color:var(--text-main);">${t("proof_author")}</p>
        <p style="font-family:var(--font-sans); font-size:13px; color:var(--text-muted);">${t("proof_role")}</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:32px; border-top:1px solid var(--glass-border); padding-top:40px; max-width:760px; margin:0 auto;">
        <div>
          <span style="font-family:var(--font-serif); font-size:42px; font-weight:400; color:var(--text-main); display:block;">${t("stat1_val")}</span>
          <span style="font-family:var(--font-sans); font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">${t("stat1_lbl")}</span>
        </div>
        <div>
          <span style="font-family:var(--font-serif); font-size:42px; font-weight:400; color:var(--text-main); display:block;">${t("stat2_val")}</span>
          <span style="font-family:var(--font-sans); font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">${t("stat2_lbl")}</span>
        </div>
        <div>
          <span style="font-family:var(--font-serif); font-size:42px; font-weight:400; color:var(--text-main); display:block;">${t("stat3_val")}</span>
          <span style="font-family:var(--font-sans); font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">${t("stat3_lbl")}</span>
        </div>
      </div>
    </section>

    <!-- 07 — CONTENT / INSIGHTS JOURNAL -->
    <section class="editorial-journal" style="margin-bottom:140px;">
      <div style="margin-bottom:40px;">
        <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:12px;">
          ${t("journal_eyebrow")}
        </span>
        <h2 style="font-family:var(--font-serif); font-size:38px; font-weight:400; color:var(--text-main);">
          ${t("journal_title")}
        </h2>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:40px;">
        <article class="glass-card" style="padding:0; overflow:hidden; border-radius:16px;">
          <img src="assets/property_modern.png" alt="Journal Article" style="width:100%; height:240px; object-fit:cover;">
          <div style="padding:28px;">
            <p style="font-family:var(--font-sans); font-size:12px; color:var(--text-muted); margin-bottom:8px;">${t("journal1_date")}</p>
            <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; line-height:1.3; margin-bottom:12px;">${t("journal1_title")}</h3>
          </div>
        </article>

        <article class="glass-card" style="padding:0; overflow:hidden; border-radius:16px;">
          <img src="assets/property_loft.png" alt="Journal Article" style="width:100%; height:240px; object-fit:cover;">
          <div style="padding:28px;">
            <p style="font-family:var(--font-sans); font-size:12px; color:var(--text-muted); margin-bottom:8px;">${t("journal2_date")}</p>
            <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; line-height:1.3; margin-bottom:12px;">${t("journal2_title")}</h3>
          </div>
        </article>
      </div>
    </section>

    <!-- 08 — ABOUT / HUMAN ELEMENT -->
    <section class="editorial-human" style="margin-bottom:140px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">
      <div>
        <span style="font-family:var(--font-sans); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:var(--primary-color); display:block; margin-bottom:16px;">
          ${t("human_eyebrow")}
        </span>
        <h2 style="font-family:var(--font-serif); font-size:40px; font-weight:400; line-height:1.15; margin-bottom:20px; color:var(--text-main);">
          ${t("human_title")}
        </h2>
        <p style="font-family:var(--font-sans); font-size:16px; line-height:1.7; color:var(--text-muted); margin-bottom:28px;">
          ${t("human_desc")}
        </p>
        <a href="#/about" style="font-family:var(--font-sans); font-size:13px; font-weight:600; color:var(--text-main); text-decoration:underline; text-underline-offset:6px;">
          Read our philosophy &rarr;
        </a>
      </div>
      <div style="border-radius:16px; overflow:hidden; border:1px solid var(--glass-border); box-shadow:var(--shadow-premium);">
        <img src="assets/property_apartment.png" alt="Homely Team & Philosophy" style="width:100%; height:380px; object-fit:cover; display:block;">
      </div>
    </section>

    <!-- 09 — FINAL CTA -->
    <section class="editorial-cta-banner" style="background:var(--text-main); color:#ffffff; border-radius:24px; padding:96px 48px; text-align:center; margin-bottom:60px;">
      <h2 style="color:#ffffff; font-family:var(--font-serif); font-size:clamp(36px, 5vw, 52px); font-weight:400; line-height:1.15; margin-bottom:20px; max-width:760px; margin-left:auto; margin-right:auto;">
        ${t("cta_headline")}
      </h2>
      <p style="color:rgba(255,255,255,0.75); font-family:var(--font-sans); font-size:17px; margin-bottom:40px; max-width:580px; margin-left:auto; margin-right:auto;">
        ${t("cta_desc")}
      </p>
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <button class="btn" id="final-cta-primary" style="padding:16px 36px; font-size:14px; font-weight:600; border-radius:30px; background:#ffffff; color:#1c1a17; border:none; cursor:pointer;">
          ${t("cta_btn_primary")}
        </button>
        <button class="btn" id="final-cta-secondary" style="padding:16px 36px; font-size:14px; font-weight:500; border-radius:30px; background:rgba(255,255,255,0.12); color:#ffffff; border:1px solid rgba(255,255,255,0.3); cursor:pointer;">
          ${t("cta_btn_secondary")}
        </button>
      </div>
    </section>
  `;

  // Bind CTA actions
  document.getElementById("hero-cta-primary").addEventListener("click", () => navigateTo("signup"));
  document.getElementById("hero-cta-secondary").addEventListener("click", () => navigateTo("login"));
  document.getElementById("final-cta-primary").addEventListener("click", () => navigateTo("signup"));
  document.getElementById("final-cta-secondary").addEventListener("click", () => navigateTo("contact"));
}

/**
 * 2. ABOUT US PAGE
 */
export function renderAboutView(container) {
  setActiveNavLink("about");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="about-story" style="margin-top: 40px; margin-bottom: 80px; display:grid; grid-template-columns:1.2fr 1fr; gap:64px; align-items:center;">
      <div class="about-story-text">
        <span style="font-size: 11px; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 16px;">ABOUT HOMELY</span>
        <h2 style="font-family:var(--font-serif); font-size:42px; font-weight:400; margin-bottom:20px; line-height:1.15;">Direct, Quiet & Human Management</h2>
        <p style="font-family:var(--font-sans); font-size:16px; color:var(--text-muted); line-height:1.7; margin-bottom:16px;">Homely provides essential, calm tools for property owners and residents to coordinate lease agreements, direct payments, and repair requests without operational chaos.</p>
        <p style="font-family:var(--font-sans); font-size:16px; color:var(--text-muted); line-height:1.7;">Our focus is on absolute financial clarity, genuine resident satisfaction, and quiet efficiency.</p>
      </div>
      <div style="border-radius:16px; overflow:hidden; border:1px solid var(--glass-border); box-shadow:var(--shadow-premium);">
        <img class="about-story-img" src="assets/property_modern.png" alt="Homely Philosophy" style="width:100%; height:380px; object-fit:cover; display:block;">
      </div>
    </div>

    <!-- Principles Grid -->
    <section style="margin-bottom: 80px;">
      <h2 style="font-family:var(--font-serif); font-size: 32px; font-weight:400; margin-bottom: 36px;">Core Principles</h2>
      <div class="grid-2" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:32px;">
        <div class="glass-panel" style="padding: 36px; border-radius:16px;">
          <h3 style="font-family: var(--font-serif); margin-bottom: 12px; font-size: 22px; font-weight: 400;">Clear Information</h3>
          <p style="color: var(--text-muted); font-family:var(--font-sans); font-size: 14px; line-height: 1.7;">We keep ledgers and receipts crystal clear so landlords and tenants always have a single source of financial truth.</p>
        </div>
        <div class="glass-panel" style="padding: 36px; border-radius:16px;">
          <h3 style="font-family: var(--font-serif); margin-bottom: 12px; font-size: 22px; font-weight: 400;">Respectful Communication</h3>
          <p style="color: var(--text-muted); font-family:var(--font-sans); font-size: 14px; line-height: 1.7;">Direct messaging between landlords, tenants, and repair contractors ensures maintenance tickets are handled with care and speed.</p>
        </div>
      </div>
    </section>
  `;
}

/**
 * 3. CONTACT US PAGE
 */
export function renderContactView(container) {
  setActiveNavLink("contact");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div style="max-width: 680px; margin: 40px auto 48px 0;">
      <span style="font-size: 11px; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;">GET IN TOUCH</span>
      <h2 style="font-family:var(--font-serif); font-size: 44px; font-weight:400;">Contact Us</h2>
      <p style="color: var(--text-muted); font-family:var(--font-sans); margin-top: 12px; font-size: 16px; line-height:1.6;">Have questions about Homely or setting up your properties? Send us a message below.</p>
    </div>

    <div class="contact-container" style="display:grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin-bottom:80px;">
      <div class="glass-panel" style="padding: 40px; border-radius:16px;">
        <form id="contact-form">
          <div class="form-group">
            <label for="contact-name">Full Name</label>
            <input type="text" id="contact-name" name="name" class="glass-input" required placeholder="e.g. John Doe">
          </div>
          <div class="form-group">
            <label for="contact-email">Email Address</label>
            <input type="email" id="contact-email" name="email" class="glass-input" required placeholder="e.g. john@domain.com">
          </div>
          <div class="form-group">
            <label for="contact-msg">Message</label>
            <textarea id="contact-msg" name="message" class="glass-input" rows="5" required placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px; padding:14px;">
            📨 Send Message
          </button>
        </form>
      </div>

      <div class="contact-info-panel" style="display:flex; flex-direction:column; gap:20px;">
        <div class="info-item" style="padding:24px; border-radius:12px; background:var(--glass-bg); border:1px solid var(--glass-border);">
          <span class="info-icon" style="font-size:24px; color:var(--primary-color);">📍</span>
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 18px; font-weight: 400; margin-bottom:4px;">Office Address</h4>
            <p style="color: var(--text-muted); font-family:var(--font-sans); font-size: 13px;">100 Stone Boulevard, Suite 400, Denver CO</p>
          </div>
        </div>
        <div class="info-item" style="padding:24px; border-radius:12px; background:var(--glass-bg); border:1px solid var(--glass-border);">
          <span class="info-icon" style="font-size:24px; color:var(--primary-color);">✉️</span>
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 18px; font-weight: 400; margin-bottom:4px;">Email Support</h4>
            <p style="color: var(--text-muted); font-family:var(--font-sans); font-size: 13px;">hello@homelyplatform.com</p>
          </div>
        </div>
        <div class="info-item" style="padding:24px; border-radius:12px; background:var(--glass-bg); border:1px solid var(--glass-border);">
          <span class="info-icon" style="font-size:24px; color:var(--primary-color);">📞</span>
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 18px; font-weight: 400; margin-bottom:4px;">Operations Center</h4>
            <p style="color: var(--text-muted); font-family:var(--font-sans); font-size: 13px;">+1 (555) 302-9800 (Mon-Fri, 9am - 5pm MST)</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Contact form submission
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const name = document.getElementById("contact-name").value;

    btn.disabled = true;
    btn.innerHTML = "⌛ Dispatched...";

    setTimeout(() => {
      toast.show(`Thank you, ${name}! Your query was dispatched successfully.`, "success");
      form.reset();
      btn.disabled = false;
      btn.innerHTML = "📨 Send Message";
    }, 1200);
  });
}

/**
 * 4. SIGN IN VIEW
 */
export function renderLoginView(container, navigateTo) {
  setActiveNavLink("login");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="auth-wrapper" style="display:flex; justify-content:center; align-items:center; min-height:70vh; margin-top:20px;">
      <div class="glass-panel auth-card" style="width:420px; padding:36px; border-radius:16px;">
        <div class="auth-header" style="text-align:center; margin-bottom:28px;">
          <h2 style="font-family:var(--font-serif); font-size:28px; font-weight:400; margin-bottom:8px;">Sign In to Portal</h2>
          <p style="font-family:var(--font-sans); font-size:13px; color:var(--text-muted);">Access your private property dashboard</p>
        </div>

        <form id="login-form">
          <div class="form-group">
            <label for="login-email">Registered Email</label>
            <input type="email" id="login-email" name="email" class="glass-input" required placeholder="e.g. sarah.j@gmail.com">
          </div>
          <div class="form-group">
            <label for="login-pw">Secure Password</label>
            <input type="password" id="login-pw" name="password" class="glass-input" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px; padding:12px;">
            🚪 Sign In
          </button>
        </form>

        <div style="text-align: center; margin-top: 24px; font-size: 13px; font-family:var(--font-sans);">
          <span style="color: var(--text-muted);">New landlord or resident?</span>
          <a href="#" id="auth-switch-signup" style="color: var(--primary-color); text-decoration:none; font-weight:600; margin-left:6px;">Create Account</a>
        </div>

        <!-- Testing presets helpers -->
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px dashed var(--glass-border); text-align: center;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight:700; letter-spacing:0.1em; color: var(--text-muted); display:block; margin-bottom:12px;">Fast-Access Simulation Accounts</span>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn btn-secondary preset-login-btn" data-email="marcus@sterlingprop.com" style="font-size: 12px; padding: 10px 12px; width: 100%;">
              🔑 Log In as Landlord (Marcus)
            </button>
            <button class="btn btn-secondary preset-login-btn" data-email="sarah.j@gmail.com" style="font-size: 12px; padding: 10px 12px; width: 100%;">
              🔑 Log In as Tenant (Sarah)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Switch
  document.getElementById("auth-switch-signup").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("signup");
  });

  // Bind Login form submit
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const ok = store.login(email, "password");

    if (ok) {
      toast.show("Authenticated successfully!", "success");
      navigateTo("dashboard");
    } else {
      toast.show("Invalid credentials. Try using one of the preset accounts below.", "error");
    }
  });

  // Bind Preset Quick Logins
  container.querySelectorAll(".preset-login-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email");
      store.login(email, "password");
      toast.show("Preset authenticated!", "success");
      navigateTo("dashboard");
    });
  });
}

/**
 * 5. SIGN UP VIEW
 */
export function renderSignupView(container, navigateTo) {
  setActiveNavLink("signup");
  document.body.className = "owner-mode";

  // Parse invite code parameters if present in URL hash
  const hashParts = window.location.hash.split("?");
  let prefillCode = "";
  if (hashParts[1]) {
    const params = new URLSearchParams(hashParts[1]);
    prefillCode = params.get("code") || "";
  }

  // Check if invitation details exist for prefilled code
  const activeInvite = prefillCode ? store.validateInvitationCode(prefillCode) : null;

  container.innerHTML = `
    <div class="auth-wrapper" style="display:flex; justify-content:center; align-items:center; min-height:70vh; margin-top:20px;">
      <div class="glass-panel auth-card" style="width:420px; padding:36px; border-radius:16px;">
        <div class="auth-header" style="text-align:center; margin-bottom:28px;">
          <h2 style="font-family:var(--font-serif); font-size:28px; font-weight:400; margin-bottom:8px;">Create Account</h2>
          <p style="font-family:var(--font-sans); font-size:13px; color:var(--text-muted);">Join the serene Homely property platform</p>
        </div>

        <form id="signup-form">
          <div class="form-group">
            <label for="signup-role">Account Type</label>
            <select id="signup-role" name="role" class="glass-input" ${activeInvite ? 'disabled' : ''}>
              <option value="owner" ${activeInvite ? '' : 'selected'}>Landlord / Owner</option>
              <option value="tenant" ${activeInvite ? 'selected' : ''}>Tenant / Resident</option>
            </select>
          </div>

          <!-- Hidden input if role is locked/disabled -->
          ${activeInvite ? `<input type="hidden" name="role" value="tenant">` : ''}

          <!-- Dynamic Invitation Code block -->
          <div id="invite-code-group" class="form-group" style="display: ${activeInvite || prefillCode ? 'block' : 'none'};">
            <label for="signup-code">Landlord Invitation Code</label>
            <input type="text" id="signup-code" name="inviteCode" class="glass-input" 
              placeholder="e.g. INV-123456" 
              value="${prefillCode}" 
              ${activeInvite ? 'readonly style="background:var(--glass-bg-accent);"' : ''}
            >
            ${activeInvite ? `<span style="font-size:10px; color:#10b981; font-weight:700; margin-top:4px; display:block;">✓ Verified invite for ${activeInvite.name}</span>` : ''}
          </div>

          <div class="form-group">
            <label for="signup-name">Full Name</label>
            <input type="text" id="signup-name" name="name" class="glass-input" required 
              placeholder="e.g. John Doe"
              value="${activeInvite ? activeInvite.name : ''}"
              ${activeInvite ? 'readonly style="background:var(--glass-bg-accent);"' : ''}
            >
          </div>
          <div class="form-group">
            <label for="signup-email">Email Address</label>
            <input type="email" id="signup-email" name="email" class="glass-input" required 
              placeholder="e.g. john@domain.com"
              value="${activeInvite ? activeInvite.email : ''}"
              ${activeInvite ? 'readonly style="background:var(--glass-bg-accent);"' : ''}
            >
          </div>

          <div class="form-group">
            <label for="signup-pw">Secure Password</label>
            <input type="password" id="signup-pw" name="password" class="glass-input" required placeholder="••••••••">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 15px; padding:12px;">
            ✨ Create Account
          </button>
        </form>

        <div style="text-align: center; margin-top: 24px; font-size: 13px; font-family:var(--font-sans);">
          <span style="color: var(--text-muted);">Already registered?</span>
          <a href="#" id="auth-switch-login" style="color: var(--primary-color); text-decoration:none; font-weight:600; margin-left:6px;">Sign In</a>
        </div>
      </div>
    </div>
  `;

  // Bind role toggler switch
  const roleSelect = document.getElementById("signup-role");
  const inviteGroup = document.getElementById("invite-code-group");
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");

  if (roleSelect && !activeInvite) {
    roleSelect.addEventListener("change", () => {
      if (roleSelect.value === "tenant") {
        inviteGroup.style.display = "block";
      } else {
        inviteGroup.style.display = "none";
        document.getElementById("signup-code").value = "";
      }
    });
  }

  // Bind Switch
  document.getElementById("auth-switch-login").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("login");
  });

  // Bind Signup Submit
  const form = document.getElementById("signup-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const role = form.querySelector("[name='role']").value;
    const name = nameInput.value;
    const email = emailInput.value;
    const password = document.getElementById("signup-pw").value;
    const inviteCode = document.getElementById("signup-code") ? document.getElementById("signup-code").value : "";

    try {
      const user = store.signup(name, email, password, role, inviteCode);
      toast.show(`Account registered successfully. Welcome, ${user.name}!`, "success");
      navigateTo("dashboard");
    } catch (err) {
      toast.show(err.message, "error");
    }
  });
}
