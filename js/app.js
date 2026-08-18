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
    this.priceListSearch = '';
    this.priceListCat = '';
    this.priceListSort = 'name-asc';
    this.priceListEditMode = false;
    this.inventorySearch = '';
    this.inventoryCat = '';
    this.inventorySort = 'stock-asc';
    this.inventoryEditMode = false;
    this.prodMgmtSearch = '';
    this.prodMgmtCat = '';
    this.prodMgmtEditMode = false;
    this.customerEditMode = false;
    this.userEditMode = false;
    this.barcodeBuffer = '';
    this.isSidebarOpen = false;
    this.barcodeTimeout = null;
    this.timeSyncInterval = null;

    this.customerHelpers = new CustomerHelpers(this);
    this.draftHelpers = new DraftHelpers(this);
    this.supplierHelpers = new SupplierHelpers(this);

    this.init();
  }

  init() {
    const store = window.store;
    document.documentElement.setAttribute('data-theme', store.currentTheme || 'light');

    store.subscribe(() => this.render());

    this.setupGlobalScanner();
    this.setupKeyboardShortcuts();
    this.startTimeSync();

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
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
        return; // Ignore scanner input if any input field is focused
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
      this.posSearchQuery = ''; // Clear search after successful scan
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
      } else if (e.key === 'F4') {
        e.preventDefault();
        this.customerHelpers.openCustomerSelectModal();
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
    if (this.posSearchQuery) {
      this.posSearchQuery = ''; // Clear search after adding item
    }
    this.render();
  }

  startTimeSync() {
    if (this.timeSyncInterval) {
      clearInterval(this.timeSyncInterval);
    }
    this.timeSyncInterval = setInterval(() => {
      const timeEl = document.getElementById('live-time-display');
      const dateEl = document.getElementById('live-date-display');
      if (timeEl && dateEl) {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        dateEl.innerText = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      }
    }, 1000); // Update every second
  }

  stopTimeSync() {
    if (this.timeSyncInterval) {
      clearInterval(this.timeSyncInterval);
      this.timeSyncInterval = null;
    }
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
    // Wait for the fade-out animation (300ms) to complete before removing
    setTimeout(() => {
      toast.remove();
    }, 2500); // 2200ms delay + 300ms fade-out
  }

  showConfirmation(options) {
    return new Promise((resolve) => {
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = window.renderConfirmationModal(options);
      document.body.appendChild(modalContainer);

      const confirmBtn = modalContainer.querySelector('#confirmation-confirm-btn');
      const cancelBtn = modalContainer.querySelector('#confirmation-cancel-btn');
      const overlay = modalContainer.querySelector('#confirmation-modal-overlay');

      const cleanup = (result) => {
        modalContainer.remove();
        resolve(result);
      };

      confirmBtn.addEventListener('click', () => cleanup(true));
      cancelBtn.addEventListener('click', () => cleanup(false));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup(false);
        }
      });
    });
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
      'categories': t.categories,
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

    // Disable page-level scrolling while dashboard is active to prevent auto-scroll
    try {
      const styleId = 'dashboard-disable-scroll-style';
      if (this.activeNav === 'dashboard') {
        if (!document.getElementById(styleId)) {
          const s = document.createElement('style');
          s.id = styleId;
          s.innerHTML = 'html,body{overflow:hidden!important;height:100%!important;}';
          document.head.appendChild(s);
        }
        // ensure we're at top (only once per dashboard activation)
        try {
          if (!this._dashboardScrolled) {
            window.scrollTo(0,0);
            this._dashboardScrolled = true;
          }
        } catch (e) {}
      } else {
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();
        // reset flag when leaving dashboard so next entry can scroll to top once
        try { this._dashboardScrolled = false; } catch (e) {}
      }
    } catch (e) {}

    this.attachGlobalEvents();
    this.attachPageSpecificEvents();
    this.updateNavIndicator();

    if (this.activeNav === 'dashboard') {
      // Close any open modal overlays that might contain autofocus inputs
      try {
        document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
      } catch (e) {}

      // Remove any lingering autofocus attributes so the browser doesn't jump
      try {
        document.querySelectorAll('[autofocus]').forEach(el => el.removeAttribute('autofocus'));
      } catch (e) {}

      // Temporarily disable programmatic focus to avoid scroll loops
      try {
        if (!this._focusTemporarilyDisabled) {
          this._origFocus = Element.prototype.focus;
          Element.prototype.focus = function() { return this; };
          this._focusTemporarilyDisabled = true;
        }
      } catch (e) {}

      // Ensure viewport top-left after layout settles
      try { window.scrollTo(0, 0); } catch (e) {}

      setTimeout(() => {
        try { this.initDashboardCharts(); } catch (e) {}
        // restore focus after a short delay
        setTimeout(() => {
          try {
            if (this._focusTemporarilyDisabled && this._origFocus) {
              Element.prototype.focus = this._origFocus;
              this._focusTemporarilyDisabled = false;
              this._origFocus = null;
            }
          } catch (e) {}
        }, 500);
      }, 50);
    }
  }

  updateNavIndicator() {
    const indicator = document.querySelector('.nav-active-indicator');
    const activeItem = document.querySelector('.sidebar-nav .nav-item.active');

    if (indicator && activeItem) {
      // Use a short timeout to ensure the DOM is fully painted before we measure
      setTimeout(() => {
        const navRect = activeItem.parentElement.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        indicator.style.top = `${itemRect.top - navRect.top}px`;
        indicator.style.height = `${itemRect.height}px`;
      }, 10); // A small delay is often sufficient
    }
  }

  renderActiveContent() {
    switch (this.activeNav) {
      case 'pos':
        return window.renderPOSBilling(this.cartState, this.posCatFilter, this.posSearchQuery);
      case 'dashboard':
        return window.renderDashboard();
      case 'price-list':
        return window.renderPriceList(this.priceListCat || '', this.priceListSearch || '', this.priceListSort || 'name-asc', this.priceListEditMode);
      case 'products':
        return window.renderProductManagement(this.prodMgmtSearch || '', this.prodMgmtCat || '', this.prodMgmtEditMode);
      case 'categories':
        return window.renderCategoryManagement();
      case 'customers':
        return window.renderCustomerManagement(this.customerEditMode);      
      case 'inventory':
        return window.renderInventoryManagement(this.inventorySearch, this.inventoryCat, this.inventorySort, this.inventoryEditMode);
      case 'suppliers':
        return window.renderSupplierManagement();
      case 'bills':
        return window.renderBillHistory();
      case 'reports':
        return window.renderReports();
      case 'users':
        return window.renderUserManagement(this.userEditMode);
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

    const menuBtn = document.getElementById('toggle-sidebar-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.isSidebarOpen = !this.isSidebarOpen;
        document.querySelector('.sidebar')?.classList.toggle('open');
        document.querySelector('.sidebar-overlay')?.classList.toggle('open');
      });
    }

    const profileBadge = document.getElementById('user-profile-badge');
    if (profileBadge) {
      profileBadge.style.cursor = 'pointer';
      profileBadge.addEventListener('click', () => this.openMyProfileModal());
    }

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
        this.stopTimeSync();
      });
    }

    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        this.isSidebarOpen = false;
        this.render(); // Re-render to close the sidebar
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
        const pin = document.getElementById('login-pin-input').value;
        const user = store.users.find(u => u.id === userId);

        if (user && user.pin === pin) {
          user.lastLogin = new Date().toLocaleString();
          store.currentUser = user;
          store.addAuditLog('USER_LOGIN', `User ${user.name} logged in.`);
          this.startTimeSync();
          this.render();
          this.showToast(`Welcome ${user.name}!`);
        } else {
          this.showToast('Incorrect PIN. Please try again.', 'danger');
        }
      });
    }

    document.querySelectorAll('.quick-demo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-user');
        const user = store.users.find(u => u.id === uId);
        if (user) {
          store.currentUser = user;
          this.startTimeSync();
          this.render();
          this.showToast(`Logged in as ${user.role} (${user.name})`);
        }
      });
    });

    const togglePinBtn = document.getElementById('toggle-pin-visibility');
    if (togglePinBtn) {
      togglePinBtn.addEventListener('click', () => {
        const pinInput = document.getElementById('login-pin-input');
        if (pinInput.type === 'password') {
          pinInput.type = 'text';
          togglePinBtn.querySelector('i').className = 'fa-solid fa-eye-slash';
        } else {
          pinInput.type = 'password';
          togglePinBtn.querySelector('i').className = 'fa-solid fa-eye';
        }
      });
    }
  }

  attachPageSpecificEvents() {
    const store = window.store;

    if (this.activeNav === 'pos') {
      const searchInput = document.getElementById('pos-product-search');
      if (searchInput) {
        searchInput.focus(); // Always focus the search bar on the POS screen
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value;
          const productByBarcode = store.findProductByBarcode(query);

          if (productByBarcode) {
            // If the query is a valid barcode, add to cart and clear search
            this.playScanBeep();
            this.addToCart(productByBarcode);
            this.showToast(`Added by barcode: ${productByBarcode.name}`);
            // The search query is cleared inside addToCart, which then triggers a re-render
          } else {
            // Otherwise, perform a regular text search
            const cursorPosition = searchInput.selectionStart;
            this.posSearchQuery = query;
            this.render();
            const inp = document.getElementById('pos-product-search');
            if (inp) {
              inp.focus();
              inp.setSelectionRange(cursorPosition, cursorPosition);
            }
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
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const idx = parseInt(inp.getAttribute('data-index'));
            const val = parseFloat(e.target.value);
            if (val > 0) {
              this.cartState.items[idx].qty = val;
            }
            this.render();
            document.getElementById('pos-product-search')?.focus();
          }
        });
      });

      document.querySelectorAll('.btn-cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          this.cartState.items.splice(idx, 1);
          this.render();
        });
      });

      document.querySelectorAll('.cart-item-row').forEach((row, idx) => {
        row.addEventListener('click', (e) => {
          if (e.target.closest('.qty-control-group')) {
            return; // Ignore clicks on the +/- buttons and input
          }
          const item = this.cartState.items[idx];
          if (item && ['Kg', 'g', 'grams'].includes(item.unit)) {
            this.openWeightEditor(idx);
          }
        });
      });

      const custBtn = document.getElementById('btn-select-customer');
      if (custBtn) {
        custBtn.addEventListener('click', () => this.customerHelpers.openCustomerSelectModal());
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

      const draftsBtn = document.getElementById('btn-hold-draft');
      if (draftsBtn) {
        draftsBtn.addEventListener('click', () => {
          this.draftHelpers.openDraftsModal();
        });
      }

      const payBtn = document.getElementById('btn-pay-print');
      if (payBtn) {
        payBtn.addEventListener('click', () => this.openPaymentModal());
      }

      const toggleShortcutBarBtn = document.getElementById('btn-toggle-shortcut-bar');
      if (toggleShortcutBarBtn) {
        toggleShortcutBarBtn.addEventListener('click', () => {
          store.settings.shortcutBarEnabled = !store.settings.shortcutBarEnabled;
          store.save();
          this.render();
        });
      }

      const shortcutSizeSmallerBtn = document.getElementById('btn-shortcut-size-smaller');
      if (shortcutSizeSmallerBtn) {
        shortcutSizeSmallerBtn.addEventListener('click', () => {
          const currentScale = parseFloat(store.settings.shortcutBarScale || 1);
          store.settings.shortcutBarScale = Math.max(0.7, currentScale - 0.1);
          store.save();
          this.render();
        });
      }

      const shortcutSizeLargerBtn = document.getElementById('btn-shortcut-size-larger');
      if (shortcutSizeLargerBtn) {
        shortcutSizeLargerBtn.addEventListener('click', () => {
          const currentScale = parseFloat(store.settings.shortcutBarScale || 1);
          store.settings.shortcutBarScale = Math.min(1.4, currentScale + 0.1);
          store.save();
          this.render();
        });
      }

      const shortcutBar = document.querySelector('.shortcut-pill-bar');
      if (shortcutBar) {
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let barStartX = 0;
        let barStartY = 0;

        const onMouseMove = (event) => {
          if (!isDragging) return;
          const nextX = barStartX + event.clientX - dragStartX;
          const nextY = barStartY + event.clientY - dragStartY;
          const maxX = window.innerWidth - shortcutBar.offsetWidth - 10;
          const maxY = window.innerHeight - shortcutBar.offsetHeight - 10;
          const clampedX = Math.max(10, Math.min(maxX, nextX));
          const clampedY = Math.max(10, Math.min(maxY, nextY));
          shortcutBar.style.left = `${clampedX}px`;
          shortcutBar.style.top = `${clampedY}px`;
        };

        const onMouseUp = () => {
          if (!isDragging) return;
          isDragging = false;
          shortcutBar.classList.remove('dragging');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          store.settings.shortcutBarPosition = {
            x: parseInt(shortcutBar.style.left, 10),
            y: parseInt(shortcutBar.style.top, 10)
          };
          store.save();
        };

        shortcutBar.addEventListener('mousedown', (event) => {
          if (event.target.closest('button')) return;
          isDragging = true;
          dragStartX = event.clientX;
          dragStartY = event.clientY;
          barStartX = shortcutBar.offsetLeft;
          barStartY = shortcutBar.offsetTop;
          shortcutBar.classList.add('dragging');
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }

      const resizer = document.getElementById('pos-resizer-handle');
      const leftPanel = document.querySelector('.pos-left-panel');
      const rightPanel = document.querySelector('.pos-cart-panel');
      const container = document.querySelector('.pos-container');

      if (resizer && leftPanel && rightPanel && container) {
        let isResizing = false;

        const onMouseDown = (e) => {
          isResizing = true;
          container.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
          if (!isResizing) return;
          const containerRect = container.getBoundingClientRect();
          const newRightWidth = Math.max(320, Math.min(800, containerRect.right - e.clientX));
          container.style.gridTemplateColumns = `1fr 5px ${newRightWidth}px`;
        };

        const onMouseUp = () => {
          isResizing = false;
          container.style.cursor = 'default';
          document.body.style.userSelect = 'auto';
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          store.settings.posCartWidth = parseInt(container.style.gridTemplateColumns.split(' ')[2]);
          store.save();
        };

        resizer.addEventListener('mousedown', onMouseDown);
      }
    }

    if (this.activeNav === 'dashboard') {
      const newBillBtn = document.getElementById('dash-new-bill');
      if (newBillBtn) newBillBtn.addEventListener('click', () => { this.activeNav = 'pos'; this.render(); });
      
      const addProdBtn = document.getElementById('dash-add-product');
      if (addProdBtn) addProdBtn.addEventListener('click', () => this.openAddProductModal());
      const periodSelect = document.getElementById('dashboard-period-select');
      const chartTypeSelect = document.getElementById('dashboard-chart-type');
      const resetBtn = document.getElementById('btn-reset-revenue');
      const resetConfirmBtn = document.getElementById('btn-reset-confirm');
      const resetScope = document.getElementById('reset-scope-select');

      const resetDashboardBtn = document.getElementById('btn-reset-dashboard');
      if (resetDashboardBtn) {
        resetDashboardBtn.addEventListener('click', () => {
          const requiredPin = store.settings.dashboardResetPin || store.currentUser.pin;
          const enteredPin = window.prompt('DANGER: This will delete ALL sales history and reset ALL revenue counters. This is irreversible.\n\nPlease enter the Dashboard Reset PIN to confirm.');
          if (enteredPin !== null) { // User didn't click cancel
            if (enteredPin === requiredPin) {
              store.clearInvoiceHistory();
              store.resetRevenue('all');
              this.showToast('Dashboard and all sales data have been reset.', 'danger');
              this.render();
            } else {
              this.showToast('Incorrect PIN. Dashboard reset cancelled.', 'danger');
            }
          }
        });
      }

      if (periodSelect) {
        periodSelect.addEventListener('change', () => this.initDashboardCharts());
      }

      if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', () => this.initDashboardCharts());
      }

      if (resetBtn && resetScope) {
        resetBtn.addEventListener('click', () => {
          // This button seems redundant with the one below, but we'll wire it up anyway.
          this.handleRevenueReset(resetScope.value);
        });
      }

      if (resetConfirmBtn && resetScope) {
        resetConfirmBtn.addEventListener('click', () => this.handleRevenueReset(resetScope.value));
      }
    }

    if (this.activeNav === 'price-list') {
      const printBtn = document.getElementById('print-price-list-btn');
      if (printBtn) printBtn.addEventListener('click', () => window.print());

      const searchInput = document.getElementById('pricelist-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.addEventListener('input', (e) => {
          const cursorPosition = searchInput.selectionStart;
          this.priceListSearch = searchInput.value;
          this.render();
          const newSearchInput = document.getElementById('pricelist-search-input');
          if (newSearchInput) {
            newSearchInput.focus();
            newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      }

      const catSelect = document.getElementById('pricelist-cat-select');
      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          this.priceListCat = e.target.value;
          this.render();
        });
      }

      const sortSelect = document.getElementById('pricelist-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.priceListSort = e.target.value;
          this.render();
        });
      }

      const toggleEditBtn = document.getElementById('toggle-pricelist-edit-mode');
      if (toggleEditBtn) {
        toggleEditBtn.addEventListener('click', () => {
          if (this.priceListEditMode) {
            this.saveAllPriceListRows();
          }
          this.priceListEditMode = !this.priceListEditMode;
          this.render();
        });
      }

      const addItemBtn = document.getElementById('btn-add-price-item');
      if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
          this.openAddProductModal();
        });
      }

      const saveAllBtn = document.getElementById('save-all-price-list-btn');
      if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => this.saveAllPriceListRows());
      }

      const exportBtn = document.getElementById('btn-export-pricelist-csv');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportPriceListToCSV());
      }

      const priceSheet = document.getElementById('printable-price-sheet');
      if (priceSheet) {
        priceSheet.addEventListener('change', (event) => {
          const target = event.target;
          if (target.matches('.price-edit-unit, .price-edit-category, .price-edit-purchase, .price-edit-selling, .price-edit-stock')) {
            const row = target.closest('tr[data-prod-row]');
            const prodId = row ? row.getAttribute('data-prod-row') : null;
            if (prodId) this.savePriceListRow(prodId);
          }
        });

        priceSheet.addEventListener('click', (event) => {
          const saveBtn = event.target.closest('.save-single-price-btn');
          const deleteBtn = event.target.closest('.delete-price-item-btn');

          if (saveBtn) {
            const prodId = saveBtn.getAttribute('data-id');
            if (prodId) this.savePriceListRow(prodId);
          }

          if (deleteBtn) {
            const prodId = deleteBtn.getAttribute('data-id');
            if (prodId && window.confirm('Delete this product permanently from the price list?')) {
              window.store.deleteProduct(prodId);
              this.showToast('Product deleted successfully.', 'danger');
              this.render();
            }
          }
        });
      }

      document.querySelectorAll('.quick-edit-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.priceListEditMode = true;
          this.render();
        });
      });
      // If edit mode is active, focus the first editable input to improve typing UX
      if (this.priceListEditMode) {
        setTimeout(() => {
          const firstEditable = document.querySelector('.price-edit-selling, .price-edit-purchase, .price-edit-stock, .price-edit-unit');
          if (firstEditable) {
            try { firstEditable.focus(); } catch (e) {}
            if (typeof firstEditable.select === 'function') {
              try { firstEditable.select(); } catch (e) {}
            }
          }
        }, 60);
      }
    }

    if (this.activeNav === 'inventory') {
      const searchInput = document.getElementById('inventory-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.addEventListener('input', (e) => {
          const cursorPosition = searchInput.selectionStart;
          this.inventorySearch = searchInput.value;
          this.render();
          const newSearchInput = document.getElementById('inventory-search-input');
          if (newSearchInput) {
            newSearchInput.focus();
            newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      }

      const catSelect = document.getElementById('inventory-cat-select');
      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          this.inventoryCat = e.target.value;
          this.render();
        });
      }

      const sortSelect = document.getElementById('inventory-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.inventorySort = e.target.value;
          this.render();
        });
      }

      const toggleEditBtn = document.getElementById('toggle-inventory-edit-mode');
      if (toggleEditBtn) {
        toggleEditBtn.addEventListener('click', () => {
          this.inventoryEditMode = !this.inventoryEditMode;
          this.render();
        });
      }

      const saveAllBtn = document.getElementById('save-all-inventory-btn');
      if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => this.saveAllInventoryRows());
      }

      const exportBtn = document.getElementById('btn-export-inventory-csv');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          this.exportInventoryToCSV();
        });
      }

      document.querySelectorAll('.delete-inventory-item-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const prodId = btn.getAttribute('data-id');
          const confirmed = await this.showConfirmation({
            title: 'Delete Product?',
            message: 'Are you sure you want to permanently delete this product? This action cannot be undone.'
          });
          if (prodId && confirmed) {
            store.deleteProduct(prodId);
            this.showToast('Product deleted successfully.', 'danger');
            this.render();
          }
        });
      });
    }

    if (this.activeNav === 'customers') {
      const toggleCustomerEditBtn = document.getElementById('toggle-customer-edit-mode');
      if (toggleCustomerEditBtn) {
        toggleCustomerEditBtn.addEventListener('click', () => {
          this.customerEditMode = !this.customerEditMode;
          this.render();
        });
      }

      const saveAllCustBtn = document.getElementById('save-all-customer-btn');
      if (saveAllCustBtn) {
        saveAllCustBtn.addEventListener('click', () => this.saveAllCustomerRows());
      }

      document.querySelectorAll('.save-single-customer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const custId = btn.getAttribute('data-id');
          if (custId) this.saveCustomerRow(custId);
        });
      });

      document.querySelectorAll('.delete-customer-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const custId = btn.getAttribute('data-id');
          const confirmed = await this.showConfirmation({ title: 'Delete Customer?', message: 'Are you sure you want to delete this customer record?' });
          if (custId && confirmed) {
            window.store.deleteCustomer(custId);
            this.showToast('Customer deleted successfully.', 'danger');
            this.render();
          }
        });
      });
    }

    if (this.activeNav === 'users') {
      const toggleUserEditBtn = document.getElementById('toggle-user-edit-mode');
      if (toggleUserEditBtn) {
        toggleUserEditBtn.addEventListener('click', () => {
          this.userEditMode = !this.userEditMode;
          this.render();
        });
      }

      const saveAllUserBtn = document.getElementById('save-all-user-btn');
      if (saveAllUserBtn) {
        saveAllUserBtn.addEventListener('click', () => this.saveAllUserRows());
      }

      document.querySelectorAll('.save-single-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const userId = btn.getAttribute('data-id');
          if (userId) this.saveUserRow(userId);
        });
      });

      document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const userId = btn.getAttribute('data-id');
          const confirmed = await this.showConfirmation({ title: 'Delete Staff Account?', message: 'Are you sure you want to delete this staff account?' });
          if (userId && confirmed) {
            window.store.deleteUser(userId);
            this.showToast('Staff account deleted successfully.', 'danger');
            this.render();
          }
        });
      });
    }

    if (this.activeNav === 'suppliers') {
      const manageSuppliersBtn = document.getElementById('manage-suppliers-btn');
      if (manageSuppliersBtn) manageSuppliersBtn.addEventListener('click', () => this.supplierHelpers.openSupplierManagementModal());
    }

    if (this.activeNav === 'products') {
      const addBtn = document.getElementById('btn-add-new-product');
      if (addBtn) addBtn.addEventListener('click', () => this.openAddProductModal());

      const searchInput = document.getElementById('prod-mgmt-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.addEventListener('input', (e) => {
          const cursorPosition = searchInput.selectionStart;
          this.prodMgmtSearch = searchInput.value;
          this.render();
          const newSearchInput = document.getElementById('prod-mgmt-search-input');
          if (newSearchInput) {
            newSearchInput.focus();
            newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      }

      const catSelect = document.getElementById('prod-mgmt-cat-select');
      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          this.prodMgmtCat = e.target.value;
          this.render();
        });
      }

      const toggleEditBtn = document.getElementById('toggle-prod-mgmt-edit-mode');
      if (toggleEditBtn) {
        toggleEditBtn.addEventListener('click', () => {
          this.prodMgmtEditMode = !this.prodMgmtEditMode;
          this.render();
        });
      }

      const saveAllBtn = document.getElementById('save-all-prod-mgmt-btn');
      if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => {
          this.saveAllProductRows();
          this.prodMgmtEditMode = false;
          this.render();
        });
      }

      const importBtn = document.getElementById('btn-import-prod-csv');
      if (importBtn) {
        importBtn.addEventListener('click', () => {
          this.openImportCSVModal();
        });
      }
    }

    if (this.activeNav === 'categories') {
      const categoryForm = document.getElementById('category-management-form');
      const addCategoryBtn = document.getElementById('btn-add-category');
      const categoryRows = document.getElementById('category-list-rows');
      const quickTabsConfig = document.getElementById('quick-access-tabs-config');
      const addQuickTabBtn = document.getElementById('btn-add-quick-tab');
      const lang = store.currentLang || 'en';
      const t = window.translations[lang] || window.translations.en;

      const buildCategoryRow = (id = '', name = '', nameKannada = '') => `
        <div class="category-row" data-id="${id}" style="display:grid;grid-template-columns:1fr 1fr auto;gap:0.5rem;align-items:center;">
          <input type="hidden" class="category-id" value="${id}">
          <input type="text" class="form-input category-name" placeholder="${t.categoryName}" value="${name}">
          <input type="text" class="form-input category-name-kannada" placeholder="${t.categoryNameKannada}" value="${nameKannada}">
          <button type="button" class="btn btn-danger btn-sm delete-category-btn" title="${t.delete}" style="min-width:90px;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      const buildTabRow = (idx, label = '', category = '') => {
        const options = store.categories.map(cat => `
            <option value="${cat.name}" ${cat.name === category ? 'selected' : ''}>${lang === 'kn' ? cat.nameKannada : cat.name}</option>
          `).join('');
        return `
          <div class="quick-access-tab-row" data-index="${idx}" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
            <input type="text" class="form-input quick-access-tab-label" data-index="${idx}" placeholder="Label" value="${label}">
            <select class="form-select quick-access-tab-category" data-index="${idx}">${options}</select>
            <button type="button" class="btn btn-danger btn-sm remove-quick-tab" data-index="${idx}" title="Remove tab"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        `;
      };

      if (addCategoryBtn && categoryRows) {
        addCategoryBtn.addEventListener('click', () => {
          const nextId = `cat-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
          categoryRows.insertAdjacentHTML('beforeend', buildCategoryRow(nextId, '', ''));
        });
      }

      if (categoryRows) {
        categoryRows.addEventListener('click', (event) => {
          const removeBtn = event.target.closest('.delete-category-btn');
          if (!removeBtn) return;
          const row = removeBtn.closest('.category-row');
          if (row) row.remove();
        });
      }

      if (addQuickTabBtn && quickTabsConfig) {
        addQuickTabBtn.addEventListener('click', () => {
          const nextIndex = quickTabsConfig.querySelectorAll('.quick-access-tab-row').length;
          const defaultCategory = store.categories[0] ? store.categories[0].name : '';
          quickTabsConfig.insertAdjacentHTML('beforeend', buildTabRow(nextIndex, '', defaultCategory));
        });
      }

      if (quickTabsConfig) {
        quickTabsConfig.addEventListener('click', (event) => {
          const removeBtn = event.target.closest('.remove-quick-tab');
          if (!removeBtn) return;
          const row = removeBtn.closest('.quick-access-tab-row');
          if (row) row.remove();
        });
      }

      if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const rows = Array.from(document.querySelectorAll('.category-row'));
          const nextCategories = [];
          const oldCategories = store.categories.reduce((map, cat) => {
            map[cat.id] = cat.name;
            return map;
          }, {});
          const nameById = {};
          let hasMissingName = false;

          rows.forEach(row => {
            const idInput = row.querySelector('.category-id');
            const nameInput = row.querySelector('.category-name');
            const id = idInput ? idInput.value || `cat-${Date.now()}-${Math.random().toString(36).slice(2,6)}` : `cat-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
            const name = nameInput ? nameInput.value.trim() : '';
            if (!name) hasMissingName = true; // No Kannada name
            if (name) { // No Kannada name
              nextCategories.push({ id, name });
              nameById[id] = name;
            }
          });

          if (hasMissingName) {
            this.showToast('Please enter a name for every category.', 'warning');
            return;
          }

          const categoryNameMap = Object.keys(oldCategories).reduce((map, id) => {
            map[oldCategories[id]] = nameById[id] || oldCategories[id];
            return map;
          }, {});

          const tabRows = Array.from(document.querySelectorAll('.quick-access-tab-row'));
          const nextQuickTabs = [];
          let hasEmptyLabel = false;
          let hasMissingCategory = false;

          tabRows.forEach(row => {
            const labelInput = row.querySelector('.quick-access-tab-label');
            const categorySelect = row.querySelector('.quick-access-tab-category');
            const label = labelInput ? labelInput.value.trim() : '';
            const category = categorySelect ? categorySelect.value : '';
            if (!label) hasEmptyLabel = true;
            if (!category) hasMissingCategory = true;
            if (label && category) nextQuickTabs.push({ label, category });
          });

          if (hasEmptyLabel) {
            this.showToast('Please enter a label for every quick-access tab.', 'warning');
            return;
          }

          store.categories = nextCategories;
          store.settings.quickAccessTabs = nextQuickTabs; // No Kannada name
          store.save();
          this.showToast('Categories saved successfully.');
          this.render();
        });
      }
    }

    if (this.activeNav === 'bills') {
      document.querySelectorAll('.btn-delete-invoice').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent the row click from firing
          const invoiceId = btn.getAttribute('data-invoice-id');
          const confirmed = await this.showConfirmation({ title: 'Delete Invoice?', message: 'Are you sure you want to delete this invoice permanently?' });
          if (invoiceId && confirmed) {
            store.deleteInvoice(invoiceId);
            this.showToast('Invoice deleted successfully.', 'danger');
            this.render();
          }
        });
      });

      const clearHistoryBtn = document.getElementById('btn-clear-bill-history');
      if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
          const confirmed = await this.showConfirmation({
            title: 'Clear All Bill History?',
            message: 'Are you sure you want to delete ALL bill history? This action cannot be undone.'
          });
          if (confirmed) {
            store.clearInvoiceHistory();
            this.showToast('All bill history cleared.', 'danger');
            this.render();
          }
        });
      }
    }

    if (this.activeNav === 'settings') {
      const settingsForm = document.getElementById('settings-form');
      const categoryListConfig = document.getElementById('category-list-config');

      const toggleDashboardPinVisibilityBtn = document.getElementById('toggle-dashboard-pin-visibility');
      if (toggleDashboardPinVisibilityBtn) {
        toggleDashboardPinVisibilityBtn.addEventListener('click', () => {
          const pinInput = document.getElementById('set-dashboard-reset-pin');
          if (pinInput.type === 'password') {
            pinInput.type = 'text';
            toggleDashboardPinVisibilityBtn.querySelector('i').className = 'fa-solid fa-eye-slash';
          } else {
            pinInput.type = 'password';
            toggleDashboardPinVisibilityBtn.querySelector('i').className = 'fa-solid fa-eye';
          }
        });
      }

      if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
          e.preventDefault();
          store.settings.tagLine = document.getElementById('set-store-tagline').value;
          store.settings.phone = document.getElementById('set-store-phone').value;
          store.settings.gstNo = document.getElementById('set-store-gst').value;
          store.settings.upiId = document.getElementById('set-store-upi').value;
          store.settings.paperSize = document.getElementById('set-paper-size').value;
          store.settings.receiptFooter = document.getElementById('set-receipt-footer').value;

          store.settings.storeName = document.getElementById('set-store-name').value;
          store.settings.address = document.getElementById('set-store-address').value;

          store.settings.dashboardResetPin = document.getElementById('set-dashboard-reset-pin').value.trim();
          store.save();
          this.showToast('Settings saved!');
          this.render();
        });
      }

      // Live preview handler
      document.querySelectorAll('.live-preview-input').forEach(input => {
        input.addEventListener('input', () => {
          const tempSettings = {
            storeName: document.getElementById('set-store-name').value,
            tagLine: document.getElementById('set-store-tagline').value,
            address: document.getElementById('set-store-address').value,
            phone: document.getElementById('set-store-phone').value,
            gstNo: document.getElementById('set-store-gst').value,
            receiptFooter: document.getElementById('set-receipt-footer').value,
            paperSize: document.getElementById('set-paper-size').value,
          };
          const mockInvoice = {
            invoiceNo: "PREVIEW-1001", date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().split(' ')[0], cashierName: store.currentUser.name, customerName: 'Sample Customer',
            items: [{ name: "Sample Product 1 (Rice)", barcode: "8900000000001", qty: 2, unit: "Kg", rate: 60, total: 120 }, { name: "Sample Product 2 (Oil)", barcode: "8900000000002", qty: 1, unit: "Ltr", rate: 150, total: 150 }],
            subtotal: 270, totalGst: 13.5, grandTotal: 284,
          };
          const previewContainer = document.getElementById('settings-receipt-preview-container');
          if (previewContainer) {
            previewContainer.innerHTML = window.renderReceiptModal(mockInvoice, tempSettings, false, true);
          }
        });
      });

      const printTestBtn = document.getElementById('btn-print-test-bill');
      if (printTestBtn) {
        printTestBtn.addEventListener('click', () => {
          const mockInvoice = { id: 'inv-test', invoiceNo: 'TEST-001', date: '2023-10-27', time: '12:00', cashierName: 'Admin', customerName: 'Test Customer', items: [{ productId: 'p-101', name: 'Test Item', qty: 1, rate: 100, total: 100 }], subtotal: 100, totalGst: 5, grandTotal: 105, roundOff: 0 };
          this.openReceiptModal(mockInvoice);
        });
      }

      const resetBillSettingsBtn = document.getElementById('btn-reset-bill-settings');
      if (resetBillSettingsBtn) {
        resetBillSettingsBtn.addEventListener('click', async () => {
          const confirmed = await this.showConfirmation({ title: 'Reset Bill Settings?', message: 'Are you sure you want to reset all bill printing text to the default values?' });
          if (confirmed) {
            const defaultSettings = window.initialStoreSettings;
            Object.keys(defaultSettings).forEach(key => {
              if (['storeName', 'tagLine', 'address', 'phone', 'gstNo', 'receiptFooter', 'paperSize'].includes(key)) {
                store.settings[key] = defaultSettings[key];
              }
            });
            store.save();
            this.render();
            this.showToast('Bill printing settings have been reset to default.');
          }
        });
      }
    }

    if (this.activeNav === 'bills') {
      document.querySelectorAll('.bill-history-row, .btn-view-invoice').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-invoice')) return;
          const invoiceId = el.getAttribute('data-invoice-id') || el.closest('[data-invoice-id]')?.getAttribute('data-invoice-id');
          if (invoiceId) {
            const invoice = store.invoices.find(inv => inv.id === invoiceId);
            if (invoice) this.openBillDetailModal(invoice);
          }
        });
      });
    }
  }

  async handleRevenueReset(scope) {
    const scopeText = scope || 'today';
    const confirmed = await this.showConfirmation({
      title: `Reset ${scopeText} Revenue?`,
      message: `This will archive the current ${scopeText} revenue and reset the counter to zero. Proceed?`,
      confirmText: 'Yes, Reset'
    });
    if (confirmed) {
      window.store.resetRevenue(scopeText);
      this.showToast('Revenue counters reset.');
      this.render();
    }
  }

  savePriceListRow(productId) {
    const store = window.store;
    const row = document.querySelector(`tr[data-prod-row="${productId}"]`);
    if (!row) return;

    const purchaseInp = row.querySelector('.price-edit-purchase');
    const sellingInp = row.querySelector('.price-edit-selling');
    const stockInp = row.querySelector('.price-edit-stock');
    const categorySelect = row.querySelector('.price-edit-category');
    const unitSelect = row.querySelector('.price-edit-unit') || row.querySelector('select');

    const product = store.products.find(p => p.id === productId);
    if (!product) return;

    product.purchasePrice = purchaseInp ? parseFloat(purchaseInp.value) || product.purchasePrice : product.purchasePrice;
    product.sellingPrice = sellingInp ? parseFloat(sellingInp.value) || product.sellingPrice : product.sellingPrice;
    product.stockQty = stockInp ? parseFloat(stockInp.value) || product.stockQty : product.stockQty;
    product.category = categorySelect ? categorySelect.value.trim() || product.category : product.category;
    product.unit = unitSelect ? unitSelect.value.trim() || product.unit : product.unit;

    store.save();
    this.showToast(`${product.name} updated successfully.`);
  }

  saveAllPriceListRows() {
    const store = window.store;
    const rows = Array.from(document.querySelectorAll('tr[data-prod-row]'));
    let updatedCount = 0;

    rows.forEach(row => {
      const productId = row.getAttribute('data-prod-row');
      if (!productId) return;

      const purchaseInp = row.querySelector('.price-edit-purchase');
      const sellingInp = row.querySelector('.price-edit-selling');
      const stockInp = row.querySelector('.price-edit-stock');
      const categorySelect = row.querySelector('.price-edit-category');
      const unitSelect = row.querySelector('.price-edit-unit');

      if (!purchaseInp && !sellingInp && !stockInp && !categorySelect && !unitSelect) return;

      const product = store.products.find(p => p.id === productId);
      if (!product) return;

      const purchasePrice = purchaseInp ? parseFloat(purchaseInp.value) || product.purchasePrice : product.purchasePrice;
      const sellingPrice = sellingInp ? parseFloat(sellingInp.value) || product.sellingPrice : product.sellingPrice;
      const stockQty = stockInp ? parseFloat(stockInp.value) || product.stockQty : product.stockQty;
      const category = categorySelect ? categorySelect.value.trim() || product.category : product.category;
      const unit = unitSelect ? unitSelect.value.trim() || product.unit : product.unit;

      product.purchasePrice = purchasePrice;
      product.sellingPrice = sellingPrice;
      product.stockQty = stockQty;
      product.category = category;
      product.unit = unit;
      updatedCount += 1;
    });

    if (updatedCount > 0) {
      store.save();
      this.showToast(`Saved ${updatedCount} products successfully.`);
    } else {
      this.showToast('No editable rows found.', 'warning');
    }
  }

  saveAllProductRows() {
    const store = window.store;
    const rows = Array.from(document.querySelectorAll('tr[data-prod-row]'));
    let updatedCount = 0;

    rows.forEach(row => {
      const productId = row.getAttribute('data-prod-row');
      if (!productId) return;

      const product = store.products.find(p => p.id === productId);
      if (!product) return;

      const nameInp = row.querySelector('.prod-mgmt-edit-name');
      const brandInp = row.querySelector('.prod-mgmt-edit-brand');
      const purchaseInp = row.querySelector('.prod-mgmt-edit-purchase');
      const sellingInp = row.querySelector('.prod-mgmt-edit-selling');
      const gstInp = row.querySelector('.prod-mgmt-edit-gst');

      if (nameInp) product.name = nameInp.value.trim() || product.name;
      if (brandInp) product.brand = brandInp.value.trim() || product.brand;
      if (purchaseInp) product.purchasePrice = parseFloat(purchaseInp.value) || product.purchasePrice;
      if (sellingInp) product.sellingPrice = parseFloat(sellingInp.value) || product.sellingPrice;
      if (gstInp) product.gstRate = parseFloat(gstInp.value) || 0;

      updatedCount++;
    });

    if (updatedCount > 0) {
      store.save();
      this.showToast(`Saved ${updatedCount} products successfully.`);
    } else {
      this.showToast('No editable product rows found.', 'warning');
    }
  }

  saveAllInventoryRows() {
    const store = window.store;
    const rows = Array.from(document.querySelectorAll('tr[data-prod-row]'));
    let updatedCount = 0;

    rows.forEach(row => {
      const productId = row.getAttribute('data-prod-row');
      if (!productId) return;

      const stockInp = row.querySelector('.inventory-edit-stock');
      const minStockInp = row.querySelector('.inventory-edit-min-stock');

      if (!stockInp || !minStockInp) return;

      const product = store.products.find(p => p.id === productId);
      if (!product) return;

      product.stockQty = parseFloat(stockInp.value) || 0;
      product.minStockAlert = parseFloat(minStockInp.value) || 0;
      updatedCount++;
    });

    if (updatedCount > 0) {
      store.save();
      this.showToast(`Saved ${updatedCount} products successfully.`);
    } else {
      this.showToast('No editable inventory rows found.', 'warning');
    }
    this.inventoryEditMode = false;
  }

  saveCustomerRow(customerId) {
    const store = window.store;
    const row = document.querySelector(`tr[data-cust-row="${customerId}"]`);
    if (!row) return;

    const nameInp = row.querySelector('.customer-edit-name');
    const mobileInp = row.querySelector('.customer-edit-mobile');

    const name = nameInp?.value.trim() || '';
    const mobile = mobileInp?.value.trim() || '';

    const customer = store.customers.find(c => c.id === customerId);
    if (!customer) return;

    customer.name = name;
    customer.mobile = mobile;
    store.save();
    this.showToast(`${customer.name} updated successfully.`);
  }

  saveAllCustomerRows() {
    const store = window.store;
    const rows = Array.from(document.querySelectorAll('tr[data-cust-row]'));
    let updatedCount = 0;

    rows.forEach(row => {
      const customerId = row.getAttribute('data-cust-row');
      if (!customerId) return;
      const nameInp = row.querySelector('.customer-edit-name');
      const mobileInp = row.querySelector('.customer-edit-mobile');
      if (!nameInp || !mobileInp) return;

      const name = nameInp.value.trim();
      const mobile = mobileInp.value.trim();
      const customer = store.customers.find(c => c.id === customerId);
      if (!customer) return;

      customer.name = name;
      customer.mobile = mobile;
      updatedCount += 1;
    });

    if (updatedCount > 0) {
      store.save();
      this.showToast(`Saved ${updatedCount} customers successfully.`);
    } else {
      this.showToast('No editable customer rows found.', 'warning');
    }
  }

  saveUserRow(userId) {
    const store = window.store;
    const row = document.querySelector(`tr[data-user-row="${userId}"]`);
    if (!row) return;

    const usernameInp = row.querySelector('.user-edit-username');
    const nameInp = row.querySelector('.user-edit-name');
    const roleSelect = row.querySelector('.user-edit-role');
    const pinInp = row.querySelector('.user-edit-pin');
    const shiftSelect = row.querySelector('.user-edit-shift');
    const attendanceSelect = row.querySelector('.user-edit-attendance');

    const username = usernameInp?.value.trim() || '';
    const name = nameInp?.value.trim() || '';
    const role = roleSelect?.value || 'Cashier';
    const shift = shiftSelect?.value || 'Morning';
    const pin = pinInp?.value.trim() || '';
    const attendanceStatus = attendanceSelect?.value || 'Present';

    const user = store.users.find(u => u.id === userId);
    if (!user) return;

    user.username = username;
    user.name = name;
    user.role = role;
    user.shift = shift;
    if (pin) user.pin = pin; // Only update PIN if a new one is entered
    user.attendanceStatus = attendanceStatus;
    store.save();
    this.showToast(`${user.name} updated successfully.`);
  }

  saveAllUserRows() {
    const store = window.store;
    const rows = Array.from(document.querySelectorAll('tr[data-user-row]'));
    let updatedCount = 0;

    rows.forEach(row => {
      const userId = row.getAttribute('data-user-row');
      if (!userId) return;
      const usernameInp = row.querySelector('.user-edit-username');
      const nameInp = row.querySelector('.user-edit-name');
      const roleSelect = row.querySelector('.user-edit-role');
      const pinInp = row.querySelector('.user-edit-pin');
      const shiftSelect = row.querySelector('.user-edit-shift');
      const attendanceSelect = row.querySelector('.user-edit-attendance');
      if (!usernameInp || !nameInp || !roleSelect || !shiftSelect || !attendanceSelect) return;

      const username = usernameInp.value.trim();
      const name = nameInp.value.trim();
      const role = roleSelect.value;
      const pin = pinInp.value.trim();
      const shift = shiftSelect.value;
      const attendanceStatus = attendanceSelect.value;
      const user = store.users.find(u => u.id === userId);
      if (!user) return;

      user.username = username;
      user.name = name;
      user.role = role;
      if (pin) user.pin = pin;
      user.shift = shift;
      user.attendanceStatus = attendanceStatus;
      updatedCount += 1;
    });

    if (updatedCount > 0) {
      store.save();
      this.showToast(`Saved ${updatedCount} staff accounts successfully.`);
    } else {
      this.showToast('No editable staff rows found.', 'warning');
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

  openBillDetailModal(invoice) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.renderBillDetailModal(invoice);
    document.body.appendChild(modalContainer);

    const closeModal = () => modalContainer.remove();

    modalContainer.querySelector('#close-bill-detail-modal')?.addEventListener('click', closeModal);
    modalContainer.querySelector('#bill-detail-close-btn')?.addEventListener('click', closeModal);

    modalContainer.querySelector('#btn-print-bill-detail')?.addEventListener('click', () => {
      this.openReceiptModal(invoice);
      // We don't close the detail modal, user can close it manually.
    });

    modalContainer.querySelector('#btn-process-return')?.addEventListener('click', () => {
      // This would open another modal to select items and quantity for return
      this.showToast('Return processing not implemented yet.', 'warning');
    });
  }

  openReceiptModal(invoice) {
    const modalContainer = document.createElement('div');
    // Pass a copy of settings to allow temporary edits
    let tempSettings = JSON.parse(JSON.stringify(window.store.settings));

    const renderAndAttach = (isEditMode = false) => {
      modalContainer.innerHTML = window.renderReceiptModal(invoice, tempSettings, isEditMode);

      modalContainer.querySelector('#close-receipt-modal').addEventListener('click', () => modalContainer.remove());
      modalContainer.querySelector('#btn-print-receipt-trigger').addEventListener('click', () => {
        window.print();
      });

      const editBtn = modalContainer.querySelector('#btn-edit-receipt');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          renderAndAttach(true); // Re-render in edit mode
        });
      }

      const saveBtn = modalContainer.querySelector('#btn-save-receipt-edits');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          // Save edited values into our temporary settings object
          tempSettings.storeName = modalContainer.querySelector('#receipt-edit-storeName').value;
          tempSettings.tagLine = modalContainer.querySelector('#receipt-edit-tagLine').value;
          tempSettings.address = modalContainer.querySelector('#receipt-edit-address').value;
          tempSettings.phone = modalContainer.querySelector('#receipt-edit-phone').value;
          tempSettings.gstNo = modalContainer.querySelector('#receipt-edit-gstNo').value;
          tempSettings.receiptFooter = modalContainer.querySelector('#receipt-edit-receiptFooter').value;
          renderAndAttach(false); // Re-render in view mode with updated temp data
        });
      }

      const cancelBtn = modalContainer.querySelector('#btn-cancel-receipt-edits');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          // Discard changes by re-rendering with original settings
          tempSettings = JSON.parse(JSON.stringify(window.store.settings));
          renderAndAttach(false);
        });
      }
    };

    renderAndAttach();
    document.body.appendChild(modalContainer);
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
        brand: 'SS Farm',
        category: document.getElementById('prod-category').value,
        purchasePrice: parseFloat(document.getElementById('prod-purchase-price').value),
        sellingPrice: parseFloat(document.getElementById('prod-selling-price').value),
        gstRate: 0, // Default GST, can be edited later in product management
        unit: document.getElementById('prod-unit').value,
        stockQty: parseFloat(document.getElementById('prod-stock-qty').value) || 0,
        minStockAlert: parseFloat(document.getElementById('prod-min-stock-alert').value) || 0
      };

      store.saveProduct(pData);
      modalContainer.remove();
      this.showToast(pData.id ? 'Product updated!' : 'Product added!');
      this.render();
    });
  }

  openWeightEditor(itemIndex) {
    const item = this.cartState.items[itemIndex];
    if (!item) return;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="weight-editor-overlay">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header">
            <div class="modal-title">Edit Quantity for ${item.name}</div>
            <button class="btn-icon" id="close-weight-editor"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <p style="font-size:0.85rem; color:var(--text-muted);">Enter weight in grams or kilograms. The quantity will be calculated automatically.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end;">
              <div class="form-group">
                <label class="form-label">Grams (g)</label>
                <input type="number" id="weight-grams-input" class="form-input" placeholder="e.g., 250">
              </div>
              <div class="form-group">
                <label class="form-label">Kilograms (Kg)</label>
                <input type="number" step="any" id="weight-kg-input" class="form-input" placeholder="e.g., 0.25">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-weight-editor">Cancel</button>
            <button class="btn btn-primary" id="save-weight-editor">Update Quantity</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    const gramsInput = modalContainer.querySelector('#weight-grams-input');
    const kgInput = modalContainer.querySelector('#weight-kg-input');

    gramsInput.addEventListener('input', () => {
      const grams = parseFloat(gramsInput.value) || 0;
      kgInput.value = grams / 1000;
    });

    kgInput.addEventListener('input', () => {
      const kg = parseFloat(kgInput.value) || 0;
      gramsInput.value = Math.round(kg * 1000);
    });

    const saveAndClose = () => {
      this.cartState.items[itemIndex].qty = parseFloat(kgInput.value) || item.qty;
      this.render();
      closeModal();
    };

    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveAndClose();
      }
    };

    gramsInput.addEventListener('keydown', handleEnter);
    kgInput.addEventListener('keydown', handleEnter);

    const closeModal = () => modalContainer.remove();
    modalContainer.querySelector('#close-weight-editor').addEventListener('click', closeModal);
    modalContainer.querySelector('#cancel-weight-editor').addEventListener('click', closeModal);
    modalContainer.querySelector('#save-weight-editor').addEventListener('click', saveAndClose);
  }

  openImportCSVModal() {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="import-csv-modal-overlay">
        <div class="modal-card" style="max-width: 500px;">
          <div class="modal-header">
            <div class="modal-title">Import Products from CSV</div>
            <button class="btn-icon" id="close-import-csv-modal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <p style="font-size:0.85rem; color:var(--text-muted);">Upload a CSV file to bulk add or update products. Products are matched by 'Barcode'.</p>
            <div class="form-group">
              <label class="form-label">CSV File</label>
              <input type="file" id="csv-file-input" class="form-input" accept=".csv">
            </div>
            <div style="font-size:0.8rem; text-align:center; margin-top:0.5rem;">
              <a href="#" id="download-csv-template" style="color:var(--primary); text-decoration:none; font-weight:600;">
                <i class="fa-solid fa-download"></i> Download Template IMS/CSV File
              </a>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="cancel-import-csv">Cancel</button>
            <button class="btn btn-primary" id="process-import-csv">Import Products</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    const closeModal = () => modalContainer.remove();
    modalContainer.querySelector('#close-import-csv-modal').addEventListener('click', closeModal);
    modalContainer.querySelector('#cancel-import-csv').addEventListener('click', closeModal);
    modalContainer.querySelector('#download-csv-template').addEventListener('click', (e) => {
      e.preventDefault();
      this.downloadCSVTemplate();
    });

    modalContainer.querySelector('#process-import-csv').addEventListener('click', () => {
      const fileInput = document.getElementById('csv-file-input');
      if (fileInput.files.length === 0) {
        this.showToast('Please select a CSV file to import.', 'warning');
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target.result;
          // More robust parsing: handles quoted fields and different line endings
          const lines = csv.split(/\r\n|\n/);
          if (lines.length < 2) {
            this.showToast('CSV file is empty or has no data rows.', 'warning');
            return;
          }
          const headers = lines[0].split(',').map(h => h.trim());
          const productsToImport = [];

          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            // This simple split assumes no commas within fields. For more complex CSVs, a library would be better.
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const productData = headers.reduce((obj, header, index) => { // No i18n
              obj[header] = values[index];
              return obj;
            }, {});
            productsToImport.push(productData);
          }
          const importedCount = window.store.importProducts(productsToImport);
          this.showToast(`Successfully imported ${importedCount} products.`);
          closeModal();
        } catch (error) {
          this.showToast('Failed to parse CSV file. Please check the format.', 'danger');
        }
      };
      reader.readAsText(file);
    });
  }

  downloadCSVTemplate() {
    const headers = ['Barcode', 'Name', 'Category', 'SellingPrice', 'PurchasePrice', 'StockQty', 'Unit', 'MinStockAlert', 'GSTrate'];
    const exampleRow = ['890000000001', 'Sample Product', 'Rice & Grains', '55', '48', '100', 'Kg', '20', '5'];
    const csvString = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportPriceListToCSV() {
    const store = window.store;
    // Get the same filtered and sorted list of products currently displayed
    let products = store.searchProducts(this.priceListSearch, this.priceListCat);
    if (this.priceListSort === 'price-asc') products.sort((a, b) => a.sellingPrice - b.sellingPrice);
    else if (this.priceListSort === 'price-desc') products.sort((a, b) => b.sellingPrice - a.sellingPrice);
    else products.sort((a, b) => a.name.localeCompare(b.name));

    const headers = ['Barcode', 'Name', 'Category', 'Unit', 'PurchasePrice', 'SellingPrice', 'StockQty'];

    // Function to escape commas and quotes in CSV fields
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [headers.join(',')];
    products.forEach(p => {
      const row = [p.barcode, p.name, p.category, p.unit, p.purchasePrice, p.sellingPrice, p.stockQty].map(escapeCSV).join(',');
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `price-list-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Price List exported to CSV successfully!');
  }

  toggleInputVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.type === 'password') {
      input.type = 'text';
      button.querySelector('i').className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      button.querySelector('i').className = 'fa-solid fa-eye';
    }
  }

  exportInventoryToCSV() {
    const store = window.store;
    // Get the same filtered and sorted list of products currently displayed
    let products = store.searchProducts(this.inventorySearch, this.inventoryCat);
    if (this.inventorySort === 'stock-asc') products.sort((a, b) => a.stockQty - b.stockQty);
    else if (this.inventorySort === 'stock-desc') products.sort((a, b) => b.stockQty - a.stockQty);
    else products.sort((a, b) => a.name.localeCompare(b.name));

    const headers = ['Barcode', 'Name', 'Brand', 'Category', 'Purchase Price', 'Selling Price', 'GST Rate (%)', 'Stock Qty', 'Unit', 'Min Stock Alert'];
    
    // Function to escape commas and quotes in CSV fields
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [headers.join(',')];
    products.forEach(p => {
      const row = [p.barcode, p.name, p.brand, p.category, p.purchasePrice, p.sellingPrice, p.gstRate, p.stockQty, p.unit, p.minStockAlert].map(escapeCSV).join(',');
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Inventory exported to CSV successfully!');
  }

  initDashboardCharts() {
    if (!window.Chart) return;
    const store = window.store;
    const revenueCtx = document.getElementById('revenueChart');
    if (!revenueCtx) return;

    const periodSelect = document.getElementById('dashboard-period-select');
    const chartTypeSelect = document.getElementById('dashboard-chart-type');
    const days = periodSelect ? parseInt(periodSelect.value, 10) || 7 : 7;
    const chartType = chartTypeSelect ? chartTypeSelect.value || 'bar' : 'bar';

    // Build last N days labels and data from salesHistory
    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(key);
      const total = (store.salesHistory || store.invoices || []).reduce((sum, inv) => {
        return sum + ((inv.date === key) ? (Number(inv.grandTotal) || 0) : 0);
      }, 0);
      data.push(total);
    }

    if (window._revenueChart) {
      try { window._revenueChart.destroy(); } catch (e) {}
      window._revenueChart = null;
    }

    try {
      const rect = revenueCtx.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      const dpr = window.devicePixelRatio || 1;
      revenueCtx.width = Math.round(cssW * dpr);
      revenueCtx.height = Math.round(cssH * dpr);
      revenueCtx.style.width = cssW + 'px';
      revenueCtx.style.height = cssH + 'px';

      window._revenueChart = new window.Chart(revenueCtx, {
        type: chartType,
        data: {
          labels,
          datasets: [{
            label: `Revenue (in ${store.settings.currency || '₹'})`,
            data,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.15)',
            fill: true,
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { display: false } }
        }
      });
    } catch (e) {
      console.error('Failed to initialize revenue chart', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
