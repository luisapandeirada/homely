/**
 * Homely - Centralized Data Store (Adapted for Portugal & European Union Standards)
 * Handles database state, onboarding invites, NIF/IBAN verifications, notifications, and localStorage sync.
 */

const DEFAULT_STATE = {
  auth: null,
  currentUser: null,
  
  users: {
    owner_1: {
      id: "owner_1",
      name: "Marcus Sterling",
      email: "marcus@sterlingprop.pt",
      phone: "+351 912 804 511",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      company: "Sterling Heritage Imobiliária Lda",
      nif: "239847102",
      iban: "PT50 0035 0001 0001 2345 6789 0",
      notifyEmail: true,
      notifySMS: false,
      onboardingStatus: "Completed"
    },
    tenant_1: {
      id: "tenant_1",
      name: "Sarah Jenkins",
      email: "sarah.j@gmail.com",
      phone: "+351 964 382 102",
      role: "tenant",
      propertyId: "prop_1",
      unitId: "unit_101",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      profession: "UX Designer",
      nif: "248192039",
      iban: "PT50 0018 0002 0003 4567 8901 2",
      notifyEmail: true,
      notifySMS: true,
      onboardingStatus: "Completed"
    },
    tenant_2: {
      id: "tenant_2",
      name: "James Miller",
      email: "james.m@outlook.com",
      phone: "+351 925 912 302",
      role: "tenant",
      propertyId: "prop_1",
      unitId: "unit_103",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      profession: "Financial Analyst",
      nif: "261904821",
      iban: "PT50 0033 0004 0005 6789 0123 4",
      notifyEmail: true,
      notifySMS: false,
      onboardingStatus: "Completed"
    },
    tenant_3: {
      id: "tenant_3",
      name: "Elena Rostova",
      email: "elena.r@techcorp.io",
      phone: "+351 931 234 876",
      role: "tenant",
      propertyId: "prop_2",
      unitId: "unit_a",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      profession: "Software Engineer",
      nif: "278104928",
      iban: "PT50 0010 0006 0007 8901 2345 6",
      notifyEmail: false,
      notifySMS: true,
      onboardingStatus: "Completed"
    }
  },
  properties: [
    {
      id: "prop_1",
      name: "Residências Av. da Liberdade",
      address: "Av. da Liberdade, 125, Lisboa",
      type: "Apartment",
      image: "assets/property_apartment.png",
      units: [
        { id: "unit_101", number: "1º Dto", rent: 1800, tenantId: "tenant_1", status: "Occupied" },
        { id: "unit_102", number: "2º Esq", rent: 1900, tenantId: null, status: "Vacant" },
        { id: "unit_103", number: "3º Dto", rent: 1850, tenantId: "tenant_2", status: "Occupied" }
      ]
    },
    {
      id: "prop_2",
      name: "Santa Catarina Lofts",
      address: "Rua de Santa Catarina, 400, Porto",
      type: "Loft",
      image: "assets/property_loft.png",
      units: [
        { id: "unit_a", number: "Loft A", rent: 2400, tenantId: "tenant_3", status: "Occupied" },
        { id: "unit_b", number: "Loft B", rent: 2600, tenantId: null, status: "Vacant" }
      ]
    },
    {
      id: "prop_3",
      name: "Moradia Cascais Estoril",
      address: "Av. Marginal, Estoril, Cascais",
      type: "Single Family",
      image: "assets/property_modern.png",
      units: [
        { id: "unit_main", number: "Moradia Principal", rent: 3100, tenantId: null, status: "Vacant" }
      ]
    }
  ],
  leases: [
    {
      id: "lease_1",
      propertyId: "prop_1",
      unitId: "unit_101",
      tenantId: "tenant_1",
      rent: 1800,
      deposit: 3600,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "Active",
      lateFeeRule: "Aplicar taxa de €50 após 5 dias de atraso",
      utilitySplit: "Inquilino paga 100% dos consumos",
      tenantSignature: "Sarah Jenkins",
      ownerSignature: "Marcus Sterling",
      signedAt: "2026-01-01T12:00:00Z"
    }
  ],
  screenings: [
    {
      tenantId: "tenant_1",
      nifVerified: true,
      incomeVerified: true,
      paymentHistoryTrack: "100% Pontual",
      verifiedAt: "2026-01-01T10:00:00Z"
    }
  ],
  contractors: [
    { id: "contr_1", name: "Serviços de Canalização Lisboa", trade: "Plumbing", rating: "4.8 ★" },
    { id: "contr_2", name: "Eletricistas Associados Porto", trade: "Electrical", rating: "4.9 ★" },
    { id: "contr_3", name: "Climatização & AVAC Lda", trade: "HVAC", rating: "4.7 ★" }
  ],
  maintenanceRequests: [
    {
      id: "req_1",
      propertyId: "prop_1",
      unitId: "unit_101",
      tenantId: "tenant_1",
      title: "Fuga na bancada da cozinha",
      description: "Pequeno gotejamento de água sob o prola da bancada da cozinha quando a torneira está aberta.",
      category: "Plumbing",
      priority: "Medium",
      status: "Reported",
      createdAt: "2026-05-28T10:00:00Z",
      attachment: null,
      cost: 0,
      taxCategory: "Reparações",
      contractorId: null,
      chat: [
        { senderId: "tenant_1", text: "Existe uma fuga de água sob o bancada da cozinha.", timestamp: "2026-05-28T10:05:00Z" }
      ]
    }
  ],
  rentPayments: [
    {
      id: "pay_101",
      tenantId: "tenant_1",
      unitId: "unit_101",
      propertyId: "prop_1",
      amount: 1800,
      dueDate: "2026-06-01",
      status: "Paid",
      paidAt: "2026-06-01T09:30:00Z",
      receiptUrl: "#",
      billingType: "Rent",
      description: "Renda Mensal - Junho 2026"
    },
    {
      id: "pay_102",
      tenantId: "tenant_2",
      unitId: "unit_103",
      propertyId: "prop_1",
      amount: 1850,
      dueDate: "2026-06-01",
      status: "Pending",
      paidAt: null,
      billingType: "Rent",
      description: "Renda Mensal - Junho 2026"
    }
  ],
  expenses: [
    {
      id: "exp_1",
      propertyId: "prop_1",
      unitId: "unit_101",
      category: "Manutenção",
      amount: 120,
      date: "2026-04-12",
      invoiceUrl: "#",
      deductible: true
    }
  ],
  messages: [
    {
      id: "msg_1",
      senderId: "owner_1",
      recipientId: "tenant_1",
      text: "Olá Sarah, enviámos o recibo da renda de Junho. Bom mês!",
      timestamp: "2026-06-01T10:00:00Z"
    }
  ],
  documents: [
    {
      id: "doc_1",
      userId: "tenant_1",
      name: "Comprovativo_NIF_IRS.pdf",
      type: "NIF & IRS",
      status: "Verified",
      uploadedAt: "2026-01-02T11:00:00Z"
    }
  ],
  notifications: [
    {
      id: "not_1",
      text: "Sarah Jenkins efetuou o pagamento da renda de Junho (€1.800) via MB WAY.",
      type: "payment",
      read: false,
      timestamp: "2026-06-01T09:30:00Z"
    }
  ],
  invitations: []
};

class Store {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem("homely_db");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  saveState() {
    localStorage.setItem("homely_db", JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Authentication
  login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const userKey = Object.keys(this.state.users).find(
      k => this.state.users[k].email.toLowerCase() === cleanEmail
    );

    if (userKey) {
      const user = this.state.users[userKey];
      this.state.auth = { ...user };
      this.state.currentUser = { ...user };
      this.saveState();
      return user;
    }
    return null;
  }

  logout() {
    this.state.auth = null;
    this.state.currentUser = null;
    this.saveState();
  }

  switchUser(userKey) {
    if (this.state.users[userKey]) {
      const user = this.state.users[userKey];
      this.state.auth = { ...user };
      this.state.currentUser = { ...user };
      this.saveState();
    }
  }

  signup(name, email, password, role = "owner", inviteCode = "") {
    const cleanEmail = email.trim().toLowerCase();
    const existing = Object.values(this.state.users).find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      throw new Error("Email address is already registered.");
    }

    let assignedPropId = null;
    let assignedUnitId = null;

    if (role === "tenant") {
      if (!inviteCode) {
        throw new Error("Invitation code is required for resident registration.");
      }
      const invite = this.validateInvitationCode(inviteCode);
      if (!invite) {
        throw new Error("Invalid or expired invitation code.");
      }
      assignedPropId = invite.propertyId;
      assignedUnitId = invite.unitId;
      invite.status = "Accepted";
    }

    const newId = `${role}_${Date.now()}`;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      phone: "+351 900 000 000",
      role: role,
      propertyId: assignedPropId,
      unitId: assignedUnitId,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      nif: "299999999",
      iban: "PT50 0000 0000 0000 0000 0000 0",
      notifyEmail: true,
      notifySMS: true,
      onboardingStatus: role === "tenant" ? "PendingLease" : "Completed"
    };

    this.state.users[newId] = newUser;
    this.state.auth = { ...newUser };
    this.state.currentUser = { ...newUser };

    if (role === "tenant" && assignedUnitId) {
      const prop = this.state.properties.find(p => p.id === assignedPropId);
      if (prop) {
        const u = prop.units.find(unit => unit.id === assignedUnitId);
        if (u) {
          u.tenantId = newId;
          u.status = "Occupied";
        }
      }
    }

    this.addNotification(`New user account registered: ${name} (${role === 'owner' ? 'Landlord' : 'Resident'}).`, "invite");
    this.saveState();
    return newUser;
  }

  // Getters
  getAuth() { return this.state.auth; }
  getCurrentUser() { return this.state.currentUser || this.state.auth; }
  getUsers() { return this.state.users || {}; }
  getProperties() { return this.state.properties || []; }
  getMaintenanceRequests() { return this.state.maintenanceRequests || []; }
  getRentPayments() { return this.state.rentPayments || []; }
  getInvitations() { return this.state.invitations || []; }
  getNotifications() { return this.state.notifications || []; }
  getMessages() { return this.state.messages || []; }
  getDocuments() { return this.state.documents || []; }

  getLastActiveTenantId() {
    const tenants = Object.values(this.state.users).filter(u => u.role === "tenant");
    return tenants.length > 0 ? tenants[0].id : null;
  }

  // Portfolio Management
  addProperty({ name, address, type, unitsString, rent }) {
    const propId = `prop_${Date.now()}`;
    const unitsArr = (unitsString || "Fração A, Fração B").split(",").map((uName, idx) => ({
      id: `unit_${Date.now()}_${idx}`,
      number: uName.trim(),
      rent: Number(rent) || 1200,
      tenantId: null,
      status: "Vacant"
    }));

    const newProp = {
      id: propId,
      name: name.trim(),
      address: address.trim(),
      type: type || "Apartment",
      image: "assets/property_apartment.png",
      units: unitsArr
    };

    this.state.properties.push(newProp);
    this.addNotification(`New property '${name}' registered into portfolio.`, "property");
    this.saveState();
  }

  addMaintenanceRequest(request) {
    const newReq = {
      id: `req_${Date.now()}`,
      propertyId: request.propertyId,
      unitId: request.unitId,
      tenantId: request.tenantId,
      title: request.title.trim(),
      description: request.description.trim(),
      category: request.category || "General",
      priority: request.priority || "Medium",
      status: "Reported",
      createdAt: new Date().toISOString(),
      attachment: request.attachment || null,
      cost: 0,
      taxCategory: "Reparações",
      contractorId: null,
      chat: []
    };
    this.state.maintenanceRequests.unshift(newReq);
    
    const tenant = this.state.users[request.tenantId] || { name: "Resident" };
    this.addNotification(`New repair log reported by ${tenant.name.split(" ")[0]}: '${request.title}'`, "maintenance");
    this.saveState();
  }

  updateMaintenanceStatus(requestId, newStatus, cost = 0, taxCategory = "Reparações") {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.status = newStatus;
      if (newStatus === "Resolved" || newStatus === "Completed") {
        req.cost = Number(cost) || 0;
        req.taxCategory = taxCategory;
        this.addNotification(`Repair log resolved. Invoiced cost: €${req.cost.toLocaleString()}`, "maintenance");
      }
      this.saveState();
    }
  }

  payRent(paymentId, paymentMethod = "MB WAY") {
    const payment = this.state.rentPayments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = "Paid";
      payment.paidAt = new Date().toISOString();
      
      const tenant = this.state.users[payment.tenantId] || { name: "Resident" };
      const billType = payment.billingType || "Rent";
      this.addNotification(`${billType} payment of €${payment.amount.toLocaleString()} cleared by ${tenant.name.split(" ")[0]} via ${paymentMethod}.`, "payment");
      
      let screening = this.state.screenings.find(s => s.tenantId === payment.tenantId);
      if (!screening) {
        screening = {
          tenantId: payment.tenantId,
          nifVerified: true,
          incomeVerified: true,
          paymentHistoryTrack: "100% Pontual",
          verifiedAt: new Date().toISOString()
        };
        this.state.screenings.push(screening);
      }
      this.saveState();
    }
  }

  sendMessage(senderId, recipientId, text) {
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: senderId,
      recipientId: recipientId,
      text: text,
      timestamp: new Date().toISOString()
    };
    this.state.messages.push(newMsg);
    this.saveState();
    return newMsg;
  }

  uploadDocument(userId, name, type) {
    const newDoc = {
      id: `doc_${Date.now()}`,
      userId: userId,
      name: name,
      type: type,
      status: "Pending",
      uploadedAt: new Date().toISOString()
    };
    this.state.documents.push(newDoc);
    
    const tenant = this.state.users[userId] || { name: "Resident" };
    this.addNotification(`${tenant.name.split(" ")[0]} uploaded ${name} credentials.`, "document");
    this.saveState();
    return newDoc;
  }

  updateDocumentStatus(docId, newStatus) {
    const doc = this.state.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = newStatus;
      this.addNotification(`Credential document '${doc.name}' marked ${newStatus}.`, "document");
      this.saveState();
    }
  }

  updateProfile(userId, profileData) {
    const user = this.state.users[userId];
    if (user) {
      user.name = profileData.name.trim();
      user.email = profileData.email.trim().toLowerCase();
      user.phone = profileData.phone.trim();
      if (profileData.nif) user.nif = profileData.nif.trim();
      if (profileData.iban) user.iban = profileData.iban.trim();
      user.notifyEmail = !!profileData.notifyEmail;
      user.notifySMS = !!profileData.notifySMS;

      if (user.role === "tenant" && profileData.profession) {
        user.profession = profileData.profession.trim();
      } else if (user.role === "owner" && profileData.company) {
        user.company = profileData.company.trim();
      }

      if (this.state.auth && this.state.auth.id === userId) {
        this.state.auth = { ...user };
        this.state.currentUser = { ...user };
      }

      this.addNotification(`Profile settings updated.`, "document");
      this.saveState();
    }
  }

  createInvitation(inv) {
    const code = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInvite = {
      code: code,
      name: inv.name.trim(),
      email: inv.email.trim().toLowerCase(),
      propertyId: inv.propertyId,
      unitId: inv.unitId,
      rentAmount: Number(inv.rent),
      depositAmount: Number(inv.deposit) || Math.round(Number(inv.rent) * 2),
      startDate: inv.startDate || new Date().toISOString().split("T")[0],
      endDate: inv.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lateFeeRule: inv.lateFeeRule || "Aplicar taxa de €50 após 5 dias de atraso",
      utilitySplit: inv.utilitySplit || "Inquilino paga 100% dos consumos",
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    this.state.invitations.unshift(newInvite);
    
    this.addNotification(`Invite code ${code} generated for resident ${inv.name}.`, "invite");
    this.saveState();
    return code;
  }

  validateInvitationCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const invite = this.state.invitations.find(
      i => i.code === cleanCode && i.status === "Pending"
    );
    return invite || null;
  }

  addNotification(text, type) {
    this.state.notifications.unshift({
      id: `not_${Date.now()}`,
      text: text,
      type: type,
      read: false,
      timestamp: new Date().toISOString()
    });
  }

  markNotificationsRead() {
    this.state.notifications.forEach(n => {
      n.read = true;
    });
    this.saveState();
  }

  getLeases() { return this.state.leases || []; }
  getScreenings() { return this.state.screenings || []; }
  getContractors() { return this.state.contractors || []; }

  createLeaseDraft(leaseData) {
    const newLease = {
      id: `lease_${Date.now()}`,
      propertyId: leaseData.propertyId,
      unitId: leaseData.unitId,
      tenantId: leaseData.tenantId || null,
      rent: Number(leaseData.rent),
      deposit: Number(leaseData.deposit),
      startDate: leaseData.startDate,
      endDate: leaseData.endDate,
      status: "Draft",
      lateFeeRule: leaseData.lateFeeRule || "Aplicar taxa de €50 após 5 dias de atraso",
      tenantSignature: null,
      ownerSignature: "Marcus Sterling",
      signedAt: null
    };
    this.state.leases.push(newLease);
    this.saveState();
    return newLease;
  }

  signLeaseAgreement(tenantId, signatureText) {
    const lease = this.state.leases.find(l => l.tenantId === tenantId && l.status === "Draft");
    const user = this.state.users[tenantId];
    if (lease && user) {
      lease.tenantSignature = signatureText;
      lease.signedAt = new Date().toISOString();
      lease.status = "Active";

      this.state.rentPayments.unshift({
        id: `pay_${Date.now()}`,
        tenantId: tenantId,
        unitId: lease.unitId,
        propertyId: lease.propertyId,
        amount: lease.rent,
        dueDate: new Date().toISOString().split("T")[0],
        status: "Pending",
        paidAt: null,
        billingType: "Rent",
        description: "Renda Mensal"
      });

      user.onboardingStatus = "Completed";
      if (this.state.auth && this.state.auth.id === tenantId) {
        this.state.auth.onboardingStatus = "Completed";
        this.state.currentUser.onboardingStatus = "Completed";
      }

      this.addNotification(`Contrato de Arrendamento assinado por ${user.name}.`, "invite");
      this.saveState();
    }
  }

  assignContractor(requestId, contractorId) {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.contractorId = contractorId;
      req.status = "In Progress";
      
      const contractor = this.state.contractors.find(c => c.id === contractorId);
      const name = contractor ? contractor.name : "técnico de serviço";
      
      req.chat.push({
        senderId: "owner_1",
        text: `Prestador de serviços atribuído: ${name}. Ordem de trabalho enviada.`,
        timestamp: new Date().toISOString()
      });
      
      this.addNotification(`Técnico atribuído ao pedido: '${req.title}'`, "maintenance");
      this.saveState();
    }
  }

  addContractorMessage(requestId, senderId, text) {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      const msg = {
        senderId: senderId,
        text: text,
        timestamp: new Date().toISOString()
      };
      req.chat.push(msg);
      this.saveState();
      return msg;
    }
    return null;
  }

  applyLateFees() {
    let count = 0;
    this.state.rentPayments.forEach(p => {
      if (p.status === "Overdue" && !p.lateFeeApplied) {
        p.amount += 50;
        p.lateFeeApplied = true;
        count++;
        const t = this.state.users[p.tenantId] || { name: "Resident" };
        this.addNotification(`Taxa de mora de €50 aplicada à renda em atraso de ${t.name.split(" ")[0]}.`, "payment");
      } else if (p.status === "Pending") {
        const today = new Date().toISOString().split("T")[0];
        if (p.dueDate < today && !p.lateFeeApplied) {
          p.status = "Overdue";
          p.amount += 50;
          p.lateFeeApplied = true;
          count++;
          const t = this.state.users[p.tenantId] || { name: "Resident" };
          this.addNotification(`Renda vencida. Marcada como Em Atraso. Taxa de mora de €50 aplicada a ${t.name.split(" ")[0]}.`, "payment");
        }
      }
    });
    if (count > 0) {
      this.saveState();
    }
    return count;
  }

  postUtilityBill({ propertyId, category, amount, dueDate }) {
    const prop = this.state.properties.find(p => p.id === propertyId);
    if (!prop) return;
    const occupiedUnits = prop.units.filter(u => u.tenantId);
    const totalUnits = prop.units.length;
    if (totalUnits === 0) return;

    occupiedUnits.forEach(u => {
      const lease = this.state.leases.find(l => l.tenantId === u.tenantId && l.status === "Active");
      const rule = lease ? lease.utilitySplit : "Inquilino paga 100% dos consumos";
      let splitFactor = 1.0;
      if (rule.includes("50/50")) {
        splitFactor = 0.5;
      } else if (rule.includes("included") || rule.includes("incluído")) {
        splitFactor = 0;
      }
      const rawShare = (amount / totalUnits) * splitFactor;
      const share = Math.round(rawShare);
      if (share > 0) {
        const tenant = this.state.users[u.tenantId];
        const tenantName = tenant ? tenant.name.split(" ")[0] : "Resident";
        this.state.rentPayments.unshift({
          id: `pay_util_${Date.now()}_${u.id}`,
          tenantId: u.tenantId,
          unitId: u.id,
          propertyId: propertyId,
          amount: share,
          dueDate: dueDate,
          status: "Pending",
          paidAt: null,
          billingType: "Utility",
          description: `Despesa de ${category}`
        });
        this.addNotification(`Despesa partilhada de €${share} atribuída a ${tenantName} para ${category}.`, "payment");
      }
    });
    this.saveState();
  }

  solicitBids(requestId) {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.status = "Bidding";
      
      req.bids = this.state.contractors.map(c => {
        const isMatch = c.trade.toLowerCase() === req.category.toLowerCase();
        const baseCost = isMatch ? 150 : 280;
        const randomCost = Math.floor(Math.random() * 80);
        const cost = baseCost + randomCost;
        const duration = isMatch ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;
        return {
          contractorId: c.id,
          contractorName: c.name,
          trade: c.trade,
          rating: c.rating,
          cost: cost,
          duration: duration
        };
      });

      this.addNotification(`Orçamentos solicitados a técnicos para o pedido '${req.title}'.`, "maintenance");
      this.saveState();
    }
  }

  acceptBid(requestId, contractorId, cost) {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.contractorId = contractorId;
      req.status = "In Progress";
      req.cost = cost;
      
      const contractor = this.state.contractors.find(c => c.id === contractorId);
      const name = contractor ? contractor.name : "técnico";
      
      req.chat.push({
        senderId: "owner_1",
        text: `Orçamento aceite de ${name}: €${cost.toLocaleString()} (Est. conclusão: ${contractor.trade === req.category ? '1-2 dias' : '3-5 dias'}). Ordem de serviço enviada.`,
        timestamp: new Date().toISOString()
      });
      
      this.addNotification(`Orçamento aceite de ${name} para o pedido: '${req.title}'`, "maintenance");
      this.saveState();
    }
  }
}

export const store = new Store();
