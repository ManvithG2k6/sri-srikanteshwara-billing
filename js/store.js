// Data Store Engine for Sri Srikanteshwara Provision and Oil Store

class DataStore {
  constructor() {
    this.storageKey = 'sri_srikanteshwara_store_v1';
    this.listeners = new Set();
    this.init();
  }

  init() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.categories = parsed.categories || window.initialCategories;
        this.products = parsed.products || window.initialProducts;
        this.customers = parsed.customers || window.initialCustomers;
        this.suppliers = parsed.suppliers || window.initialSuppliers;
        this.users = parsed.users || window.initialUsers;
        this.invoices = parsed.invoices || window.initialInvoices;
        this.drafts = parsed.drafts || [];
        this.auditLogs = parsed.auditLogs || [];
        this.settings = parsed.settings || window.initialStoreSettings;
        this.currentUser = parsed.currentUser || window.initialUsers[0];
        this.currentLang = parsed.currentLang || 'en';
        this.currentTheme = parsed.currentTheme || 'light';
      } catch (e) {
        console.error("Failed parsing storage, loading defaults", e);
        this.loadDefaults();
      }
    } else {
      this.loadDefaults();
    }
    this.buildSearchIndex();
  }

  loadDefaults() {
    this.categories = [...window.initialCategories];
    this.products = [...window.initialProducts];
    this.customers = [...window.initialCustomers];
    this.suppliers = [...window.initialSuppliers];
    this.users = [...window.initialUsers];
    this.invoices = [...window.initialInvoices];
    this.drafts = [];
    this.auditLogs = [{
      id: 'log-1',
      timestamp: new Date().toISOString(),
      userName: 'System',
      action: 'INITIALIZE',
      details: 'System initialized with default grocery dataset.'
    }];
    this.settings = { ...window.initialStoreSettings };
    this.currentUser = window.initialUsers[0];
    this.currentLang = 'en';
    this.currentTheme = 'light';
    this.save();
  }

  save() {
    try {
      const data = {
        categories: this.categories,
        products: this.products,
        customers: this.customers,
        suppliers: this.suppliers,
        users: this.users,
        invoices: this.invoices,
        drafts: this.drafts,
        auditLogs: this.auditLogs,
        settings: this.settings,
        currentUser: this.currentUser,
        currentLang: this.currentLang,
        currentTheme: this.currentTheme
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.buildSearchIndex();
      this.notify();
    } catch (e) {
      console.error("Save error:", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  buildSearchIndex() {
    this.searchIndex = this.products.map(p => {
      const tokens = `${p.barcode} ${p.name} ${p.nameKannada || ''} ${p.brand} ${p.category}`.toLowerCase();
      return { id: p.id, barcode: p.barcode, tokens, product: p };
    });
  }

  searchProducts(query, categoryFilter = '') {
    if (!query && !categoryFilter) return this.products;
    const q = (query || '').trim().toLowerCase();
    
    return this.products.filter(p => {
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!q) return true;

      if (p.barcode.includes(q)) return true;

      const fullText = `${p.name} ${p.nameKannada || ''} ${p.brand} ${p.category}`.toLowerCase();
      return fullText.includes(q);
    });
  }

  findProductByBarcode(barcode) {
    return this.products.find(p => p.barcode === barcode.trim());
  }

  createInvoice(invoiceData) {
    const nextNum = this.invoices.length + 1001;
    const invoiceNo = `SS-2026-${nextNum}`;
    const now = new Date();
    
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      cashierId: this.currentUser ? this.currentUser.id : 'user-3',
      cashierName: this.currentUser ? this.currentUser.name : 'Cashier',
      status: 'Completed',
      ...invoiceData
    };

    invoiceData.items.forEach(item => {
      const p = this.products.find(prod => prod.id === item.productId);
      if (p) {
        p.stockQty = Math.max(0, p.stockQty - item.qty);
      }
    });

    if (invoiceData.customerId && invoiceData.customerId !== 'walk-in') {
      const cust = this.customers.find(c => c.id === invoiceData.customerId);
      if (cust) {
        const earnedPoints = Math.floor(invoiceData.grandTotal / 100);
        cust.loyaltyPoints += earnedPoints;
        cust.totalPurchases += invoiceData.grandTotal;
      }
    }

    this.invoices.unshift(newInvoice);
    this.addAuditLog('CREATE_BILL', `Bill #${invoiceNo} created for ₹${invoiceData.grandTotal}`);
    this.save();
    return newInvoice;
  }

  saveDraftBill(cartState) {
    if (!cartState.items || cartState.items.length === 0) return;
    const draft = {
      id: `draft-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      ...cartState
    };
    this.drafts.push(draft);
    this.addAuditLog('HOLD_BILL', `Draft bill held with ${cartState.items.length} items`);
    this.save();
  }

  deleteDraftBill(draftId) {
    this.drafts = this.drafts.filter(d => d.id !== draftId);
    this.save();
  }

  saveProduct(productData) {
    if (productData.id) {
      const idx = this.products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        this.products[idx] = { ...productData };
        this.addAuditLog('UPDATE_PRODUCT', `Updated product: ${productData.name}`);
      }
    } else {
      const newProd = {
        id: `p-${Date.now()}`,
        ...productData
      };
      this.products.unshift(newProd);
      this.addAuditLog('ADD_PRODUCT', `Added new product: ${productData.name}`);
    }
    this.save();
  }

  deleteProduct(productId) {
    const p = this.products.find(prod => prod.id === productId);
    this.products = this.products.filter(prod => prod.id !== productId);
    if (p) {
      this.addAuditLog('DELETE_PRODUCT', `Deleted product: ${p.name}`);
    }
    this.save();
  }

  saveCustomer(customerData) {
    if (customerData.id) {
      const idx = this.customers.findIndex(c => c.id === customerData.id);
      if (idx !== -1) {
        this.customers[idx] = { ...customerData };
        this.addAuditLog('UPDATE_CUSTOMER', `Updated customer: ${customerData.name}`);
      }
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        loyaltyPoints: 0,
        totalPurchases: 0,
        outstandingBalance: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...customerData
      };
      this.customers.unshift(newCust);
      this.addAuditLog('ADD_CUSTOMER', `Added customer: ${customerData.name}`);
    }
    this.save();
  }

  deleteCustomer(customerId) {
    this.customers = this.customers.filter(c => c.id !== customerId);
    this.save();
  }

  addAuditLog(action, details) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: this.currentUser ? this.currentUser.name : 'System',
      action,
      details
    });
    if (this.auditLogs.length > 500) this.auditLogs.pop();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.save();
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.save();
  }

  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage.getItem(this.storageKey)));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Sri_Srikanteshwara_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  restoreBackupJSON(jsonContent) {
    try {
      const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      if (typeof parsed === 'string') {
        localStorage.setItem(this.storageKey, parsed);
      } else {
        localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      }
      this.init();
      this.addAuditLog('RESTORE_BACKUP', 'Database restored from JSON backup file.');
      return true;
    } catch (e) {
      console.error("Failed restoring backup", e);
      return false;
    }
  }
}

window.store = new DataStore();
