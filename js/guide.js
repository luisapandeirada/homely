/**
 * Homely - Interactive Simulation Guide
 * Renders a collapsible helper overlay to guide users through testing the app's fintech and property management workflows.
 */

import { store } from "./store.js";
import { toast } from "./components.js";

class SimulationGuide {
  constructor() {
    this.container = null;
    this.isCollapsed = localStorage.getItem("homely_guide_collapsed") === "true";
  }

  init() {
    // Check if the user is logged in. If not, don't show the guide or show it collapsed.
    const user = store.getAuth();
    if (!user) {
      if (this.container) {
        this.container.style.display = "none";
      }
      return;
    }

    this.container = document.getElementById("simulation-guide-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "simulation-guide-container";
      this.container.className = "simulation-guide-container";
      document.body.appendChild(this.container);
    } else {
      this.container.style.display = "block";
    }

    this.render();
  }

  checkProgress() {
    const state = store.state;
    const invitations = state.invitations || [];
    const users = Object.values(state.users || {});
    const leases = state.leases || [];
    const payments = state.rentPayments || [];
    const requests = state.maintenanceRequests || [];

    // Check 1: Invite a new tenant
    // Has the landlord generated an invite other than the test one?
    const hasNewInvite = invitations.some(inv => inv.code !== "INV-TEST12");

    // Check 2: Sign up and sign lease
    // Has any tenant user finished onboarding (except default tenant_1, tenant_2, tenant_3)?
    const hasNewOnboardedTenant = users.some(u => 
      u.role === "tenant" && 
      u.onboardingStatus === "Completed" && 
      !["tenant_1", "tenant_2", "tenant_3"].includes(u.id)
    );

    // Check 3: Pay rent & splits
    // Has rent been paid (either invoice pay_1 cleared or any new tenant paid)?
    const hasPaidRent = payments.some(p => 
      p.status === "Paid" && 
      (p.id === "pay_1" || !["pay_2", "pay_3", "pay_4"].includes(p.id))
    );

    // Check 4: Dispatch Contractor
    // Has a contractor been assigned to req_1 or a new ticket?
    const hasDispatched = requests.some(r => 
      r.contractorId !== null && 
      r.id !== "req_2"
    );

    // Check 5: Dispatch chat message
    // Has there been any chat messages exchanged with the contractor in the work order?
    const hasChatted = requests.some(r => 
      r.contractorId !== null && 
      r.chat.some(msg => msg.senderId === r.contractorId)
    );

    // Check 6: OCR Receipt scan & Schedule E
    // Has any request (other than req_2) been resolved with a cost > 0 and tax category set?
    const hasResolvedOCR = requests.some(r => 
      r.status === "Resolved" && 
      r.cost > 0 && 
      r.taxCategory !== "" && 
      r.id !== "req_2"
    );

    // Check 7: Time Leap
    // Has any payment had late fees applied?
    const hasLeaped = payments.some(p => p.lateFeeApplied === true);

    // Check 8: Post Building Utility Bill
    const hasPostedUtility = payments.some(p => p.billingType === "Utility");

    // Check 9: Contractor Bids
    const hasAcceptedBid = requests.some(r => r.status === "In Progress" && r.bids && r.bids.length > 0 && r.contractorId !== null);

    // Check 10: Credit score booster
    const hasEnabledBooster = users.some(u => u.creditBoosterEnabled === true);

    return {
      hasNewInvite,
      hasNewOnboardedTenant,
      hasPaidRent,
      hasDispatched,
      hasChatted,
      hasResolvedOCR,
      hasLeaped,
      hasPostedUtility,
      hasAcceptedBid,
      hasEnabledBooster
    };
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem("homely_guide_collapsed", this.isCollapsed ? "true" : "false");
    this.render();
  }

  render() {
    if (!this.container) return;

    const progress = this.checkProgress();
    const user = store.getAuth();
    const invitations = store.getInvitations();
    const pendingInvite = invitations.find(inv => inv.status === "Pending");
    const activeTenantId = store.getLastActiveTenantId();

    if (this.isCollapsed) {
      this.container.className = "simulation-guide-container collapsed";
      this.container.innerHTML = `
        <button class="guide-toggle-btn" id="guide-expand-btn">
          ⚡ Homely Live Tour Guide
        </button>
      `;
      document.getElementById("guide-expand-btn").addEventListener("click", () => this.toggleCollapse());
      return;
    }

    this.container.className = "simulation-guide-container expanded glass-panel";
    
    this.container.innerHTML = `
      <div class="guide-header">
        <h4 style="font-size:13px; font-weight:800; display:flex; align-items:center; gap:6px; color:#000;">
          <span>⚡</span> Live Demo Guide
        </h4>
        <button class="guide-close-icon" id="guide-collapse-btn" title="Minimize Guide">&times;</button>
      </div>

      <p class="guide-description">
        Follow these steps to experience the complete fintech & landlord SaaS simulation:
      </p>

      <div class="guide-steps-list">
        <!-- STEP 1 -->
        <div class="guide-step ${progress.hasNewInvite ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasNewInvite ? '✓' : '1'}</div>
          <div class="step-details">
            <span class="step-title">Invite a New Tenant</span>
            <p class="step-desc">Generate a draft lease & invite code as Landlord.</p>
            ${!progress.hasNewInvite ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-leases">
                Go to Landlord Leases ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 2 -->
        <div class="guide-step ${progress.hasNewOnboardedTenant ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasNewOnboardedTenant ? '✓' : '2'}</div>
          <div class="step-details">
            <span class="step-title">Onboard & Sign Lease</span>
            <p class="step-desc">Register with code and sign lease agreement using cursor canvas.</p>
            ${!progress.hasNewOnboardedTenant ? `
              <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px; width:100%;">
                ${pendingInvite ? `
                  <div class="invite-badge-helper" style="font-size:10px; background:var(--glass-bg-accent); padding:4px 8px; border-radius:4px; border:1.5px dashed var(--glass-border); line-height:1.3;">
                    Code: <strong style="font-family:monospace; color:var(--primary-color);">${pendingInvite.code}</strong>
                    <button class="guide-link-btn" id="copy-invite-link-btn" data-url="#/signup?code=${pendingInvite.code}" style="display:block; margin-top:2px; font-size:9px; color:#635bff; background:none; border:none; padding:0; cursor:pointer; font-weight:700;">Copy Signup Link</button>
                  </div>
                ` : '<span style="font-size:9px; color:var(--text-muted); font-style:italic;">Create an invite code in Step 1 first.</span>'}
                <button class="btn btn-secondary guide-action-btn" data-action="register-tenant" ${!pendingInvite ? 'disabled' : ''}>
                  Go to Signup Page ➔
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- STEP 3 -->
        <div class="guide-step ${progress.hasPaidRent ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasPaidRent ? '✓' : '3'}</div>
          <div class="step-details">
            <span class="step-title">Rent Checkout & Stripe Splits</span>
            <p class="step-desc">Settle the pending invoice and view the Stripe split flowchart.</p>
            ${!progress.hasPaidRent ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-tenant-dashboard">
                Go to Tenant Dashboard ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 4 -->
        <div class="guide-step ${progress.hasDispatched ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasDispatched ? '✓' : '4'}</div>
          <div class="step-details">
            <span class="step-title">Dispatch Work Order</span>
            <p class="step-desc">File a repair order (as Tenant) and dispatch a contractor (as Landlord).</p>
            ${!progress.hasDispatched ? `
              <div style="display:flex; gap:6px; margin-top:6px;">
                <button class="btn btn-secondary guide-action-btn" data-action="go-tenant-dashboard" style="font-size:10px; padding:4px 8px; flex:1;">Tenant Console</button>
                <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-kanban" style="font-size:10px; padding:4px 8px; flex:1;">Landlord Kanban</button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- STEP 5 -->
        <div class="guide-step ${progress.hasChatted ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasChatted ? '✓' : '5'}</div>
          <div class="step-details">
            <span class="step-title">Contractor Chat Dispatch</span>
            <p class="step-desc">Send messages on the Kanban ticket and see contractor responses.</p>
            ${!progress.hasChatted ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-kanban">
                Go to Kanban Chat ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 6 -->
        <div class="guide-step ${progress.hasResolvedOCR ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasResolvedOCR ? '✓' : '6'}</div>
          <div class="step-details">
            <span class="step-title">OCR Invoice & Tax Assistant</span>
            <p class="step-desc">Scan maintenance receipts via OCR and view IRS Schedule E deductions.</p>
            ${!progress.hasResolvedOCR ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-kanban">
                Scan Receipt in Kanban ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 7 -->
        <div class="guide-step ${progress.hasLeaped ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasLeaped ? '✓' : '7'}</div>
          <div class="step-details">
            <span class="step-title">Simulate Late Fee Leap</span>
            <p class="step-desc">Perform a Time Leap to test automated late fee calculations.</p>
            ${!progress.hasLeaped ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-ledger">
                Go to Ledger Operations ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 8 -->
        <div class="guide-step ${progress.hasPostedUtility ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasPostedUtility ? '✓' : '8'}</div>
          <div class="step-details">
            <span class="step-title">Split Building Utility Bills</span>
            <p class="step-desc">Post a master utility invoice (as Landlord) and auto-split charges with tenants.</p>
            ${!progress.hasPostedUtility ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-ledger">
                Post Utility Bill ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 9 -->
        <div class="guide-step ${progress.hasAcceptedBid ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasAcceptedBid ? '✓' : '9'}</div>
          <div class="step-details">
            <span class="step-title">Contractor Bidding matrix</span>
            <p class="step-desc">Request quotes from all trades and accept the best bid (as Landlord).</p>
            ${!progress.hasAcceptedBid ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-landlord-kanban">
                Compare Bids ➔
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STEP 10 -->
        <div class="guide-step ${progress.hasEnabledBooster ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasEnabledBooster ? '✓' : '10'}</div>
          <div class="step-details">
            <span class="step-title">Credit Score Booster Toggle</span>
            <p class="step-desc">Enable credit score reporting (as Tenant) and boost score via on-time rent payment.</p>
            ${!progress.hasEnabledBooster ? `
              <button class="btn btn-secondary guide-action-btn" data-action="go-tenant-dashboard">
                Toggle Booster ➔
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="guide-footer-info">
        <span>Current Profile: <strong>${user.role === 'owner' ? 'Marcus (Landlord)' : user.name.split(" ")[0] + ' (Tenant)'}</strong></span>
      </div>
    `;

    // Bind Collapse Button
    document.getElementById("guide-collapse-btn").addEventListener("click", () => this.toggleCollapse());

    // Bind Copy Invite Link Button
    const copyLinkBtn = document.getElementById("copy-invite-link-btn");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const relativeUrl = copyLinkBtn.getAttribute("data-url");
        const fullUrl = `${window.location.origin}${window.location.pathname}${relativeUrl}`;
        
        navigator.clipboard.writeText(fullUrl).then(() => {
          toast.show("Invite signup URL copied to clipboard!", "success");
        }).catch(err => {
          toast.show("Invite link: " + fullUrl, "info");
        });
      });
    }

    // Bind actions
    this.container.querySelectorAll(".guide-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        this.executeAction(action);
      });
    });
  }

  executeAction(action) {
    if (action === "go-landlord-leases") {
      store.switchUser("owner_1");
      sessionStorage.setItem("owner_active_tab", "leases");
      window.location.hash = "#/dashboard";
      toast.show("Switched to Landlord Marcus Sterling • Asset Leases", "success");
    } 
    else if (action === "register-tenant") {
      store.logout();
      const invitations = store.getInvitations();
      const pendingInvite = invitations.find(inv => inv.status === "Pending");
      if (pendingInvite) {
        window.location.hash = `#/signup?code=${pendingInvite.code}`;
        toast.show("Switched to Tenant registration.", "info");
      } else {
        window.location.hash = `#/signup`;
      }
    } 
    else if (action === "go-tenant-dashboard") {
      const tenantId = store.getLastActiveTenantId();
      if (tenantId) {
        store.switchUser(tenantId);
        sessionStorage.setItem("tenant_active_tab", "dashboard");
        window.location.hash = "#/dashboard";
        const tUser = store.getUsers()[tenantId];
        toast.show(`Switched to Tenant ${tUser.name.split(" ")[0]} Dashboard`, "success");
      } else {
        toast.show("Please create and onboard a tenant first.", "warning");
      }
    } 
    else if (action === "go-landlord-kanban") {
      store.switchUser("owner_1");
      sessionStorage.setItem("owner_active_tab", "maintenance");
      window.location.hash = "#/dashboard";
      toast.show("Switched to Landlord Marcus Sterling • Logistics Kanban", "success");
    } 
    else if (action === "go-landlord-ledger") {
      store.switchUser("owner_1");
      sessionStorage.setItem("owner_active_tab", "financials");
      window.location.hash = "#/dashboard";
      toast.show("Switched to Landlord Marcus Sterling • Ledger Operations", "success");
    }
  }
}

export const guide = new SimulationGuide();
