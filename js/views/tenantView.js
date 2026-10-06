/**
 * Homely - Tenant View Controller (Adapted for Portugal & European Union Standards)
 * Handles layout rendering for portfolio residents.
 */

import { store } from "../store.js";
import { createDialog, toast, initSignaturePad } from "../components.js";
import { t } from "../i18n.js";

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
          <span class="sidebar-icon">📈</span> ${t("sidebar_overview")}
        </div>
        <div class="sidebar-item ${activeTab === 'documents' ? 'active' : ''}" data-tab="documents">
          <span class="sidebar-icon">📄</span> ${t("sidebar_documents")}
        </div>
        <div class="sidebar-item ${activeTab === 'chat' ? 'active' : ''}" data-tab="chat">
          <span class="sidebar-icon">💬</span> ${t("sidebar_messages")}
        </div>
        
        <div class="sidebar-separator"></div>
        
        <div class="sidebar-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
          <span class="sidebar-icon">👤</span> ${t("sidebar_profile")}
        </div>
      </aside>

      <!-- Main Panel Area -->
      <main class="dashboard-main" style="display: flex; flex-direction: column; gap: 24px; min-width: 0; flex: 1;">
        <!-- Resident Welcome Banner -->
        <div class="dashboard-header" style="margin-bottom: 0; background: linear-gradient(135deg, rgba(28,26,23,0.95) 0%, rgba(91,112,101,0.85) 100%), url('assets/property_apartment.png') center/cover no-repeat; color:#ffffff; padding: 28px 32px; border-radius: 16px; box-shadow: var(--shadow-premium); display:flex; justify-content:space-between; align-items:center;">
          <div class="user-profile-header" style="display:flex; align-items:center; gap:16px;">
            <img class="user-avatar" src="${tenant.avatar}" alt="Tenant Profile" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.3);">
            <div class="welcome-text">
              <h2 style="color:#ffffff; font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:4px;">Olá, ${tenant.name.split(" ")[0]}</h2>
              <p style="color:rgba(255,255,255,0.8); font-size:13px;">${t("nav_tenant")} • ${prop ? prop.name : 'Sem imóvel ativo'} (${unit ? unit.number : 'Sem Fração'})</p>
            </div>
          </div>
          <button class="btn btn-primary" id="file-request-btn" style="padding:10px 20px; font-size:13px; border-radius:30px; background:#ffffff; color:#1c1a17; border:none; font-weight:600;">
            ${t("btn_request_repair")}
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
      toast.show("Nenhum contrato ativo associado.", "error");
      return;
    }

    createDialog({
      title: t("btn_request_repair"),
      contentHTML: `
        <div class="form-group">
          <label for="req-title">Título da Reparação</label>
          <input type="text" id="req-title" name="title" class="glass-input" required placeholder="e.g. Fuga na banca da cozinha">
        </div>
        <div class="form-group">
          <label for="req-desc">Descrição Detalhada</label>
          <textarea id="req-desc" name="description" class="glass-input" rows="3" required placeholder="Descreva o problema..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="req-cat">Categoria</label>
            <select id="req-cat" name="category" class="glass-input">
              <option value="Plumbing">Canalização</option>
              <option value="Electrical">Eletricidade</option>
              <option value="HVAC">Climatização / AVAC</option>
              <option value="Appliance">Eletrodomésticos</option>
              <option value="Other">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="req-pri">Urgência</label>
            <select id="req-pri" name="priority" class="glass-input">
              <option value="Low">${t("low_priority")}</option>
              <option value="Medium" selected>${t("medium_priority")}</option>
              <option value="High">${t("high_priority")}</option>
              <option value="Emergency">${t("emergency")}</option>
            </select>
          </div>
        </div>
      `,
      submitLabel: t("btn_request_repair"),
      onSubmit: (data) => {
        store.addMaintenanceRequest({
          propertyId: prop.id,
          unitId: unit.id,
          tenantId: tenant.id,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          attachment: null
        });
        toast.show("Pedido de reparação registado com sucesso.", "success");
        renderTabContent();
      }
    });
  });

  renderTabContent();
}

function renderOnboardingWizard(container, tenant, prop, unit) {
  let step = 1;
  let screeningCompleted = false;

  const renderWizard = () => {
    container.innerHTML = `
      <div class="glass-panel" style="max-width: 600px; margin: 40px auto; padding: 36px; border-radius:16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:30px; border-bottom:1px solid var(--glass-border); padding-bottom:15px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:${step === 1 ? 'var(--primary-color)' : '#10b981'}; color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;">1</span>
            <span style="font-size:12px; font-weight:700;">Verificação NIF & Documentação</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:${step === 2 ? 'var(--primary-color)' : 'var(--glass-border)'}; color:${step === 2 ? '#fff' : 'var(--text-muted)'}; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;">2</span>
            <span style="font-size:12px; font-weight:700;">Assinatura do Contrato</span>
          </div>
        </div>

        <div id="wizard-content"></div>
      </div>
    `;

    const wizardContent = container.querySelector("#wizard-content");

    if (step === 1) {
      wizardContent.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:40px; margin-bottom:10px;">🛡️</div>
          <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;">Verificação NIF & IRS Concluída</h3>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:24px;">Os seus dados fiscais e comprovativo de rendimentos foram verificados.</p>
          
          <div style="display:flex; justify-content:center; gap:16px; margin-bottom:28px;">
            <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:16px; border-radius:8px; flex:1;">
              <span style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block;">Número NIF</span>
              <span style="font-size:18px; font-weight:700; color:#10b981; font-family:var(--font-sans);">${tenant.nif || '248192039'}</span>
            </div>
            <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:16px; border-radius:8px; flex:1;">
              <span style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block;">IRS / Rendimentos</span>
              <span style="font-size:14px; font-weight:700; color:#10b981; display:block; margin-top:4px;">✓ Verificado</span>
            </div>
          </div>
          
          <button class="btn btn-primary" id="wizard-next-step-btn" style="width:100%;">
            Avançar para Assinatura do Contrato &rarr;
          </button>
        </div>
      `;
      wizardContent.querySelector("#wizard-next-step-btn").addEventListener("click", () => {
        step = 2;
        renderWizard();
      });
    } else if (step === 2) {
      const draftLease = store.getLeases().find(l => l.tenantId === tenant.id && l.status === "Draft");
      if (!draftLease) {
        wizardContent.innerHTML = `
          <div style="text-align:center;">
            <p style="font-size:13px; color:var(--text-muted);">Nenhum rascunho de contrato pendente para esta fração. Contacte o senhorio.</p>
          </div>
        `;
        return;
      }

      wizardContent.innerHTML = `
        <div>
          <h3 style="font-size:18px; font-weight:700; margin-bottom:8px;">Assinatura Digital do Contrato de Arrendamento</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Por favor reveja as cláusulas do contrato e desenhe a sua assinatura abaixo.</p>
          
          <div style="background:var(--glass-bg-accent); border:1px solid var(--glass-border); padding:16px; border-radius:8px; max-height:160px; overflow-y:auto; font-size:12px; font-family:monospace; margin-bottom:20px;">
            <h4 style="text-align:center; font-weight:700; margin-bottom:8px;">CLÁUSULAS DO CONTRATO</h4>
            <p><strong>1. IMÓVEL:</strong> ${unit ? unit.number : 'Fração'} em ${prop ? prop.name : 'Imóvel'}.</p>
            <p><strong>2. RENDA MENSAL:</strong> €${draftLease.rent.toLocaleString()} por mês.</p>
            <p><strong>3. CAUÇÃO:</strong> €${draftLease.deposit.toLocaleString()} na assinatura.</p>
            <p><strong>4. DURAÇÃO:</strong> ${draftLease.startDate} a ${draftLease.endDate}.</p>
          </div>

          <form id="wizard-sign-form">
            <div class="form-group">
              <label>Assinatura Digital</label>
              <input type="text" id="sign-name-text" class="glass-input" required value="${tenant.name}">
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:20px;">
              ✍️ Assinar & Ativar Contrato de Arrendamento
            </button>
          </form>
        </div>
      `;

      wizardContent.querySelector("#wizard-sign-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("sign-name-text").value.trim();
        store.signLeaseAgreement(tenant.id, nameInput);
        toast.show("Contrato assinado com sucesso! Bem-vindo.", "success");
      });
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
    <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:28px;">
      
      <!-- Left Column: Rent Payment & Details -->
      <div style="display:flex; flex-direction:column; gap:24px;">
        
        <!-- Rent Payment Card -->
        <div class="tenant-payment-card">
          ${activeInvoice ? `
            <h3>${t("btn_pay_rent")}</h3>
            <p style="opacity:0.8; font-size:13px; margin-top:4px;">Vencimento em ${activeInvoice.dueDate}.</p>
            <div class="rent-amount">€${activeInvoice.amount.toLocaleString()}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
              <span class="payment-status-badge ${activeInvoice.status.toLowerCase()}">${activeInvoice.status === 'Pending' ? 'Pendente' : 'Em Atraso'}</span>
              <button class="btn btn-primary pay-rent-btn" data-id="${activeInvoice.id}" style="background:#ffffff; color:#1c1a17; font-weight:700;">
                💳 ${t("btn_pay_rent")}
              </button>
            </div>
          ` : `
            <h3>Sem Rendas Pendentes</h3>
            <p style="opacity:0.8; font-size:13px; margin-top:4px;">Todas as mensalidades estão regularizadas.</p>
            <div class="rent-amount" style="font-size:32px;">€0,00 Pendente</div>
            <div style="margin-top:20px;">
              <span class="payment-status-badge paid">✓ Estado: Em Dia</span>
            </div>
          `}
        </div>

        <!-- Lease Overview -->
        <div class="glass-panel" style="padding:24px;">
          <h3 style="margin-bottom:16px; font-size:18px; font-family:var(--font-serif);">${t("leases_title")}</h3>
          <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">
              <span style="color:var(--text-muted);">${t("monthly_rent")}</span>
              <strong>€${unit ? unit.rent.toLocaleString() : '1.800'} / mês</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">
              <span style="color:var(--text-muted);">${t("lease_period")}</span>
              <strong>01 Jan 2026 - 31 Dez 2026</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">
              <span style="color:var(--text-muted);">${t("deposit")}</span>
              <strong>€${unit ? (unit.rent * 2).toLocaleString() : '3.600'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">${t("nif_number")}</span>
              <strong>${tenant.nif || '248192039'}</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Verification & European Payment Methods -->
      <div style="display:flex; flex-direction:column; gap:24px;">
        
        <div class="glass-panel" style="padding:24px;">
          <h3 style="font-family:var(--font-serif); font-size:18px; margin-bottom:12px;">Verificação Fiscal & NIF (Portugal / UE)</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">Comprovativo de NIF e IRS verificado junto do proprietário.</p>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--glass-bg-accent); padding:12px 16px; border-radius:8px; border:1px solid var(--glass-border);">
              <span style="font-size:12px; font-weight:600;">Estado NIF</span>
              <span style="font-size:11px; color:#10b981; font-weight:700;">✓ Verificado (${tenant.nif || '248192039'})</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--glass-bg-accent); padding:12px 16px; border-radius:8px; border:1px solid var(--glass-border);">
              <span style="font-size:12px; font-weight:600;">Histórico de Rendas</span>
              <span style="font-size:11px; color:#10b981; font-weight:700;">✓ 100% Pontual</span>
            </div>
          </div>
        </div>

        <!-- Recent Payments List -->
        <div class="glass-panel" style="padding:24px;">
          <h3 style="font-family:var(--font-serif); font-size:18px; margin-bottom:16px;">${t("recent_activity")}</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${tenantPayments.length === 0 ? `
              <p style="font-size:12px; color:var(--text-muted);">Sem pagamentos efetuados.</p>
            ` : tenantPayments.map(p => `
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; padding:10px 0; border-bottom:1px solid var(--glass-border);">
                <div>
                  <div style="font-weight:600;">${p.description || 'Renda Mensal'}</div>
                  <div style="font-size:11px; color:var(--text-muted);">${p.dueDate}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:700;">€${p.amount.toLocaleString()}</div>
                  <span class="payment-status-badge ${p.status.toLowerCase()}">${p.status === 'Paid' ? 'Pago' : 'Pendente'}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

      </div>

    </div>
  `;

  // Bind Pay Rent button with Portugal/EU payment modalities
  targetElement.querySelector(".pay-rent-btn")?.addEventListener("click", () => {
    if (!activeInvoice) return;

    createDialog({
      title: "Pagamento de Renda (Portugal & UE)",
      contentHTML: `
        <div style="margin-bottom:20px; background:var(--glass-bg-accent); padding:16px; border-radius:8px; border:1px solid var(--glass-border);">
          <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Valor da Renda</div>
          <div style="font-size:28px; font-weight:700; font-family:var(--font-sans); color:var(--text-main);">€${activeInvoice.amount.toLocaleString()}</div>
        </div>

        <div class="form-group">
          <label>${t("payment_method")}</label>
          <select id="pt-payment-method" class="glass-input">
            <option value="MB WAY">📱 MB WAY</option>
            <option value="Multibanco / SEPA (IBAN)">🏛️ Multibanco / Transferência SEPA (IBAN)</option>
            <option value="Cartão de Débito / Crédito">💳 Cartão de Débito / Crédito</option>
          </select>
        </div>

        <div id="mbway-panel" class="form-group" style="margin-top:16px;">
          <label>Número de Telemóvel MB WAY</label>
          <input type="text" id="mbway-phone" class="glass-input" value="${tenant.phone || '+351 964 382 102'}">
        </div>
      `,
      submitLabel: "Confirmar Pagamento (€" + activeInvoice.amount.toLocaleString() + ")",
      onSubmit: (data) => {
        const method = document.getElementById("pt-payment-method").value;
        store.payRent(activeInvoice.id, method);
        toast.show(`Pagamento de €${activeInvoice.amount} efetuado com sucesso via ${method}!`, "success");
        renderTenantView(targetElement.parentElement);
      }
    });
  });
}

/**
 * 2. DOCUMENTS TAB
 */
function renderDocumentsTab(targetElement, docs, userId) {
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
            <th>Data</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${docs.length === 0 ? `
            <tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Nenhum documento carregado.</td></tr>
          ` : docs.map(d => `
            <tr>
              <td style="font-weight:600;">📄 ${d.name}</td>
              <td>${d.type}</td>
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
 * 3. CHAT TAB
 */
function renderChatTab(targetElement, messages, userId) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("sidebar_messages")}</h2>
    </div>
    <div class="glass-panel" style="padding:24px; max-width:640px;">
      <div style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; margin-bottom:20px;">
        ${messages.map(m => `
          <div style="background:var(--glass-bg-accent); padding:12px 16px; border-radius:8px; border:1px solid var(--glass-border);">
            <div style="font-weight:700; font-size:12px; margin-bottom:4px;">${m.senderId === userId ? 'Você' : 'Senhorio / Marcus'}</div>
            <p style="font-size:14px;">${m.text}</p>
          </div>
        `).join("")}
      </div>
      <form id="tenant-msg-form" style="display:flex; gap:10px;">
        <input type="text" id="msg-input-text" class="glass-input" required placeholder="Escreva uma mensagem...">
        <button type="submit" class="btn btn-primary">${t("btn_send_message")}</button>
      </form>
    </div>
  `;

  document.getElementById("tenant-msg-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("msg-input-text");
    store.sendMessage(userId, "owner_1", input.value);
    input.value = "";
    toast.show("Mensagem enviada.", "success");
    renderChatTab(targetElement, store.getMessages(), userId);
  });
}

/**
 * 4. PROFILE TAB
 */
function renderProfileTab(targetElement, tenant) {
  targetElement.innerHTML = `
    <div class="card-title-row">
      <h2 style="font-family:var(--font-serif); font-size:26px; font-weight:400; margin-bottom:0;">${t("profile_title")}</h2>
    </div>
    <div class="glass-panel" style="padding:32px; max-width:600px; border-radius:16px;">
      <form id="tenant-profile-form">
        <div class="form-group">
          <label>${t("full_name")}</label>
          <input type="text" name="name" class="glass-input" value="${tenant.name}" required>
        </div>
        <div class="form-group">
          <label>${t("email_address")}</label>
          <input type="email" name="email" class="glass-input" value="${tenant.email}" required>
        </div>
        <div class="form-group">
          <label>${t("phone_number")}</label>
          <input type="text" name="phone" class="glass-input" value="${tenant.phone || '+351 964 382 102'}">
        </div>
        <div class="form-group">
          <label>${t("nif_number")}</label>
          <input type="text" name="nif" class="glass-input" value="${tenant.nif || '248192039'}">
        </div>
        <div class="form-group">
          <label>${t("iban")}</label>
          <input type="text" name="iban" class="glass-input" value="${tenant.iban || 'PT50 0018 0002 0003 4567 8901 2'}">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:12px;">
          ${t("btn_save_changes")}
        </button>
      </form>
    </div>
  `;

  document.getElementById("tenant-profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    store.updateProfile(tenant.id, Object.fromEntries(formData.entries()));
    toast.show("Perfil atualizado.", "success");
  });
}
