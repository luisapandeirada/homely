/**
 * Homely - Centralized Data Store (Financial redone with notifications and expenses)
 * Handles database state, onboarding invites, notifications, and localStorage sync.
 */

const DEFAULT_STATE = {
  auth: null,
  currentUser: null,
  
  users: {
    owner_1: {
      id: "owner_1",
      name: "Marcus Sterling",
      email: "marcus@sterlingprop.com",
      phone: "+1 (555) 902-8811",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      company: "Sterling Real Estate LLC",
      notifyEmail: true,
      notifySMS: false,
      onboardingStatus: "Completed"
    },
    tenant_1: {
      id: "tenant_1",
      name: "Sarah Jenkins",
      email: "sarah.j@gmail.com",
      phone: "+1 (555) 382-9102",
      role: "tenant",
      propertyId: "prop_1",
      unitId: "unit_101",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      profession: "UX Designer",
      notifyEmail: true,
      notifySMS: true,
      onboardingStatus: "Completed"
    },
    tenant_2: {
      id: "tenant_2",
      name: "James Miller",
      email: "james.m@outlook.com",
      phone: "+1 (555) 912-3021",
      role: "tenant",
      propertyId: "prop_1",
      unitId: "unit_103",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      profession: "Financial Analyst",
      notifyEmail: true,
      notifySMS: false,
      onboardingStatus: "Completed"
    },
    tenant_3: {
      id: "tenant_3",
      name: "Elena Rostova",
      email: "elena.r@techcorp.io",
      phone: "+1 (555) 234-8765",
      role: "tenant",
      propertyId: "prop_2",
      unitId: "unit_a",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      profession: "Software Engineer",
      notifyEmail: false,
      notifySMS: true,
      onboardingStatus: "Completed"
    }
  },
  properties: [
    {
      id: "prop_1",
      name: "Sunset Heights Apartments",
      address: "742 Evergreen Terrace, Springfield",
      type: "Apartment",
      image: "assets/property_apartment.png",
      units: [
        { id: "unit_101", number: "Apt 101", rent: 1800, tenantId: "tenant_1", status: "Occupied" },
        { id: "unit_102", number: "Apt 102", rent: 1900, tenantId: null, status: "Vacant" },
        { id: "unit_103", number: "Apt 103", rent: 1850, tenantId: "tenant_2", status: "Occupied" }
      ]
    },
    {
      id: "prop_2",
      name: "Oakwood Industrial Lofts",
      address: "1042 Industrial Pkwy, Sector 7G",
      type: "Loft",
      image: "assets/property_loft.png",
      units: [
        { id: "unit_a", number: "Loft A", rent: 2400, tenantId: "tenant_3", status: "Occupied" },
        { id: "unit_b", number: "Loft B", rent: 2600, tenantId: null, status: "Vacant" }
      ]
    },
    {
      id: "prop_3",
      name: "Pinecrest Cottage",
      address: "88 Whispering Pines Road",
      type: "Single Family",
      image: "assets/property_modern.png",
      units: [
        { id: "unit_main", number: "Main House", rent: 3100, tenantId: null, status: "Vacant" }
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
      deposit: 2700,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "Active",
      lateFeeRule: "Apply $50 fee after 5 days",
      utilitySplit: "Tenant pays 100% utilities",
      tenantSignature: "Sarah Jenkins",
      ownerSignature: "Marcus Sterling",
      signedAt: "2026-01-01T12:00:00Z"
    }
  ],
  screenings: [
    {
      tenantId: "tenant_1",
      creditScore: 780,
      criminalCheck: "Passed",
      evictionCheck: "No records found",
      verifiedAt: "2026-01-01T10:00:00Z"
    }
  ],
  contractors: [
    { id: "contr_1", name: "Apex Plumbing Solutions", trade: "Plumbing", rating: "4.8 ★" },
    { id: "contr_2", name: "Electric Express LLC", trade: "Electrical", rating: "4.9 ★" },
    { id: "contr_3", name: "HVAC Thermal Comfort", trade: "HVAC", rating: "4.7 ★" }
  ],
  maintenanceRequests: [
    {
      id: "req_1",
      propertyId: "prop_1",
      unitId: "unit_101",
      tenantId: "tenant_1",
      title: "Kitchen Sink Leak",
      description: "Water is slowly pooling under the kitchen sink cabinetry when the tap runs.",
      category: "Plumbing",
      priority: "Medium",
      status: "Reported",
      createdAt: "2026-05-28T10:00:00Z",
      attachment: null,
      cost: 0,
      taxCategory: "",
      contractorId: null,
      chat: [
        { senderId: "tenant_1", text: "Water is slow pooling under the kitchen sink.", timestamp: "2026-05-28T10:05:00Z" }
      ]
    },
    {
      id: "req_2",
      propertyId: "prop_2",
      unitId: "unit_a",
      tenantId: "tenant_3",
      title: "AC Fan Noise",
      description: "The ceiling AC unit makes a loud rattling sound whenever it kicks in.",
      category: "HVAC",
      priority: "High",
      status: "In Progress",
      createdAt: "2026-05-30T14:30:00Z",
      attachment: "assets/property_loft.png",
      cost: 150,
      taxCategory: "Repairs",
      contractorId: "contr_3",
      chat: [
        { senderId: "tenant_3", text: "It is rattling quite loudly when running.", timestamp: "2026-05-30T14:35:00Z" },
        { senderId: "owner_1", text: "I have dispatched HVAC Thermal Comfort to look at it.", timestamp: "2026-05-30T15:00:00Z" }
      ]
    }
  ],
  rentPayments: [
    {
      id: "pay_1",
      tenantId: "tenant_1",
      unitId: "unit_101",
      propertyId: "prop_1",
      amount: 1800,
      dueDate: "2026-06-01",
      status: "Pending",
      paidAt: null
    },
    {
      id: "pay_2",
      tenantId: "tenant_1",
      unitId: "unit_101",
      propertyId: "prop_1",
      amount: 1800,
      dueDate: "2026-05-01",
      status: "Paid",
      paidAt: "2026-05-01T09:12:00Z"
    },
    {
      id: "pay_3",
      tenantId: "tenant_1",
      unitId: "unit_101",
      propertyId: "prop_1",
      amount: 1800,
      dueDate: "2026-04-01",
      status: "Paid",
      paidAt: "2026-04-01T11:45:00Z"
    },
    {
      id: "pay_4",
      tenantId: "tenant_2",
      unitId: "unit_103",
      propertyId: "prop_1",
      amount: 1850,
      dueDate: "2026-06-01",
      status: "Paid",
      paidAt: "2026-05-30T17:22:00Z"
    },
    {
      id: "pay_5",
      tenantId: "tenant_3",
      unitId: "unit_a",
      propertyId: "prop_2",
      amount: 2400,
      dueDate: "2026-05-15",
      status: "Overdue",
      paidAt: null
    }
  ],
  messages: [
    {
      id: "msg_1",
      senderId: "tenant_1",
      recipientId: "owner_1",
      text: "Hello Marcus, I just filed a maintenance ticket for the kitchen sink leak. It's a slow drip.",
      timestamp: "2026-05-28T10:05:00Z"
    },
    {
      id: "msg_2",
      senderId: "owner_1",
      recipientId: "tenant_1",
      text: "Thanks for reporting, Sarah. I will check the schedule and have our plumbing dispatch look at it.",
      timestamp: "2026-05-28T11:30:00Z"
    },
    {
      id: "msg_3",
      senderId: "tenant_3",
      recipientId: "owner_1",
      text: "Hi Marcus, the AC unit in Loft A is making a rattling noise. It is still blowing cold air though.",
      timestamp: "2026-05-30T14:35:00Z"
    }
  ],
  documents: [
    {
      id: "doc_1",
      userId: "tenant_1",
      name: "Lease_Contract_Jenkins.pdf",
      type: "Lease Agreement",
      status: "Approved",
      uploadedAt: "2026-01-01T12:00:00Z"
    },
    {
      id: "doc_2",
      userId: "tenant_1",
      name: "Government_ID_SarahJ.pdf",
      type: "ID Proof",
      status: "Approved",
      uploadedAt: "2026-01-01T12:15:00Z"
    },
    {
      id: "doc_3",
      userId: "tenant_3",
      name: "Payslip_May_2026.pdf",
      type: "Income Proof",
      status: "Pending",
      uploadedAt: "2026-05-29T16:40:00Z"
    }
  ],
  invitations: [
    {
      code: "INV-TEST12",
      name: "Joe Renter",
      email: "joe@renter.com",
      propertyId: "prop_2",
      unitId: "unit_b",
      rentAmount: 2600,
      status: "Pending",
      createdAt: "2026-06-01T12:00:00Z"
    }
  ],
  notifications: [
    {
      id: "not_1",
      text: "Sarah Jenkins uploaded paystub_sarah_may.pdf for review",
      type: "document",
      read: false,
      timestamp: "2026-06-01T15:30:00Z"
    },
    {
      id: "not_2",
      text: "Rent invoice of $1,850 cleared by James Miller",
      type: "payment",
      read: false,
      timestamp: "2026-06-01T17:22:00Z"
    }
  ]
};

class Store {
  constructor() {
    this.storageKey = "homely_app_state_v5";
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse stored state. Resetting to default.", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.notify();
  }

  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  getAuth() {
    return this.state.auth;
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = Object.values(this.state.users).find(
      u => u.email.toLowerCase() === normalizedEmail
    );

    if (user) {
      this.state.auth = { ...user };
      this.state.currentUser = { ...user };
      this.saveState();
      return true;
    }
    return false;
  }

  signup(name, email, password, role, inviteCode) {
    let propertyId = null;
    let unitId = null;
    let rentAmount = 0;

    if (role === "tenant") {
      const invite = this.validateInvitationCode(inviteCode);
      if (!invite) {
        throw new Error("Invalid or expired invitation code. Tenant accounts must be invited by a landlord.");
      }
      propertyId = invite.propertyId;
      unitId = invite.unitId;
      rentAmount = invite.rentAmount;
      invite.status = "Used";
    }

    const userId = `${role}_${Date.now()}`;
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      phone: "+1 (555) 000-0000",
      notifyEmail: true,
      notifySMS: false
    };

    if (role === "tenant") {
      newUser.profession = "Unspecified";
      newUser.propertyId = propertyId;
      newUser.unitId = unitId;
      newUser.onboardingStatus = "Pending";
      localStorage.setItem("homely_last_active_tenant_id", userId);

      const prop = this.state.properties.find(p => p.id === propertyId);
      if (prop) {
        const u = prop.units.find(un => un.id === unitId);
        if (u) {
          u.tenantId = userId;
          u.status = "Occupied";
          u.rent = rentAmount;
        }
      }

      // Pre-create the draft lease that needs signature!
      this.state.leases.push({
        id: `lease_${Date.now()}`,
        propertyId: propertyId,
        unitId: unitId,
        tenantId: userId,
        rent: rentAmount,
        deposit: invite.depositAmount || Math.round(rentAmount * 1.5),
        startDate: invite.startDate || new Date().toISOString().split("T")[0],
        endDate: invite.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Draft",
        lateFeeRule: invite.lateFeeRule || "Apply $50 fee after 5 days",
        utilitySplit: invite.utilitySplit || "Tenant pays 100% utilities",
        tenantSignature: null,
        ownerSignature: "Marcus Sterling",
        signedAt: null
      });

      this.addNotification(`Renter ${name} registered. Awaiting screening & lease signature.`, "invite");
    } else {
      newUser.company = "Independent Owner";
      newUser.onboardingStatus = "Completed";
    }

    this.state.users[userId] = newUser;
    this.state.auth = { ...newUser };
    this.state.currentUser = { ...newUser };
    this.saveState();
    return newUser;
  }

  logout() {
    this.state.auth = null;
    this.state.currentUser = null;
    this.saveState();
  }

  getProperties() {
    return this.state.properties;
  }

  getMaintenanceRequests() {
    return this.state.maintenanceRequests;
  }

  getRentPayments() {
    return this.state.rentPayments;
  }

  getUsers() {
    return this.state.users;
  }

  getMessages() {
    return this.state.messages;
  }

  getDocuments() {
    return this.state.documents;
  }

  getInvitations() {
    return this.state.invitations;
  }

  getNotifications() {
    return this.state.notifications;
  }

  // Mutations
  switchUser(userId) {
    const user = this.state.users[userId];
    if (user) {
      this.state.currentUser = { ...user };
      this.state.auth = { ...user };
      if (user.role === "tenant") {
        localStorage.setItem("homely_last_active_tenant_id", userId);
      }
      this.saveState();
    }
  }

  getLastActiveTenantId() {
    const stored = localStorage.getItem("homely_last_active_tenant_id");
    if (stored && this.state.users[stored]) {
      return stored;
    }
    const tenantUsers = Object.keys(this.state.users).filter(id => this.state.users[id].role === "tenant");
    return tenantUsers.includes("tenant_1") ? "tenant_1" : (tenantUsers[0] || null);
  }

  addProperty(property) {
    const propertyId = `prop_${Date.now()}`;
    
    // Parse multi-unit string input (e.g. "101, 102, 103" or "A, B")
    const unitsRaw = property.unitsString || "Main";
    const unitNames = unitsRaw.split(",")
      .map(u => u.trim())
      .filter(u => u.length > 0);

    const rentAmt = Number(property.rent) || 1500;

    const newProp = {
      id: propertyId,
      name: property.name,
      address: property.address,
      type: property.type,
      image: property.image || "assets/property_modern.png",
      units: unitNames.map((name, index) => ({
        id: `unit_${Date.now()}_${index}`,
        number: name,
        rent: rentAmt,
        tenantId: null,
        status: "Vacant"
      }))
    };
    this.state.properties.push(newProp);
    
    this.addNotification(`New asset '${property.name}' registered to portfolio with ${unitNames.length} units.`, "property");
    this.saveState();
  }

  addMaintenanceRequest(request) {
    const newReq = {
      id: `req_${Date.now()}`,
      propertyId: request.propertyId,
      unitId: request.unitId,
      tenantId: request.tenantId,
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      status: "Reported",
      createdAt: new Date().toISOString(),
      attachment: request.attachment || null,
      cost: 0,
      taxCategory: "",
      contractorId: null,
      chat: []
    };
    this.state.maintenanceRequests.unshift(newReq);
    
    const tenant = this.state.users[request.tenantId] || { name: "A tenant" };
    this.addNotification(`New repair log reported by ${tenant.name.split(" ")[0]}: '${request.title}'`, "maintenance");
    this.saveState();
  }

  updateMaintenanceStatus(requestId, newStatus, cost = 0, taxCategory = "Repairs") {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.status = newStatus;
      if (newStatus === "Resolved") {
        req.cost = Number(cost) || 0;
        req.taxCategory = taxCategory;
        this.addNotification(`Repair log resolved. Invoiced cost: $${req.cost.toLocaleString()} under Schedule E category '${taxCategory}'`, "maintenance");
      }
      this.saveState();
    }
  }

  payRent(paymentId, paymentMethod = "Credit Card") {
    const payment = this.state.rentPayments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = "Paid";
      payment.paidAt = new Date().toISOString();
      
      const tenant = this.state.users[payment.tenantId] || { name: "Renter" };
      const billType = payment.billingType || "Rent";
      this.addNotification(`${billType} yield of $${payment.amount.toLocaleString()} cleared by ${tenant.name.split(" ")[0]} via ${paymentMethod}.`, "payment");
      
      // If credit booster enabled, raise score!
      if (tenant.creditBoosterEnabled) {
        let screening = this.state.screenings.find(s => s.tenantId === payment.tenantId);
        if (!screening) {
          screening = {
            tenantId: payment.tenantId,
            creditScore: 740,
            criminalCheck: "Passed",
            evictionCheck: "No records found",
            verifiedAt: new Date().toISOString()
          };
          this.state.screenings.push(screening);
        }
        const oldScore = screening.creditScore;
        screening.creditScore = Math.min(850, screening.creditScore + 10);
        this.addNotification(`[Credit Booster] reported payment for ${tenant.name.split(" ")[0]}. Score raised from ${oldScore} to ${screening.creditScore}.`, "document");
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
    
    const tenant = this.state.users[userId] || { name: "Renter" };
    this.addNotification(`${tenant.name.split(" ")[0]} uploaded ${name} credentials.`, "document");
    this.saveState();
    return newDoc;
  }

  updateDocumentStatus(docId, newStatus) {
    const doc = this.state.documents.find(d => d.id === docId);
    if (doc) {
      doc.status = newStatus;
      
      const tenant = this.state.users[doc.userId] || { id: "" };
      this.addNotification(`Onboarding credential '${doc.name}' marked ${newStatus}.`, "document");
      this.saveState();
    }
  }

  updateProfile(userId, profileData) {
    const user = this.state.users[userId];
    if (user) {
      user.name = profileData.name.trim();
      user.email = profileData.email.trim().toLowerCase();
      user.phone = profileData.phone.trim();
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
      depositAmount: Number(inv.deposit) || Math.round(Number(inv.rent) * 1.5),
      startDate: inv.startDate || new Date().toISOString().split("T")[0],
      endDate: inv.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lateFeeRule: inv.lateFeeRule || "Apply $50 fee after 5 days",
      utilitySplit: inv.utilitySplit || "Tenant pays 100% utilities",
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    this.state.invitations.unshift(newInvite);
    
    this.addNotification(`Invite code ${code} generated for renter ${inv.name}.`, "invite");
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

  // Global Notification actions
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

  // New Competitor & Fintech Getters & Mutations
  getLeases() {
    return this.state.leases || [];
  }

  getScreenings() {
    return this.state.screenings || [];
  }

  getContractors() {
    return this.state.contractors || [];
  }

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
      lateFeeRule: leaseData.lateFeeRule || "Apply $50 fee after 5 days",
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

      // Generate invoice
      this.state.rentPayments.unshift({
        id: `pay_${Date.now()}`,
        tenantId: tenantId,
        unitId: lease.unitId,
        propertyId: lease.propertyId,
        amount: lease.rent,
        dueDate: new Date().toISOString().split("T")[0],
        status: "Pending",
        paidAt: null
      });

      user.onboardingStatus = "Completed";
      if (this.state.auth && this.state.auth.id === tenantId) {
        this.state.auth.onboardingStatus = "Completed";
        this.state.currentUser.onboardingStatus = "Completed";
      }

      this.addNotification(`Lease Agreement signed via e-sign pad by ${user.name}.`, "invite");
      this.saveState();
    }
  }

  runTenantScreening(tenantId, creditScore = 740) {
    const screening = {
      tenantId: tenantId,
      creditScore: Number(creditScore),
      criminalCheck: "Passed",
      evictionCheck: "No records found",
      verifiedAt: new Date().toISOString()
    };
    this.state.screenings.push(screening);
    this.saveState();
  }

  assignContractor(requestId, contractorId) {
    const req = this.state.maintenanceRequests.find(r => r.id === requestId);
    if (req) {
      req.contractorId = contractorId;
      req.status = "In Progress";
      
      const contractor = this.state.contractors.find(c => c.id === contractorId);
      const name = contractor ? contractor.name : "dispatch service";
      
      req.chat.push({
        senderId: "owner_1",
        text: `Assigned contractor: ${name}. Work order dispatched.`,
        timestamp: new Date().toISOString()
      });
      
      this.addNotification(`Contractor dispatched to ticket: '${req.title}'`, "maintenance");
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
        const t = this.state.users[p.tenantId] || { name: "Tenant" };
        this.addNotification(`Automated late fee of $50 applied to ${t.name.split(" ")[0]} overdue rent.`, "payment");
      } else if (p.status === "Pending") {
        const today = new Date().toISOString().split("T")[0];
        if (p.dueDate < today && !p.lateFeeApplied) {
          p.status = "Overdue";
          p.amount += 50;
          p.lateFeeApplied = true;
          count++;
          const t = this.state.users[p.tenantId] || { name: "Tenant" };
          this.addNotification(`Billing past due date. Marked Overdue. Late fee of $50 applied to ${t.name.split(" ")[0]}.`, "payment");
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
      const rule = lease ? lease.utilitySplit : "Tenant pays 100% utilities";
      let splitFactor = 1.0;
      if (rule.includes("50/50")) {
        splitFactor = 0.5;
      } else if (rule.includes("included")) {
        splitFactor = 0;
      }
      const rawShare = (amount / totalUnits) * splitFactor;
      const share = Math.round(rawShare);
      if (share > 0) {
        const tenant = this.state.users[u.tenantId];
        const tenantName = tenant ? tenant.name.split(" ")[0] : "Tenant";
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
          description: `${category} Split Bill`
        });
        this.addNotification(`Utility split bill of $${share} posted to ${tenantName} for ${category}.`, "payment");
      }
    });
    this.saveState();
  }

  toggleCreditBooster(tenantId, enabled) {
    const user = this.state.users[tenantId];
    if (user) {
      user.creditBoosterEnabled = enabled;
      if (this.state.auth && this.state.auth.id === tenantId) {
        this.state.auth.creditBoosterEnabled = enabled;
        this.state.currentUser.creditBoosterEnabled = enabled;
      }
      this.addNotification(`Credit Booster toggled ${enabled ? 'ON' : 'OFF'} for ${user.name.split(" ")[0]}.`, "document");
      this.saveState();
    }
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

      this.addNotification(`Solicited bids from contractors for ticket '${req.title}'.`, "maintenance");
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
      const name = contractor ? contractor.name : "contractor";
      
      req.chat.push({
        senderId: "owner_1",
        text: `Accepted quote from ${name}: $${cost.toLocaleString()} (Est. completion: ${contractor.trade === req.category ? '1-2 days' : '3-5 days'}). Dispatch order sent.`,
        timestamp: new Date().toISOString()
      });
      
      this.addNotification(`Bid accepted from ${name} for ticket: '${req.title}'`, "maintenance");
      this.saveState();
    }
  }
}

export const store = new Store();
