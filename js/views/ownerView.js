import { store } from "../store.js";
import { renderFinancialChart, renderOccupancyGauge, createDialog, toast, downloadCSV, renderFloorPlan } from "../components.js";
import { t } from "../i18n.js";

export function renderOwnerView(container) {
  const properties = store.getProperties();
  const requests = store.getMaintenanceRequests();
  const payments = store.getRentPayments();
  const users = store.getUsers();
  const messages = store.getMessages();
  const documents = store.getDocuments();

  let activeTab = sessionStorage.getItem("owner_active_tab") || "summary";

  container.innerHTML = `
    <div class="dashboard-wrapper">
      <!-- Side Menu -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-item ${activeTab === 'summary' ? 'active' : ''}" data-tab="summary">
          <span class="sidebar-icon">📈</span> ${t("sidebar_overview")}
        </div>
        <div class="sidebar-item ${activeTab === 'properties' ? 'active' : ''}" data-tab="properties">
          <span class="sidebar-icon">🏢</span> ${t("sidebar_properties")}
        </div>
        <div class="sidebar-item ${activeTab === 'leases' ? 'active' : ''}" data-tab="leases">
          <span class="sidebar-icon">✉️</span> ${t("sidebar_leases")}
        </div>
        <div class="sidebar-item ${activeTab === 'maintenance' ? 'active' : ''}" data-tab="maintenance">
          <span class="sidebar-icon">🔧</span> ${t("sidebar_maintenance")}
        </div>
        <div class="sidebar-item ${activeTab === 'financials' ? 'active' : ''}" data-tab="financials">
          <span class="sidebar-icon">📊</span> ${t("sidebar_financials")}
        </div>
        <div class="sidebar-item ${activeTab === 'documents' ? 'active' : ''}" data-tab="documents">
          <span class="sidebar-icon">📄</span> ${t("sidebar_documents")}
        </div>
        <div class="sidebar-item ${activeTab === 'messages' ? 'active' : ''}" data-tab="messages">
          <span class="sidebar-icon">💬</span> ${t("sidebar_messages")}
        </div>
        
        <div class="sidebar-separator"></div>
        
        <div class="sidebar-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
          <span class="sidebar-icon">👤</span> ${t("sidebar_profile")}
        </div>
      </aside>

      <!-- Main Panel Area -->
      <main class="dashboard-main" style="display: flex; flex-direction: column; gap: 24px; min-width: 0; flex: 1;">
        <!-- Dynamic tab content container -->
        <div id="owner-tab-content" class="view-section"></div>
      </main>
    </div>
  `;

  const tabContent = document.getElementById("owner-tab-content");

  const renderTabContent = () => {
    sessionStorage.setItem("owner_active_tab", activeTab);
    
    if (activeTab === "summary") {
      renderSummaryTab(tabContent, properties, requests, payments, users);
    } else if (activeTab === "properties") {
      renderPropertiesTab(tabContent, properties, users);
    } else if (activeTab === "leases") {
      renderLeasesTab(tabContent, properties, users, store.getInvitations());
    } else if (activeTab === "maintenance") {
      renderMaintenanceTab(tabContent, store.getMaintenanceRequests(), properties, users);
    } else if (activeTab === "financials") {
      renderFinancialsTab(tabContent, store.getRentPayments(), users, properties);
    } else if (activeTab === "documents") {
      renderDocumentsTab(tabContent, store.getDocuments(), users);
    } else if (activeTab === "messages") {
      renderMessagesTab(tabContent, store.getMessages(), users);
    } else if (activeTab === "profile") {
      renderProfileTab(tabContent, store.getCurrentUser());
    }
  };

  container.querySelectorAll(".sidebar-item").forEach(tab => {
    tab.addEventListener("click", () => {
      container.querySelectorAll(".sidebar-item").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.getAttribute("data-tab");
      renderTabContent();
    });
  });

  renderTabContent();
}

/**
 * 1. PROPERTIES TAB
 */
function renderPropertiesTab(targetElement, properties, users) {
  targetElement.innerHTML = `
    <div class="card-title-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">Properties</h2>
      <button class="btn btn-primary" id="add-property-btn" style="padding: 9px 20px; font-size:13px; border-radius:30px; font-weight:600;">
        + Add Property
      </button>
    </div>
    <div class="properties-grid">
      ${properties.map(p => {
        const totalUnits = p.units.length;
        const occupied = p.units.filter(u => u.status === "Occupied").length;
        const vacant = totalUnits - occupied;

        return `
          <div class="glass-panel property-card">
            <div class="property-img-wrapper">
              <img class="property-img" src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'">
              <span class="property-type-tag">${p.type}</span>
            </div>
            <div class="property-info">
              <h3>${p.name}</h3>
              <p>📍 ${p.address}</p>
              
              <div style="margin: 15px 0;">
                <div style="font-weight: 700; font-size: 11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom: 8px;">Units Distribution</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${p.units.map(u => {
                    const tenantName = u.tenantId ? (users[u.tenantId]?.name || "Assigned Tenant") : "Empty";
                    return `
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--glass-bg-accent); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border);">
                        <span style="font-weight:600; font-family:var(--font-sans);">${u.number} <span style="color:var(--text-muted); font-weight:400;">($${u.rent.toLocaleString()}/mo)</span></span>
                        <div style="display:flex; align-items:center; gap:8px;">
                          <span class="unit-pill ${u.status.toLowerCase()}">${u.status}</span>
                          ${u.tenantId ? `<span style="font-size:11px; color:var(--text-muted); font-weight:500;">${tenantName}</span>` : ""}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>

              <div class="property-units-summary">
                <span>Leased Units: <strong>${occupied} / ${totalUnits}</strong></span>
                <span class="${vacant > 0 ? 'text-warning' : 'text-success'}" style="font-weight:700;">
                  ${vacant > 0 ? `${vacant} Vacant` : "Fully Leased"}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // Bind register property dialog
  const addPropBtn = document.getElementById("add-property-btn");
  if (addPropBtn) {
    addPropBtn.addEventListener("click", () => {
      createDialog({
        title: "Add New Property",
        contentHTML: `
          <div class="form-group">
            <label for="prop-name">Property Name</label>
            <input type="text" id="prop-name" name="name" class="glass-input" required placeholder="e.g. Shady Pines Estates">
          </div>
          <div class="form-group">
            <label for="prop-address">Street Address</label>
            <input type="text" id="prop-address" name="address" class="glass-input" required placeholder="e.g. 1200 Pine Road, Springfield">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="prop-type">Property Type</label>
              <select id="prop-type" name="type" class="glass-input">
                <option value="Apartment">Apartment Complex</option>
                <option value="Loft">Industrial Loft</option>
                <option value="Single Family">Single Family Home</option>
                <option value="Condo">Condo Unit</option>
              </select>
            </div>
            <div class="form-group">
              <label for="prop-rent">Target Monthly Rent ($)</label>
              <input type="number" id="prop-rent" name="rent" class="glass-input" required min="100" placeholder="e.g. 2100">
            </div>
          </div>
          <div class="form-group">
            <label for="prop-units-string">Units Designation (comma-separated list)</label>
            <textarea id="prop-units-string" name="unitsString" class="glass-input" required placeholder="e.g. Apt 101, Apt 102, Apt 103" rows="2" style="resize:vertical; font-family:var(--font-body);"></textarea>
          </div>
        `,
        submitLabel: "Add Property",
        onSubmit: (data) => {
          store.addProperty({
            name: data.name,
            address: data.address,
            type: data.type,
            unitsString: data.unitsString,
            rent: data.rent
          });
          toast.show("Property added successfully.", "success");
          renderOwnerView(targetElement.parentElement);
        }
      });
    });
  }
}

/**
 * 2. LEASES & TENANTS TAB (With Invitations tables)
 */
function renderLeasesTab(targetElement, properties, users, invitations) {
  const leases = store.getLeases();
  const vacantUnits = [];

  properties.forEach(p => {
    p.units.forEach(u => {
      if (!u.tenantId) {
        vacantUnits.push({
          propertyName: p.name,
          propertyId: p.id,
          unitId: u.id,
          number: u.number,
          rent: u.rent
        });
      }
    });
  });

  const pendingInvites = invitations.filter(i => i.status === "Pending");

  targetElement.innerHTML = `
    <div class="card-title-row">
      <h3 style="font-size:20px; margin-bottom:0;">Leases & Contracts Ledger</h3>
      ${vacantUnits.length > 0 ? `
        <button class="btn btn-primary" id="invite-renter-btn" style="padding: 8px 16px; font-size:13px; border-radius:4px;">
          ✉️ Invite & Draft Lease
        </button>
      ` : ""}
    </div>

    <!-- Leases Table -->
    <div class="glass-table-wrapper" style="margin-bottom:40px;">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Property / Unit</th>
            <th>Renter Profile</th>
            <th>Rent & Deposit</th>
            <th>Contract Period</th>
            <th>Custom Rules</th>
            <th>Signatures</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${leases.length === 0 ? `
            <tr>
              <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
                No leases registered in this portfolio.
              </td>
            </tr>
          ` : leases.map(lease => {
            const prop = properties.find(p => p.id === lease.propertyId);
            const unit = prop ? prop.units.find(u => u.id === lease.unitId) : null;
            const tenant = users[lease.tenantId];
            const tenantName = tenant ? tenant.name : "Awaiting Tenant";
            const tenantAvatar = tenant ? tenant.avatar : "https://api.dicebear.com/7.x/initials/svg?seed=Pending";
            
            let statusPill = "vacant";
            if (lease.status === "Active") statusPill = "occupied";
            
            return `
              <tr>
                <td>
                  <div style="font-weight: 700;">${prop ? prop.name : 'Unknown Property'}</div>
                  <div style="font-size:11px; color: var(--text-muted);">${unit ? unit.number : 'Unknown Unit'}</div>
                </td>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${tenantAvatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
                    <span style="font-weight:600;">${tenantName}</span>
                  </div>
                  ${tenant ? `<div style="font-size:11px; color: var(--text-muted);">${tenant.email}</div>` : ""}
                </td>
                <td>
                  <div style="font-weight: 700;">$${lease.rent.toLocaleString()}/mo</div>
                  <div style="font-size:11px; color:var(--text-muted);">Deposit: $${lease.deposit.toLocaleString()}</div>
                </td>
                <td style="font-size: 12px; font-weight: 500;">
                  ${lease.startDate} to ${lease.endDate}
                </td>
                <td style="font-size: 11px;">
                  <div style="font-weight: 600;">Fees: ${lease.lateFeeRule || 'None'}</div>
                  <div style="color:var(--text-muted); margin-top:2px;">Splits: ${lease.utilitySplit || 'None'}</div>
                </td>
                <td style="font-size: 11px; font-weight: 600;">
                  <div>✍️ Landlord: ${lease.ownerSignature || 'Signed'}</div>
                  <div style="color:var(--text-muted); margin-top:2px;">✍️ Tenant: ${lease.tenantSignature || 'Pending'}</div>
                </td>
                <td>
                  <span class="unit-pill ${statusPill}">${lease.status}</span>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- Pending Invitations Table -->
    <h3 style="font-size:16px; margin-bottom:15px;">Pending Tenant Invites</h3>
    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Invitation Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Property & Unit</th>
            <th>Target Rent</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${pendingInvites.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align:center; padding: 25px; color:var(--text-muted);">
                No pending tenant invitations found.
              </td>
            </tr>
          ` : pendingInvites.map(invite => {
            const prop = properties.find(p => p.id === invite.propertyId);
            const unit = prop ? prop.units.find(u => u.id === invite.unitId) : null;
            return `
              <tr>
                <td style="font-weight:800; font-family:var(--font-sans); color:var(--primary-color);">${invite.code}</td>
                <td style="font-weight:700;">${invite.name}</td>
                <td>${invite.email}</td>
                <td>${prop ? prop.name : 'Property'} - ${unit ? unit.number : ''}</td>
                <td style="font-weight:700; font-family:var(--font-sans);">$${invite.rentAmount.toLocaleString()}/mo</td>
                <td>
                  <button class="btn btn-secondary copy-invite-url-btn" 
                    data-code="${invite.code}" 
                    style="padding:4px 8px; font-size:11px; border-radius:4px;"
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Bind copy invitation links
  targetElement.querySelectorAll(".copy-invite-url-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      const url = `${window.location.origin}${window.location.pathname}#/signup?code=${code}`;
      
      navigator.clipboard.writeText(url).then(() => {
        toast.show("Onboarding URL copied to clipboard!", "success");
      }).catch(err => {
        toast.show(`Code: ${code}`, "info");
      });
    });
  });

  // Bind invite renter dialog
  const inviteBtn = document.getElementById("invite-renter-btn");
  if (inviteBtn) {
    inviteBtn.addEventListener("click", () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYearStr = nextYearDate.toISOString().split("T")[0];

      createDialog({
        title: "Invite Tenant & Draft Lease",
        contentHTML: `
          <div class="form-group">
            <label for="invite-unit">Select Vacant Asset Unit</label>
            <select id="invite-unit" name="unitKey" class="glass-input">
              ${vacantUnits.map(v => {
                const val = `${v.propertyId}|${v.unitId}`;
                const highlightUnit = sessionStorage.getItem("leases_highlight_unit");
                const selected = val === highlightUnit ? "selected" : "";
                return `<option value="${val}" ${selected}>${v.propertyName} - ${v.number} ($${v.rent}/mo)</option>`;
              }).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="invite-name">Tenant Full Name</label>
            <input type="text" id="invite-name" name="name" class="glass-input" required placeholder="e.g. Peter Parker">
          </div>
          <div class="form-group">
            <label for="invite-email">Tenant Email Address</label>
            <input type="email" id="invite-email" name="email" class="glass-input" required placeholder="e.g. peter.p@dailybugle.com">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="invite-rent">Assigned Monthly Rent ($)</label>
              <input type="number" id="invite-rent" name="rent" class="glass-input" required value="2000">
            </div>
            <div class="form-group">
              <label for="invite-deposit">Security Deposit ($)</label>
              <input type="number" id="invite-deposit" name="deposit" class="glass-input" required value="3000">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="invite-start">Lease Start Date</label>
              <input type="date" id="invite-start" name="startDate" class="glass-input" required value="${todayStr}">
            </div>
            <div class="form-group">
              <label for="invite-end">Lease End Date</label>
              <input type="date" id="invite-end" name="endDate" class="glass-input" required value="${nextYearStr}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="invite-late-fee">Automated Late Fee Rule</label>
              <select id="invite-late-fee" name="lateFeeRule" class="glass-input">
                <option value="Apply $50 fee after 5 days">Apply $50 fee after 5 days</option>
                <option value="Apply $25 fee after 3 days">Apply $25 fee after 3 days</option>
                <option value="Apply $100 fee after 7 days">Apply $100 fee after 7 days</option>
                <option value="No late fee rule">No late fee rule</option>
              </select>
            </div>
            <div class="form-group">
              <label for="invite-utility-split">Utility Split Rule</label>
              <select id="invite-utility-split" name="utilitySplit" class="glass-input">
                <option value="Tenant pays 100% utilities">Tenant pays 100% utilities</option>
                <option value="50/50 Water/Gas Split">50/50 Water/Gas Split</option>
                <option value="All utilities included in rent">All utilities included</option>
              </select>
            </div>
          </div>
        `,
        submitLabel: "Generate Invite & Lease Draft",
        onSubmit: (data) => {
          const [propId, unitId] = data.unitKey.split("|");
          const code = store.createInvitation({
            name: data.name,
            email: data.email,
            propertyId: propId,
            unitId: unitId,
            rent: data.rent,
            deposit: data.deposit,
            startDate: data.startDate,
            endDate: data.endDate,
            lateFeeRule: data.lateFeeRule,
            utilitySplit: data.utilitySplit
          });

          toast.show(`Invitation and lease draft created. Code: ${code}`, "success");
          renderLeasesTab(targetElement, store.getProperties(), store.getUsers(), store.getInvitations());
        }
      });

      // Recalculate deposit on rent change
      setTimeout(() => {
        const rentInput = document.getElementById("invite-rent");
        const depositInput = document.getElementById("invite-deposit");
        if (rentInput && depositInput) {
          rentInput.addEventListener("input", () => {
            const rentVal = Number(rentInput.value) || 0;
            depositInput.value = Math.round(rentVal * 1.5);
          });
        }
      }, 50);
    });
  }

  if (sessionStorage.getItem("leases_auto_open_invite") === "true") {
    sessionStorage.removeItem("leases_auto_open_invite");
    const inviteBtn = document.getElementById("invite-renter-btn");
    if (inviteBtn) {
      setTimeout(() => inviteBtn.click(), 100);
    }
  }
}

/**
 * 3. MAINTENANCE BOARD TAB
 */
function renderMaintenanceTab(targetElement, requests, properties, users) {
  const reported = requests.filter(r => r.status === "Reported");
  const bidding = requests.filter(r => r.status === "Bidding");
  const inProgress = requests.filter(r => r.status === "In Progress");
  const resolved = requests.filter(r => r.status === "Resolved");

  targetElement.innerHTML = `
    <div class="maintenance-board">
      
      <!-- REPORTED -->
      <div class="maintenance-column">
        <div class="column-header">
          <h3>Unassigned Logs</h3>
          <span class="card-count">${reported.length}</span>
        </div>
        <div class="ticket-list" data-status="Reported">
          ${reported.map(r => renderTicketCard(r, properties, users)).join("")}
        </div>
      </div>

      <!-- BIDDING -->
      <div class="maintenance-column">
        <div class="column-header">
          <h3>Bidding & Quotes</h3>
          <span class="card-count" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5;">${bidding.length}</span>
        </div>
        <div class="ticket-list" data-status="Bidding">
          ${bidding.map(r => renderTicketCard(r, properties, users)).join("")}
        </div>
      </div>

      <!-- IN PROGRESS -->
      <div class="maintenance-column">
        <div class="column-header">
          <h3>Dispatched</h3>
          <span class="card-count" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">${inProgress.length}</span>
        </div>
        <div class="ticket-list" data-status="In Progress">
          ${inProgress.map(r => renderTicketCard(r, properties, users)).join("")}
        </div>
      </div>

      <!-- RESOLVED -->
      <div class="maintenance-column">
        <div class="column-header">
          <h3>Resolved</h3>
          <span class="card-count" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">${resolved.length}</span>
        </div>
        <div class="ticket-list" data-status="Resolved">
          ${resolved.map(r => renderTicketCard(r, properties, users)).join("")}
        </div>
      </div>
      
    </div>
  `;

  // Bind click handlers to change status & contractor messaging
  targetElement.querySelectorAll(".ticket-card").forEach(card => {
    card.addEventListener("click", () => {
      const ticketId = card.getAttribute("data-id");
      const ticket = requests.find(r => r.id === ticketId);
      if (!ticket) return;

      const contractors = store.getContractors();
      
      const renderTicketDialogContent = (modalBodyElement) => {
        const isResolved = ticket.status === "Resolved";
        const hasContractor = !!ticket.contractorId;
        const currentContractor = contractors.find(c => c.id === ticket.contractorId);

        modalBodyElement.innerHTML = `
          <div style="margin-bottom:15px; background:var(--glass-bg-accent); padding:15px; border-radius:6px; border:1px solid var(--glass-border); font-family:var(--font-sans); font-size:13px;">
            <div style="font-weight: 700; margin-bottom:4px; font-size:14px;">${ticket.title}</div>
            <div style="color:var(--text-muted); margin-bottom:8px; line-height:1.4;">${ticket.description}</div>
            ${ticket.attachment ? `
              <div style="margin-bottom: 8px;">
                <span style="font-size:10px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Reference Photo</span>
                <img src="${ticket.attachment}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; border:1px solid var(--glass-border);">
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); border-top:1px dashed var(--glass-border); padding-top:8px; margin-top:8px;">
              <span>Category: <strong>${ticket.category}</strong></span>
              <span>Priority: <strong class="text-danger">${ticket.priority}</strong></span>
              <span>Renter: <strong>${users[ticket.tenantId]?.name || 'Sarah Jenkins'}</strong></span>
            </div>
          </div>

          <!-- Contractor Dispatch Section -->
          ${!isResolved ? `
            ${ticket.status === "Bidding" ? `
              <div id="bidding-matrix-mount" style="margin-bottom:15px;"></div>
            ` : `
              <div style="margin-bottom:15px; border:1px solid var(--glass-border); border-radius:6px; padding:12px; background:var(--glass-bg); display:flex; flex-direction:column; gap:8px;">
                <h4 style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; letter-spacing:0.05em;">Contractor Dispatch</h4>
                ${hasContractor ? `
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--glass-bg-accent); padding:8px 12px; border-radius:4px; border:1px solid var(--glass-border); margin-bottom:2px;">
                    <div>
                      <strong>${currentContractor.name}</strong>
                      <div style="font-size:10px; color:var(--text-muted);">${currentContractor.trade} • ${currentContractor.rating}</div>
                    </div>
                    <span style="font-size:10px; background:rgba(16, 185, 129, 0.1); color:#10b981; font-weight:700; padding:2px 6px; border-radius:4px;">Dispatched</span>
                  </div>
                ` : `
                  <div style="display:flex; gap:8px;">
                    <select id="assign-contractor-select" class="glass-input" style="font-size:12px; padding:6px 10px; flex:1;">
                      <option value="">-- Choose Contractor --</option>
                      ${contractors.map(c => `
                        <option value="${c.id}">${c.name} (${c.trade} • ${c.rating})</option>
                      `).join("")}
                    </select>
                    <button type="button" class="btn btn-primary" id="assign-contractor-btn" style="padding:6px 12px; font-size:12px; border-radius:4px;">Assign</button>
                  </div>
                  <div style="border-top:1px dashed var(--glass-border); padding-top:8px; text-align:center;">
                    <span style="font-size:10px; color:var(--text-muted); display:block; margin-bottom:6px;">OR request competitive bids from all active trades:</span>
                    <button type="button" class="btn btn-secondary" id="solicit-quotes-btn" style="width:100%; padding:6px 12px; font-size:11px; font-weight:700; border-color:var(--primary-color); color:var(--primary-color); background:transparent;">
                      ⚡ Solicit Competitive Quotes
                    </button>
                  </div>
                `}
              </div>
            `}
          ` : ''}

          <!-- Work Order Chat Thread (Only if contractor assigned) -->
          ${hasContractor && !isResolved ? `
            <div style="margin-bottom:15px; border:1px solid var(--glass-border); border-radius:6px; overflow:hidden;">
              <div style="background:var(--glass-bg-accent); padding:8px 12px; border-bottom:1px solid var(--glass-border); font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">
                Work Order Dispatch Chat
              </div>
              <div id="dispatch-chat-body" style="height:120px; overflow-y:auto; padding:10px; background:#f9fafb; display:flex; flex-direction:column; gap:8px;">
                ${ticket.chat.length === 0 ? `
                  <div style="font-size:11px; color:var(--text-muted); text-align:center; padding-top:40px;">No messages in this dispatch thread yet.</div>
                ` : ticket.chat.map(m => {
                  const isLandlord = m.senderId === "owner_1";
                  const isTenant = m.senderId === ticket.tenantId;
                  const senderName = isLandlord ? "You (Landlord)" : (isTenant ? (users[m.senderId]?.name.split(" ")[0] || "Tenant") : (currentContractor ? currentContractor.name.split(" ")[0] : "Contractor"));
                  const align = isLandlord ? "flex-end" : "flex-start";
                  const bg = isLandlord ? "#000000" : "#ffffff";
                  const fg = isLandlord ? "#ffffff" : "var(--text-main)";
                  return `
                    <div style="display:flex; flex-direction:column; align-items:${align}; max-width:85%; align-self:${align};">
                      <span style="font-size:8px; color:var(--text-muted); margin-bottom:2px; font-weight:700;">${senderName}</span>
                      <div style="background:${bg}; color:${fg}; border:1px solid var(--glass-border); border-radius:4px; padding:6px 10px; font-size:11px; line-height:1.3; font-family:var(--font-sans);">
                        ${m.text}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
              <div style="display:flex; border-top:1px solid var(--glass-border); background:var(--glass-bg);">
                <input type="text" id="dispatch-chat-input" class="glass-input" placeholder="Message contractor..." style="border:none; border-radius:0; font-size:11px; padding:8px 12px; flex:1; outline:none; background:transparent;">
                <button type="button" class="btn btn-secondary" id="dispatch-chat-send-btn" style="border:none; border-left:1px solid var(--glass-border); border-radius:0; padding:6px 12px; font-size:11px; font-weight:700; background:transparent;">Send</button>
              </div>
            </div>
          ` : ''}

          <!-- Status Section -->
          <div class="form-group">
            <label for="ticket-status">Status</label>
            <select id="ticket-status" name="status" class="glass-input">
              <option value="Reported" ${ticket.status === 'Reported' ? 'selected' : ''}>Unassigned</option>
              <option value="Bidding" ${ticket.status === 'Bidding' ? 'selected' : ''}>Bidding quotes</option>
              <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </div>

          <div id="ticket-resolution-container" style="${isResolved ? '' : 'display:none;'} border-top:1px dashed var(--glass-border); padding-top:15px; margin-top:15px;">
            <div class="form-row">
              <div class="form-group">
                <label for="ticket-cost">Resolution Cost ($)</label>
                <input type="number" id="ticket-cost" name="cost" class="glass-input" min="0" value="${ticket.cost || 0}" placeholder="e.g. 150">
              </div>
              <div class="form-group">
                <label for="ticket-tax-cat">Tax Category</label>
                <select id="ticket-tax-cat" name="taxCategory" class="glass-input">
                  <option value="Repairs" ${ticket.taxCategory === 'Repairs' ? 'selected' : ''}>Repairs (Line 14)</option>
                  <option value="Cleaning & Maintenance" ${ticket.taxCategory === 'Cleaning & Maintenance' ? 'selected' : ''}>Cleaning & Maint (Line 7)</option>
                  <option value="Taxes" ${ticket.taxCategory === 'Taxes' ? 'selected' : ''}>Taxes (Line 16)</option>
                  <option value="Insurance" ${ticket.taxCategory === 'Insurance' ? 'selected' : ''}>Insurance (Line 9)</option>
                  <option value="Utilities" ${ticket.taxCategory === 'Utilities' ? 'selected' : ''}>Utilities (Line 17)</option>
                  <option value="Other" ${ticket.taxCategory === 'Other' ? 'selected' : ''}>Other (Line 19)</option>
                </select>
              </div>
            </div>
            
            ${!isResolved ? `
              <div style="margin-top:12px;">
                <button type="button" class="btn btn-secondary" id="ocr-scan-btn" style="width:100%; padding:8px 12px; font-size:12px; font-weight:700; border-style:dashed; display:flex; align-items:center; justify-content:center; gap:6px;">
                  📄 Auto-Scan Receipt (Fintech OCR)
                </button>
              </div>
            ` : ''}
          </div>
        `;

        const chatBody = modalBodyElement.querySelector("#dispatch-chat-body");
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

        const statusSelect = modalBodyElement.querySelector("#ticket-status");
        const resolutionContainer = modalBodyElement.querySelector("#ticket-resolution-container");
        if (statusSelect && resolutionContainer) {
          statusSelect.addEventListener("change", (e) => {
            if (e.target.value === "Resolved") {
              resolutionContainer.style.display = "block";
            } else {
              resolutionContainer.style.display = "none";
            }
          });
        }

        const assignBtn = modalBodyElement.querySelector("#assign-contractor-btn");
        if (assignBtn) {
          assignBtn.addEventListener("click", () => {
            const selectVal = modalBodyElement.querySelector("#assign-contractor-select").value;
            if (!selectVal) {
              toast.show("Please select a contractor.", "warning");
              return;
            }
            store.assignContractor(ticket.id, selectVal);
            toast.show("Contractor assigned & dispatched.", "success");
            renderTicketDialogContent(modalBodyElement);
          });
        }

        const bidsMount = modalBodyElement.querySelector("#bidding-matrix-mount");
        if (bidsMount) {
          import("../components.js").then(module => {
            module.renderBiddingMatrix(bidsMount, ticket, (contractorId, cost) => {
              store.acceptBid(ticket.id, contractorId, cost);
              toast.show("Bid accepted! Work order dispatched.", "success");
              renderTicketDialogContent(modalBodyElement);
            });
          });
        }

        const solicitQuotesBtn = modalBodyElement.querySelector("#solicit-quotes-btn");
        if (solicitQuotesBtn) {
          solicitQuotesBtn.addEventListener("click", () => {
            store.solicitBids(ticket.id);
            toast.show("Requested quotes from contractors.", "success");
            renderTicketDialogContent(modalBodyElement);
          });
        }

        const chatSendBtn = modalBodyElement.querySelector("#dispatch-chat-send-btn");
        const chatInput = modalBodyElement.querySelector("#dispatch-chat-input");
        if (chatSendBtn && chatInput) {
          const sendMsg = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            store.addContractorMessage(ticket.id, "owner_1", text);
            chatInput.value = "";
            renderTicketDialogContent(modalBodyElement);

            setTimeout(() => {
              let replyText = "Received the order. Will coordinate with the tenant.";
              if (ticket.category === "Plumbing") {
                replyText = "Plumber is on-site. Replacing the seal ring now.";
              } else if (ticket.category === "HVAC") {
                replyText = "HVAC tech has inspected the compressor. Replacing fan motor.";
              }
              store.addContractorMessage(ticket.id, ticket.contractorId, replyText);
              
              const chatBodyReload = document.getElementById("dispatch-chat-body");
              if (chatBodyReload) {
                renderTicketDialogContent(modalBodyElement);
                toast.show("New contractor dispatch update.", "info");
              }
            }, 1500);
          };

          chatSendBtn.addEventListener("click", sendMsg);
          chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMsg();
            }
          });
        }

        const ocrBtn = modalBodyElement.querySelector("#ocr-scan-btn");
        if (ocrBtn) {
          ocrBtn.addEventListener("click", () => {
            createDialog({
              title: "Select Receipt Document to Scan",
              contentHTML: `
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <button type="button" class="btn btn-secondary select-receipt-file-btn" data-file="Apex_Plumbing_Invoice_280.pdf" style="text-align:left; justify-content:flex-start;">📄 Apex_Plumbing_Invoice_280.pdf ($280.00)</button>
                  <button type="button" class="btn btn-secondary select-receipt-file-btn" data-file="HVAC_Thermal_AC_Repair_150.png" style="text-align:left; justify-content:flex-start;">📄 HVAC_Thermal_AC_Repair_150.png ($150.00)</button>
                  <button type="button" class="btn btn-secondary select-receipt-file-btn" data-file="Office_Cleaners_Sweep_95.pdf" style="text-align:left; justify-content:flex-start;">📄 Office_Cleaners_Sweep_95.pdf ($95.00)</button>
                  <button type="button" class="btn btn-secondary select-receipt-file-btn" data-file="County_Property_Tax_Stmt_450.jpg" style="text-align:left; justify-content:flex-start;">📄 County_Property_Tax_Stmt_450.jpg ($450.00)</button>
                </div>
              `,
              submitLabel: "Cancel",
              onSubmit: () => {}
            });

            setTimeout(() => {
              const fileBtns = document.querySelectorAll(".select-receipt-file-btn");
              fileBtns.forEach(fbtn => {
                fbtn.addEventListener("click", () => {
                  const fileName = fbtn.getAttribute("data-file");
                  const openDialogs = document.querySelectorAll("dialog[open]");
                  if (openDialogs.length > 0) {
                    const topDialog = openDialogs[openDialogs.length - 1];
                    topDialog.close();
                    topDialog.remove();
                  }

                  import("../components.js").then(module => {
                    module.runMockOCRScan(fileName, ({ cost, taxCategory }) => {
                      toast.show("OCR scan completed.", "success");
                      const costField = modalBodyElement.querySelector("#ticket-cost");
                      const taxCatField = modalBodyElement.querySelector("#ticket-tax-cat");
                      if (costField) costField.value = cost;
                      if (taxCatField) taxCatField.value = taxCategory;
                    });
                  });
                });
              });
            }, 50);
          });
        }
      };

      createDialog({
        title: `Dispatch Ticket #${ticketId.substring(4, 8).toUpperCase()}`,
        contentHTML: `<div id="ticket-modal-body"></div>`,
        submitLabel: "Settle Status",
        onSubmit: (data) => {
          const statusSelect = document.getElementById("ticket-status");
          const costField = document.getElementById("ticket-cost");
          const taxCatField = document.getElementById("ticket-tax-cat");
          
          const status = statusSelect ? statusSelect.value : ticket.status;
          const cost = costField ? Number(costField.value) : 0;
          const taxCategory = taxCatField ? taxCatField.value : "";

          store.updateMaintenanceStatus(ticketId, status, cost, taxCategory);
          toast.show(`Ticket settled.`, "success");
          renderOwnerView(targetElement.parentElement);
        }
      });

      const modalBody = document.getElementById("ticket-modal-body");
      if (modalBody) {
        renderTicketDialogContent(modalBody);
      }
    });
  });

  const highlightUnitId = sessionStorage.getItem("kanban_highlight_ticket_unit");
  if (highlightUnitId) {
    sessionStorage.removeItem("kanban_highlight_ticket_unit");
    const ticket = requests.find(r => r.unitId === highlightUnitId && r.status !== "Resolved");
    if (ticket) {
      setTimeout(() => {
        const card = targetElement.querySelector(`.ticket-card[data-id="${ticket.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.click();
        }
      }, 100);
    }
  }
}

function renderTicketCard(ticket, properties, users) {
  const prop = properties.find(p => p.id === ticket.propertyId);
  const unit = prop ? prop.units.find(u => u.id === ticket.unitId) : null;
  const tenant = users[ticket.tenantId];
  const dateStr = new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return `
    <div class="ticket-card" data-id="${ticket.id}">
      <div class="ticket-header">
        <span class="ticket-badge priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span>
        <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-sans); font-weight:600;">${dateStr}</span>
      </div>
      <h4>${ticket.title}</h4>
      <p>${ticket.description}</p>
      ${ticket.attachment ? `
        <div style="margin: 8px 0; border: 1px solid var(--glass-border); border-radius: 4px; overflow:hidden;">
          <img src="${ticket.attachment}" style="width:100%; height:60px; object-fit:cover;">
        </div>
      ` : ''}
      <div class="ticket-footer">
        <span>🏢 ${prop ? prop.name.split(" ")[0] : 'Asset'} (${unit ? unit.number : ''})</span>
        <span style="font-weight:700;">👤 ${tenant ? tenant.name.split(" ")[0] : 'Renter'}</span>
      </div>
    </div>
  `;
}

/**
 * 4. FINANCIALS & CHART TAB
 */
function renderFinancialsTab(targetElement, payments, users, properties) {
  let filterProp = sessionStorage.getItem("ledger_filter_prop") || "all";
  let filterTenant = sessionStorage.getItem("ledger_filter_tenant") || "all";
  let filterStatus = sessionStorage.getItem("ledger_filter_status") || "all";

  const uniqueTenants = Object.values(users).filter(u => u.role === "tenant");

  let filteredPayments = payments.filter(p => {
    if (filterProp !== "all" && p.propertyId !== filterProp) return false;
    if (filterTenant !== "all" && p.tenantId !== filterTenant) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  const totalPaid = filteredPayments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);

  // IRS Schedule E Category Totals
  const requests = store.getMaintenanceRequests();
  const resolvedRequests = requests.filter(r => r.status === "Resolved" && r.cost > 0);
  const categoriesList = [
    { name: "Repairs", line: "Line 14" },
    { name: "Cleaning & Maintenance", line: "Line 7" },
    { name: "Taxes", line: "Line 16" },
    { name: "Insurance", line: "Line 9" },
    { name: "Utilities", line: "Line 17" },
    { name: "Other", line: "Line 19" }
  ];

  const taxSummary = categoriesList.map(cat => {
    const items = resolvedRequests.filter(r => r.taxCategory === cat.name);
    const sum = items.reduce((s, r) => s + (r.cost || 0), 0);
    return { ...cat, sum, count: items.length };
  });

  const totalExpenses = taxSummary.reduce((s, c) => s + c.sum, 0);

  targetElement.innerHTML = `
    <div class="grid-2" style="margin-bottom:24px;">
      <!-- Chart Card -->
      <div class="glass-panel" style="padding: 20px;">
        <h3 style="font-size:15px; margin-bottom:12px;">Operational Cash Flow</h3>
        <div id="financial-chart-mount" class="chart-container"></div>
      </div>
      
      <!-- Stats Panel -->
      <div class="glass-panel" style="padding: 20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <h3 style="font-size:15px; margin-bottom:12px;">Active Filter Metrics</h3>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>Filtered Records</span>
              <strong>${filteredPayments.length}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>Cleared Invoices</span>
              <strong class="text-success">${filteredPayments.filter(p => p.status === 'Paid').length}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
              <span>Arrears Invoices</span>
              <strong class="text-danger">${filteredPayments.filter(p => p.status === 'Overdue').length}</strong>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--glass-border); padding-top:10px; margin-top:10px;">
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Total Rent Collected</div>
          <div style="font-size:22px; font-weight:800; font-family:var(--font-sans); font-variant-numeric: tabular-nums;">
            $${totalPaid.toLocaleString()}
          </div>
        </div>
      </div>
    </div>

    <!-- Tax Categories & Expenses -->
    <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>Tax Categories & Expenses</span>
        <span style="font-size:10px; background:rgba(99,91,255,0.1); color:#635bff; padding:2px 8px; border-radius:12px; font-weight:600;">Schedule E Categories</span>
      </h3>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Maintenance expenses are automatically grouped under IRS tax categories.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:15px;">
        ${taxSummary.map(cat => `
          <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:10px; border-radius:6px;">
            <span style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block;">${cat.name} (${cat.line})</span>
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:4px;">
              <strong style="font-size:15px; font-family:var(--font-sans);">$${cat.sum.toLocaleString()}</strong>
              <span style="font-size:10px; color:var(--text-muted);">${cat.count} item${cat.count !== 1 ? 's' : ''}</span>
            </div>
          </div>
        `).join("")}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:10px 15px; border-radius:6px; font-size:13px; font-weight:700;">
        <span>Total Schedule E Deductibles</span>
        <span style="font-size:15px; color:var(--primary-color); font-variant-numeric: tabular-nums;">$${totalExpenses.toLocaleString()}</span>
      </div>
    </div>

    <!-- Interactive Filters -->
    <div class="glass-panel" style="padding: 16px 20px; margin-bottom: 20px; display:flex; gap:16px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
      <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
        <div style="display:flex; flex-direction:column; gap:4px;">
          <label style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Property</label>
          <select id="filter-property" class="glass-input" style="padding: 6px 12px; font-size:12px; min-width:160px;">
            <option value="all" ${filterProp === 'all' ? 'selected' : ''}>All Assets</option>
            ${properties.map(pr => `<option value="${pr.id}" ${filterProp === pr.id ? 'selected' : ''}>${pr.name.split(" ")[0]}</option>`).join("")}
          </select>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:4px;">
          <label style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Tenant</label>
          <select id="filter-tenant" class="glass-input" style="padding: 6px 12px; font-size:12px; min-width:140px;">
            <option value="all" ${filterTenant === 'all' ? 'selected' : ''}>All Renters</option>
            ${uniqueTenants.map(t => `<option value="${t.id}" ${filterTenant === t.id ? 'selected' : ''}>${t.name.split(" ")[0]}</option>`).join("")}
          </select>
        </div>

        <div style="display:flex; flex-direction:column; gap:4px;">
          <label style="font-size:9px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Settle Status</label>
          <select id="filter-status" class="glass-input" style="padding: 6px 12px; font-size:12px; min-width:120px;">
            <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Status</option>
            <option value="Paid" ${filterStatus === 'Paid' ? 'selected' : ''}>Paid</option>
            <option value="Pending" ${filterStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Overdue" ${filterStatus === 'Overdue' ? 'selected' : ''}>Overdue</option>
          </select>
        </div>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" id="export-csv-btn" style="padding: 8px 16px; font-size:13px;">
          📊 Export Ledger CSV
        </button>
        <button class="btn btn-primary" id="post-utility-btn" style="padding: 8px 16px; font-size:13px; background:#4f46e5; border:none;">
          💧 Post Master Utility Bill
        </button>
        <button class="btn btn-primary" id="time-leap-btn" style="padding: 8px 16px; font-size:13px; background:var(--primary-color); border:none;">
          ⚡ Simulate Time Leap (+5 Days)
        </button>
      </div>
    </div>

    <!-- Ledger table -->
    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Renter Profile</th>
            <th>Asset / Suite</th>
            <th>Due Date</th>
            <th>Invoice Amount</th>
            <th>Settlement</th>
            <th>Logistics</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPayments.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align:center; padding: 30px; color:var(--text-muted);">
                No matching financial ledgers found.
              </td>
            </tr>
          ` : filteredPayments.map(p => {
            const tenant = users[p.tenantId] || { name: "Unknown Tenant" };
            const prop = properties.find(pr => pr.id === p.propertyId) || { name: "Unknown" };
            const unit = prop.units ? prop.units.find(u => u.id === p.unitId) : null;
            return `
              <tr>
                <td>
                  <div style="font-weight:700;">${tenant.name}</div>
                  <div style="font-size:11px; color:var(--text-muted);">${tenant.email}</div>
                </td>
                <td>
                  <div style="font-weight:600;">${prop.name.split(" ")[0]}</div>
                  <div style="font-size:11px; color:var(--text-muted);">${unit ? unit.number : ''}</div>
                </td>
                <td style="font-family:var(--font-sans); font-weight:500;">${p.dueDate}</td>
                <td style="font-weight:700; font-family:var(--font-sans);">$${p.amount.toLocaleString()}</td>
                <td>
                  <span class="payment-status-badge ${p.status.toLowerCase()}">${p.status}</span>
                </td>
                <td>
                  ${p.status !== 'Paid' ? `
                    <button class="btn btn-secondary force-pay-btn" data-id="${p.id}" style="padding:4px 8px; font-size:11px; border-radius:4px;">
                      Settle Cash
                    </button>
                  ` : `<span style="font-size:11px; color:var(--text-muted); font-weight:500;">Cleared Ledger</span>`}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  const chartMount = document.getElementById("financial-chart-mount");
  renderFinancialChart(chartMount, filteredPayments);

  const pFilter = document.getElementById("filter-property");
  const tFilter = document.getElementById("filter-tenant");
  const sFilter = document.getElementById("filter-status");

  const applyFilters = () => {
    sessionStorage.setItem("ledger_filter_prop", pFilter.value);
    sessionStorage.setItem("ledger_filter_tenant", tFilter.value);
    sessionStorage.setItem("ledger_filter_status", sFilter.value);
    renderFinancialsTab(targetElement, payments, users, properties);
  };

  pFilter.addEventListener("change", applyFilters);
  tFilter.addEventListener("change", applyFilters);
  sFilter.addEventListener("change", applyFilters);

  targetElement.querySelectorAll(".force-pay-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const payId = btn.getAttribute("data-id");
      store.payRent(payId);
      toast.show("Invoice settled manually.", "success");
      renderFinancialsTab(targetElement, store.getRentPayments(), users, properties);
    });
  });

  document.getElementById("export-csv-btn").addEventListener("click", () => {
    let csv = `"Tenant Name","Email","Property","Unit","Due Date","Amount ($)","Status"\n`;
    filteredPayments.forEach(p => {
      const tenant = users[p.tenantId] || { name: "N/A", email: "N/A" };
      const prop = properties.find(pr => pr.id === p.propertyId) || { name: "N/A" };
      const unit = prop.units ? prop.units.find(u => u.id === p.unitId) : null;
      const unitNo = unit ? unit.number : "N/A";
      csv += `"${tenant.name}","${tenant.email}","${prop.name}","${unitNo}","${p.dueDate}",${p.amount},"${p.status}"\n`;
    });
    
    downloadCSV("homely_rent_ledger.csv", csv);
    toast.show("Ledger exported. Downloading CSV...", "success");
  });

  document.getElementById("time-leap-btn").addEventListener("click", () => {
    const allPayments = store.getRentPayments();
    allPayments.forEach(p => {
      if (p.status === "Pending" || p.status === "Overdue") {
        const date = new Date(p.dueDate);
        date.setDate(date.getDate() - 5);
        p.dueDate = date.toISOString().split("T")[0];
      }
    });
    const count = store.applyLateFees();
    if (count > 0) {
      toast.show(`Time leap simulation completed! Automated late fee of $50 applied to ${count} overdue ledgers.`, "warning");
    } else {
      toast.show("Time leap completed. No pending invoices met the overdue late fee date threshold.", "info");
    }
    renderFinancialsTab(targetElement, store.getRentPayments(), users, properties);
  });

  document.getElementById("post-utility-btn").addEventListener("click", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    createDialog({
      title: "Register Master Utility Invoice",
      contentHTML: `
        <div class="form-group">
          <label for="util-prop">Select Asset Portfolio</label>
          <select id="util-prop" name="propertyId" class="glass-input">
            ${properties.map(pr => `<option value="${pr.id}">${pr.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="util-cat">Utility Type</label>
          <select id="util-cat" name="category" class="glass-input">
            <option value="Water">Water Invoice</option>
            <option value="Electricity">Electricity Invoice</option>
            <option value="Gas">Gas & Heating Invoice</option>
            <option value="Trash">Trash & Recycling</option>
          </select>
        </div>
        <div class="form-group">
          <label for="util-amt">Master Invoice Amount ($)</label>
          <input type="number" id="util-amt" name="amount" class="glass-input" required min="1" value="150" placeholder="e.g. 150">
        </div>
        <div class="form-group">
          <label for="util-due">Payment Due Date</label>
          <input type="date" id="util-due" name="dueDate" class="glass-input" required value="${todayStr}">
        </div>
      `,
      submitLabel: "Calculate & Split Bill",
      onSubmit: (data) => {
        store.postUtilityBill({
          propertyId: data.propertyId,
          category: data.category,
          amount: Number(data.amount),
          dueDate: data.dueDate
        });
        toast.show(`Master ${data.category} invoice processed. Utility splits posted to occupied units.`, "success");
        renderFinancialsTab(targetElement, store.getRentPayments(), users, properties);
      }
    });
  });
}

/**
 * 5. DOCUMENTS TAB
 */
function renderDocumentsTab(targetElement, documents, users) {
  targetElement.innerHTML = `
    <h3 style="font-size:20px; margin-bottom:20px;">Renter Credentials Review</h3>
    
    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Renter Profile</th>
            <th>File Name</th>
            <th>Credential Type</th>
            <th>Upload Date</th>
            <th>Verification Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${documents.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">
                No uploaded documents found.
              </td>
            </tr>
          ` : documents.map(doc => {
            const tenant = users[doc.userId] || { name: "Unknown Tenant", avatar: "" };
            let statusPill = "vacant";
            if (doc.status === "Approved") statusPill = "occupied";

            return `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${tenant.avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
                    <span style="font-weight:600;">${tenant.name}</span>
                  </div>
                </td>
                <td>
                  <a href="#" class="preview-doc-mock" data-name="${doc.name}" style="color:var(--primary-color); font-weight:700; text-decoration:none;">
                    📄 ${doc.name}
                  </a>
                </td>
                <td style="font-weight:600;">${doc.type}</td>
                <td style="font-family:var(--font-sans); font-weight:500;">${new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <span class="unit-pill ${statusPill}" style="${doc.status === 'Rejected' ? 'background:rgba(239,68,68,0.1); color:#ef4444;' : ''}">
                    ${doc.status}
                  </span>
                </td>
                <td>
                  ${doc.status === "Pending" ? `
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-secondary approve-doc-btn" data-id="${doc.id}" style="padding:4px 8px; font-size:11px; border-color:#10b981; color:#10b981;">
                        Approve
                      </button>
                      <button class="btn btn-secondary reject-doc-btn" data-id="${doc.id}" style="padding:4px 8px; font-size:11px; border-color:#ef4444; color:#ef4444;">
                        Reject
                      </button>
                    </div>
                  ` : `<span style="font-size:11px; color:var(--text-muted); font-weight:500;">Resolved</span>`}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  targetElement.querySelectorAll(".approve-doc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const docId = btn.getAttribute("data-id");
      store.updateDocumentStatus(docId, "Approved");
      toast.show("Document verified and approved.", "success");
      renderDocumentsTab(targetElement, store.getDocuments(), users);
    });
  });

  targetElement.querySelectorAll(".reject-doc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const docId = btn.getAttribute("data-id");
      store.updateDocumentStatus(docId, "Rejected");
      toast.show("Document marked as rejected.", "error");
      renderDocumentsTab(targetElement, store.getDocuments(), users);
    });
  });

  targetElement.querySelectorAll(".preview-doc-mock").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const fname = link.getAttribute("data-name");
      createDialog({
        title: `File Preview: ${fname}`,
        contentHTML: `
          <div style="background:#f3f4f6; color:#000; padding:40px 20px; text-align:center; border: 1px solid var(--glass-border); border-radius:6px; font-family:monospace;">
            <div style="font-size:40px; margin-bottom:12px;">📄</div>
            <h4 style="font-weight:700; margin-bottom:6px;">${fname}</h4>
            <p style="font-size:12px; color:#475467;">[ MOCK DIGITAL PREVIEW FRAME ]</p>
            <p style="font-size:11px; color:#98a2b3; margin-top:10px;">Security Hash: SHA-256 Verified</p>
          </div>
        `,
        submitLabel: "Close Preview",
        onSubmit: () => {}
      });
    });
  });
}

/**
 * 6. MESSAGES TAB
 */
function renderMessagesTab(targetElement, messages, users) {
  const tenants = Object.values(users).filter(u => u.role === "tenant");
  let activeTenantId = sessionStorage.getItem("owner_active_chat_tenant") || (tenants[0] ? tenants[0].id : null);

  targetElement.innerHTML = `
    <div class="glass-panel" style="display:grid; grid-template-columns: 260px 1fr; height: 500px; overflow:hidden;">
      <!-- Sidebar List -->
      <div style="border-right: 1px solid var(--glass-border); display:flex; flex-direction:column; overflow-y:auto;">
        <div style="padding:15px; border-bottom:1px solid var(--glass-border); font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase;">
          Active Chats
        </div>
        <div id="messages-sidebar-list" style="display:flex; flex-direction:column;">
          ${tenants.map(t => {
            const isActive = t.id === activeTenantId;
            return `
              <div class="msg-sidebar-item" data-id="${t.id}" style="padding:15px; border-bottom:1px solid var(--glass-border); cursor:pointer; display:flex; align-items:center; gap:10px; background:${isActive ? 'var(--glass-bg-accent)' : 'transparent'};">
                <img src="${t.avatar}" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border:${isActive ? '1px solid var(--primary-color)' : 'none'};">
                <div style="overflow:hidden;">
                  <div style="font-weight:700; font-size:13px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">${t.name}</div>
                  <div style="font-size:11px; color:var(--text-muted); text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">${t.profession || 'Tenant'}</div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Chat Thread Window -->
      <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%; background:var(--glass-bg-accent);">
        ${activeTenantId ? `
          <!-- Header -->
          <div style="background:var(--glass-bg); padding:15px; border-bottom:1px solid var(--glass-border); display:flex; align-items:center; gap:10px;">
            <img src="${users[activeTenantId].avatar}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
            <div>
              <div style="font-weight:800; font-size:14px;">${users[activeTenantId].name}</div>
              <div style="font-size:11px; color:var(--text-muted);">${users[activeTenantId].email} • Direct Thread</div>
            </div>
          </div>

          <!-- Messages Body -->
          <div id="chat-thread-body" style="flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
            ${renderThreadMessages(messages, "owner_1", activeTenantId)}
          </div>

          <!-- Form Input -->
          <form id="chat-send-form" style="background:var(--glass-bg); padding:15px; border-top:1px solid var(--glass-border); display:flex; gap:10px;">
            <input type="text" id="chat-msg-input" class="glass-input" required autocomplete="off" placeholder="Write secure message..." style="flex:1; padding:8px 12px; font-size:13px;">
            <button type="submit" class="btn btn-primary" style="padding:8px 16px; font-size:13px; border-radius:4px;">Send</button>
          </form>
        ` : `
          <div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-muted); font-size:13px;">
            Select a tenant thread to start messaging operations.
          </div>
        `}
      </div>
    </div>
  `;

  const threadBody = document.getElementById("chat-thread-body");
  if (threadBody) threadBody.scrollTop = threadBody.scrollHeight;

  targetElement.querySelectorAll(".msg-sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
      const tid = item.getAttribute("data-id");
      sessionStorage.setItem("owner_active_chat_tenant", tid);
      renderMessagesTab(targetElement, messages, users);
    });
  });

  const chatForm = document.getElementById("chat-send-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-msg-input");
      const text = input.value.trim();
      if (!text) return;

      store.sendMessage("owner_1", activeTenantId, text);
      input.value = "";
      
      renderMessagesTab(targetElement, store.getMessages(), users);

      setTimeout(() => {
        const typingIndicator = document.createElement("div");
        typingIndicator.id = "typing-loader";
        typingIndicator.style.cssText = "font-size:11px; color:var(--text-muted); font-style:italic; padding-left:10px;";
        typingIndicator.innerHTML = `${users[activeTenantId].name.split(" ")[0]} is typing...`;
        
        const thread = document.getElementById("chat-thread-body");
        if (thread) {
          thread.appendChild(typingIndicator);
          thread.scrollTop = thread.scrollHeight;
        }

        setTimeout(() => {
          const indicator = document.getElementById("typing-loader");
          if (indicator) indicator.remove();

          const replyText = `Acknowledged, Marcus. I will review this operational log in our next sprint and follow up on the status portal.`;
          store.sendMessage(activeTenantId, "owner_1", replyText);
          toast.show(`Message from ${users[activeTenantId].name.split(" ")[0]}`, "info");
          
          renderMessagesTab(targetElement, store.getMessages(), users);
        }, 1200);
      }, 800);
    });
  }
}

function renderThreadMessages(messages, ownerId, tenantId) {
  const thread = messages.filter(
    m => (m.senderId === ownerId && m.recipientId === tenantId) ||
         (m.senderId === tenantId && m.recipientId === ownerId)
  );

  if (thread.length === 0) {
    return `<div style="text-align:center; color:var(--text-muted); padding:30px; font-size:12px;">This is the start of your secure chat channel.</div>`;
  }

  return thread.map(m => {
    const isOwner = m.senderId === ownerId;
    const timeStr = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div style="display:flex; flex-direction:column; align-items:${isOwner ? 'flex-end' : 'flex-start'};">
        <div style="background:${isOwner ? '#000000' : '#ffffff'}; color:${isOwner ? '#ffffff' : 'var(--text-main)'}; border: 1px solid var(--glass-border); padding: 10px 14px; border-radius: 8px; max-width:70%; font-size:13px; font-family:var(--font-sans); box-shadow:var(--shadow-premium);">
          ${m.text}
        </div>
        <span style="font-size:10px; color:var(--text-muted); margin-top:4px; font-family:var(--font-sans);">${timeStr}</span>
      </div>
    `;
  }).join("");
}

/**
 * 7. MY PROFILE TAB
 */
function renderProfileTab(targetElement, owner) {
  targetElement.innerHTML = `
    <div class="glass-panel" style="padding:30px; max-width:600px; margin: 0 auto;">
      <h3 style="font-size:20px; margin-bottom:20px;">Operator Profile Settings</h3>
      
      <form id="owner-profile-form">
        <div class="form-group">
          <label>Profile Avatar Reference</label>
          <div style="display:flex; align-items:center; gap:15px; margin-top:6px;">
            <img src="${owner.avatar}" style="width:54px; height:54px; border-radius:50%; object-fit:cover; border:1px solid var(--primary-color);">
            <span style="font-size:12px; color:var(--text-muted);">Avatar syncs with dicebear initials automatically on name updates.</span>
          </div>
        </div>
        
        <div class="form-group" style="margin-top:20px;">
          <label for="prof-name">Full Name</label>
          <input type="text" id="prof-name" name="name" class="glass-input" required value="${owner.name}">
        </div>

        <div class="form-group">
          <label for="prof-email">Email Address</label>
          <input type="email" id="prof-email" name="email" class="glass-input" required value="${owner.email}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="prof-phone">Operations Hotline</label>
            <input type="text" id="prof-phone" name="phone" class="glass-input" required value="${owner.phone}">
          </div>
          <div class="form-group">
            <label for="prof-comp">Asset Holding Company</label>
            <input type="text" id="prof-comp" name="company" class="glass-input" required value="${owner.company || ''}">
          </div>
        </div>

        <div style="margin-top:20px; border-top:1px dashed var(--glass-border); padding-top:15px;">
          <h4 style="font-size:12px; font-family:var(--font-sans); font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:12px; letter-spacing:0.05em;">Notifications Dispatch</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; text-transform:none; cursor:pointer;">
              <input type="checkbox" name="notifyEmail" ${owner.notifyEmail ? 'checked' : ''} style="accent-color:var(--primary-color);">
              <span>Dispatched ledger receipts to registered email address</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; text-transform:none; cursor:pointer;">
              <input type="checkbox" name="notifySMS" ${owner.notifySMS ? 'checked' : ''} style="accent-color:var(--primary-color);">
              <span>Dispatched urgent service updates to mobile hotline</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:25px;">
          💾 Save Profile Changes
        </button>
      </form>
    </div>
  `;

  const form = document.getElementById("owner-profile-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      notifyEmail: formData.get("notifyEmail") === "on",
      notifySMS: formData.get("notifySMS") === "on"
    };

    store.updateProfile(owner.id, data);
    toast.show("Operator profile settings updated.", "success");
    renderOwnerView(targetElement.parentElement);
  });
}

/**
 * 8. DASHBOARD SUMMARY TAB
 */
function renderSummaryTab(targetElement, properties, requests, payments, users) {
  const totalPaid = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const maintenanceExpenses = requests.filter(r => r.status === "Resolved").reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const netYield = totalPaid - maintenanceExpenses;
  const activeRequests = requests.filter(r => r.status !== "Resolved").length;

  targetElement.innerHTML = `
    <!-- Alcove Architectural Dashboard Hero -->
    <div class="dashboard-header" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(28,26,23,0.95) 0%, rgba(45,58,47,0.9) 100%), url('assets/property_modern.png') center/cover no-repeat; color:#ffffff; padding: 28px 32px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; background:rgba(255,255,255,0.15); color:#ffffff; padding:4px 10px; border-radius:20px; display:inline-block; margin-bottom:8px; backdrop-filter:blur(6px);">
          ${store.getCurrentUser().company || 'Marcus Properties LLC'}
        </span>
        <h2 style="color:#ffffff; font-size:26px; font-weight:700; margin-bottom:4px; letter-spacing:-0.02em;">Welcome back, ${store.getCurrentUser().name}</h2>
        <p style="color:rgba(255,255,255,0.8); font-size:13px;">Overview of active properties, financial ledgers, and maintenance requests.</p>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${store.getCurrentUser().avatar}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.3);">
      </div>
    </div>

    <!-- Metrics Section -->
    <div class="metrics-row" style="margin-bottom: 24px;">
      <div class="glass-panel metric-card">
        <div class="metric-icon">💰</div>
        <div class="metric-details">
          <h4>${t("metric_gross_rent")}</h4>
          <div class="value">$${totalPaid.toLocaleString()}</div>
        </div>
      </div>

      <div class="glass-panel metric-card">
        <div class="metric-icon">💸</div>
        <div class="metric-details">
          <h4>${t("metric_net_rent")}</h4>
          <div class="value">$${netYield.toLocaleString()}</div>
        </div>
      </div>
      
      <div class="glass-panel metric-card">
        <div class="metric-icon">📈</div>
        <div class="metric-details" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <div style="flex:1;">
            <h4>${t("metric_occupancy")}</h4>
            <div class="value">${properties.length} ${t("sidebar_properties")}</div>
          </div>
          <div id="occupancy-gauge-mount" style="width: 80px; height: 80px;"></div>
        </div>
      </div>

      <div class="glass-panel metric-card">
        <div class="metric-icon">🔧</div>
        <div class="metric-details">
          <h4>${t("metric_active_maint")}</h4>
          <div class="value">${activeRequests} Pending</div>
        </div>
      </div>
    </div>

    <!-- Floor Plan Map Section -->
    <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size:15px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>Building Floor Plan</span>
        <span style="font-size:9px; color:var(--text-muted); font-weight:600;">Hover for details • Click unit to view</span>
      </h3>
      <div id="floor-plan-map-mount"></div>
    </div>

    <div class="grid-2">
      <!-- Chart Card -->
      <div class="glass-panel" style="padding: 20px;">
        <h3 style="font-size:15px; margin-bottom:12px;">Cash Flow Summary</h3>
        <div id="financial-chart-mount" class="chart-container" style="height: 180px;"></div>
      </div>
      
      <!-- Recent Alerts Overview -->
      <div class="glass-panel" style="padding: 20px;">
        <h3 style="font-size:15px; margin-bottom:12px;">Recent Activity</h3>
        <div style="display:flex; flex-direction:column; gap:8px; max-height: 200px; overflow-y:auto;">
          ${store.getNotifications().slice(0, 4).map(n => {
            let emoji = "💡";
            if (n.type === "payment") emoji = "💰";
            if (n.type === "maintenance") emoji = "🔧";
            if (n.type === "invite") emoji = "✉️";
            const relativeTime = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
              <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:10px; border-radius:6px; font-size:11px; display:flex; gap:10px; align-items:center;">
                <span style="font-size:14px;">${emoji}</span>
                <div style="flex:1;">
                  <p style="color:var(--text-main); font-weight:600; line-height:1.3; margin:0;">${n.text}</p>
                </div>
                <span style="color:var(--text-muted); font-size:9px;">${relativeTime}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  // Render occupancy gauge
  const gaugeMount = document.getElementById("occupancy-gauge-mount");
  renderOccupancyGauge(gaugeMount, properties);

  // Render chart
  const chartMount = document.getElementById("financial-chart-mount");
  renderFinancialChart(chartMount, payments);

  // Render Floor Plan Map
  const floorPlanMount = document.getElementById("floor-plan-map-mount");
  renderFloorPlan(floorPlanMount, properties, requests, users, (propertyId, unitId) => {
    const prop = properties.find(p => p.id === propertyId);
    const unit = prop ? prop.units.find(u => u.id === unitId) : null;
    if (!unit) return;

    const hasIssue = requests.some(r => r.unitId === unitId && r.status !== "Resolved");
    if (hasIssue) {
      sessionStorage.setItem("owner_active_tab", "maintenance");
      sessionStorage.setItem("kanban_highlight_ticket_unit", unitId);
    } else if (unit.status === "Occupied") {
      sessionStorage.setItem("owner_active_tab", "leases");
    } else {
      sessionStorage.setItem("owner_active_tab", "leases");
      sessionStorage.setItem("leases_highlight_unit", `${propertyId}|${unitId}`);
      sessionStorage.setItem("leases_auto_open_invite", "true");
    }
    renderOwnerView(targetElement.parentElement);
  });
}
