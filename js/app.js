// Main Application Controller - Sri Srikanteshwara Store

class App {
  constructor() {
    this.activeNav = 'pos';
    this.cartState = {
      items: [],
      customerId: 'walk-in',
      billDiscount: 0,
      enableRoundOff: true
    };
    this.posSearchQuery = '';
    this.posCatFilter = '';
    this.barcodeBuffer = '';
    this.barcodeTimeout = null;

    this.init();
  }

  init() {
    const store = window.store;
    document.documentElement.setAttribute('data-theme', store.currentTheme || 'light');

    store.subscribe(() => this.render());

    this.setupGlobalScanner();
    this.setupKeyboardShortcuts();

    this.render();
  }

  playScanBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio not allowed', e);
    }
  }

  setupGlobalScanner() {
    window.addEventListener('keydown', (e) => {
      const targetTag = e.target.tagName;
      if ((targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') && e.target.id !== 'pos-product-search') {
        return;
      }

      if (e.key === 'Enter') {
        if (this.barcodeBuffer.length >= 3) {
          const barcode = this.barcodeBuffer.trim();
          this.handleBarcodeScanned(barcode);
          this.barcodeBuffer = '';
        }
      } else if (e.key.length === 1) {
        this.barcodeBuffer += e.key;
        clearTimeout(this.barcodeTimeout);
        this.barcodeTimeout = setTimeout(() => {
          this.barcodeBuffer = '';
        }, 120);
      }
    });
  }

  handleBarcodeScanned(barcode) {
    const store = window.store;
    const p = store.findProductByBarcode(barcode);
    if (p) {
      this.playScanBeep();
      this.addToCart(p);
      this.showToast(`Scanned: ${p.name}`);
    } else {
      this.showToast(`Barcode ${barcode} not found in store database!`, 'warning');
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        this.cartState = { items: [], customerId: 'walk-in', billDiscount: 0, enableRoundOff: true };
        this.activeNav = 'pos';
        this.render();
        this.showToast('New Bill started');
      } else if (e.key === 'F2') {
        e.preventDefault();
        this.activeNav = 'pos';
        this.render();
        const searchInput = document.getElementById('pos-product-search');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (this.cartState.items.length > 0) {
          this.openPaymentModal();
        }
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (this.cartState.items.length > 0) {
          window.store.saveDraftBill(this.cartState);
          this.cartState = { items: [], customerId: 'walk-in', billDiscount: 0, enableRoundOff: true };
          this.render();
          this.showToast('Bill held in drafts!');
        }
      }
    });
  }

  addToCart(product, qty = 1) {
    const existingIndex = this.cartState.items.findIndex(item => item.productId === product.id);
    if (existingIndex !== -1) {
      this.cartState.items[existingIndex].qty += qty;
    } else {
      this.cartState.items.push({
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        unit: product.unit,
        qty: qty,
        rate: product.sellingPrice,
        discount: 0,
        gstRate: product.gstRate || 0,
        total: product.sellingPrice * qty
      });
    }
    this.render();
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeft = `4px solid ${type === 'warning' ? 'var(--warning)' : type === 'danger' ? 'var(--danger)' : 'var(--primary)'}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check'}" style="color:${type === 'warning' ? 'var(--warning)' : 'var(--primary)'};"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  render() {
    const store = window.store;
    const appEl = document.getElementById('app');
    if (!appEl) return;

    if (!store.currentUser) {
      appEl.innerHTML = window.renderLoginModal();
      this.attachLoginEvents();
      return;
    }

    const lang = store.currentLang || 'en';
    const t = window.translations[lang] || window.translations.en;

    const pageTitles = {
      'pos': t.posBilling,
      'dashboard': t.dashboard,
      'price-list': t.priceListTitle,
      'products': t.products,
      'inventory': t.inventory,
      'customers': t.customers,
      'suppliers': t.suppliers,
      'bills': t.billHistory,
      'reports': t.reports,
      'users': t.userManagement,
      'settings': t.settings
    };

    appEl.innerHTML = `
      ${window.renderSidebar(this.activeNav)}
      <div class="main-wrapper">
        ${window.renderTopBar(pageTitles[this.activeNav] || 'Sri Srikanteshwara Store')}
        <main class="content-area" id="main-content-body">
          ${this.renderActiveContent()}
        </main>
      </div>
    `;

    this.attachGlobalEvents();
    this.attachPageSpecificEvents();

    if (this.activeNav === 'dashboard') {
      setTimeout(() => this.initDashboardCharts(), 50);
    }
  }

  renderActiveContent() {
    switch (this.activeNav) {
      case 'pos':
        return window.renderPOSBilling(this.cartState, this.posCatFilter, this.posSearchQuery);
      case 'dashboard':
        return window.renderDashboard();
      case 'price-list':
        return window.renderPriceList(this.priceListCat || '', this.priceListSearch || '', this.priceListSort || 'name-asc');
      case 'products':
        return window.renderProductManagement(this.prodMgmtSearch || '', this.prodMgmtCat || '');
      case 'inventory':
        return window.renderInventoryManagement();
      case 'customers':
        return window.renderCustomerManagement(this.custSearch || '');
      case 'suppliers':
        return window.renderSupplierManagement();
      case 'bills':
        return window.renderBillHistory(this.billSearch || '');
      case 'reports':
        return window.renderReports();
      case 'users':
        return window.renderUserManagement();
      case 'settings':
        return window.renderSettings();
      default:
        return window.renderPOSBilling(this.cartState);
    }
  }

  attachGlobalEvents() {
    const store = window.store;

    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const navId = el.getAttribute('data-nav');
        if (navId) {
          this.activeNav = navId;
          this.render();
        }
      });
    });

    const themeBtn = document.getElementById('toggle-theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = store.currentTheme === 'dark' ? 'light' : 'dark';
        store.setTheme(nextTheme);
      });
    }

    const langBtn = document.getElementById('toggle-lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const nextLang = store.currentLang === 'en' ? 'kn' : 'en';
        store.setLanguage(nextLang);
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.currentUser = null;
        this.render();
      });
    }
  }

  attachLoginEvents() {
    const store = window.store;

    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('login-user-select').value;
        const user = store.users.find(u => u.id === userId);
        if (user) {
          user.lastLogin = new Date().toLocaleString();
          store.currentUser = user;
          store.addAuditLog('USER_LOGIN', `User ${user.name} logged in.`);
          this.render();
          this.showToast(`Welcome ${user.name}!`);
        }
      });
    }

    document.querySelectorAll('.quick-demo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-user');
        const user = store.users.find(u => u.id === uId);
        if (user) {
          store.currentUser = user;
          this.render();
          this.showToast(`Logged in as ${user.role} (${user.name})`);
        }
      });
    });
  }

  attachPageSpecificEvents() {
    const store = window.store;

    if (this.activeNav === 'pos') {
      const searchInput = document.getElementById('pos-product-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.posSearchQuery = e.target.value;
          this.render();
          const inp = document.getElementById('pos-product-search');
          if (inp) {
            inp.focus();
            inp.setSelectionRange(inp.value.length, inp.value.length);
          }
        });
      }

      document.querySelectorAll('.pos-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.posCatFilter = btn.getAttribute('data-cat') || '';
          this.render();
        });
      });

      document.querySelectorAll('.add-to-cart-btn, .pos-product-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const pid = card.getAttribute('data-product-id');
          const p = store.products.find(prod => prod.id === pid);
          if (p) this.addToCart(p);
        });
      });

      document.querySelectorAll('.btn-cart-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          this.cartState.items[idx].qty += 1;
          this.render();
        });
      });

      document.querySelectorAll('.btn-cart-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          if (this.cartState.items[idx].qty > 1) {
            this.cartState.items[idx].qty -= 1;
          } else {
            this.cartState.items.splice(idx, 1);
          }
          this.render();
        });
      });

      document.querySelectorAll('.cart-qty-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
          const idx = parseInt(inp.getAttribute('data-index'));
          const val = parseFloat(e.target.value);
          if (val > 0) {
            this.cartState.items[idx].qty = val;
          } else {
            this.cartState.items.splice(idx, 1);
          }
          this.render();
        });
      });

      document.querySelectorAll('.btn-cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          this.cartState.items.splice(idx, 1);
          this.render();
        });
      });

      const custBtn = document.getElementById('btn-select-customer');
      if (custBtn) {
        custBtn.addEventListener('click', () => this.openCustomerSelectModal());
      }

      const discountInp = document.getElementById('cart-bill-discount-input');
      if (discountInp) {
        discountInp.addEventListener('change', (e) => {
          this.cartState.billDiscount = parseFloat(e.target.value) || 0;
          this.render();
        });
      }

      const clearBtn = document.getElementById('btn-clear-cart');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.cartState.items = [];
          this.render();
        });
      }

      const holdBtn = document.getElementById('btn-hold-cart');
      if (holdBtn) {
        holdBtn.addEventListener('click', () => {
          store.saveDraftBill(this.cartState);
          this.cartState = { items: [], customerId: 'walk-in', billDiscount: 0, enableRoundOff: true };
          this.render();
          this.showToast('Bill held in drafts!');
        });
      }

      const payBtn = document.getElementById('btn-pay-print');
      if (payBtn) {
        payBtn.addEventListener('click', () => this.openPaymentModal());
      }
    }

    if (this.activeNav === 'dashboard') {
      const newBillBtn = document.getElementById('dash-new-bill');
      if (newBillBtn) newBillBtn.addEventListener('click', () => { this.activeNav = 'pos'; this.render(); });
      
      const addProdBtn = document.getElementById('dash-add-product');
      if (addProdBtn) addProdBtn.addEventListener('click', () => this.openAddProductModal());
    }

    if (this.activeNav === 'price-list') {
      const printBtn = document.getElementById('print-price-list-btn');
      if (printBtn) printBtn.addEventListener('click', () => window.print());
    }

    if (this.activeNav === 'products') {
      const addBtn = document.getElementById('btn-add-new-product');
      if (addBtn) addBtn.addEventListener('click', () => this.openAddProductModal());
    }

    if (this.activeNav === 'settings') {
      const settingsForm = document.getElementById('settings-form');
      if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
          e.preventDefault();
          store.settings.storeName = document.getElementById('set-store-name').value;
          store.settings.address = document.getElementById('set-store-address').value;
          store.save();
          this.showToast('Settings saved!');
        });
      }
    }
  }

  openPaymentModal() {
    const store = window.store;
    const subtotal = this.cartState.items.reduce((acc, item) => acc + (item.rate * item.qty - item.discount), 0);
    let totalGst = 0;
    this.cartState.items.forEach(item => {
      const itemTotal = (item.rate * item.qty - item.discount);
      if (item.gstRate > 0) totalGst += (itemTotal * item.gstRate) / 100;
    });

    const rawTotal = Math.max(0, subtotal + totalGst - (this.cartState.billDiscount || 0));
    const grandTotal = Math.round(rawTotal);
    let activeMethod = 'Cash';

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.renderPaymentModal(grandTotal, this.cartState.customerId);
    document.body.appendChild(modalContainer);

    const methodBtns = modalContainer.querySelectorAll('.pay-method-btn');
    methodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        methodBtns.forEach(b => { b.className = 'btn pay-method-btn btn-outline'; });
        btn.className = 'btn pay-method-btn btn-primary';
        activeMethod = btn.getAttribute('data-method');

        document.getElementById('pay-details-cash').style.display = activeMethod === 'Cash' ? 'block' : 'none';
        document.getElementById('pay-details-upi').style.display = activeMethod === 'UPI' ? 'block' : 'none';
        document.getElementById('pay-details-card').style.display = (activeMethod === 'Card' || activeMethod === 'Mixed') ? 'block' : 'none';

        if (activeMethod === 'UPI' && window.QRCode) {
          const upiContainer = document.getElementById('upi-qrcode-container');
          upiContainer.innerHTML = '';
          const upiString = `upi://pay?pa=${store.settings.upiId || '9845012345@ybl'}&pn=SriSrikanteshwaraStore&am=${grandTotal}&cu=INR`;
          new QRCode(upiContainer, { text: upiString, width: 140, height: 140 });
        }
      });
    });

    const cashInput = document.getElementById('cash-amount-received');
    const changeSpan = document.getElementById('cash-change-due');
    if (cashInput && changeSpan) {
      cashInput.addEventListener('input', () => {
        const val = parseFloat(cashInput.value) || 0;
        const change = Math.max(0, val - grandTotal);
        changeSpan.innerText = `${store.settings.currency || '₹'}${change.toFixed(2)}`;
      });
    }

    document.getElementById('close-payment-modal').addEventListener('click', () => modalContainer.remove());
    document.getElementById('cancel-payment-btn').addEventListener('click', () => modalContainer.remove());

    document.getElementById('confirm-payment-btn').addEventListener('click', () => {
      const selectedCustomer = store.customers.find(c => c.id === this.cartState.customerId);
      const invoiceData = {
        customerId: this.cartState.customerId,
        customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
        customerMobile: selectedCustomer ? selectedCustomer.mobile : '',
        items: [...this.cartState.items],
        subtotal,
        totalDiscount: this.cartState.billDiscount || 0,
        totalGst,
        grandTotal,
        roundOff: parseFloat((grandTotal - rawTotal).toFixed(2)),
        paymentMethod: activeMethod
      };

      const newInvoice = store.createInvoice(invoiceData);
      modalContainer.remove();

      this.cartState = { items: [], customerId: 'walk-in', billDiscount: 0, enableRoundOff: true };
      this.render();

      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

      this.openReceiptModal(newInvoice);
    });
  }

  openReceiptModal(invoice) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.renderReceiptModal(invoice);
    document.body.appendChild(modalContainer);

    document.getElementById('close-receipt-modal').addEventListener('click', () => modalContainer.remove());
    document.getElementById('btn-print-receipt-trigger').addEventListener('click', () => {
      window.print();
    });
  }

  openCustomerSelectModal() {
    const store = window.store;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card" style="max-width:440px;">
          <div class="modal-header" style="background:var(--primary);color:#fff;">
            <div class="modal-title" style="color:#fff;"><i class="fa-solid fa-user"></i> Select Customer</div>
          </div>
          <div class="modal-body">
            <div style="display:flex;flex-direction:column;gap:0.5rem;max-height:300px;overflow-y:auto;">
              <button class="btn btn-outline cust-select-btn" data-id="walk-in" style="justify-content:flex-start;">
                <i class="fa-solid fa-user-slash"></i> Walk-in Customer
              </button>
              ${store.customers.map(c => `
                <button class="btn btn-outline cust-select-btn" data-id="${c.id}" style="justify-content:space-between;">
                  <div>
                    <strong style="display:block;">${c.name}</strong>
                    <span style="font-size:0.75rem;color:var(--text-muted);">${c.mobile}</span>
                  </div>
                  <span class="badge badge-warning">${c.loyaltyPoints} Pts</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="close-cust-select">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    modalContainer.querySelectorAll('.cust-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cartState.customerId = btn.getAttribute('data-id');
        modalContainer.remove();
        this.render();
      });
    });

    modalContainer.querySelector('#close-cust-select').addEventListener('click', () => modalContainer.remove());
  }

  openAddProductModal(product = null) {
    const store = window.store;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.renderAddEditProductModal(product);
    document.body.appendChild(modalContainer);

    document.getElementById('close-prod-modal').addEventListener('click', () => modalContainer.remove());

    const form = document.getElementById('product-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pData = {
        id: document.getElementById('prod-id').value || undefined,
        barcode: document.getElementById('prod-barcode').value,
        name: document.getElementById('prod-name').value,
        nameKannada: document.getElementById('prod-name-kannada').value,
        brand: 'SS Farm',
        category: 'Edible Oils & Ghee',
        purchasePrice: parseFloat(document.getElementById('prod-purchase-price').value),
        sellingPrice: parseFloat(document.getElementById('prod-selling-price').value),
        gstRate: 5,
        unit: 'Kg',
        stockQty: 50,
        minStockAlert: 10
      };

      store.saveProduct(pData);
      modalContainer.remove();
      this.showToast(pData.id ? 'Product updated!' : 'Product added!');
      this.render();
    });
  }

  initDashboardCharts() {
    if (!window.Chart) return;

    const trendCtx = document.getElementById('salesTrendChart');
    if (trendCtx) {
      new window.Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Sales (₹)',
            data: [14200, 18500, 12900, 22400, 19800, 28500, 32100],
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
