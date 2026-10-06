/**
 * Homely - Interactive Simulation Guide (Portugal & EU Adapted)
 * Renders a collapsible helper overlay to guide users through testing the app's property management workflows.
 */

import { store } from "./store.js";
import { toast } from "./components.js";

class SimulationGuide {
  constructor() {
    this.container = null;
    this.isCollapsed = localStorage.getItem("homely_guide_collapsed") === "true";
  }

  init() {
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

    const hasNewInvite = invitations.length > 0;
    const hasNewOnboardedTenant = users.some(u => u.role === "tenant" && u.onboardingStatus === "Completed");
    const hasPaidRent = payments.some(p => p.status === "Paid");
    const hasDispatched = requests.some(r => r.contractorId !== null);
    const hasChatted = requests.some(r => r.chat && r.chat.length > 1);
    const hasResolvedOCR = requests.some(r => r.status === "Resolved" || r.status === "Completed");
    const hasLeaped = payments.some(p => p.lateFeeApplied === true);
    const hasPostedUtility = payments.some(p => p.billingType === "Utility");
    const hasAcceptedBid = requests.some(r => r.status === "In Progress" && r.contractorId !== null);
    const hasVerifiedNIF = users.some(u => u.role === "tenant" && u.nif);

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
      hasVerifiedNIF
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
      document.getElementById("guide-expand-btn")?.addEventListener("click", () => this.toggleCollapse());
      return;
    }

    this.container.className = "simulation-guide-container expanded glass-panel";
    
    this.container.innerHTML = `
      <div class="guide-header">
        <h4 style="font-size:13px; font-weight:800; display:flex; align-items:center; gap:6px; color:#000;">
          <span>⚡</span> Live Demo Guide (Portugal & UE)
        </h4>
        <button class="guide-close-icon" id="guide-collapse-btn" title="Minimize Guide">&times;</button>
      </div>

      <div class="guide-description">
        Interactive workflow guide for Landlords & Residents (EU Standard: Euro €, NIF, IBAN, MB WAY).
      </div>

      <div class="guide-steps-list">
        <!-- STEP 1 -->
        <div class="guide-step ${progress.hasNewInvite ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasNewInvite ? '✓' : '1'}</div>
          <div class="step-details">
            <span class="step-title">Convidar Inquilino</span>
            <p class="step-desc">Gerar código de convite para fração vaga (como Senhorio).</p>
          </div>
        </div>

        <!-- STEP 2 -->
        <div class="guide-step ${progress.hasPaidRent ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasPaidRent ? '✓' : '2'}</div>
          <div class="step-details">
            <span class="step-title">Pagamento de Renda (MB WAY / IBAN)</span>
            <p class="step-desc">Liquidar renda em atraso via MB WAY ou Transferência SEPA.</p>
          </div>
        </div>

        <!-- STEP 3 -->
        <div class="guide-step ${progress.hasVerifiedNIF ? 'done' : ''}">
          <div class="step-checkbox">${progress.hasVerifiedNIF ? '✓' : '3'}</div>
          <div class="step-details">
            <span class="step-title">Verificação NIF & IRS</span>
            <p class="step-desc">Verificar dados fiscais e comprovativo de rendimentos NIF/IRS.</p>
          </div>
        </div>
      </div>

      <div class="guide-footer-info">
        <span>Perfil Ativo: <strong>${user.role === 'owner' ? 'Marcus (Senhorio)' : user.name.split(" ")[0] + ' (Inquilino)'}</strong></span>
      </div>
    `;

    document.getElementById("guide-collapse-btn")?.addEventListener("click", () => this.toggleCollapse());
  }
}

export const guide = new SimulationGuide();
