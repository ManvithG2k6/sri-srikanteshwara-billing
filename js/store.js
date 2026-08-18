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
        this.invoices = parsed.invoices || window.initialInvoices; // Initialize invoices first
        // Ensure all loaded products have unique IDs
        this.products.forEach(prod => {
          if (!prod.id || typeof prod.id !== 'string' || prod.id.trim() === '') {
            prod.id = `p-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
          }
        });
        this.customers = parsed.customers || window.initialCustomers;
        this.suppliers = parsed.suppliers || window.initialSuppliers;
        this.salesHistory = parsed.salesHistory || this.invoices || []; // Now this.invoices is defined
            this.archivedRevenues = parsed.archivedRevenues || [];
            this.revenue = Object.assign({
              today: 0,
              week: 0,
              month: 0,
              lifetime: 0,
              lastResetAt: null
            }, parsed.revenue || {});
        this.users = parsed.users || window.initialUsers;
        this.drafts = parsed.drafts || [];
        this.auditLogs = parsed.auditLogs || [];
        this.settings = {
          ...window.initialStoreSettings,
          ...(parsed.settings || {})
        };
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
    // Recompute revenue counters if missing using invoices
    this._recomputeRevenueFromInvoices();
    this.buildSearchIndex();
  }

  _recomputeRevenueFromInvoices() {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0,0,0,0);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let today = 0, week = 0, month = 0, lifetime = 0;
      (this.invoices || []).forEach(inv => {
        const invDate = new Date(inv.date + 'T00:00:00');
        lifetime += Number(inv.grandTotal) || 0;
        if (inv.date === todayStr) today += Number(inv.grandTotal) || 0;
        if (invDate >= startOfWeek) week += Number(inv.grandTotal) || 0;
        if (invDate >= startOfMonth) month += Number(inv.grandTotal) || 0;
      });
      this.revenue = this.revenue || {};
      this.revenue.today = today;
      this.revenue.week = week;
      this.revenue.month = month;
      this.revenue.lifetime = lifetime;
    } catch (e) {
      console.error('Revenue recompute failed', e);
    }
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
        revenue: this.revenue,
        archivedRevenues: this.archivedRevenues,
        salesHistory: this.salesHistory,
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
    // Use requestAnimationFrame to prevent render-blocking on large data changes
    requestAnimationFrame(() => {
      this.listeners.forEach(fn => fn());
    });
  }

  buildSearchIndex() {
    this.searchIndex = this.products.map(p => {
      const tokens = `${p.barcode} ${p.name} ${p.brand} ${p.category}`.toLowerCase();
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

      return `${p.name} ${p.nameKannada || ''} ${p.brand} ${p.category} ${p.barcode}`.toLowerCase().includes(q);
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
      items: invoiceData.items.map(item => ({
        ...item,
        returnedQty: 0
      })),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      cashierId: this.currentUser ? this.currentUser.id : 'user-3',
      cashierName: this.currentUser ? this.currentUser.name : 'Cashier',
      status: 'Completed',
      ...invoiceData
    };

    newInvoice.items.forEach(item => {
      const p = this.products.find(prod => prod.id === item.productId);
      if (p) {
        p.stockQty = Math.max(0, p.stockQty - item.qty);
      }
    });

    if (invoiceData.customerId && invoiceData.customerId !== 'walk-in') {
      const cust = this.customers.find(c => c.id === invoiceData.customerId);
      if (cust) {
        cust.totalPurchases += invoiceData.grandTotal;
      }
    }

    this.invoices.unshift(newInvoice);
    // keep salesHistory in sync
    this.salesHistory = this.salesHistory || [];
    this.salesHistory.unshift(newInvoice);
    this.addAuditLog('CREATE_BILL', `Bill #${invoiceNo} created for ₹${invoiceData.grandTotal}`);
    // update revenue counters
    try {
      this._incrementRevenue(newInvoice.grandTotal, newInvoice);
    } catch (e) { console.error(e); }
    this.save();
    return newInvoice;
  }

  _incrementRevenue(amount, invoice) {
    amount = Number(amount) || 0;
    if (!this.revenue) this.revenue = { today:0, week:0, month:0, lifetime:0 };
    this.revenue.lifetime = (this.revenue.lifetime || 0) + amount;
    // recompute today/week/month incrementally
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (invoice && invoice.date === todayStr) this.revenue.today = (this.revenue.today || 0) + amount;
    // week and month recompute for safety
    this._recomputeRevenueFromInvoices();
  }

  archiveRevenue(scope, meta = {}) {
    this.archivedRevenues = this.archivedRevenues || [];
    const snapshot = {
      id: `arch-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      scope,
      revenue: Object.assign({}, this.revenue),
      meta,
      archivedAt: new Date().toISOString()
    };
    this.archivedRevenues.push(snapshot);
    this.save();
    return snapshot;
  }

  resetRevenue(scope) {
    // scope: 'today'|'week'|'month'|'all'
    // archive before reset
    this.archiveRevenue(scope, {reason: 'manual_reset'});
    if (scope === 'today') this.revenue.today = 0;
    else if (scope === 'week') this.revenue.week = 0;
    else if (scope === 'month') this.revenue.month = 0;
    else if (scope === 'all') { this.revenue.today = 0; this.revenue.week = 0; this.revenue.month = 0; this.revenue.lifetime = 0; }
    this.revenue.lastResetAt = new Date().toISOString();
    this.save();
  }

  clearInvoiceHistory() {
    this.invoices = [];
    this.salesHistory = []; // Also clear salesHistory if it's a separate record
    this.addAuditLog('CLEAR_HISTORY', 'All invoice history cleared.');
    this.save();
  }

  deleteInvoice(invoiceId) {
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      this.invoices = this.invoices.filter(inv => inv.id !== invoiceId);
      this.salesHistory = (this.salesHistory || []).filter(inv => inv.id !== invoiceId);
      this.addAuditLog('DELETE_INVOICE', `Deleted Invoice #${invoice.invoiceNo}`);
      this.save();
    }
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
    // Use barcode as the unique identifier for updates from external sources like CSV
    const existingProduct = this.products.find(p => p.barcode === productData.barcode);

    // Sanitize and parse incoming data
    const parsedData = {
      ...productData,
      purchasePrice: parseFloat(productData.purchasePrice) || 0,
      sellingPrice: parseFloat(productData.sellingPrice) || 0,
      gstRate: parseFloat(productData.gstRate) || 0,
      stockQty: parseFloat(productData.stockQty) || 0,
      minStockAlert: parseFloat(productData.minStockAlert) || 10,
    };

    if (existingProduct) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === existingProduct.id);
      this.products[index] = {
        ...existingProduct, // Keep original ID and other non-CSV fields
        ...parsedData // Overwrite with new data
      };
      this.addAuditLog('UPDATE_PRODUCT', `Updated product via import: ${parsedData.name}`);
    } else {
      // Create new product
      const newProd = {
        brand: 'SS Farm', // Default brand
        ...parsedData, // Use parsed data
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` // Generate a new unique ID
      };
      this.products.unshift(newProd);
      this.addAuditLog('ADD_PRODUCT', `Added new product: ${newProd.name}`);
    }
    this.save();
  }

  importProducts(productsData) {
    let importedCount = 0;
    productsData.forEach(productData => {
      const existingProduct = this.products.find(p => p.barcode === productData.barcode);

      const parsedData = {
        ...productData,
        purchasePrice: parseFloat(productData.purchasePrice) || 0,
        sellingPrice: parseFloat(productData.sellingPrice) || 0,
        gstRate: parseFloat(productData.gstRate) || 0,
        stockQty: parseFloat(productData.stockQty) || 0,
        minStockAlert: parseFloat(productData.minStockAlert) || 10,
      };

      if (existingProduct) {
        const index = this.products.findIndex(p => p.id === existingProduct.id);
        this.products[index] = { ...existingProduct, ...parsedData };
      } else {
        const newProd = {
          brand: 'SS Farm',
          ...parsedData,
          id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        };
        this.products.unshift(newProd);
      }
      importedCount++;
    });

    this.addAuditLog('IMPORT_PRODUCTS', `Imported ${importedCount} products from CSV.`);
    this.save(); // Save only once after all products are processed
    return importedCount;
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

  saveSupplier(supplierData) {
    if (supplierData.id) {
      const idx = this.suppliers.findIndex(s => s.id === supplierData.id);
      if (idx !== -1) {
        this.suppliers[idx] = { ...this.suppliers[idx], ...supplierData };
        this.addAuditLog('UPDATE_SUPPLIER', `Updated supplier: ${supplierData.name}`);
      }
    } else {
      const newSupplier = {
        id: `sup-${Date.now()}`,
        totalPurchases: 0,
        pendingAmount: 0,
        ...supplierData
      };
      this.suppliers.unshift(newSupplier);
      this.addAuditLog('ADD_SUPPLIER', `Added supplier: ${newSupplier.name}`);
    }
    this.save();
  }

  deleteSupplier(supplierId) {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    this.suppliers = this.suppliers.filter(s => s.id !== supplierId);
    if (supplier) {
      this.addAuditLog('DELETE_SUPPLIER', `Deleted supplier: ${supplier.name}`);
    }
    this.save();
  }

  deleteUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
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
