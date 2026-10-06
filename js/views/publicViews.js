/**
 * Homely - Public Website Views (Financial & Invitation Logic)
 * Renders Landing page, About Us, Contact Us, and Login/Signup forms.
 */

import { store } from "../store.js";
import { toast } from "../components.js";

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
 * 1. LANDING PAGE
 */
export function renderLandingView(container, navigateTo) {
  setActiveNavLink("home");
  document.body.className = "owner-mode";
  
  container.innerHTML = `
    <!-- Immersive Cover Hero (Alcove Architecture Style) -->
    <section class="hero-section" style="position:relative; width:100%; overflow:hidden; border-radius:20px; min-height:560px; display:flex; align-items:flex-end; background:linear-gradient(180deg, rgba(28,26,23,0.15) 0%, rgba(28,26,23,0.88) 100%), url('assets/property_modern.png') center/cover no-repeat; color:#ffffff; padding:72px 64px 64px 64px; margin-top:16px; margin-bottom:70px; box-shadow:var(--shadow-premium);">
      <div style="max-width:840px; position:relative; z-index:2;">
        <p style="font-family:var(--font-sans); font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:rgba(255,255,255,0.8); margin-bottom:18px;">
          Property & Tenancy Management
        </p>
        <h1 style="color:#ffffff; font-family:var(--font-serif); font-size:64px; font-weight:400; line-height:1.06; letter-spacing:-0.015em; margin-bottom:22px;">
          Direct, simple management for your properties.
        </h1>
        <p style="color:rgba(255,255,255,0.9); font-family:var(--font-sans); font-size:18px; line-height:1.65; margin-bottom:36px; font-weight:400; max-width:660px;">
          A calm, quiet platform for property owners and residents. Clear financial tracking, direct rent payments, and simple maintenance coordination.
        </p>
        <div class="cta-group" style="display:flex; gap:16px; align-items:center;">
          <button class="btn btn-primary" id="landing-cta-owner" style="padding:14px 32px; font-size:14px; font-weight:600; border-radius:30px; background:#ffffff; color:#1c1a17; border:none; letter-spacing:0.02em; cursor:pointer;">
            Landlord Portal
          </button>
          <button class="btn btn-secondary" id="landing-cta-tenant" style="padding:14px 32px; font-size:14px; font-weight:500; border-radius:30px; background:rgba(255,255,255,0.18); color:#ffffff; border:1px solid rgba(255,255,255,0.35); backdrop-filter:blur(12px); cursor:pointer;">
            Tenant Sign In
          </button>
        </div>
      </div>
    </section>

    <!-- Property Showcase Grid -->
    <div style="margin-bottom: 70px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; padding-bottom:16px; border-bottom:1px solid var(--glass-border);">
        <div>
          <p style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:6px;">PROPERTIES</p>
          <h2 style="font-size:32px; font-family:var(--font-serif); font-weight:400;">Featured Residences</h2>
        </div>
        <span style="font-size:13px; color:var(--text-muted); font-weight:400;">Direct occupancy and lease status</span>
      </div>

      <div class="properties-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:28px;">
        <div class="glass-card property-card" style="padding:0; overflow:hidden; border-radius:12px; border:1px solid var(--glass-border); background:var(--glass-bg);">
          <div style="height:260px; overflow:hidden; position:relative;">
            <img src="assets/property_apartment.png" alt="Sunset Heights" style="width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease;">
            <span style="position:absolute; top:16px; left:16px; background:rgba(28,26,23,0.75); color:#ffffff; font-size:11px; font-weight:500; padding:4px 12px; border-radius:20px; backdrop-filter:blur(8px);">3 Units</span>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:500; margin-bottom:6px;">Sunset Heights Apartments</h3>
            <p style="font-size:13px; color:var(--text-muted);">742 Evergreen Terrace, Springfield</p>
          </div>
        </div>

        <div class="glass-card property-card" style="padding:0; overflow:hidden; border-radius:12px; border:1px solid var(--glass-border); background:var(--glass-bg);">
          <div style="height:260px; overflow:hidden; position:relative;">
            <img src="assets/property_loft.png" alt="Oakwood Lofts" style="width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease;">
            <span style="position:absolute; top:16px; left:16px; background:rgba(28,26,23,0.75); color:#ffffff; font-size:11px; font-weight:500; padding:4px 12px; border-radius:20px; backdrop-filter:blur(8px);">2 Units</span>
          </div>
          <div style="padding:24px;">
            <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:500; margin-bottom:6px;">Oakwood Industrial Lofts</h3>
            <p style="font-size:13px; color:var(--text-muted);">1042 Industrial Pkwy, Sector 7G</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Architectural Feature Columns -->
    <section style="margin-bottom:70px;">
      <div style="margin-bottom:32px; padding-bottom:16px; border-bottom:1px solid var(--glass-border);">
        <p style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:6px;">CAPABILITIES</p>
        <h2 style="font-size:32px; font-family:var(--font-serif); font-weight:400;">Designed for Simplicity</h2>
      </div>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:28px;">
        <div class="glass-card" style="padding:32px; border-radius:12px; background:var(--glass-bg);">
          <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:500; margin-bottom:10px;">Clear Records</h3>
          <p style="font-size:13px; color:var(--text-muted); line-height:1.65;">Track monthly rent collections, split expenses, and review straightforward financial summaries without clutter.</p>
        </div>

        <div class="glass-card" style="padding:32px; border-radius:12px; background:var(--glass-bg);">
          <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:500; margin-bottom:10px;">Direct Payments</h3>
          <p style="font-size:13px; color:var(--text-muted); line-height:1.65;">Digital rent settlement for residents with transparent payment receipts and clear due dates.</p>
        </div>

        <div class="glass-card" style="padding:32px; border-radius:12px; background:var(--glass-bg);">
          <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:500; margin-bottom:10px;">Maintenance Coordination</h3>
          <p style="font-size:13px; color:var(--text-muted); line-height:1.65;">Log maintenance requests directly, compare contractor options, and keep residents informed at every step.</p>
        </div>
      </div>
    </section>

    <!-- Editorial Quote Banner -->
    <section style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:56px 40px; border-radius:16px; margin-bottom:70px; text-align:center;">
      <p style="font-family:var(--font-serif); font-size:24px; font-weight:400; color:var(--text-main); line-height:1.5; max-width:680px; margin:0 auto;">
        "Property management made direct, quiet, and transparent for both owners and tenants."
      </p>
    </section>
  `;

  // Bind CTA actions
  document.getElementById("landing-cta-owner").addEventListener("click", () => navigateTo("signup"));
  document.getElementById("landing-cta-tenant").addEventListener("click", () => navigateTo("login"));
}

/**
 * 2. ABOUT US PAGE
 */
export function renderAboutView(container) {
  setActiveNavLink("about");
  document.body.className = "owner-mode";

  container.innerHTML = `
    <div class="about-story" style="margin-top: 20px;">
      <div class="about-story-text">
        <span style="font-size: 11px; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">ABOUT HOMELY</span>
        <h2>Direct & Simple Management</h2>
        <p>Homely provides essential tools for landlords and tenants to handle lease agreements, rent payments, and repair requests without unnecessary complexity.</p>
        <p>Our focus is on clear communication, transparent financial records, and quick resolution of maintenance tickets.</p>
      </div>
      <img class="about-story-img" src="assets/property_modern.png" alt="Homely">
    </div>

    <!-- Values Grid -->
    <section style="margin-bottom: 60px;">
      <h2 style="font-size: 28px; margin-bottom: 30px; letter-spacing: -0.03em;">Principles</h2>
      <div class="grid-2">
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="font-family: var(--font-sans); margin-bottom: 8px; font-size: 18px; font-weight: 700;">Clear Information</h3>
          <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6;">We keep reports and ledgers simple so landlords and tenants always know where things stand.</p>
        </div>
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="font-family: var(--font-sans); margin-bottom: 8px; font-size: 18px; font-weight: 700;">Fast Communication</h3>
          <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6;">Direct messaging between landlords, tenants, and repair contractors ensures issues are resolved quickly.</p>
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
    <div style="max-width: 600px; margin: 20px auto 40px 0;">
      <span style="font-size: 11px; font-weight: 700; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">GET IN TOUCH</span>
      <h2 style="font-size: 36px; letter-spacing:-0.03em;">Contact Us</h2>
      <p style="color: var(--text-muted); margin-top: 10px; font-size: 15px;">Have questions or feedback? Send us a message below.</p>
    </div>

    <div class="contact-container">
      <div class="glass-panel" style="padding: 30px;">
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
            <textarea id="contact-msg" name="message" class="glass-input" rows="4" required placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            📨 Send Message
          </button>
        </form>
      </div>

      <div class="contact-info-panel">
        <div class="info-item">
          <span class="info-icon">📍</span>
          <div>
            <h4 style="font-family: var(--font-sans); font-size: 15px; font-weight: 700;">Office Address</h4>
            <p style="color: var(--text-muted); font-size: 13px;">100 Stone Boulevard, Suite 400, Denver CO</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">✉️</span>
          <div>
            <h4 style="font-family: var(--font-sans); font-size: 15px; font-weight: 700;">Email Support</h4>
            <p style="color: var(--text-muted); font-size: 13px;">hello@homelyplatform.com</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">📞</span>
          <div>
            <h4 style="font-family: var(--font-sans); font-size: 15px; font-weight: 700;">Operations Center</h4>
            <p style="color: var(--text-muted); font-size: 13px;">+1 (555) 302-9800 (Mon-Fri, 9am - 5pm MST)</p>
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
      btn.innerHTML = "📨 Submit Query";
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
    <div class="auth-wrapper">
      <div class="glass-panel auth-card">
        <div class="auth-header">
          <h2>Secure Login</h2>
          <p>Access your private operations dashboard</p>
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
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            🚪 Sign In
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px;">
          <span style="color: var(--text-muted);">New operator or tenant?</span>
          <a href="#" id="auth-switch-signup" style="color: var(--primary-color); text-decoration:none; font-weight:700;">Register Account</a>
        </div>

        <!-- Testing presets helpers -->
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px dashed var(--glass-border); text-align: center;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight:800; color: var(--text-muted); display:block; margin-bottom:12px;">Fast-Access Simulation Accounts</span>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn btn-secondary preset-login-btn" data-email="marcus@sterlingprop.com" style="font-size: 12px; padding: 8px 12px; width: 100%;">
              🔑 Log In as Landlord (Marcus)
            </button>
            <button class="btn btn-secondary preset-login-btn" data-email="sarah.j@gmail.com" style="font-size: 12px; padding: 8px 12px; width: 100%;">
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
 * 5. SIGN UP VIEW (With Invitation Code Enforced Validation & Prefill)
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
    <div class="auth-wrapper">
      <div class="glass-panel auth-card">
        <div class="auth-header">
          <h2>Register Account</h2>
          <p>Join the unified Homely platform</p>
        </div>

        <form id="signup-form">
          <div class="form-group">
            <label for="signup-role">Account Type</label>
            <select id="signup-role" name="role" class="glass-input" ${activeInvite ? 'disabled' : ''}>
              <option value="owner" ${activeInvite ? '' : 'selected'}>Landlord / Owner</option>
              <option value="tenant" ${activeInvite ? 'selected' : ''}>Tenant / Renter</option>
            </select>
          </div>

          <!-- Hidden input if role is locked/disabled -->
          ${activeInvite ? `<input type="hidden" name="role" value="tenant">` : ''}

          <!-- Dynamic Invitation Code block (Enforced for Tenant) -->
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

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 15px;">
            ✨ Create Account
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 13px;">
          <span style="color: var(--text-muted);">Already have an account?</span>
          <a href="#" id="auth-switch-login" style="color: var(--primary-color); text-decoration:none; font-weight:700;">Sign In</a>
        </div>
      </div>
    </div>
  `;

  // Bind role toggler switch (show/hide invite field dynamically)
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
