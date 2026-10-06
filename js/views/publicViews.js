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
 * 1. LANDING PAGE - One Big Continuous Page (Editorial Narrative Canvas)
 */
export function renderLandingView(container, navigateTo) {
  setActiveNavLink("home");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="continuous-canvas">
      
      <!-- 01 — THE OPENING (Hero) -->
      <section class="narrative-hero-moment">
        <span class="editorial-eyebrow">${t("hero_tag")}</span>
        <h1 class="editorial-headline-hero">${t("hero_headline")}</h1>
        <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:48px; flex-wrap:wrap; margin-bottom:64px;">
          <p class="editorial-body" style="max-width:580px; font-size:20px;">
            ${t("hero_subline")}
          </p>
          <div>
            <button class="btn btn-primary" id="hero-cta-primary" style="padding:16px 36px; font-size:15px;">
              ${t("hero_cta_primary")}
            </button>
          </div>
        </div>

        <div class="narrative-full-bleed-image" style="border-radius:12px; height:65vh;">
          <img src="assets/property_modern.png" alt="Homely Atmosphere">
        </div>
      </section>

      <!-- 02 — THE BIG IDEA -->
      <section class="narrative-statement-moment" style="text-align:center;">
        <span class="editorial-eyebrow" style="margin-bottom:24px;">${t("statement_eyebrow")}</span>
        <h2 class="editorial-headline-statement" style="max-width:960px; margin-left:auto; margin-right:auto; font-size:clamp(40px, 5.5vw, 76px);">
          "${t("statement_headline")}"
        </h2>
        <p class="editorial-body" style="max-width:700px; margin:32px auto 0 auto;">
          ${t("statement_desc")}
        </p>
      </section>

      <!-- 03 — THE HUMAN PROBLEM -->
      <section class="narrative-split-moment">
        <div>
          <span class="editorial-eyebrow">${t("problem_eyebrow")}</span>
          <h2 class="editorial-headline-statement">${t("problem_headline")}</h2>
          <p class="editorial-body">${t("problem_desc")}</p>
        </div>
        <div style="height:480px; overflow:hidden; border-radius:12px;">
          <img src="assets/property_apartment.png" alt="Property Management Complexity" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </section>

      <!-- 04 — THE HOMELY APPROACH (Sequence of Short Statements with Full Bleed Visuals) -->
      <div class="narrative-stone-band">
        <div style="max-width:1320px; margin:0 auto;">
          <span class="editorial-eyebrow">${t("approach_eyebrow")}</span>
          <h2 class="editorial-headline-statement" style="margin-bottom:80px;">${t("approach_headline")}</h2>

          <!-- Moment A: Less Administration -->
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:64px; align-items:center; margin-bottom:120px;">
            <div>
              <h3 style="font-family:var(--font-serif); font-size:36px; font-weight:400; margin-bottom:16px;">${t("approach_less_admin_title")}</h3>
              <p class="editorial-body">${t("approach_less_admin_desc")}</p>
            </div>
            <div style="height:380px; border-radius:12px; overflow:hidden;">
              <img src="assets/property_loft.png" alt="Less Administration" style="width:100%; height:100%; object-fit:cover;">
            </div>
          </div>

          <!-- Moment B: More Clarity -->
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:64px; align-items:center;">
            <div style="height:380px; border-radius:12px; overflow:hidden;">
              <img src="assets/property_modern.png" alt="More Clarity" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div>
              <h3 style="font-family:var(--font-serif); font-size:36px; font-weight:400; margin-bottom:16px;">${t("approach_more_clarity_title")}</h3>
              <p class="editorial-body">${t("approach_more_clarity_desc")}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 05 & 06 — THE PRODUCT & PRODUCT EXPERIENCES -->
      <section class="narrative-statement-moment" style="padding-top:160px; padding-bottom:80px;">
        <span class="editorial-eyebrow">${t("product_eyebrow")}</span>
        <h2 class="editorial-headline-statement" style="max-width:880px;">${t("product_headline")}</h2>
      </section>

      <!-- Financial Ledger Moment -->
      <section class="narrative-split-moment" style="padding-top:40px; padding-bottom:120px;">
        <div>
          <span class="editorial-eyebrow">${t("story1_eyebrow")}</span>
          <h3 style="font-family:var(--font-serif); font-size:42px; font-weight:400; margin-bottom:20px;">${t("story1_title")}</h3>
          <p class="editorial-body">${t("story1_desc")}</p>
        </div>
        <div style="height:440px; border-radius:12px; overflow:hidden;">
          <img src="assets/property_apartment.png" alt="Financial Ledger" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </section>

      <!-- Resident Payments Moment -->
      <section class="narrative-split-moment" style="padding-top:0; padding-bottom:120px;">
        <div style="height:440px; border-radius:12px; overflow:hidden;">
          <img src="assets/property_loft.png" alt="Resident Payments" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div>
          <span class="editorial-eyebrow">${t("story2_eyebrow")}</span>
          <h3 style="font-family:var(--font-serif); font-size:42px; font-weight:400; margin-bottom:20px;">${t("story2_title")}</h3>
          <p class="editorial-body">${t("story2_desc")}</p>
        </div>
      </section>

      <!-- Maintenance Board Moment -->
      <section class="narrative-hero-moment" style="padding-top:0; padding-bottom:160px;">
        <div style="margin-bottom:40px;">
          <span class="editorial-eyebrow">${t("story3_eyebrow")}</span>
          <h3 style="font-family:var(--font-serif); font-size:44px; font-weight:400; max-width:800px;">${t("story3_title")}</h3>
          <p class="editorial-body" style="max-width:680px; margin-top:16px;">${t("story3_desc")}</p>
        </div>
        <div style="height:55vh; min-height:400px; border-radius:12px; overflow:hidden;">
          <img src="assets/property_modern.png" alt="Maintenance Coordination" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </section>

      <!-- 07 — THE HUMAN BENEFIT -->
      <div class="narrative-stone-band" style="text-align:center;">
        <div style="max-width:960px; margin:0 auto;">
          <span class="editorial-eyebrow">${t("benefit_eyebrow")}</span>
          <h2 class="editorial-headline-statement" style="font-size:clamp(40px, 5.5vw, 72px); margin-bottom:28px;">
            ${t("benefit_headline")}
          </h2>
          <p class="editorial-body" style="max-width:680px; margin:0 auto;">
            ${t("benefit_desc")}
          </p>
        </div>
      </div>

      <!-- 08 — TRUST & PROOF -->
      <section class="narrative-statement-moment" style="text-align:center;">
        <span class="editorial-eyebrow">${t("proof_eyebrow")}</span>
        <blockquote style="font-family:var(--font-serif); font-size:clamp(28px, 3.5vw, 46px); font-weight:400; line-height:1.3; max-width:900px; margin:0 auto 36px auto;">
          ${t("proof_quote")}
        </blockquote>
        <p style="font-family:var(--font-sans); font-size:15px; font-weight:700;">${t("proof_author")}</p>
        <p style="font-family:var(--font-sans); font-size:13px; color:var(--text-muted); margin-bottom:64px;">${t("proof_role")}</p>

        <div style="display:flex; justify-content:center; gap:80px; flex-wrap:wrap; padding-top:40px; border-top:1px solid var(--glass-border); max-width:800px; margin:0 auto;">
          <div>
            <span style="font-family:var(--font-serif); font-size:48px; display:block;">${t("stat1_val")}</span>
            <span style="font-family:var(--font-sans); font-size:11px; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:var(--text-muted);">${t("stat1_lbl")}</span>
          </div>
          <div>
            <span style="font-family:var(--font-serif); font-size:48px; display:block;">${t("stat2_val")}</span>
            <span style="font-family:var(--font-sans); font-size:11px; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:var(--text-muted);">${t("stat2_lbl")}</span>
          </div>
          <div>
            <span style="font-family:var(--font-serif); font-size:48px; display:block;">${t("stat3_val")}</span>
            <span style="font-family:var(--font-sans); font-size:11px; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:var(--text-muted);">${t("stat3_lbl")}</span>
          </div>
        </div>
      </section>

      <!-- 09 — THE PEOPLE BEHIND HOMELY -->
      <section class="narrative-split-moment">
        <div>
          <span class="editorial-eyebrow">${t("human_eyebrow")}</span>
          <h2 class="editorial-headline-statement">${t("human_title")}</h2>
          <p class="editorial-body" style="margin-bottom:28px;">${t("human_desc")}</p>
          <a href="#/about" style="font-family:var(--font-sans); font-size:13px; font-weight:600; color:var(--text-main); text-decoration:underline; text-underline-offset:6px;">
            Learn more about our philosophy &rarr;
          </a>
        </div>
        <div style="height:440px; border-radius:12px; overflow:hidden;">
          <img src="assets/property_apartment.png" alt="Behind Homely" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </section>

      <!-- 10 — FINAL STATEMENT & CONCLUSION (Charcoal Climax Band) -->
      <div class="narrative-charcoal-band" style="text-align:center;">
        <div style="max-width:960px; margin:0 auto;">
          <h2 class="editorial-headline-statement" style="color:#ffffff; font-size:clamp(40px, 5.5vw, 68px); margin-bottom:28px;">
            ${t("cta_headline")}
          </h2>
          <p style="font-family:var(--font-sans); font-size:18px; color:rgba(255,255,255,0.75); margin-bottom:48px; max-width:600px; margin-left:auto; margin-right:auto;">
            ${t("cta_desc")}
          </p>
          <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap;">
            <button class="btn" id="final-cta-primary" style="background:#ffffff; color:#1c1a17; border:none; padding:16px 40px;">
              ${t("cta_btn_primary")}
            </button>
            <button class="btn" id="final-cta-secondary" style="background:transparent; color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:16px 40px;">
              ${t("cta_btn_secondary")}
            </button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Bind CTA actions
  document.getElementById("hero-cta-primary").addEventListener("click", () => navigateTo("signup"));
  document.getElementById("final-cta-primary").addEventListener("click", () => navigateTo("signup"));
  document.getElementById("final-cta-secondary").addEventListener("click", () => navigateTo("contact"));
}

/**
 * 2. ABOUT US VIEW
 */
export function renderAboutView(container) {
  setActiveNavLink("about");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="continuous-canvas">
      <section class="narrative-hero-moment">
        <span class="editorial-eyebrow">ABOUT HOMELY</span>
        <h1 class="editorial-headline-hero" style="max-width:960px;">Direct, Quiet & Human Management.</h1>
        <p class="editorial-body" style="max-width:720px; font-size:20px; margin-bottom:64px;">
          Homely provides essential, calm tools for property owners and residents to coordinate lease agreements, direct payments, and repair requests without operational chaos.
        </p>

        <div class="narrative-full-bleed-image" style="border-radius:12px; height:55vh;">
          <img src="assets/property_modern.png" alt="Homely Story">
        </div>
      </section>

      <section class="narrative-statement-moment" style="padding-top:40px;">
        <h2 class="editorial-headline-statement" style="max-width:840px;">"We keep information transparent so everyone has a single source of truth."</h2>
        <p class="editorial-body" style="max-width:680px; margin-top:28px;">
          Direct communication between landlords, tenants, and repair contractors ensures maintenance tickets are handled with care and speed.
        </p>
      </section>
    </div>
  `;
}

/**
 * 3. CONTACT US VIEW - Clean Underline Form Integrated directly into Canvas
 */
export function renderContactView(container) {
  setActiveNavLink("contact");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="continuous-canvas">
      <section class="narrative-hero-moment" style="padding-bottom:120px;">
        <span class="editorial-eyebrow">GET IN TOUCH</span>
        <h1 class="editorial-headline-hero" style="max-width:900px;">${t("contact_headline")}</h1>
        <p class="editorial-body" style="max-width:640px; margin-bottom:64px;">${t("contact_subline")}</p>

        <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:80px; align-items:start;">
          <form id="contact-form">
            <div style="margin-bottom:32px;">
              <label class="editorial-label" for="contact-name">Full Name</label>
              <input type="text" id="contact-name" name="name" class="editorial-input" required placeholder="e.g. John Doe">
            </div>
            <div style="margin-bottom:32px;">
              <label class="editorial-label" for="contact-email">Email Address</label>
              <input type="email" id="contact-email" name="email" class="editorial-input" required placeholder="e.g. john@domain.com">
            </div>
            <div style="margin-bottom:48px;">
              <label class="editorial-label" for="contact-msg">Message</label>
              <textarea id="contact-msg" name="message" class="editorial-input" rows="4" required placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="padding:16px 40px; width:100%;">
              📨 Send Message
            </button>
          </form>

          <div style="display:flex; flex-direction:column; gap:40px; padding-top:16px;">
            <div>
              <span class="editorial-label">Office Address</span>
              <p style="font-family:var(--font-serif); font-size:22px; color:var(--text-main);">100 Stone Boulevard, Suite 400</p>
              <p style="font-family:var(--font-sans); font-size:14px; color:var(--text-muted);">Denver, CO</p>
            </div>
            <div>
              <span class="editorial-label">Direct Support</span>
              <p style="font-family:var(--font-serif); font-size:22px; color:var(--text-main);">hello@homelyplatform.com</p>
            </div>
            <div>
              <span class="editorial-label">Operations</span>
              <p style="font-family:var(--font-serif); font-size:22px; color:var(--text-main);">+1 (555) 302-9800</p>
            </div>
          </div>
        </div>
      </section>
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
    <div style="max-width:440px; margin:100px auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:40px;">
        <span class="editorial-eyebrow">PORTAL ACCESS</span>
        <h2 style="font-family:var(--font-serif); font-size:36px; font-weight:400; margin-bottom:8px;">Sign In</h2>
        <p style="font-family:var(--font-sans); font-size:14px; color:var(--text-muted);">Access your private property workspace</p>
      </div>

      <form id="login-form">
        <div style="margin-bottom:28px;">
          <label class="editorial-label" for="login-email">Registered Email</label>
          <input type="email" id="login-email" name="email" class="editorial-input" required placeholder="e.g. sarah.j@gmail.com">
        </div>
        <div style="margin-bottom:36px;">
          <label class="editorial-label" for="login-pw">Secure Password</label>
          <input type="password" id="login-pw" name="password" class="editorial-input" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:14px;">
          🚪 Sign In
        </button>
      </form>

      <div style="text-align:center; margin-top:28px; font-size:13px; font-family:var(--font-sans);">
        <span style="color:var(--text-muted);">New operator or resident?</span>
        <a href="#" id="auth-switch-signup" style="color:var(--text-main); text-decoration:underline; font-weight:600; margin-left:6px;">Create Account</a>
      </div>

      <!-- Presets -->
      <div style="margin-top:40px; padding-top:24px; border-top:1px solid var(--glass-border); text-align:center;">
        <span style="font-size:10px; text-transform:uppercase; font-weight:700; letter-spacing:0.15em; color:var(--text-muted); display:block; margin-bottom:16px;">Simulation Fast Access</span>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn btn-secondary preset-login-btn" data-email="marcus@sterlingprop.com" style="font-size:12px; padding:10px; width:100%;">
            🔑 Landlord (Marcus)
          </button>
          <button class="btn btn-secondary preset-login-btn" data-email="sarah.j@gmail.com" style="font-size:12px; padding:10px; width:100%;">
            🔑 Tenant (Sarah)
          </button>
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
      toast.show("Invalid credentials. Try using preset accounts.", "error");
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

  const hashParts = window.location.hash.split("?");
  let prefillCode = "";
  if (hashParts[1]) {
    const params = new URLSearchParams(hashParts[1]);
    prefillCode = params.get("code") || "";
  }

  const activeInvite = prefillCode ? store.validateInvitationCode(prefillCode) : null;

  container.innerHTML = `
    <div style="max-width:440px; margin:100px auto; padding:0 24px;">
      <div style="text-align:center; margin-bottom:40px;">
        <span class="editorial-eyebrow">GET STARTED</span>
        <h2 style="font-family:var(--font-serif); font-size:36px; font-weight:400; margin-bottom:8px;">Create Account</h2>
        <p style="font-family:var(--font-sans); font-size:14px; color:var(--text-muted);">Join the Homely platform</p>
      </div>

      <form id="signup-form">
        <div style="margin-bottom:28px;">
          <label class="editorial-label" for="signup-role">Account Type</label>
          <select id="signup-role" name="role" class="editorial-input" ${activeInvite ? 'disabled' : ''}>
            <option value="owner" ${activeInvite ? '' : 'selected'}>Landlord / Owner</option>
            <option value="tenant" ${activeInvite ? 'selected' : ''}>Tenant / Resident</option>
          </select>
        </div>

        ${activeInvite ? `<input type="hidden" name="role" value="tenant">` : ''}

        <div id="invite-code-group" style="margin-bottom:28px; display:${activeInvite || prefillCode ? 'block' : 'none'};">
          <label class="editorial-label" for="signup-code">Invitation Code</label>
          <input type="text" id="signup-code" name="inviteCode" class="editorial-input" 
            placeholder="e.g. INV-123456" 
            value="${prefillCode}" 
            ${activeInvite ? 'readonly' : ''}
          >
          ${activeInvite ? `<span style="font-size:11px; color:#10b981; font-weight:600; margin-top:4px; display:block;">✓ Verified invite for ${activeInvite.name}</span>` : ''}
        </div>

        <div style="margin-bottom:28px;">
          <label class="editorial-label" for="signup-name">Full Name</label>
          <input type="text" id="signup-name" name="name" class="editorial-input" required 
            placeholder="e.g. John Doe"
            value="${activeInvite ? activeInvite.name : ''}"
            ${activeInvite ? 'readonly' : ''}
          >
        </div>

        <div style="margin-bottom:28px;">
          <label class="editorial-label" for="signup-email">Email Address</label>
          <input type="email" id="signup-email" name="email" class="editorial-input" required 
            placeholder="e.g. john@domain.com"
            value="${activeInvite ? activeInvite.email : ''}"
            ${activeInvite ? 'readonly' : ''}
          >
        </div>

        <div style="margin-bottom:36px;">
          <label class="editorial-label" for="signup-pw">Secure Password</label>
          <input type="password" id="signup-pw" name="password" class="editorial-input" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%; padding:14px;">
          ✨ Create Account
        </button>
      </form>

      <div style="text-align:center; margin-top:28px; font-size:13px; font-family:var(--font-sans);">
        <span style="color:var(--text-muted);">Already registered?</span>
        <a href="#" id="auth-switch-login" style="color:var(--text-main); text-decoration:underline; font-weight:600; margin-left:6px;">Sign In</a>
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
