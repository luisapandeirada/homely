/**
 * Homely - Tenant View Controller (Expanded Feature Set)
 * Handles layout rendering for portfolio tenants.
 */

import { store } from "../store.js";
import { createDialog, toast, initSignaturePad, renderStripeSplitDiagram } from "../components.js";

export function renderTenantView(container) {
  const tenant = store.getCurrentUser();
  const properties = store.getProperties();
  const requests = store.getMaintenanceRequests();
  const payments = store.getRentPayments();
  const messages = store.getMessages();
  const documents = store.getDocuments();

  const prop = properties.find(p => p.id === tenant.propertyId);
  const unit = prop ? prop.units.find(u => u.id === tenant.unitId) : null;

  if (tenant.onboardingStatus === "Pending") {
    renderOnboardingWizard(container, tenant, prop, unit);
    return;
  }

  const tenantRequests = requests.filter(r => r.tenantId === tenant.id);
  const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
  const tenantDocs = documents.filter(d => d.userId === tenant.id);

  const activeInvoice = tenantPayments.find(p => p.status === "Pending" || p.status === "Overdue");

  let activeTab = sessionStorage.getItem("tenant_active_tab") || "dashboard";

  container.innerHTML = `
    <div class="dashboard-wrapper">
      <!-- Side Menu -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
          <span class="sidebar-icon">📈</span> Overview
        </div>
        <div class="sidebar-item ${activeTab === 'documents' ? 'active' : ''}" data-tab="documents">
          <span class="sidebar-icon">📄</span> Documents
        </div>
        <div class="sidebar-item ${activeTab === 'chat' ? 'active' : ''}" data-tab="chat">
          <span class="sidebar-icon">💬</span> Messages
        </div>
        
        <div class="sidebar-separator"></div>
        
        <div class="sidebar-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
          <span class="sidebar-icon">👤</span> My Profile
        </div>
      </aside>

      <!-- Main Panel Area -->
      <main class="dashboard-main" style="display: flex; flex-direction: column; gap: 24px; min-width: 0; flex: 1;">
        <!-- Alcove Tenant Welcome Banner -->
        <div class="dashboard-header" style="margin-bottom: 0; background: linear-gradient(135deg, rgba(28,26,23,0.95) 0%, rgba(91,112,101,0.85) 100%), url('assets/property_apartment.png') center/cover no-repeat; color:#ffffff; padding: 28px 32px; border-radius: 16px; box-shadow: var(--shadow-premium); display:flex; justify-content:space-between; align-items:center;">
          <div class="user-profile-header" style="display:flex; align-items:center; gap:16px;">
            <img class="user-avatar" src="${tenant.avatar}" alt="Tenant Profile" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.3);">
            <div class="welcome-text">
              <h2 style="color:#ffffff; font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:4px;">Hello, ${tenant.name.split(" ")[0]}</h2>
              <p style="color:rgba(255,255,255,0.8); font-size:13px;">Resident • ${prop ? prop.name : 'No active property'} (${unit ? unit.number : 'No Unit'})</p>
            </div>
          </div>
          <button class="btn btn-primary" id="file-request-btn" style="padding:10px 20px; font-size:13px; border-radius:30px; background:#ffffff; color:#1c1a17; border:none; font-weight:600;">
            + Request Repair
          </button>
        </div>

        <!-- Dynamic tab content container -->
        <div id="tenant-tab-content" class="view-section"></div>
      </main>
    </div>
  `;

  const tabContent = document.getElementById("tenant-tab-content");

  const renderTabContent = () => {
    sessionStorage.setItem("tenant_active_tab", activeTab);

    if (activeTab === "dashboard") {
      renderDashboardTab(tabContent, prop, unit, activeInvoice, tenantRequests, tenantPayments);
    } else if (activeTab === "documents") {
      renderDocumentsTab(tabContent, tenantDocs, tenant.id);
    } else if (activeTab === "chat") {
      renderChatTab(tabContent, messages, tenant.id);
    } else if (activeTab === "profile") {
      renderProfileTab(tabContent, tenant);
    }
  };

  // Wire up tabs
  container.querySelectorAll(".sidebar-item").forEach(tab => {
    tab.addEventListener("click", () => {
      container.querySelectorAll(".sidebar-item").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.getAttribute("data-tab");
      renderTabContent();
    });
  });

  // Log Service request wizard
  const fileRequestBtn = document.getElementById("file-request-btn");
  fileRequestBtn.addEventListener("click", () => {
    if (!prop || !unit) {
      toast.show("No active lease suite linked to this renter.", "error");
      return;
    }

    createDialog({
      title: "File Service Maintenance Log",
      contentHTML: `
        <div class="form-group">
          <label for="req-title">Issue Summary</label>
          <input type="text" id="req-title" name="title" class="glass-input" required placeholder="e.g. Dishwasher leaking under bottom panel">
        </div>
        <div class="form-group">
          <label for="req-desc">Issue Description</label>
          <textarea id="req-desc" name="description" class="glass-input" rows="3" required placeholder="Detail the issue coordinates..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="req-cat">Service Category</label>
            <select id="req-cat" name="category" class="glass-input">
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC / Utilities</option>
              <option value="Appliance">Appliances</option>
              <option value="Other">Other Service</option>
            </select>
          </div>
          <div class="form-group">
            <label for="req-pri">Urgency Dispatch</label>
            <select id="req-pri" name="priority" class="glass-input">
              <option value="Low">Low</option>
              <option value="Medium" selected>Medium</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:15px;">
          <label for="req-photo">Service Photo (Mock Attachment)</label>
          <select id="req-photo" name="attachment" class="glass-input">
            <option value="">No photo attachment</option>
            <option value="assets/property_apartment.png">AC Unit Rusty Vent</option>
            <option value="assets/property_loft.png">Leaking Pipe under Cabinets</option>
            <option value="assets/property_modern.png">Exposed Wire Wall Panel</option>
          </select>
        </div>
      `,
      submitLabel: "Settle Order",
      onSubmit: (data) => {
        store.addMaintenanceRequest({
          propertyId: prop.id,
          unitId: unit.id,
          tenantId: tenant.id,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          attachment: data.attachment || null
        });
        toast.show("Service order filed with operations center.", "success");
        // Re-render
        if (activeTab === "dashboard") {
          renderTabContent();
        } else {
          activeTab = "dashboard";
          container.querySelectorAll(".sidebar-item").forEach(t => {
            if (t.getAttribute("data-tab") === "dashboard") t.classList.add("active");
            else t.classList.remove("active");
          });
          renderTabContent();
        }
      }
    });
  });

  // Initial tab render
  renderTabContent();
}

function renderOnboardingWizard(container, tenant, prop, unit) {
  let step = 1; // 1: Screening, 2: E-Sign
  let screeningCompleted = false;

  const renderWizard = () => {
    container.innerHTML = `
      <div class="glass-panel" style="max-width: 600px; margin: 40px auto; padding: 30px; font-family: var(--font-sans);">
        <!-- Step Indicators -->
        <div style="display:flex; justify-content:space-between; margin-bottom:30px; border-bottom:1px solid var(--glass-border); padding-bottom:15px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:${step === 1 ? 'var(--primary-color)' : '#10b981'}; color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;">1</span>
            <span style="font-size:12px; font-weight:700; color:${step === 1 ? 'var(--text-main)' : 'var(--text-muted)'};">Background Screening</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:${step === 2 ? 'var(--primary-color)' : 'var(--glass-border)'}; color:${step === 2 ? '#fff' : 'var(--text-muted)'}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;">2</span>
            <span style="font-size:12px; font-weight:700; color:${step === 2 ? 'var(--text-main)' : 'var(--text-muted)'};">Lease Agreement E-Sign</span>
          </div>
        </div>

        <div id="wizard-content"></div>
      </div>
    `;

    const wizardContent = container.querySelector("#wizard-content");

    if (step === 1) {
      const screening = store.getScreenings().find(s => s.tenantId === tenant.id);
      if (screening || screeningCompleted) {
        const score = screening ? screening.creditScore : 740;
        wizardContent.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:40px; margin-bottom:10px;">🛡️</div>
            <h3 style="font-size:18px; font-weight:800; margin-bottom:6px;">TransUnion Screening Passed</h3>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">Your background screening report has been compiled and verified successfully.</p>
            
            <div style="display:flex; justify-content:center; gap:20px; margin-bottom:25px;">
              <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:15px; border-radius:6px; min-width:120px;">
                <span style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block;">Credit Score</span>
                <span style="font-size:24px; font-weight:800; color:#10b981; font-family:var(--font-sans);">${score}</span>
              </div>
              <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:15px; border-radius:6px; min-width:120px;">
                <span style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block;">Eviction Record</span>
                <span style="font-size:13px; font-weight:700; color:#10b981; display:block; margin-top:8px;">No records</span>
              </div>
              <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:15px; border-radius:6px; min-width:120px;">
                <span style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block;">Criminal Check</span>
                <span style="font-size:13px; font-weight:700; color:#10b981; display:block; margin-top:8px;">Passed</span>
              </div>
            </div>
            
            <button class="btn btn-primary" id="wizard-next-step-btn" style="width:100%;">
              Continue to Lease Signature &rarr;
            </button>
          </div>
        `;
        wizardContent.querySelector("#wizard-next-step-btn").addEventListener("click", () => {
          step = 2;
          renderWizard();
        });
      } else {
        wizardContent.innerHTML = `
          <div>
            <h3 style="font-size:18px; font-weight:800; margin-bottom:8px;">Background screening check</h3>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin-bottom:20px;">
              To comply with renting leasing policies for <strong>${prop ? prop.name : 'your landlord'}</strong>, we run a secure tenant credit score and background screening via TransUnion SmartMove.
            </p>
            <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:15px; border-radius:6px; margin-bottom:20px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>TransUnion SmartMove screening fee:</span>
                <strong>$30.00</strong>
              </div>
              <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:11px;">
                <span>Includes credit report, eviction checks, criminal registry scan.</span>
              </div>
            </div>
            <button class="btn btn-primary" id="run-screening-btn" style="width:100%; justify-content:center;">
              🛡️ Authorize & Run TransUnion screening
            </button>
          </div>
        `;

        wizardContent.querySelector("#run-screening-btn").addEventListener("click", () => {
          toast.show("Contacting TransUnion databases...", "info");
          const runBtn = wizardContent.querySelector("#run-screening-btn");
          runBtn.disabled = true;
          runBtn.innerText = "Connecting secure portal...";

          setTimeout(() => {
            store.runTenantScreening(tenant.id, 740);
            screeningCompleted = true;
            toast.show("Screening successfully passed & verified.", "success");
            renderWizard();
          }, 1500);
        });
      }
    } else if (step === 2) {
      const draftLease = store.getLeases().find(l => l.tenantId === tenant.id && l.status === "Draft");
      if (!draftLease) {
        wizardContent.innerHTML = `
          <div style="text-align:center;">
            <p style="font-size:13px; color:var(--text-muted);">No draft lease agreement was found for this suite. Please contact landlord Marcus Sterling to draft lease terms.</p>
          </div>
        `;
        return;
      }

      wizardContent.innerHTML = `
        <div>
          <h3 style="font-size:18px; font-weight:800; margin-bottom:8px;">Lease Covenants E-Signature</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Please review the covenants drafted by Marcus Sterling and draw your signature below.</p>
          
          <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:15px; border-radius:6px; max-height:160px; overflow-y:auto; font-size:12px; font-family:monospace; margin-bottom:20px; line-height:1.5;">
            <h4 style="text-align:center; font-weight:800; margin-bottom:8px;">LEASE AGREEMENT TERMS</h4>
            <p><strong>1. PREMISES:</strong> Suite ${unit ? unit.number : 'Unit'} at ${prop ? prop.name : 'Apartments'}.</p>
            <p><strong>2. BASE RENT YIELD:</strong> $${draftLease.rent.toLocaleString()} per calendar month, due on the 1st.</p>
            <p><strong>3. SECURITY DEPOSIT:</strong> $${draftLease.deposit.toLocaleString()} due at move-in.</p>
            <p><strong>4. CONTRACT TERM:</strong> ${draftLease.startDate} to ${draftLease.endDate}.</p>
            <p><strong>5. AUTOMATED FEES:</strong> ${draftLease.lateFeeRule}.</p>
            <p><strong>6. UTILITY SPLITS:</strong> ${draftLease.utilitySplit || 'Tenant pays 100% utilities'}.</p>
          </div>

          <form id="wizard-sign-form">
            <div class="form-group">
              <label>Draw Cursive Signature</label>
              <div style="position:relative; width:100%; background:#fff; border:1px solid var(--glass-border); border-radius:4px;">
                <canvas id="sign-canvas" width="540" height="120" style="width:100%; height:120px; display:block; cursor:crosshair;"></canvas>
                <button type="button" id="clear-sign-canvas" style="position:absolute; right:10px; bottom:10px; font-size:10px; background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:3px 8px; border-radius:3px; cursor:pointer;">Clear</button>
              </div>
            </div>
            <div class="form-group" style="margin-top:12px;">
              <label for="sign-name-text">Or Type Signature Name</label>
              <input type="text" id="sign-name-text" class="glass-input" required placeholder="Type your full name to sign" value="${tenant.name}">
            </div>
            
            <label style="display:flex; align-items:flex-start; gap:8px; font-size:12px; margin-top:15px; cursor:pointer;">
              <input type="checkbox" id="sign-certify" required style="accent-color:var(--primary-color); margin-top:3px;">
              <span>I certify that this is a legally binding signature of my name to this residential lease contract.</span>
            </label>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:20px; justify-content:center;">
              ✍️ Sign & Activate Lease Agreement
            </button>
          </form>
        </div>
      `;

      setTimeout(() => {
        const canvas = wizardContent.querySelector("#sign-canvas");
        const clearBtn = wizardContent.querySelector("#clear-sign-canvas");
        if (canvas) {
          initSignaturePad(canvas, clearBtn, () => {});
        }

        const signForm = wizardContent.querySelector("#wizard-sign-form");
        signForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const nameInput = document.getElementById("sign-name-text").value.trim();
          if (!nameInput) {
            toast.show("Please enter your name to sign.", "warning");
            return;
          }
          store.signLeaseAgreement(tenant.id, nameInput);
          toast.show("Lease executed successfully! Welcome to your new home.", "success");
        });
      }, 50);
    }
  };

  renderWizard();
}

/**
 * 1. DASHBOARD TAB
 */
function renderDashboardTab(targetElement, prop, unit, activeInvoice, tenantRequests, tenantPayments) {
  const tenant = store.getCurrentUser();
  targetElement.innerHTML = `
    <div class="grid-2">
      <!-- Left Column: Payment & Lease -->
      <div style="display:flex; flex-direction:column; gap:24px;">
        
        <!-- Rent Due Card -->
        <div class="tenant-payment-card">
          ${activeInvoice ? `
            <h3>Rent Due</h3>
            <p style="opacity:0.7; font-size:13px; margin-top:2px;">Payment due before ${activeInvoice.dueDate}.</p>
            <div class="rent-amount">$${activeInvoice.amount.toLocaleString()}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
              <span class="payment-status">${activeInvoice.status}</span>
              <button class="btn btn-primary pay-rent-btn" data-id="${activeInvoice.id}" style="background:#ffffff; color:#000000; border-radius:4px; font-weight:700;">
                💳 Pay Rent
              </button>
            </div>
          ` : `
            <h3>Dues Cleared</h3>
            <p style="opacity:0.7; font-size:13px; margin-top:2px;">All billing balances are fully settled.</p>
            <div class="rent-amount" style="font-size:32px;">$0.00 Outstanding</div>
            <div style="margin-top:15px;">
              <span class="payment-status" style="background:rgba(255,255,255,0.15);">Status: Verified</span>
            </div>
          `}
        </div>

        <!-- Lease Specifications -->
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom:12px; display:flex; justify-content:space-between; font-size:16px;">
            <span>Lease Overview</span>
            <span style="font-size:10px; color:var(--primary-color); font-weight:800; text-transform:uppercase; letter-spacing:0.05em; align-self:center;">ACTIVE LEASE</span>
          </h3>
          <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">
              <span style="color:var(--text-muted);">Current Base Rent</span>
              <strong>$${unit ? unit.rent.toLocaleString() : 'N/A'} / mo</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">
              <span style="color:var(--text-muted);">Contract Period</span>
              <strong>Jan 01, 2026 - Dec 31, 2026</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">
              <span style="color:var(--text-muted);">Security Deposit</span>
              <strong>$${unit ? (unit.rent * 1.5).toLocaleString() : 'N/A'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:4px;">
              <span style="color:var(--text-muted);">Landlord Agent</span>
              <strong>Marcus Sterling Real Estate</strong>
            </div>
          </div>
          </div>
        </div>

        <!-- Credit Score Booster Card -->
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom:12px; display:flex; justify-content:space-between; font-size:16px;">
            <span>Credit Score Booster</span>
            <span style="font-size:10px; color:#4f46e5; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; align-self:center;">Fintech reporting</span>
          </h3>
          <p style="font-size:11px; color:var(--text-muted); margin-bottom:15px;">Report your rent and utility payments directly to TransUnion bureaus to raise your credit score.</p>
          
          <div style="display:flex; align-items:center; justify-content:space-between; background:var(--glass-bg-accent); padding:12px; border-radius:6px; border:1px solid var(--glass-border); margin-bottom:15px;">
            <div>
              <span style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block;">Report to Bureaus</span>
              <strong id="credit-booster-status-lbl" style="font-size:12px; color:var(--text-main);">${tenant.creditBoosterEnabled ? 'ENABLED' : 'DISABLED'}</strong>
            </div>
            <label class="switch" style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
              <input type="checkbox" id="credit-booster-toggle" ${tenant.creditBoosterEnabled ? 'checked' : ''} style="opacity:0; width:0; height:0;">
              <span class="slider round" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:${tenant.creditBoosterEnabled ? 'var(--primary-color)' : 'var(--glass-border)'}; border-radius:34px; transition:0.4s; display:flex; align-items:center; padding: 2px;">
                <span style="display:block; width:18px; height:18px; border-radius:50%; background:#ffffff; transition:0.4s; transform:${tenant.creditBoosterEnabled ? 'translateX(20px)' : 'translateX(0)'}; box-shadow:0 1px 3px rgba(0,0,0,0.1);"></span>
              </span>
            </label>
          </div>
          
          <!-- Score Progress Bar -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">
              <span>Credit Score Progress</span>
              <strong style="color:var(--primary-color); font-size:11px;">${store.getScreenings().find(s => s.tenantId === tenant.id)?.creditScore || 740} / 850</strong>
            </div>
            <div style="width:100%; height:8px; background:var(--glass-bg-accent); border:1px solid var(--glass-border); border-radius:4px; overflow:hidden;">
              <div style="width:${((store.getScreenings().find(s => s.tenantId === tenant.id)?.creditScore || 740) - 300) / 5.5}%; height:100%; background:var(--primary-color); border-radius:4px; transition:width 0.4s;"></div>
            </div>
            <span style="font-size:9px; color:var(--text-muted); display:block; margin-top:6px; text-align:right;">Score scales from 300 to 850</span>
          </div>
        </div>

      </div>

      <!-- Right Column: Maintenance -->
      <div style="display:flex; flex-direction:column; gap:24px;">
        
        <!-- Maintenance list -->
        <div class="glass-panel" style="padding:24px;">
          <h3 style="margin-bottom:12px; font-size:16px;">Active Maintenance Logs</h3>
          <div style="display:flex; flex-direction:column; gap:10px; max-height:330px; overflow-y:auto; padding-right:5px;">
            ${tenantRequests.length === 0 ? `
              <div style="text-align:center; color:var(--text-muted); padding:30px; font-size:13px;">
                No service requests logged for this account.
              </div>
            ` : tenantRequests.map(r => {
              let statusClass = "vacant";
              if (r.status === "Resolved") statusClass = "occupied";
              
              return `
                <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:12px; border-radius:6px; display:flex; flex-direction:column; align-items:stretch; gap:6px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                      <h4 style="font-size:14px; font-weight:700; font-family:var(--font-sans);">${r.title}</h4>
                      <p style="font-size:12px; color:var(--text-muted); margin-top:2px; margin-bottom:0;">${r.description}</p>
                      ${r.attachment ? `
                        <div style="margin-top:6px; border: 1px solid var(--glass-border); border-radius:4px; overflow:hidden; width:80px; height:45px;">
                          <img src="${r.attachment}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                      ` : ''}
                      <div style="display:flex; gap:10px; font-size:10px; margin-top:6px; color:var(--text-muted);">
                        <span>Category: <strong>${r.category}</strong></span>
                        <span>Priority: <strong class="${r.priority === 'High' || r.priority === 'Emergency' ? 'text-danger' : ''}">${r.priority}</strong></span>
                      </div>
                    </div>
                    <span class="unit-pill ${statusClass}">${r.status}</span>
                  </div>

                  <!-- Contractor updates chat inside maintenance card -->
                  ${r.contractorId ? `
                    <div style="margin-top:10px; border-top:1px dashed var(--glass-border); padding-top:8px;">
                      <span style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:5px;">Contractor Updates & Chat</span>
                      <div class="contractor-chat-feed" style="max-height:80px; overflow-y:auto; display:flex; flex-direction:column; gap:4px; margin-bottom:6px; font-size:11px; background:#fff; border:1px solid var(--glass-border); padding:6px; border-radius:4px;">
                        ${r.chat.length === 0 ? `
                          <span style="color:var(--text-muted); font-style:italic;">No messages. Dispatch team active.</span>
                        ` : r.chat.map(m => {
                          const isMe = m.senderId === tenant.id;
                          const isLandlord = m.senderId === "owner_1";
                          const name = isMe ? "You" : (isLandlord ? "Marcus (Landlord)" : "Contractor");
                          return `
                            <div>
                              <strong>${name}:</strong> <span>${m.text}</span>
                            </div>
                          `;
                        }).join("")}
                      </div>
                      <div style="display:flex; gap:6px;">
                        <input type="text" class="glass-input tenant-contractor-chat-input" data-req-id="${r.id}" placeholder="Reply to contractor..." style="font-size:11px; padding:4px 8px; flex:1; height:26px;">
                        <button class="btn btn-secondary tenant-contractor-chat-send-btn" data-req-id="${r.id}" style="padding:4px 8px; font-size:11px; height:26px;">Send</button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join("")}
          </div>
        </div>

      </div>
    </div>

    <!-- Rent ledger table -->
    <h3 style="margin-top:30px; margin-bottom:12px; font-size:16px;">Billing Ledger History</h3>
    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Billing Item</th>
            <th>Due Date</th>
            <th>Settle Date</th>
            <th>Amount</th>
            <th>Receipt Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tenantPayments.map(p => {
            const isRent = (p.billingType || "Rent") === "Rent";
            const title = isRent ? `Rent Settlement (${new Date(p.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' })})` : `${p.description || 'Utility Bill'}`;
            const itemEmoji = isRent ? "🏠" : "💧";
            return `
              <tr>
                <td style="font-weight:700;">
                  <span style="margin-right:6px;">${itemEmoji}</span>${title}
                </td>
                <td style="font-family:var(--font-sans); font-weight:500;">${p.dueDate}</td>
                <td style="font-family:var(--font-sans); font-weight:500;">${p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '-'}</td>
                <td style="font-weight:700; font-family:var(--font-sans);">$${p.amount.toLocaleString()}</td>
                <td>
                  ${p.status === "Paid" ? `
                    <button class="btn btn-secondary print-receipt-btn" data-id="${p.id}" style="padding:4px 8px; font-size:11px; border-radius:4px;">
                      View Invoice
                    </button>
                  ` : `<span style="font-size:11px; color:var(--text-muted); font-weight:500;">Invoice Pending</span>`}
                </td>
                <td>
                  <span class="payment-status-badge ${p.status.toLowerCase()}">${p.status}</span>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bind Pay Rent Button
  const payRentBtn = targetElement.querySelector(".pay-rent-btn");
  if (payRentBtn) {
    payRentBtn.addEventListener("click", () => {
      const payId = payRentBtn.getAttribute("data-id");
      const paymentObj = tenantPayments.find(p => p.id === payId);
      if (!paymentObj) return;

      let selectedMethod = "Credit Card";

      const processPayment = (method) => {
        toast.show(`Connecting to ${method} merchant network...`, "info");
        
        setTimeout(() => {
          store.payRent(payId, method);
          toast.show(`Settlement cleared via ${method}. Receipt updated in history.`, "success");
          renderDashboardTab(targetElement, prop, unit, null, store.getMaintenanceRequests().filter(r => r.tenantId === store.getCurrentUser().id), store.getRentPayments().filter(p => p.tenantId === store.getCurrentUser().id));
        }, 1200);
      };

      const closeActiveDialog = () => {
        const activeDialog = document.querySelector("dialog[open]");
        if (activeDialog) {
          activeDialog.close();
          activeDialog.remove();
        }
      };

      createDialog({
        title: "Secure Settlement Gateway",
        contentHTML: `
          <div style="background:#000000; color:#ffffff; padding:18px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); margin-bottom:16px; font-family:'Inter';">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; font-size:12px; opacity:0.6;">
              <span>INVOICE DEBIT</span>
              <span>TXN PORTAL</span>
            </div>
            <div style="font-size:24px; font-weight:800; margin-bottom:4px; font-variant-numeric: tabular-nums;">$${paymentObj.amount.toLocaleString()}</div>
            <div style="font-size:11px; opacity:0.6;">Payee: Marcus Sterling Operations</div>
          </div>

          <!-- Stripe Connect Split Diagram Mount -->
          <div id="stripe-split-mount"></div>
          
          <!-- Checkout Tabs -->
          <div style="display:flex; border-bottom:1px solid var(--glass-border); margin-bottom:16px; gap:10px;">
            <div class="pay-tab active" data-method="Credit Card" style="padding:8px 12px; font-size:12px; font-weight:700; cursor:pointer; border-bottom:2px solid var(--primary-color);">Credit Card</div>
            <div class="pay-tab" data-method="Apple Pay" style="padding:8px 12px; font-size:12px; font-weight:700; cursor:pointer; border-bottom:2px solid transparent; color:var(--text-muted);">Apple Pay</div>
            <div class="pay-tab" data-method="PayPal" style="padding:8px 12px; font-size:12px; font-weight:700; cursor:pointer; border-bottom:2px solid transparent; color:var(--text-muted);">PayPal</div>
          </div>

          <!-- Credit Card Panel -->
          <div id="panel-credit-card" class="pay-panel">
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" name="holderName" id="cc-holder" class="glass-input" required value="${store.getCurrentUser().name}" placeholder="Name">
            </div>
            <div class="form-group">
              <label>Credit Card Number</label>
              <input type="text" name="cardNo" id="cc-number" class="glass-input" required maxlength="19" placeholder="4000 1234 5678 9010">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Code</label>
                <input type="text" name="expiry" id="cc-expiry" class="glass-input" required maxlength="5" placeholder="MM/YY">
              </div>
              <div class="form-group">
                <label>CVC Security</label>
                <input type="password" name="cvc" id="cc-cvc" class="glass-input" required maxlength="3" placeholder="•••">
              </div>
            </div>
          </div>

          <!-- Apple Pay Panel -->
          <div id="panel-apple-pay" class="pay-panel" style="display:none; padding:10px 0;">
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px; line-height:1.5;">
              Pay securely using Apple Pay with your linked Visa, Mastercard, or American Express cards stored in your Apple Wallet.
            </p>
            <div id="apple-pay-btn-click" style="background:#000000; color:#ffffff; border-radius:6px; padding:12px; font-weight:700; text-align:center; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; border:1px solid rgba(255,255,255,0.15);">
              <span style="font-size:18px;"></span> Pay with Apple Pay
            </div>
          </div>

          <!-- PayPal Panel -->
          <div id="panel-paypal" class="pay-panel" style="display:none; padding:10px 0;">
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px; line-height:1.5;">
              Log in to your PayPal account to complete the rent billing transfer instantly. Supports linked bank accounts and PayPal balances.
            </p>
            <div id="paypal-btn-click" style="background:#ffc439; color:#003087; border-radius:6px; padding:12px; font-weight:700; text-align:center; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
              <span style="font-weight:900; font-style:italic;">PayPal</span> Checkout
            </div>
          </div>
        `,
        submitLabel: `Settle $${paymentObj.amount.toLocaleString()}`,
        onSubmit: () => {
          processPayment("Credit Card");
        }
      });

      // Bind dynamic handlers inside dialog
      setTimeout(() => {
        const dialogDom = document.querySelector("dialog[open]");
        if (!dialogDom) return;

        const tabs = dialogDom.querySelectorAll(".pay-tab");
        const panels = dialogDom.querySelectorAll(".pay-panel");
        const ccInputs = dialogDom.querySelectorAll("#panel-credit-card input");
        const submitBtn = dialogDom.querySelector("button[type='submit']");

        // Render Stripe split diagram
        const stripeMount = dialogDom.querySelector("#stripe-split-mount");
        if (stripeMount) {
          renderStripeSplitDiagram(stripeMount, paymentObj.amount);
        }

        // Format Credit Card input
        const cInput = dialogDom.querySelector("#cc-number");
        if (cInput) {
          cInput.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            let formatted = v.match(/.{1,4}/g)?.join(" ") || "";
            e.target.value = formatted.substring(0, 19);
          });
        }

        tabs.forEach(tab => {
          tab.addEventListener("click", () => {
            tabs.forEach(t => {
              t.classList.remove("active");
              t.style.borderBottomColor = "transparent";
              t.style.color = "var(--text-muted)";
            });
            tab.classList.add("active");
            tab.style.borderBottomColor = "var(--primary-color)";
            tab.style.color = "var(--text-main)";

            selectedMethod = tab.getAttribute("data-method");

            panels.forEach(p => p.style.display = "none");
            if (selectedMethod === "Credit Card") {
              dialogDom.querySelector("#panel-credit-card").style.display = "block";
              ccInputs.forEach(input => input.setAttribute("required", "true"));
              if (submitBtn) submitBtn.style.display = "inline-flex";
            } else if (selectedMethod === "Apple Pay") {
              dialogDom.querySelector("#panel-apple-pay").style.display = "block";
              ccInputs.forEach(input => input.removeAttribute("required"));
              if (submitBtn) submitBtn.style.display = "none";
            } else if (selectedMethod === "PayPal") {
              dialogDom.querySelector("#panel-paypal").style.display = "block";
              ccInputs.forEach(input => input.removeAttribute("required"));
              if (submitBtn) submitBtn.style.display = "none";
            }
          });
        });

        const applePayBtn = dialogDom.querySelector("#apple-pay-btn-click");
        if (applePayBtn) {
          applePayBtn.addEventListener("click", () => {
            closeActiveDialog();
            processPayment("Apple Pay");
          });
        }

        const paypalBtn = dialogDom.querySelector("#paypal-btn-click");
        if (paypalBtn) {
          paypalBtn.addEventListener("click", () => {
            closeActiveDialog();
            processPayment("PayPal");
          });
        }
      }, 50);
    });
  }

  // Print/view invoice receipts
  targetElement.querySelectorAll(".print-receipt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const payId = btn.getAttribute("data-id");
      const paymentObj = tenantPayments.find(p => p.id === payId);
      if (!paymentObj) return;

      const dateStr = paymentObj.paidAt ? new Date(paymentObj.paidAt).toLocaleString() : new Date().toLocaleString();

      createDialog({
        title: "Cleared Transaction Ledger",
        contentHTML: `
          <div class="receipt-layout">
            <h2>HOMELY SETTLEMENT</h2>
            <div class="receipt-row">
              <span>LEDGER ID:</span>
              <strong>TXN-${payId.substring(4).toUpperCase()}</strong>
            </div>
            <div class="receipt-row">
              <span>SETTLE DATE:</span>
              <strong>${dateStr}</strong>
            </div>
            <div class="receipt-row" style="margin-bottom:12px;">
              <span>METHOD:</span>
              <strong>Merchant Settlement Gateway</strong>
            </div>
            
            <div style="border-top:1px solid #e5e7eb; border-bottom:1px solid #e5e7eb; padding: 10px 0; margin-bottom:12px;">
              <div class="receipt-row" style="font-weight:700;">
                <span>BILL PERIOD:</span>
                <span>${new Date(paymentObj.dueDate).toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
              </div>
              <div style="font-size:11px; color:#475467; margin-top:2px;">
                Asset: ${prop ? prop.name : ''}, ${unit ? unit.number : ''}
              </div>
            </div>

            <div class="receipt-row" style="font-size:15px; font-weight:800;">
              <span>SETTLED BALANCE:</span>
              <span>$${paymentObj.amount.toLocaleString()}</span>
            </div>
            <div style="text-align:center; font-size:10px; color:#667085; margin-top:20px;">
              APPROVED AUTOMATICALLY • HOMELY TECH CORP
            </div>
          </div>
        `,
        submitLabel: "Print Ledger Statement",
        onSubmit: () => {
          toast.show("Spooling invoice PDF statement...", "success");
        }
      });
    });
  });

  // Mock agreement doc
  const agreeMock = document.getElementById("view-agreement-mock");
  if (agreeMock) {
    agreeMock.addEventListener("click", (e) => {
      e.preventDefault();
      createDialog({
        title: "Residential Lease Agreement",
        contentHTML: `
          <div style="font-size:12px; line-height:1.5; max-height:260px; overflow-y:auto; background:var(--glass-bg-accent); padding:15px; border-radius:6px; border:1px solid var(--glass-border); font-family:monospace;">
            <h4 style="text-align:center; margin-bottom:8px; font-weight:700;">LEASE COVENANTS</h4>
            <p><strong>1. PARTIES:</strong> Marcus Sterling Real Estate Management and Sarah Jenkins (Tenant).</p>
            <p style="margin-top:6px;"><strong>2. PREMISES:</strong> Residential Suite Apt 101, 742 Evergreen Terrace.</p>
            <p style="margin-top:6px;"><strong>3. YIELD TERMS:</strong> $1,800.00 due on the first day of each calendar month. Late payments subject to penalty logs.</p>
            <p style="margin-top:6px;"><strong>4. MAINTENANCE:</strong> Management resolves structural, HVAC and plumbing requests filed via tenant portal logs.</p>
            <p style="margin-top:6px;"><strong>5. EXECUTED:</strong> Signed electronically Jan 01, 2026.</p>
          </div>
        `,
        submitLabel: "Settle Covenants",
        onSubmit: () => {}
      });
    });
  }

  // Bind Contractor Chat Sends inside maintenance cards
  const allSendBtns = targetElement.querySelectorAll(".tenant-contractor-chat-send-btn");
  allSendBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const reqId = btn.getAttribute("data-req-id");
      const input = targetElement.querySelector(`.tenant-contractor-chat-input[data-req-id="${reqId}"]`);
      const text = input.value.trim();
      if (!text) return;

      store.addContractorMessage(reqId, tenant.id, text);
      input.value = "";
      toast.show("Message sent to dispatch thread.", "success");
      
      renderDashboardTab(targetElement, prop, unit, activeInvoice, store.getMaintenanceRequests().filter(r => r.tenantId === tenant.id), store.getRentPayments().filter(p => p.tenantId === tenant.id));
      
      setTimeout(() => {
        const ticketObj = store.getMaintenanceRequests().find(r => r.id === reqId);
        if (ticketObj) {
          let replyText = "Understood. The team has received this message.";
          if (ticketObj.category === "Plumbing") {
            replyText = "We are on-site resolving this plumbers ticket now.";
          } else if (ticketObj.category === "HVAC") {
            replyText = "HVAC tech has updated the dispatch schedule based on your note.";
          }
          store.addContractorMessage(reqId, ticketObj.contractorId, replyText);
          toast.show("Contractor update received.", "info");
          
          renderDashboardTab(targetElement, prop, unit, activeInvoice, store.getMaintenanceRequests().filter(r => r.tenantId === tenant.id), store.getRentPayments().filter(p => p.tenantId === tenant.id));
        }
      }, 1500);
    });
  });

  const boosterToggle = targetElement.querySelector("#credit-booster-toggle");
  if (boosterToggle) {
    boosterToggle.addEventListener("change", (e) => {
      const enabled = e.target.checked;
      store.toggleCreditBooster(tenant.id, enabled);
      toast.show(`Credit score booster toggled ${enabled ? 'ENABLED' : 'DISABLED'}.`, "success");
      // Refresh the view
      renderDashboardTab(targetElement, prop, unit, activeInvoice, tenantRequests, tenantPayments);
    });
  }
}

/**
 * 2. DOCUMENTS TAB (Tenant upload vault)
 */
function renderDocumentsTab(targetElement, documents, tenantId) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h3 style="font-size:18px;">My Document Vault</h3>
      <button class="btn btn-secondary" id="upload-doc-btn" style="padding: 6px 12px; font-size:12px;">
        + Upload Document
      </button>
    </div>

    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Type</th>
            <th>Upload Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${documents.length === 0 ? `
            <tr>
              <td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">
                Your document vault is empty. Click Upload Document to register credentials.
              </td>
            </tr>
          ` : documents.map(doc => {
            let statusPill = "vacant"; // orange
            if (doc.status === "Approved") statusPill = "occupied"; // green
            
            return `
              <tr>
                <td style="font-weight:700;">📄 ${doc.name}</td>
                <td style="font-weight:600;">${doc.type}</td>
                <td style="font-family:var(--font-sans); font-weight:500;">${new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <span class="unit-pill ${statusPill}" style="${doc.status === 'Rejected' ? 'background:rgba(239,68,68,0.1); color:#ef4444;' : ''}">
                    ${doc.status}
                  </span>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bind Upload dialog
  document.getElementById("upload-doc-btn").addEventListener("click", () => {
    createDialog({
      title: "Upload Operational Credentials",
      contentHTML: `
        <div class="form-group">
          <label for="doc-type">Document Category</label>
          <select id="doc-type" name="type" class="glass-input">
            <option value="ID Proof">Government Issued ID</option>
            <option value="Income Proof">Proof of Income / Payslip</option>
            <option value="Lease Agreement">Signed Lease Copy</option>
          </select>
        </div>
        <div class="form-group">
          <label for="doc-filename">File Name</label>
          <input type="text" id="doc-filename" name="filename" class="glass-input" required placeholder="e.g. paystub_sarah_may.pdf">
        </div>
        <div style="border: 2px dashed var(--glass-border); border-radius: 6px; padding:30px; text-align:center; background:var(--bg-app); cursor:pointer;">
          <div style="font-size:28px; margin-bottom:8px;">📤</div>
          <span style="font-size:12px; font-weight:600; color:var(--text-muted);">Mock-Drag & Drop or Browse File</span>
        </div>
      `,
      submitLabel: "Initiate Upload",
      onSubmit: (data) => {
        // Play mock uploading progress animation
        toast.show("Initializing file buffers...", "info");
        
        setTimeout(() => {
          store.uploadDocument(tenantId, data.filename, data.type);
          toast.show("Document uploaded successfully. Awaiting operator audit.", "success");
          renderDocumentsTab(targetElement, store.getDocuments().filter(d => d.userId === tenantId), tenantId);
        }, 1200);
      }
    });
  });
}

/**
 * 3. CHAT TAB (Tenant Chat thread)
 */
function renderChatTab(targetElement, messages, tenantId) {
  const landlordId = "owner_1";
  
  targetElement.innerHTML = `
    <div class="glass-panel" style="display:flex; flex-direction:column; justify-content:space-between; height: 500px; overflow:hidden; background:var(--glass-bg-accent);">
      <!-- Header -->
      <div style="background:var(--glass-bg); padding:15px; border-bottom:1px solid var(--glass-border); display:flex; align-items:center; gap:10px;">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
        <div>
          <div style="font-weight:800; font-size:14px;">Marcus Sterling (Landlord)</div>
          <div style="font-size:11px; color:var(--text-muted);">marcus@sterlingprop.com • Asset Manager Hotline</div>
        </div>
      </div>

      <!-- Messages Body -->
      <div id="chat-thread-body" style="flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
        ${renderTenantThreadMessages(messages, tenantId, landlordId)}
      </div>

      <!-- Form Input -->
      <form id="chat-send-form" style="background:var(--glass-bg); padding:15px; border-top:1px solid var(--glass-border); display:flex; gap:10px;">
        <input type="text" id="chat-msg-input" class="glass-input" required autocomplete="off" placeholder="Write message to landlord..." style="flex:1; padding:8px 12px; font-size:13px;">
        <button type="submit" class="btn btn-primary" style="padding:8px 16px; font-size:13px; border-radius:4px;">Send</button>
      </form>
    </div>
  `;

  const threadBody = document.getElementById("chat-thread-body");
  if (threadBody) threadBody.scrollTop = threadBody.scrollHeight;

  // Submit message wire
  const chatForm = document.getElementById("chat-send-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-msg-input");
      const text = input.value.trim();
      if (!text) return;

      store.sendMessage(tenantId, landlordId, text);
      input.value = "";
      
      renderChatTab(targetElement, store.getMessages(), tenantId);

      // simulated auto response
      setTimeout(() => {
        const typingIndicator = document.createElement("div");
        typingIndicator.id = "typing-loader";
        typingIndicator.style.cssText = "font-size:11px; color:var(--text-muted); font-style:italic; padding-left:10px;";
        typingIndicator.innerHTML = `Marcus Sterling is typing...`;
        
        const thread = document.getElementById("chat-thread-body");
        if (thread) {
          thread.appendChild(typingIndicator);
          thread.scrollTop = thread.scrollHeight;
        }

        setTimeout(() => {
          const indicator = document.getElementById("typing-loader");
          if (indicator) indicator.remove();

          const replyText = `Received. I have cataloged this thread and flagged it for our asset operations review.`;
          store.sendMessage(landlordId, tenantId, replyText);
          toast.show("Message from Marcus Sterling", "info");
          
          renderChatTab(targetElement, store.getMessages(), tenantId);
        }, 1200);
      }, 800);
    });
  }
}

function renderTenantThreadMessages(messages, tenantId, landlordId) {
  const thread = messages.filter(
    m => (m.senderId === tenantId && m.recipientId === landlordId) ||
         (m.senderId === landlordId && m.recipientId === tenantId)
  );

  if (thread.length === 0) {
    return `<div style="text-align:center; color:var(--text-muted); padding:30px; font-size:12px;">This is the start of your secure chat channel with management.</div>`;
  }

  return thread.map(m => {
    const isTenant = m.senderId === tenantId;
    const timeStr = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div style="display:flex; flex-direction:column; align-items:${isTenant ? 'flex-end' : 'flex-start'};">
        <div style="background:${isTenant ? '#000000' : '#ffffff'}; color:${isTenant ? '#ffffff' : 'var(--text-main)'}; border: 1px solid var(--glass-border); padding: 10px 14px; border-radius: 8px; max-width:70%; font-size:13px; font-family:var(--font-sans); box-shadow:var(--shadow-premium);">
          ${m.text}
        </div>
        <span style="font-size:10px; color:var(--text-muted); margin-top:4px; font-family:var(--font-sans);">${timeStr}</span>
      </div>
    `;
  }).join("");
}

/**
 * 4. MY PROFILE TAB
 */
function renderProfileTab(targetElement, tenant) {
  targetElement.innerHTML = `
    <div class="glass-panel" style="padding:30px; max-width:600px; margin: 0 auto;">
      <h3 style="font-size:20px; margin-bottom:20px;">My Profile Settings</h3>
      
      <form id="tenant-profile-form">
        <div class="form-group">
          <label>Profile Avatar Reference</label>
          <div style="display:flex; align-items:center; gap:15px; margin-top:6px;">
            <img src="${tenant.avatar}" style="width:54px; height:54px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
            <span style="font-size:12px; color:var(--text-muted);">Initials update dynamically on save.</span>
          </div>
        </div>
        
        <div class="form-group" style="margin-top:20px;">
          <label for="prof-name">Full Name</label>
          <input type="text" id="prof-name" name="name" class="glass-input" required value="${tenant.name}">
        </div>

        <div class="form-group">
          <label for="prof-email">Email Address</label>
          <input type="email" id="prof-email" name="email" class="glass-input" required value="${tenant.email}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="prof-phone">Mobile Phone</label>
            <input type="text" id="prof-phone" name="phone" class="glass-input" required value="${tenant.phone}">
          </div>
          <div class="form-group">
            <label for="prof-prof">Profession / Employment</label>
            <input type="text" id="prof-prof" name="profession" class="glass-input" required value="${tenant.profession || ''}">
          </div>
        </div>

        <div style="margin-top:20px; border-top:1px dashed var(--glass-border); padding-top:15px;">
          <h4 style="font-size:12px; font-family:var(--font-sans); font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:12px; letter-spacing:0.05em;">Notifications Dispatch</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; text-transform:none; cursor:pointer;">
              <input type="checkbox" name="notifyEmail" ${tenant.notifyEmail ? 'checked' : ''} style="accent-color:var(--primary-color);">
              <span>Dispatched transaction invoices to registered email address</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; text-transform:none; cursor:pointer;">
              <input type="checkbox" name="notifySMS" ${tenant.notifySMS ? 'checked' : ''} style="accent-color:var(--primary-color);">
              <span>Dispatched service dispatch warnings to mobile SMS</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:25px;">
          💾 Save Profile Changes
        </button>
      </form>
    </div>
  `;

  // Submit Profile Changes
  const form = document.getElementById("tenant-profile-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      profession: formData.get("profession"),
      notifyEmail: formData.get("notifyEmail") === "on",
      notifySMS: formData.get("notifySMS") === "on"
    };

    store.updateProfile(tenant.id, data);
    toast.show("Your profile settings updated.", "success");
    renderTenantView(targetElement.parentElement);
  });
}
