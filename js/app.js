/**
 * Homely - Main Application Router & Coordinator
 * Directs navigation based on URL hashes, updates nav bars, and syncs session state.
 */

import { store } from "./store.js";
import { renderLandingView, renderAboutView, renderContactView, renderLoginView, renderSignupView } from "./views/publicViews.js";
import { renderOwnerView } from "./views/ownerView.js";
import { renderTenantView } from "./views/tenantView.js";
import { toast } from "./components.js";
import { guide } from "./guide.js";
import { getLang, setLang, t } from "./i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  const navbarMount = document.getElementById("global-navbar");

  // Theme Controller
  let currentTheme = localStorage.getItem("homely_theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  const navigateTo = (routeId) => {
    window.location.hash = `#/${routeId}`;
  };

  const router = () => {
    const hash = window.location.hash || "#/";
    const user = store.getAuth();
    
    // Smooth transition fade out
    appContainer.style.opacity = "0.2";
    appContainer.style.transform = "translateY(5px)";
    appContainer.style.transition = "opacity 0.2s ease, transform 0.2s ease";

    setTimeout(() => {
      // Render Navbar (which contains the Notification Bell & Language Selector)
      renderNavbar(navbarMount, user, navigateTo, currentTheme, toggleTheme, router);

      if (hash === "#/" || hash === "#/home" || hash === "") {
        renderLandingView(appContainer, navigateTo);
      } else if (hash === "#/about") {
        renderAboutView(appContainer);
      } else if (hash === "#/contact") {
        renderContactView(appContainer);
      } else if (hash.startsWith("#/login")) {
        if (user) {
          window.location.hash = "#/dashboard";
        } else {
          renderLoginView(appContainer, navigateTo);
        }
      } else if (hash.startsWith("#/signup")) {
        if (user) {
          window.location.hash = "#/dashboard";
        } else {
          renderSignupView(appContainer, navigateTo);
        }
      } else if (hash.startsWith("#/dashboard")) {
        if (!user) {
          window.location.hash = "#/login";
        } else {
          document.body.className = `${user.role}-mode`;
          if (user.role === "owner") {
            renderOwnerView(appContainer);
          } else {
            renderTenantView(appContainer);
          }
        }
      } else {
        renderLandingView(appContainer, navigateTo);
      }

      appContainer.style.opacity = "1";
      appContainer.style.transform = "translateY(0)";
      
      // Initialize/Update Simulation Guide Overlay
      guide.init();
    }, 180);
  };

  const toggleTheme = () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("homely_theme", currentTheme);
    toast.show(`Theme updated to ${currentTheme} mode`, "info");
    router();
  };

  window.addEventListener("hashchange", router);
  store.subscribe(() => {
    router();
  });

  router();
});

/**
 * Dynamically renders the global navigation bar (including Notifications Bell & Lang Switcher)
 */
function renderNavbar(mountElement, user, navigateTo, theme, onThemeToggle, onLanguageChange) {
  if (!mountElement) return;

  const hash = window.location.hash || "#/";
  const lang = getLang();

  const langHTML = `
    <div class="lang-switch" style="display:inline-flex; align-items:center; background:var(--glass-bg-accent); border:1px solid var(--glass-border); border-radius:20px; padding:2px; font-size:11px; font-weight:600; font-family:var(--font-sans);">
      <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" style="padding:3px 8px; border-radius:14px; border:none; background:${lang === 'en' ? 'var(--glass-bg)' : 'transparent'}; color:var(--text-main); cursor:pointer; box-shadow:${lang === 'en' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'};">🇬🇧 EN</button>
      <button class="lang-btn ${lang === 'pt' ? 'active' : ''}" data-lang="pt" style="padding:3px 8px; border-radius:14px; border:none; background:${lang === 'pt' ? 'var(--glass-bg)' : 'transparent'}; color:var(--text-main); cursor:pointer; box-shadow:${lang === 'pt' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'};">🇵🇹 PT</button>
    </div>
  `;

  // RENDER LOGGED OUT NAVBAR
  if (!user) {
    mountElement.innerHTML = `
      <a href="#/" class="brand">
        <span>Homely</span><span class="brand-dot"></span>
      </a>

      <div class="nav-links">
        <a href="#/" class="nav-link ${hash === '#/' ? 'active' : ''}" data-route="home">${t("nav_home")}</a>
        <a href="#/about" class="nav-link ${hash === '#/about' ? 'active' : ''}" data-route="about">${t("nav_about")}</a>
        <a href="#/contact" class="nav-link ${hash === '#/contact' ? 'active' : ''}" data-route="contact">${t("nav_contact")}</a>
      </div>

      <div class="nav-actions">
        ${langHTML}
        <button class="theme-toggle-btn btn-circle" id="nav-theme-btn" style="border:none; background:transparent; font-size:16px; cursor:pointer;">
          ${theme === "dark" ? "☀️" : "🌙"}
        </button>
        <a href="#/login" class="btn btn-secondary" style="padding: 7px 18px; font-size:13px; border-radius:30px; font-weight:500;">${t("nav_signin")}</a>
        <a href="#/signup" class="btn btn-primary" style="padding: 7px 18px; font-size:13px; border-radius:30px; font-weight:600;">${t("nav_signup")}</a>
      </div>
    `;
    
    document.getElementById("nav-theme-btn").addEventListener("click", onThemeToggle);
  } 
  // RENDER LOGGED IN DASHBOARD NAVBAR
  else {
    const alerts = store.getNotifications();
    const unreadAlerts = alerts.filter(n => !n.read);
    const unreadCount = unreadAlerts.length;

    mountElement.innerHTML = `
      <a href="#/" class="brand">
        <span>Homely</span><span class="brand-dot"></span>
      </a>

      <!-- Center Nav Links & Role Swapper -->
      <div style="display:flex; align-items:center; gap:24px;">
        <a href="#/" class="nav-link ${hash === '#/' ? 'active' : ''}" style="font-size:13px;">${t("nav_home")}</a>
        <a href="#/dashboard" class="nav-link ${hash.startsWith('#/dashboard') ? 'active' : ''}" style="font-size:13px;">${t("nav_dashboard")}</a>
        
        <div class="role-switch-container" style="margin-left:8px;">
          <div class="role-tab ${user.role === 'owner' ? 'active' : ''}" id="nav-tab-owner" style="font-size:12px; font-weight:600;">${t("nav_landlord")}</div>
          <div class="role-tab ${user.role === 'tenant' ? 'active' : ''}" id="nav-tab-tenant" style="font-size:12px; font-weight:600;">${t("nav_tenant")}</div>
          <div class="role-slider"></div>
        </div>
      </div>

      <div class="nav-actions">
        ${langHTML}
        <!-- Interactive Notification Bell popover -->
        <div style="position:relative;" id="nav-notifications-container">
          <button class="theme-toggle-btn btn-circle" id="nav-notifications-btn" title="Activity Logs" style="border:none; background:transparent; font-size:15px; cursor:pointer;">
            🔔
            ${unreadCount > 0 ? `<span class="pulse-notification-dot" style="position:absolute; top:-1px; right:-1px; background:#c86d51; width:7px; height:7px; border-radius:50%; border:1.5px solid var(--glass-bg);"></span>` : ''}
          </button>
          
          <!-- Popover card -->
          <div id="nav-notifications-popover" class="glass-panel" style="display:none; position:absolute; right:0; top:44px; width:320px; max-height:400px; overflow-y:auto; z-index:300; padding:16px; font-family:var(--font-sans);">
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:10px; border-bottom:1px solid var(--glass-border); margin-bottom:12px;">
              <span style="font-size:11px; font-weight:700; color:var(--text-main); text-transform:uppercase; letter-spacing:0.08em;">${t("nav_activity_logs")}</span>
              ${unreadCount > 0 ? `<span style="font-size:10px; background:rgba(200,109,81,0.12); color:var(--primary-color); font-weight:600; padding:2px 8px; border-radius:12px;">${unreadCount} New</span>` : ''}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;" id="nav-notifications-list-mount">
              ${renderNotificationsList(alerts)}
            </div>
          </div>
        </div>

        <button class="theme-toggle-btn btn-circle" id="nav-theme-btn" style="border:none; background:transparent; font-size:15px; cursor:pointer;">
          ${theme === "dark" ? "☀️" : "🌙"}
        </button>
        
        <!-- User avatar badge -->
        <div class="nav-user-panel" style="background:var(--glass-bg-accent); padding:4px 10px 4px 6px; border-radius:20px; border:1px solid var(--glass-border);">
          <img src="${user.avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
          <span class="nav-username" style="font-size:12px; font-weight:600; color:var(--text-main);">${user.name.split(" ")[0]}</span>
        </div>

        <button class="btn btn-secondary" id="nav-logout-btn" style="padding:6px 14px; font-size:12px; border-radius:20px; font-weight:500;">
          ${t("nav_logout")}
        </button>
      </div>
    `;

    // Bind language switcher buttons
    mountElement.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedLang = btn.getAttribute("data-lang");
        if (selectedLang === getLang()) return;
        setLang(selectedLang);
        toast.show(selectedLang === "pt" ? "Idioma alterado para Português (PT)" : "Language set to English", "info");
        if (onLanguageChange) onLanguageChange();
      });
    });

    // Bind Swapper
    const oTab = document.getElementById("nav-tab-owner");
    const tTab = document.getElementById("nav-tab-tenant");

    oTab.addEventListener("click", () => {
      if (user.role === "owner") return;
      store.switchUser("owner_1");
      toast.show("Switched to Landlord Marcus Profile", "success");
      navigateTo("dashboard");
    });

    tTab.addEventListener("click", () => {
      if (user.role === "tenant") return;
      const lastTenantId = store.getLastActiveTenantId();
      if (!lastTenantId) {
        toast.show("No active tenants registered in portfolio.", "warning");
        return;
      }
      store.switchUser(lastTenantId);
      const tenantName = store.getUsers()[lastTenantId]?.name || "Tenant";
      toast.show(`Switched to Tenant ${tenantName.split(" ")[0]} Profile`, "success");
      navigateTo("dashboard");
    });

    // Bind Logout
    document.getElementById("nav-logout-btn").addEventListener("click", () => {
      store.logout();
      toast.show("Logged out successfully.", "info");
      window.location.hash = "#/";
    });

    // Bind Notifications popover toggler
    const bellBtn = document.getElementById("nav-notifications-btn");
    const popover = document.getElementById("nav-notifications-popover");

    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = popover.style.display === "block";
      
      // Close popover
      if (isVisible) {
        popover.style.display = "none";
      } 
      // Open popover, mark read
      else {
        popover.style.display = "block";
        store.markNotificationsRead();
        // Clear red dot count badge immediately without full route re-draw
        const badge = bellBtn.querySelector(".pulse-notification-dot");
        if (badge) badge.remove();
      }
    });

    // Close notifications panel when clicking outside
    document.addEventListener("click", (e) => {
      if (popover && !popover.contains(e.target) && e.target !== bellBtn) {
        popover.style.display = "none";
      }
    });

    document.getElementById("nav-theme-btn").addEventListener("click", onThemeToggle);
  }
}

function renderNotificationsList(alerts) {
  if (alerts.length === 0) {
    return `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">No system operations recorded.</div>`;
  }

  return alerts.map(n => {
    let emoji = "💡";
    if (n.type === "payment") emoji = "💰";
    if (n.type === "maintenance") emoji = "🔧";
    if (n.type === "invite") emoji = "✉️";
    if (n.type === "document") emoji = "📄";
    if (n.type === "property") emoji = "🏢";

    const relativeTime = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:10px; border-radius:6px; font-size:12px; display:flex; gap:10px; align-items:flex-start;">
        <span style="font-size:16px;">${emoji}</span>
        <div style="flex:1;">
          <p style="color:var(--text-main); font-weight:600; line-height:1.4;">${n.text}</p>
          <span style="color:var(--text-muted); font-size:10px; display:block; margin-top:4px;">${relativeTime}</span>
        </div>
      </div>
    `;
  }).join("");
}
