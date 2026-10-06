/**
 * Homely - Centralized Data Store (Clean Slate State for Production & Testing)
 * Manages user accounts, properties, leases, tenant invitations, email notifications, and localStorage sync.
 */

const CLEAN_STATE = {
  auth: null,
  currentUser: null,
  users: {},
  properties: [],
  leases: [],
  screenings: [],
  contractors: [
    { id: "contr_1", name: "Serviços de Canalização Lisboa", trade: "Plumbing", rating: "4.8 ★" },
    { id: "contr_2", name: "Eletricistas Associados Porto", trade: "Electrical", rating: "4.9 ★" },
    { id: "contr_3", name: "Climatização & AVAC Lda", trade: "HVAC", rating: "4.7 ★" }
  ],
  maintenanceRequests: [],
  rentPayments: [],
  expenses: [],
  messages: [],
  documents: [],
  notifications: [],
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
        this.state = JSON.parse(JSON.stringify(CLEAN_STATE));
      }
    } else {
      this.state = JSON.parse(JSON.stringify(CLEAN_STATE));
    }
  }

  saveState() {
    localStorage.setItem("homely_db", JSON.stringify(this.state));
    this.notify();
  }

  resetAllData() {
    this.state = JSON.parse(JSON.stringify(CLEAN_STATE));
    localStorage.removeItem("homely_db");
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

  signup(name, email, password, role = "owner", inviteCode = "") {
    const cleanEmail = email.trim().toLowerCase();
    const existing = Object.values(this.state.users).find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      throw new Error("E-mail address is already registered.");
    }

    let assignedPropId = null;
    let assignedUnitId = null;
    let rentAmount = 0;

    if (role === "tenant" && inviteCode) {
      const invite = this.validateInvitationCode(inviteCode);
      if (!invite) {
        throw new Error("Invalid or expired invitation code.");
      }
      assignedPropId = invite.propertyId;
      assignedUnitId = invite.unitId;
      rentAmount = invite.rentAmount;
      invite.status = "Accepted";
    }

    const newId = `${role}_${Date.now()}`;
    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      phone: "",
      role: role,
      propertyId: assignedPropId,
      unitId: assignedUnitId,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=1c1a17&color=fff`,
      nif: "",
      iban: "",
      notifyEmail: true,
      notifySMS: true,
      onboardingStatus: role === "tenant" ? (assignedUnitId ? "PendingLease" : "PendingInvite") : "Completed"
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

      // Generate initial rent invoice
      this.state.rentPayments.unshift({
        id: `pay_${Date.now()}`,
        tenantId: newId,
        unitId: assignedUnitId,
        propertyId: assignedPropId,
        amount: rentAmount || 1500,
        dueDate: new Date().toISOString().split("T")[0],
        status: "Pending",
        paidAt: null,
        billingType: "Rent",
        description: "Renda Mensal"
      });
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

  // Portfolio Mutations
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
    return newProp;
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
    return newInvite;
  }

  validateInvitationCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const invite = this.state.invitations.find(
      i => i.code === cleanCode && i.status === "Pending"
    );
    return invite || null;
  }

  linkTenantInvitation(userId, inviteCode) {
    const invite = this.validateInvitationCode(inviteCode);
    if (!invite) {
      throw new Error("Código de convite inválido ou expirado / Invalid invitation code.");
    }

    const user = this.state.users[userId];
    if (!user) throw new Error("Utilizador não encontrado.");

    user.propertyId = invite.propertyId;
    user.unitId = invite.unitId;
    user.onboardingStatus = "PendingLease";
    invite.status = "Accepted";

    const prop = this.state.properties.find(p => p.id === invite.propertyId);
    if (prop) {
      const u = prop.units.find(unit => unit.id === invite.unitId);
      if (u) {
        u.tenantId = userId;
        u.status = "Occupied";
      }
    }

    // Generate initial rent invoice
    this.state.rentPayments.unshift({
      id: `pay_${Date.now()}`,
      tenantId: userId,
      unitId: invite.unitId,
      propertyId: invite.propertyId,
      amount: invite.rentAmount || 1500,
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      paidAt: null,
      billingType: "Rent",
      description: "Renda Mensal"
    });

    if (this.state.auth && this.state.auth.id === userId) {
      this.state.auth = { ...user };
      this.state.currentUser = { ...user };
    }

    this.addNotification(`Resident ${user.name} linked invitation code ${invite.code}.`, "invite");
    this.saveState();
    return user;
  }

  signLeaseAgreement(userId, signatureName) {
    const user = this.state.users[userId];
    if (user) {
      user.onboardingStatus = "Completed";

      // Create or update lease record
      const existingLease = this.state.leases.find(l => l.tenantId === userId);
      if (!existingLease && user.propertyId && user.unitId) {
        const prop = this.state.properties.find(p => p.id === user.propertyId);
        const unit = prop ? prop.units.find(u => u.id === user.unitId) : null;
        this.state.leases.push({
          id: `lease_${Date.now()}`,
          propertyId: user.propertyId,
          unitId: user.unitId,
          tenantId: userId,
          rent: unit ? unit.rent : 1200,
          deposit: unit ? unit.rent * 2 : 2400,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Active",
          signedAt: new Date().toISOString(),
          signedName: signatureName
        });
      } else if (existingLease) {
        existingLease.status = "Active";
        existingLease.signedAt = new Date().toISOString();
        existingLease.signedName = signatureName;
      }

      if (this.state.auth && this.state.auth.id === userId) {
        this.state.auth = { ...user };
        this.state.currentUser = { ...user };
      }

      this.addNotification(`Lease agreement digitally signed by resident ${signatureName}.`, "invite");
      this.saveState();
    }
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
  getContractors() { return this.state.contractors || []; }
}

export const store = new Store();
