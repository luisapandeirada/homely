import { store } from "../store.js";
import { renderFinancialChart, renderOccupancyGauge, createDialog, toast, downloadCSV, renderFloorPlan } from "../components.js";
import { t } from "../i18n.js";
import { emailService } from "../emailService.js";
import { pdfService } from "../pdfService.js";

export function renderOwnerView(container) {
  const properties = store.getProperties();
  const requests = store.getMaintenanceRequests();
  const payments = store.getRentPayments();
  const users = store.getUsers();

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
 * 1. SUMMARY / OVERVIEW TAB
 */
function renderSummaryTab(targetElement, properties, requests, payments, users) {
  let totalUnits = 0;
  let occupiedUnits = 0;
  properties.forEach(p => {
    p.units.forEach(u => {
      totalUnits++;
      if (u.tenantId) occupiedUnits++;
    });
  });

  const grossRent = payments.reduce((acc, p) => p.status === "Paid" ? acc + p.amount : acc, 0);
  const activeRequestsCount = requests.filter(r => r.status !== "Completed" && r.status !== "Resolved").length;

  if (properties.length === 0) {
    targetElement.innerHTML = `
      <div class="metrics-row">
        <div class="metric-card"><div class="metric-icon">💶</div><div class="metric-details"><h4>${t("metric_gross_rent")}</h4><div class="value">€0</div></div></div>
        <div class="metric-card"><div class="metric-icon">📈</div><div class="metric-details"><h4>${t("metric_net_rent")}</h4><div class="value">€0</div></div></div>
        <div class="metric-card"><div class="metric-icon">🏢</div><div class="metric-details"><h4>${t("metric_occupancy")}</h4><div class="value">0%</div></div></div>
        <div class="metric-card"><div class="metric-icon">🔧</div><div class="metric-details"><h4>${t("metric_active_maint")}</h4><div class="value">0</div></div></div>
      </div>

      <div class="glass-card" style="text-align:center; padding:60px 24px; margin-top:24px; border-radius:16px;">
        <div style="font-size:48px; margin-bottom:16px;">🏢</div>
        <h3 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:8px;">O seu portfólio está vazio</h3>
        <p style="font-size:14px; color:var(--text-muted); max-width:520px; margin:0 auto 28px auto; line-height:1.6;">
          Registe o seu primeiro imóvel e as suas frações para começar a gerir contratos de arrendamento, rendas mensais e pedidos de reparação.
        </p>
        <button class="btn btn-primary" id="summary-add-prop-btn" style="padding:14px 32px; font-size:14px;">
          ${t("btn_add_property")}
        </button>
      </div>
    `;

    document.getElementById("summary-add-prop-btn")?.addEventListener("click", () => {
      triggerAddPropertyModal(targetElement);
    });
    return;
  }

  targetElement.innerHTML = `
    <!-- Metrics Row -->
    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-icon">💶</div>
        <div class="metric-details">
          <h4>${t("metric_gross_rent")}</h4>
          <div class="value">€${grossRent.toLocaleString()}</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">📈</div>
        <div class="metric-details">
          <h4>${t("metric_net_rent")}</h4>
          <div class="value">€${Math.round(grossRent * 0.88).toLocaleString()}</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">🏢</div>
        <div class="metric-details">
          <h4>${t("metric_occupancy")}</h4>
          <div class="value">${totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0}%</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon">🔧</div>
        <div class="metric-details">
          <h4>${t("metric_active_maint")}</h4>
          <div class="value">${activeRequestsCount}</div>
        </div>
      </div>
    </div>

    <!-- Interactive Portfolio Floor Plan Matrix -->
    <div class="glass-card floor-plan-card" style="margin-bottom:28px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:400; margin-bottom:4px;">Matriz de Imóveis & Frações (Portugal & EU)</h3>
          <p style="font-size:12px; color:var(--text-muted); font-family:var(--font-sans);">Visão interativa de frações, inquilinos e rendas mensais em euros.</p>
        </div>
        <div style="display:flex; gap:12px; font-size:11px; font-weight:600; font-family:var(--font-sans);">
          <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> ${t("units_leased")}</span>
          <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#f59e0b;"></span> ${t("vacant")}</span>
        </div>
      </div>
      <div id="floor-plan-mount"></div>
    </div>

    <!-- Charts Grid -->
    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px;">
      <div class="glass-card">
        <h3 style="font-family:var(--font-serif); font-size:18px; font-weight:400; margin-bottom:16px;">Rendimento Mensal (€)</h3>
        <div id="financial-chart-container"></div>
      </div>
      <div class="glass-card">
        <h3 style="font-family:var(--font-serif); font-size:18px; font-weight:400; margin-bottom:16px;">${t("metric_occupancy")}</h3>
        <div id="occupancy-gauge-container"></div>
      </div>
    </div>
  `;

  renderFloorPlan(document.getElementById("floor-plan-mount"), properties, (unit, prop) => {
    toast.show(`${unit.number} (${prop.name}) - Renda: €${unit.rent}/mês`, "info");
  });
  renderFinancialChart(document.getElementById("financial-chart-container"), payments);
  renderOccupancyGauge(document.getElementById("occupancy-gauge-container"), occupiedUnits, totalUnits);
}

function triggerAddPropertyModal(targetElement) {
  createDialog({
    title: t("btn_add_property"),
    contentHTML: `
      <div class="form-group">
        <label for="prop-name">Nome do Imóvel</label>
        <input type="text" id="prop-name" name="name" class="glass-input" required placeholder="e.g. Edifício Chiado">
      </div>
      <div class="form-group">
        <label for="prop-address">Morada Completa</label>
        <input type="text" id="prop-address" name="address" class="glass-input" required placeholder="e.g. Rua Garrett 45, Lisboa">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="prop-type">Tipo de Imóvel</label>
          <select id="prop-type" name="type" class="glass-input">
            <option value="Apartment">Apartamento</option>
            <option value="Loft">Loft / Estúdio</option>
            <option value="Single Family">Moradia</option>
            <option value="Condo">Fração Autónoma</option>
          </select>
        </div>
        <div class="form-group">
          <label for="prop-rent">Renda Prevista (€)</label>
          <input type="number" id="prop-rent" name="rent" class="glass-input" required min="100" placeholder="e.g. 1500">
        </div>
      </div>
      <div class="form-group">
        <label for="prop-units-string">Designação das Frações (separadas por vírgula)</label>
        <textarea id="prop-units-string" name="unitsString" class="glass-input" required placeholder="e.g. 1º Dto, 1º Esq, 2º Dto" rows="2"></textarea>
      </div>
    `,
    submitLabel: t("btn_add_property"),
    onSubmit: (data) => {
      store.addProperty(data);
      toast.show("Imóvel adicionado com sucesso.", "success");
      renderOwnerView(targetElement.closest(".dashboard-wrapper")?.parentElement || targetElement);
    }
  });
}

/**
 * 2. PROPERTIES TAB
 */
function renderPropertiesTab(targetElement, properties, users) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("properties_title")}</h2>
      <button class="btn btn-primary" id="add-property-btn">
        ${t("btn_add_property")}
      </button>
    </div>

    ${properties.length === 0 ? `
      <div class="glass-panel" style="text-align:center; padding:60px 24px; border-radius:16px; margin-top:20px;">
        <div style="font-size:48px; margin-bottom:16px;">🏢</div>
        <h3 style="font-family:var(--font-serif); font-size:24px; font-weight:400; margin-bottom:8px;">Nenhum imóvel registado</h3>
        <p style="font-size:14px; color:var(--text-muted); max-width:480px; margin:0 auto 24px auto;">
          Clique abaixo para registar o seu primeiro imóvel e começar a organizar o portfólio.
        </p>
      </div>
    ` : `
      <div class="properties-grid">
        ${properties.map(p => {
          const totalUnits = p.units.length;
          const occupied = p.units.filter(u => u.status === "Occupied").length;
          const vacant = totalUnits - occupied;

          return `
            <div class="glass-panel property-card">
              <div class="property-img-wrapper">
                <img class="property-img" src="${p.image}" alt="${p.name}">
                <span class="property-type-tag">${p.type}</span>
              </div>
              <div class="property-info">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                  <div>
                    <h3>${p.name}</h3>
                    <p>📍 ${p.address}</p>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary edit-prop-btn" data-id="${p.id}" style="font-size:11px; padding:4px 8px;" title="Editar Imóvel">✏️</button>
                    <button class="btn btn-secondary delete-prop-btn" data-id="${p.id}" style="font-size:11px; padding:4px 8px; color:#ef4444;" title="Eliminar Imóvel">🗑️</button>
                  </div>
                </div>
                
                <div style="margin: 15px 0;">
                  <div style="font-weight: 700; font-size: 11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom: 8px;">${t("units_distribution")}</div>
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${p.units.map(u => {
                      const tenantName = u.tenantId ? (users[u.tenantId]?.name || "Inquilino") : "Livre";
                      return `
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--glass-bg-accent); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border);">
                          <span style="font-weight:600; font-family:var(--font-sans);">${u.number} <span style="color:var(--text-muted); font-weight:400;">(€${u.rent.toLocaleString()}/mês)</span></span>
                          <div style="display:flex; align-items:center; gap:8px;">
                            <span class="unit-pill ${u.status.toLowerCase()}">${u.status === 'Occupied' ? t("units_leased") : t("vacant")}</span>
                            ${u.tenantId ? `<span style="font-size:11px; color:var(--text-muted); font-weight:500;">${tenantName}</span>` : ""}
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>

                <div class="property-units-summary">
                  <span>${t("units_leased")}: <strong>${occupied} / ${totalUnits}</strong></span>
                  <span class="${vacant > 0 ? 'text-warning' : 'text-success'}" style="font-weight:700;">
                    ${vacant > 0 ? `${vacant} ${t("vacant")}` : t("fully_leased")}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `}
  `;

  document.getElementById("add-property-btn")?.addEventListener("click", () => {
    triggerAddPropertyModal(targetElement);
  });

  // Bind Edit Property buttons
  targetElement.querySelectorAll(".edit-prop-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const propId = btn.getAttribute("data-id");
      const prop = properties.find(p => p.id === propId);
      if (!prop) return;

      createDialog({
        title: "Editar Imóvel",
        contentHTML: `
          <div class="form-group">
            <label for="edit-prop-name">Nome do Imóvel</label>
            <input type="text" id="edit-prop-name" name="name" class="glass-input" required value="${prop.name}">
          </div>
          <div class="form-group">
            <label for="edit-prop-address">Morada Completa</label>
            <input type="text" id="edit-prop-address" name="address" class="glass-input" required value="${prop.address}">
          </div>
          <div class="form-group">
            <label for="edit-prop-type">Tipo de Imóvel</label>
            <select id="edit-prop-type" name="type" class="glass-input">
              <option value="Apartment" ${prop.type === 'Apartment' ? 'selected' : ''}>Apartamento</option>
              <option value="Loft" ${prop.type === 'Loft' ? 'selected' : ''}>Loft / Estúdio</option>
              <option value="Single Family" ${prop.type === 'Single Family' ? 'selected' : ''}>Moradia</option>
              <option value="Condo" ${prop.type === 'Condo' ? 'selected' : ''}>Fração Autónoma</option>
            </select>
          </div>
        `,
        submitLabel: "Guardar Alterações",
        onSubmit: (data) => {
          store.updateProperty(propId, data);
          toast.show("Dados do imóvel atualizados.", "success");
          renderOwnerView(targetElement.closest(".dashboard-wrapper")?.parentElement || targetElement);
        }
      });
    });
  });

  // Bind Delete Property buttons
  targetElement.querySelectorAll(".delete-prop-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const propId = btn.getAttribute("data-id");
      const prop = properties.find(p => p.id === propId);
      if (!prop) return;

      if (confirm(`Tem a certeza que pretende eliminar o imóvel '${prop.name}' do seu portfólio?`)) {
        store.deleteProperty(propId);
        toast.show("Imóvel removido do portfólio.", "success");
        renderOwnerView(targetElement.closest(".dashboard-wrapper")?.parentElement || targetElement);
      }
    });
  });
}

/**
 * 3. LEASES TAB
 */
function renderLeasesTab(targetElement, properties, users, invitations) {
  const leases = store.getLeases();
  const vacantUnits = [];
  properties.forEach(p => {
    p.units.forEach(u => {
      if (!u.tenantId) vacantUnits.push({ propertyName: p.name, propertyId: p.id, unitId: u.id, number: u.number, rent: u.rent });
    });
  });

  const pendingInvites = invitations.filter(i => i.status === "Pending");

  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("leases_title")}</h2>
      ${vacantUnits.length > 0 ? `
        <button class="btn btn-primary" id="invite-renter-btn">
          ✉️ ${t("btn_invite_tenant")}
        </button>
      ` : (properties.length === 0 ? `
        <button class="btn btn-primary" id="invite-renter-btn-disabled" disabled style="opacity:0.5; cursor:not-allowed;">
          ✉️ ${t("btn_invite_tenant")}
        </button>
      ` : "")}
    </div>

    ${properties.length === 0 ? `
      <div class="glass-panel" style="text-align:center; padding:48px 24px; border-radius:16px; margin-bottom:30px;">
        <div style="font-size:40px; margin-bottom:12px;">✉️</div>
        <h3 style="font-family:var(--font-serif); font-size:22px; font-weight:400; margin-bottom:8px;">Adicione um imóvel primeiro</h3>
        <p style="font-size:13px; color:var(--text-muted); max-width:440px; margin:0 auto 20px auto;">
          Para poder convidar um inquilino, precisa de ter pelo menos uma fração registada no seu portfólio.
        </p>
        <button class="btn btn-primary" id="leases-add-prop-btn">
          ${t("btn_add_property")}
        </button>
      </div>
    ` : `
      <div class="glass-table-wrapper" style="margin-bottom:40px;">
        <table class="glass-table">
          <thead>
            <tr>
              <th>${t("properties_title")} / Fração</th>
              <th>Inquilino</th>
              <th>${t("monthly_rent")} & ${t("deposit")}</th>
              <th>${t("lease_period")}</th>
              <th>${t("nif_number")} & ${t("verification_status")}</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${leases.length === 0 ? `
              <tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">Sem contratos ativos registados.</td></tr>
            ` : leases.map(lease => {
              const prop = properties.find(p => p.id === lease.propertyId);
              const unit = prop ? prop.units.find(u => u.id === lease.unitId) : null;
              const tenant = users[lease.tenantId];
              return `
                <tr>
                  <td>
                    <div style="font-weight: 700;">${prop ? prop.name : 'Imóvel'}</div>
                    <div style="font-size:11px; color: var(--text-muted);">${unit ? unit.number : 'Fração'}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;">${tenant ? tenant.name : 'Inquilino'}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${tenant ? tenant.email : ''}</div>
                  </td>
                  <td>
                    <div style="font-weight:700;">€${lease.rent.toLocaleString()}/mês</div>
                    <div style="font-size:11px; color:var(--text-muted);">${t("deposit")}: €${lease.deposit.toLocaleString()}</div>
                  </td>
                  <td style="font-size:12px;">${lease.startDate} a ${lease.endDate}</td>
                  <td>
                    <div style="font-size:11px; font-weight:600;">NIF: ${tenant && tenant.nif ? tenant.nif : 'Pendente'}</div>
                    <span style="font-size:10px; color:#10b981; font-weight:700;">✓ IRS Verificado</span>
                  </td>
                  <td><span class="unit-pill ${lease.status === 'Active' ? 'occupied' : 'vacant'}">${lease.status}</span></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `}

    <!-- Convites Pendentes (Pending Invitations Section) -->
    <div style="margin-top:32px;">
      <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:400; margin-bottom:16px;">Convites de Inquilinos Pendentes</h3>
      <div class="glass-table-wrapper">
        <table class="glass-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome & E-mail</th>
              <th>Fração & Renda</th>
              <th>Data de Envio</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${pendingInvites.length === 0 ? `
              <tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">Nenhum convite pendente.</td></tr>
            ` : pendingInvites.map(inv => {
              const prop = properties.find(p => p.id === inv.propertyId);
              const unit = prop ? prop.units.find(u => u.id === inv.unitId) : null;
              const directLink = `${window.location.origin}${window.location.pathname}#/signup?code=${inv.code}`;
              return `
                <tr>
                  <td><span style="font-family:monospace; font-weight:700; color:#10b981;">${inv.code}</span></td>
                  <td>
                    <div style="font-weight:600;">${inv.name}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${inv.email}</div>
                  </td>
                  <td>
                    <div style="font-size:12px; font-weight:600;">${prop ? prop.name : ''} (${unit ? unit.number : ''})</div>
                    <div style="font-size:11px; color:var(--text-muted);">€${inv.rentAmount}/mês</div>
                  </td>
                  <td style="font-size:12px;">${new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td><span class="unit-pill vacant">Pendente</span></td>
                  <td>
                    <button class="btn btn-secondary copy-pending-link-btn" data-link="${directLink}" style="font-size:11px; padding:6px 12px;">
                      📋 Copiar Link
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("leases-add-prop-btn")?.addEventListener("click", () => {
    triggerAddPropertyModal(targetElement);
  });

  targetElement.querySelectorAll(".copy-pending-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const link = btn.getAttribute("data-link");
      navigator.clipboard.writeText(link);
      toast.show("Link de convite copiado para a área de transferência!", "success");
    });
  });

  document.getElementById("invite-renter-btn")?.addEventListener("click", () => {
    createDialog({
      title: t("btn_invite_tenant"),
      contentHTML: `
        <div class="form-group">
          <label for="invite-unit">Fração Disponível</label>
          <select id="invite-unit" name="unitKey" class="glass-input">
            ${vacantUnits.map(v => `<option value="${v.propertyId}|${v.unitId}">${v.propertyName} - ${v.number} (€${v.rent}/mês)</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="invite-name">Nome do Inquilino</label>
          <input type="text" id="invite-name" name="name" class="glass-input" required placeholder="e.g. João Silva">
        </div>
        <div class="form-group">
          <label for="invite-email">E-mail do Inquilino</label>
          <input type="email" id="invite-email" name="email" class="glass-input" required placeholder="e.g. joao.silva@domain.pt">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="invite-rent">Renda Mensal (€)</label>
            <input type="number" id="invite-rent" name="rent" class="glass-input" required value="1200">
          </div>
          <div class="form-group">
            <label for="invite-deposit">Caução (€)</label>
            <input type="number" id="invite-deposit" name="deposit" class="glass-input" required value="2400">
          </div>
        </div>
      `,
      submitLabel: t("btn_invite_tenant"),
      onSubmit: (data) => {
        const [propId, unitId] = data.unitKey.split("|");
        const newInvite = store.createInvitation({ ...data, propertyId: propId, unitId: unitId });
        const inviteUrl = `${window.location.origin}${window.location.pathname}#/signup?code=${newInvite.code}`;
        const targetProp = properties.find(p => p.id === propId);
        const targetUnit = targetProp ? targetProp.units.find(u => u.id === unitId) : null;

        // Dispatch email via emailService
        emailService.sendTenantInvitation({
          name: newInvite.name,
          email: newInvite.email,
          inviteCode: newInvite.code,
          propertyName: targetProp ? targetProp.name : "Imóvel",
          unitNumber: targetUnit ? targetUnit.number : "Fração",
          rentAmount: newInvite.rentAmount,
          inviteUrl: inviteUrl
        });

        // Render interactive sent invitation email modal
        const inviteModalOverlay = document.createElement("div");
        inviteModalOverlay.className = "dialog-overlay";
        inviteModalOverlay.innerHTML = `
          <div class="dialog-content" style="max-width:540px; padding:0; overflow:hidden; border-radius:16px;">
            <div style="background:#1c1a17; color:#ffffff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:20px;">✉️</span>
                <div>
                  <h4 style="font-family:var(--font-serif); font-size:18px; font-weight:400; color:#fff; margin:0;">Convite Enviado por E-mail</h4>
                  <span style="font-size:11px; color:rgba(255,255,255,0.7); font-family:var(--font-sans);">[Homely Automated Invitation Dispatch]</span>
                </div>
              </div>
            </div>

            <div style="padding:28px; background:#faf7f2;">
              <div style="font-size:13px; color:var(--text-main); margin-bottom:16px; background:#fff; padding:12px 16px; border-radius:8px; border:1px solid var(--glass-border);">
                <p style="margin-bottom:4px;"><strong>Para:</strong> ${newInvite.name} (&lt;${newInvite.email}&gt;)</p>
                <p style="margin-bottom:0;"><strong>Assunto:</strong> [Homely] Convite para Arrendamento de Imóvel</p>
              </div>

              <div style="background:#ffffff; border:1px dashed var(--glass-border); padding:18px; border-radius:10px; text-align:center; margin-bottom:24px;">
                <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Código de Convite / Invite Code</span>
                <span style="font-family:monospace; font-size:26px; font-weight:700; letter-spacing:0.15em; color:#10b981; display:block; margin-bottom:12px;">${newInvite.code}</span>

                <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-muted); font-weight:700; display:block; margin-bottom:6px;">Link Direto para o Inquilino Regista-se</span>
                <input type="text" id="modal-invite-link-field" readonly class="glass-input" style="font-size:12px; font-family:monospace; text-align:center;" value="${inviteUrl}">
              </div>

              <div style="display:flex; gap:12px;">
                <button id="modal-copy-link-btn" class="btn btn-secondary" style="flex:1; padding:12px;">📋 Copiar Link</button>
                <button id="modal-close-invite-btn" class="btn btn-primary" style="flex:1; padding:12px;">Concluído</button>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(inviteModalOverlay);

        document.getElementById("modal-copy-link-btn").addEventListener("click", () => {
          navigator.clipboard.writeText(inviteUrl);
          toast.show("Link de convite copiado!", "success");
        });

        document.getElementById("modal-close-invite-btn").addEventListener("click", () => {
          document.body.removeChild(inviteModalOverlay);
          renderOwnerView(targetElement.closest(".dashboard-wrapper")?.parentElement || targetElement);
        });
      }
    });
  });
}

/**
 * 4. MAINTENANCE TAB
 */
function renderMaintenanceTab(targetElement, requests, properties, users) {
  const contractors = store.getContractors();

  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("maintenance_title")}</h2>
    </div>
    <div class="maintenance-board">
      <div class="maintenance-column">
        <div class="column-header">
          <h3>${t("reported")}</h3>
          <span class="card-count">${requests.filter(r => r.status === 'Reported').length}</span>
        </div>
        <div class="ticket-list">
          ${requests.filter(r => r.status === 'Reported').map(r => `
            <div class="ticket-card maintenance-ticket-clickable" data-id="${r.id}" style="cursor:pointer;" title="Clique para gerir reparação">
              <div class="ticket-header">
                <h4>${r.title}</h4>
                <span class="ticket-badge priority-${r.priority.toLowerCase()}">${r.priority}</span>
              </div>
              <p>${r.description}</p>
              <div style="font-size:11px; color:var(--text-muted); margin-top:8px; display:flex; justify-content:space-between;">
                <span>👤 ${users[r.tenantId]?.name || 'Residente'}</span>
                <span>⚙️ Clique p/ gerir</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="maintenance-column">
        <div class="column-header">
          <h3>${t("in_progress")}</h3>
          <span class="card-count">${requests.filter(r => r.status === 'In Progress').length}</span>
        </div>
        <div class="ticket-list">
          ${requests.filter(r => r.status === 'In Progress').map(r => `
            <div class="ticket-card maintenance-ticket-clickable" data-id="${r.id}" style="cursor:pointer;" title="Clique para gerir reparação">
              <div class="ticket-header">
                <h4>${r.title}</h4>
                <span class="ticket-badge priority-high">${t("in_progress")}</span>
              </div>
              <p>${r.description}</p>
              <div style="font-size:11px; color:var(--text-muted); margin-top:8px; display:flex; justify-content:space-between;">
                <span>👤 ${users[r.tenantId]?.name || 'Residente'}</span>
                <span>⚙️ Gerir</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="maintenance-column">
        <div class="column-header">
          <h3>${t("completed")}</h3>
          <span class="card-count">${requests.filter(r => r.status === 'Completed' || r.status === 'Resolved').length}</span>
        </div>
        <div class="ticket-list">
          ${requests.filter(r => r.status === 'Completed' || r.status === 'Resolved').map(r => `
            <div class="ticket-card maintenance-ticket-clickable" data-id="${r.id}" style="cursor:pointer;" title="Clique para gerir reparação">
              <div class="ticket-header">
                <h4>${r.title}</h4>
                <span class="ticket-badge priority-low">✓ ${t("completed")}</span>
              </div>
              <p>${r.description}</p>
              <div style="font-size:11px; color:var(--text-muted); margin-top:8px; display:flex; justify-content:space-between;">
                <span>Custo: €${r.cost || 0}</span>
                <span>✓ Concluído</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  // Bind click handlers for managing repair tickets
  targetElement.querySelectorAll(".maintenance-ticket-clickable").forEach(card => {
    card.addEventListener("click", () => {
      const reqId = card.getAttribute("data-id");
      const req = requests.find(r => r.id === reqId);
      if (!req) return;

      createDialog({
        title: `Gerir Reparação: ${req.title}`,
        contentHTML: `
          <div style="margin-bottom:16px; font-size:13px; color:var(--text-muted);">
            <p style="margin-bottom:4px;"><strong>Descrição:</strong> ${req.description}</p>
            <p style="margin-bottom:4px;"><strong>Categoria:</strong> ${req.category} | <strong>Urgência:</strong> ${req.priority}</p>
            <p><strong>Residente:</strong> ${users[req.tenantId]?.name || 'Residente'}</p>
          </div>

          <div class="form-group">
            <label for="maint-status">Estado da Reparação</label>
            <select id="maint-status" name="status" class="glass-input">
              <option value="Reported" ${req.status === 'Reported' ? 'selected' : ''}>Registado</option>
              <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>Em Resolução / Atribuído</option>
              <option value="Completed" ${req.status === 'Completed' || req.status === 'Resolved' ? 'selected' : ''}>Concluído & Resolvido</option>
            </select>
          </div>

          <div class="form-group">
            <label for="maint-contractor">Atribuir Prestador de Serviços / Empreiteiro</label>
            <select id="maint-contractor" name="contractorId" class="glass-input">
              <option value="">-- Selecionar Prestador --</option>
              ${contractors.map(c => `<option value="${c.id}" ${req.contractorId === c.id ? 'selected' : ''}>${c.name} (${c.trade} - ${c.rating})</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label for="maint-cost">Custo Faturado (€) (Dedução Fiscal IRS)</label>
            <input type="number" id="maint-cost" name="cost" class="glass-input" value="${req.cost || 0}" min="0" step="10" placeholder="e.g. 150">
          </div>
        `,
        submitLabel: "Guardar Estado da Reparação",
        onSubmit: (data) => {
          store.updateMaintenanceStatus(req.id, data.status, data.cost, "Reparações");
          toast.show("Estado da reparação e custos atualizados!", "success");
          renderOwnerView(targetElement.closest(".dashboard-wrapper")?.parentElement || targetElement);
        }
      });
    });
  });
}

/**
 * 5. FINANCIALS TAB
 */
function renderFinancialsTab(targetElement, payments, users, properties) {
  const totalCollected = payments.reduce((acc, p) => p.status === "Paid" ? acc + p.amount : acc, 0);

  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("financials_title")}</h2>
      <button class="btn btn-secondary" id="export-csv-btn">${t("btn_export_csv")}</button>
    </div>

    <div class="metrics-row" style="margin-bottom:28px;">
      <div class="metric-card">
        <div class="metric-icon">💶</div>
        <div class="metric-details">
          <h4>${t("total_collected")}</h4>
          <div class="value">€${totalCollected.toLocaleString()}</div>
        </div>
      </div>
    </div>

    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data de Vencimento</th>
            <th>Estado</th>
            <th>Recibo</th>
          </tr>
        </thead>
        <tbody>
          ${payments.map(p => {
            const tenantUser = users[p.tenantId];
            const prop = properties.find(pr => pr.id === p.propertyId);
            const unit = prop ? prop.units.find(u => u.id === p.unitId) : null;
            return `
              <tr>
                <td style="font-weight:600;">${p.description || 'Renda Mensal'}</td>
                <td style="font-weight:700;">€${p.amount.toLocaleString()}</td>
                <td>${p.dueDate}</td>
                <td><span class="payment-status-badge ${p.status.toLowerCase()}">${p.status === 'Paid' ? 'Pago' : 'Pendente'}</span></td>
                <td>
                  <button class="btn btn-secondary download-receipt-pdf-btn" data-id="${p.id}" style="font-size:11px; padding:4px 10px;">
                    📄 Recibo PDF
                  </button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  targetElement.querySelectorAll(".download-receipt-pdf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-id");
      const p = payments.find(pay => pay.id === pId);
      if (!p) return;
      const tenantUser = users[p.tenantId];
      const prop = properties.find(pr => pr.id === p.propertyId);
      const unit = prop ? prop.units.find(u => u.id === p.unitId) : null;
      pdfService.downloadReceiptPDF(p, tenantUser, prop, unit);
    });
  });

  document.getElementById("export-csv-btn")?.addEventListener("click", () => {
    downloadCSV("relatorio_financeiro_homely.csv", payments);
  });
}

/**
 * 6. DOCUMENTS TAB
 */
function renderDocumentsTab(targetElement, documents, users) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("sidebar_documents")}</h2>
    </div>
    <div class="glass-table-wrapper">
      <table class="glass-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Tipo</th>
            <th>Utilizador</th>
            <th>Data</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${documents.map(d => `
            <tr>
              <td style="font-weight:600;">📄 ${d.name}</td>
              <td>${d.type}</td>
              <td>${users[d.userId]?.name || 'Utilizador'}</td>
              <td>${new Date(d.uploadedAt).toLocaleDateString()}</td>
              <td><span class="unit-pill occupied">✓ Verificado</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * 7. MESSAGES TAB
 */
function renderMessagesTab(targetElement, messages, users) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("sidebar_messages")}</h2>
    </div>
    <div class="glass-panel" style="padding:24px; max-width:700px;">
      <div style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; margin-bottom:20px;">
        ${messages.map(m => `
          <div style="background:var(--glass-bg-accent); padding:12px 16px; border-radius:8px; border:1px solid var(--glass-border);">
            <div style="font-weight:700; font-size:12px; margin-bottom:4px;">${users[m.senderId]?.name || 'Utilizador'}</div>
            <p style="font-size:14px;">${m.text}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/**
 * 8. PROFILE TAB
 */
function renderProfileTab(targetElement, user) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("profile_title")}</h2>
    </div>
    <div class="glass-panel" style="padding:32px; max-width:600px; border-radius:16px;">
      <form id="owner-profile-form">
        <div class="form-group">
          <label>${t("full_name")}</label>
          <input type="text" name="name" class="glass-input" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label>${t("email_address")}</label>
          <input type="email" name="email" class="glass-input" value="${user.email}" required>
        </div>
        <div class="form-group">
          <label>${t("phone_number")}</label>
          <input type="text" name="phone" class="glass-input" value="${user.phone}">
        </div>
        <div class="form-group">
          <label>${t("nif_number")}</label>
          <input type="text" name="nif" class="glass-input" value="${user.nif || '239847102'}">
        </div>
        <div class="form-group">
          <label>${t("iban")}</label>
          <input type="text" name="iban" class="glass-input" value="${user.iban || 'PT50 0035 0001 0001 2345 6789 0'}">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:12px;">
          ${t("btn_save_changes")}
        </button>
      </form>
    </div>
  `;

  document.getElementById("owner-profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    store.updateProfile(user.id, Object.fromEntries(formData.entries()));
    toast.show("Definições de perfil guardadas.", "success");
  });
}
