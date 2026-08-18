// Consolidated UI Components for Sri Srikanteshwara Store

// 1. Sidebar Component
window.renderSidebar = function(activeNav) {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  const user = store.currentUser || { name: 'Admin', role: 'Admin' };
  const lowStockCount = store.products.filter(p => p.stockQty <= p.minStockAlert).length;

  const navItems = [
    { id: 'pos', label: t.posBilling, icon: 'fa-calculator', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'dashboard', label: t.dashboard, icon: 'fa-chart-line', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'price-list', label: t.priceList, icon: 'fa-tags', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'products', label: t.products, icon: 'fa-boxes-stacked', badge: lowStockCount > 0 ? `${lowStockCount}` : null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'categories', label: t.categories, icon: 'fa-layer-group', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'inventory', label: t.inventory, icon: 'fa-warehouse', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'customers', label: t.customers, icon: 'fa-users', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'suppliers', label: t.suppliers, icon: 'fa-truck-field', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'bills', label: t.billHistory, icon: 'fa-receipt', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'reports', label: t.reports, icon: 'fa-file-invoice-dollar', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'users', label: t.userManagement, icon: 'fa-user-shield', badge: null, roles: ['Admin'] },
    { id: 'settings', label: t.settings, icon: 'fa-gear', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
  ];

  return `
    <aside class="sidebar ${app.isSidebarOpen ? 'open' : ''}">
      <div class="sidebar-header">
        <div class="store-logo-icon">
          <i class="fa-solid fa-store"></i>
        </div>
        <div class="store-title-container">
          <div class="store-name" title="${t.storeName}">${t.storeName}</div>
          <div class="store-subtitle">${t.storeSubtitle}</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Store Operations</div>
        <div class="nav-active-indicator"></div>
        ${navItems
          .filter(item => item.roles.includes(user.role))
          .map(item => `
            <a class="nav-item ${activeNav === item.id ? 'active' : ''}" data-nav="${item.id}">
              <i class="fa-solid ${item.icon}"></i>
              <span style="flex:1;">${item.label}</span>
              ${item.badge ? `<span class="badge badge-danger">${item.badge}</span>` : ''}
            </a>
          `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-badge" id="user-profile-badge" title="Edit My Profile">
          <div class="user-avatar">${user.name.charAt(0)}</div>
          <div class="user-details">
            <div class="user-name">${user.name}</div>
            <div class="user-role"><i class="fa-solid fa-shield-halved" style="color:var(--secondary);"></i> ${user.role}</div>
          </div>
          <button class="btn-icon" id="logout-btn" title="Logout" style="width:32px;height:32px;border:none;background:transparent;color:#94a3b8;">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay ${app.isSidebarOpen ? 'open' : ''}"></div>
  `;
};

// 2. TopBar Component
window.renderTopBar = function(pageTitle) {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const theme = store.currentTheme || 'light';

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const isTyping = document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-icon" id="toggle-sidebar-btn" title="Toggle Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <h1 class="page-title">${pageTitle}</h1>
      </div>

      <div class="topbar-right">
        ${isTyping ? `
          <div class="scanner-status-indicator" title="Typing in a field...">
            <i class="fa-solid fa-keyboard" style="color: var(--secondary);"></i>
            <span class="scanner-status-text">Typing...</span>
          </div>
        ` : `
          <div class="scanner-status-indicator" title="USB Barcode Scanner Ready">
            <span class="pulse-dot"></span>
            <i class="fa-solid fa-barcode"></i>
            <span class="scanner-status-text">Scanner Ready</span>
          </div>
        `}

        <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;display:flex;flex-direction:column;align-items:flex-end;line-height:1.2;">
          <span id="live-time-display" style="color:var(--text-main);">${timeStr}</span>
          <span id="live-date-display">${dateStr}</span>
        </div>

        <button class="lang-toggle-btn" id="toggle-lang-btn" title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ">
          <i class="fa-solid fa-language" style="color:var(--secondary);"></i> Language
          <!-- <span>${lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span> -->
        </button>

        <button class="btn-icon" id="toggle-theme-btn" title="Toggle Theme (Dark/Light)">
          <i class="fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
        </button>
      </div>
    </header>
  `;
};

// 3. Login Modal Component
window.renderLoginModal = function() {
  const store = window.store;
  return `
    <div class="modal-overlay" id="login-modal-overlay">
      <div class="modal-card" style="max-width: 440px;">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: #fff;">
          <div class="modal-title" style="color: #fff;">
            <i class="fa-solid fa-store" style="color: var(--secondary);"></i>
            <span>Sri Srikanteshwara Store Login</span>
          </div>
        </div>

        <div class="modal-body">
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;">
            Select your staff role or user account to access the billing and inventory software.
          </p>

          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Role / Account</label>
              <select class="form-select" id="login-user-select" required>
                ${store.users.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Password / PIN (Default: 1234)</label>
              <div style="position:relative;" title="Default PIN is 1234 for all users initially.">
                <input type="password" class="form-input" id="login-pin-input" value="1234" required placeholder="Enter PIN or password">
                <button type="button" id="toggle-pin-visibility" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--text-muted);cursor:pointer;">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;font-size:0.82rem;">
              <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;">
                <input type="checkbox" id="remember-me-check" checked> Remember Me
              </label>
              <a href="#" id="forgot-password-link" style="color:var(--primary);text-decoration:none;font-weight:600;">Forgot Password?</a>
            </div>

            <div style="margin-bottom:1rem;">
              <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-bottom:0.4rem;">QUICK DEMO LOGINS:</div>
              <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-1">Admin</button>
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-2">Manager</button>
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-3">Cashier</button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In to Software
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
};

// 4. POS Billing Component
window.renderPOSBilling = function(cartState, activeCategoryFilter = '', searchQuery = '') {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  const curr = store.settings.currency || '₹';

  const filteredProducts = store.searchProducts(searchQuery, activeCategoryFilter);
  const subtotal = cartState.items.reduce((acc, item) => acc + (item.rate * item.qty - item.discount), 0);
  const totalItemCount = cartState.items.reduce((acc, item) => acc + item.qty, 0);
  
  let totalGst = 0;
  cartState.items.forEach(item => {
    const itemTotal = (item.rate * item.qty - item.discount);
    if (item.gstRate > 0) totalGst += (itemTotal * item.gstRate) / 100;
  });

  const billDiscount = cartState.billDiscount || 0;
  const rawTotal = Math.max(0, subtotal + totalGst - billDiscount);
  const roundedTotal = cartState.enableRoundOff ? Math.round(rawTotal) : rawTotal;
  const roundOffDiff = (roundedTotal - rawTotal).toFixed(2);

  const selectedCustomer = store.customers.find(c => c.id === cartState.customerId);
  const shortcutBarEnabled = store.settings.shortcutBarEnabled !== false;
  const shortcutBarPosition = store.settings.shortcutBarPosition || { x: 300, y: 520 };
  const shortcutBarScale = parseFloat(store.settings.shortcutBarScale || 1);
  const posCartWidth = store.settings.posCartWidth || 420; // Default cart width

  const quickAccessTabs = store.settings.quickAccessTabs && Array.isArray(store.settings.quickAccessTabs)
    ? store.settings.quickAccessTabs
    : [
        // Default fallback tabs
        { label: 'Oils', category: 'Edible Oils & Ghee' },
        { label: 'Rice', category: 'Rice & Grains' },
        { label: 'Dals', category: 'Dals & Pulses' },
        { label: 'Flours', category: 'Flours & Rava' },
        { label: 'Spices', category: 'Spices & Masala' },
        { label: 'Dairy', category: 'Dairy & Bakery' }
      ];

  const categoriesToShow = activeCategoryFilter
    ? store.categories.filter(cat => cat.name === activeCategoryFilter)
    : store.categories;

  const categorySections = categoriesToShow.map(cat => {
    const productsInCategory = filteredProducts.filter(p => p.category === cat.name);
    return {
      title: lang === 'kn' ? cat.nameKannada : cat.name,
      name: cat.name,
      products: productsInCategory
    };
  }).filter(section => section.products.length > 0);

  return `
    <div class="pos-container" style="--pos-cart-width: ${posCartWidth}px;">
      <div class="pos-left-panel">
        <div class="pos-search-bar">
          <i class="fa-solid fa-magnifying-glass pos-search-icon"></i>
          <input type="text" id="pos-product-search" class="pos-search-input" placeholder="${t.searchPlaceholder}" value="${searchQuery}" autocomplete="off">
        </div>

        <div class="quick-access-row">
          <button class="btn btn-sm ${!activeCategoryFilter ? 'btn-primary' : 'btn-outline'} pos-cat-btn" data-cat="">
            ${t.allCategories}
          </button>
          ${quickAccessTabs.map(tab => {
            const cat = store.categories.find(c => c.name === tab.category);
            if (!cat) return '';
            return `
              <button class="btn btn-sm ${activeCategoryFilter === cat.name ? 'btn-primary' : 'btn-outline'} pos-cat-btn" data-cat="${cat.name}">
                ${tab.label || (lang === 'kn' ? cat.nameKannada : cat.name)}
              </button>
            `;
          }).join('')}
        </div>

        <div class="pos-product-list-container">
          ${categorySections.length === 0 ? `
            <div style="text-align:center; padding:3rem; color:var(--text-muted);">
              <i class="fa-solid fa-box-open" style="font-size:2.5rem;margin-bottom:0.5rem;"></i>
              <div>No products found matching search query.</div>
            </div>
          ` : categorySections.map(section => `
            <div class="category-section">
              <div class="category-section-header">
                <div>
                  <div class="category-title">${section.title}</div>
                  <div class="category-subtitle">${section.products.length} items</div>
                </div>
              </div>
              <div class="pos-product-grid category-grid">
                ${section.products.map(p => `
                  <div class="pos-product-card" data-product-id="${p.id}">
                    <div>
                      <div class="product-card-name">${p.name}</div>
                      <!-- <div class="product-card-kannada">${p.nameKannada || ''}</div> -->
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.4rem;">
                      <div class="product-card-price">${curr}${p.sellingPrice}</div>
                      <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${p.id}" style="padding:0.25rem 0.5rem;">
                        <i class="fa-solid fa-plus"></i> Add
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pos-resizer" id="pos-resizer-handle"></div>

      <div class="pos-cart-panel" style="width: ${posCartWidth}px;">
        <div class="cart-header">
          <div style="font-weight:700;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <i class="fa-solid fa-cart-shopping" style="color:var(--primary);"></i>
            <span>Active Cart</span>
            ${totalItemCount > 0 ? `<span class="badge badge-primary" style="font-size: 0.8rem;">${totalItemCount} Items</span>` : ''}
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
            <button class="btn btn-outline btn-sm" id="btn-hold-draft">
              <i class="fa-solid fa-pause"></i> Drafts (${store.drafts.length})
            </button>
            <button class="btn btn-outline btn-sm" id="btn-toggle-shortcut-bar">
              <i class="fa-solid fa-keyboard"></i> ${shortcutBarEnabled ? 'Hide' : 'Show'} Shortcuts
            </button>
            <button class="btn btn-outline btn-sm" id="btn-shortcut-size-smaller" title="Smaller shortcut bar">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-shortcut-size-larger" title="Larger shortcut bar">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-clear-cart">
              <i class="fa-solid fa-trash-can" style="color:var(--danger);"></i>
            </button>
          </div>
        </div>

        <div class="cart-customer-bar">
          <div style="display:flex;align-items:center;gap:0.5rem;overflow:hidden;">
            <i class="fa-solid fa-user-tag" style="color:var(--primary);"></i>
            <div style="overflow:hidden;">
              <div style="font-weight:700;font-size:0.85rem;">
                ${selectedCustomer ? selectedCustomer.name : t.walkInCustomer}
              </div>
              ${selectedCustomer ? `
                <div style="font-size:0.72rem;color:var(--text-muted);">Mob: ${selectedCustomer.mobile}</div>
              ` : ''}
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-select-customer">
            <i class="fa-solid fa-user-plus"></i> Select
          </button>
        </div>

        <div class="cart-items-container">
          ${cartState.items.length === 0 ? `
            <div style="text-align:center;padding:3rem 1rem;color:var(--text-muted);">
              <i class="fa-solid fa-basket-shopping" style="font-size:2.5rem;margin-bottom:0.5rem;opacity:0.4;"></i>
              <div style="font-weight:600;font-size:0.9rem;">${t.cartEmpty}</div>
            </div>`
           : cartState.items.map((item, idx) => {
              const isWeightItem = ['Kg', 'g', 'grams'].includes(item.unit);
              return `
            <div class="cart-item-row" ${isWeightItem ? 'style="cursor:pointer;" title="Click to edit weight"' : ''}>
              <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-sub">${curr}${item.rate} / ${item.unit} | GST: ${item.gstRate}%</div>
              </div>

              <div class="qty-control-group">
                <button class="qty-btn btn-cart-minus" data-index="${idx}" style="min-width: 24px;">-</button>
                <input type="number" step="any" class="qty-input cart-qty-input" data-index="${idx}" value="${item.qty}" style="width: 55px;">
                <button class="qty-btn btn-cart-plus" data-index="${idx}">+</button>
              </div>

              <div style="text-align:right;min-width:65px;">
                <div style="font-weight:700;font-size:0.9rem;color:var(--primary);">
                  ${curr}${(item.rate * item.qty - item.discount).toFixed(2)}
                </div>
                <button class="btn-icon btn-cart-remove" data-index="${idx}" style="width:20px;height:20px;border:none;background:transparent;color:var(--danger);font-size:0.75rem;">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            `;
          }).join('')}
        </div>

        <div class="cart-summary-box">
          <div class="summary-line"><span>${t.subtotal}</span><span>${curr}${subtotal.toFixed(2)}</span></div>
          <div class="summary-line"><span>${t.gstTax}</span><span>${curr}${totalGst.toFixed(2)}</span></div>
          <div class="summary-line" style="display:flex;align-items:center;justify-content:space-between;">
            <span>${t.billDiscount}</span>
            <input type="number" id="cart-bill-discount-input" value="${billDiscount}" style="width:70px;padding:0.15rem 0.4rem;text-align:right;border:1px solid var(--border);border-radius:4px;">
          </div>
          <div class="summary-line"><span>${t.roundOff}</span><span>${roundOffDiff > 0 ? `+${roundOffDiff}` : roundOffDiff}</span></div>
          <div class="summary-line grand-total"><span>${t.grandTotal}</span><span>${curr}${roundedTotal.toFixed(2)}</span></div>
        </div>

        ${shortcutBarEnabled ? `
        <div class="shortcut-pill-bar" style="left:${shortcutBarPosition.x}px; top:${shortcutBarPosition.y}px; --shortcut-scale:${shortcutBarScale};">
          <div><span class="shortcut-key">F1</span> New</div>
          <div><span class="shortcut-key">F2</span> Search</div>
          <div><span class="shortcut-key">F4</span> Cust</div>
          <div><span class="shortcut-key">F8</span> Pay</div>
          <div><span class="shortcut-key">F10</span> Draft</div>
        </div>
        ` : ''}

        <div class="pos-actions-bar">
          <button class="btn btn-secondary btn-lg" id="btn-hold-cart" ${cartState.items.length === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-pause"></i> Hold (F10)
          </button>
          <button class="btn btn-primary btn-lg" id="btn-pay-print" ${cartState.items.length === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-cash-register"></i> ${t.payNow}
          </button>
        </div>
      </div>
    </div>
  `;
};

// 5. Payment Modal
window.renderPaymentModal = function(grandTotal, selectedCustomer) {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  const curr = store.settings.currency || '₹';
  const upiVpa = store.settings.upiId || '9845012345@ybl';

  return `
    <div class="modal-overlay" id="payment-modal-overlay">
      <div class="modal-card" style="max-width: 520px;">
        <div class="modal-header" style="background: var(--primary); color: #fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-indian-rupee-sign" style="color:var(--secondary);"></i>
            <span>Complete Payment - ${curr}${grandTotal.toFixed(2)}</span>
          </div>
          <button class="btn-icon" id="close-payment-modal" style="border:none;background:transparent;color:#fff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:0.5rem;margin-bottom:1.25rem;">
            <button class="btn pay-method-btn btn-primary" data-method="Cash"><i class="fa-solid fa-money-bill-wave"></i> Cash</button>
            <button class="btn pay-method-btn btn-outline" data-method="UPI"><i class="fa-solid fa-qrcode"></i> UPI QR</button>
            <button class="btn pay-method-btn btn-outline" data-method="Card"><i class="fa-solid fa-credit-card"></i> Card</button>
            <button class="btn pay-method-btn btn-outline" data-method="Mixed"><i class="fa-solid fa-sliders"></i> Mixed</button>
          </div>

          <div id="pay-details-cash" class="pay-tab-content">
            <div class="form-group">
              <label class="form-label">${t.amountReceived}</label>
              <input type="number" step="any" id="cash-amount-received" class="form-input" value="${Math.ceil(grandTotal)}" style="font-size:1.25rem;font-weight:700;color:var(--primary);">
            </div>
            <div style="display:flex;gap:0.4rem;margin-bottom:1rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm cash-chip" data-val="${Math.ceil(grandTotal)}">Exact (${curr}${Math.ceil(grandTotal)})</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="100">${curr}100</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="200">${curr}200</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="500">${curr}500</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="2000">${curr}2000</button>
            </div>
            <div style="padding:1rem;background-color:var(--success-light);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:space-between;border:1px solid var(--success);">
              <span style="font-weight:600;color:var(--success);">${t.changeDue}:</span>
              <span id="cash-change-due" style="font-size:1.4rem;font-weight:800;color:var(--success);">${curr}0.00</span>
            </div>
          </div>

          <div id="pay-details-upi" class="pay-tab-content" style="display:none;text-align:center;">
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem;">
              Scan UPI QR code to pay <strong>${curr}${grandTotal.toFixed(2)}</strong>
            </p>
            <div id="upi-qrcode-container" style="display:inline-block;padding:0.75rem;background:#fff;border-radius:var(--radius-lg);box-shadow:var(--shadow-md);margin-bottom:1rem;"></div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);">UPI ID: ${upiVpa}</div>
          </div>

          <div id="pay-details-card" class="pay-tab-content" style="display:none;">
            <div class="form-group">
              <label class="form-label">Card Machine Reference / Auth Code</label>
              <input type="text" id="card-auth-code" class="form-input" placeholder="e.g. POS-987654">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-payment-btn">${t.cancel}</button>
          <button class="btn btn-primary btn-lg" id="confirm-payment-btn" style="flex:1;">
            <i class="fa-solid fa-print"></i> ${t.completePayment}
          </button>
        </div>
      </div>
    </div>
  `;
};

// 6. Receipt Modal
window.renderReceiptModal = function(invoice, settings, isEditMode = false, isPreview = false) {
  const s = settings; // Use the passed settings object
  const curr = s.currency || '₹';
  const cgst = (invoice.totalGst / 2).toFixed(2);
  const sgst = (invoice.totalGst / 2).toFixed(2);

  const coreReceiptHtml = `
    <div id="printable-receipt" class="thermal-receipt">
      ${isEditMode && !isPreview ? `
              <div class="receipt-edit-bar" style="display:flex; flex-direction:column; gap: 0.5rem; margin-bottom: 1rem; background: var(--bg-body); padding: 1rem; border-radius: var(--radius-md);">
                <h4 style="margin:0; font-size: 1rem; color: var(--primary);">Edit Receipt Details (for this print only)</h4>
                <input type="text" id="receipt-edit-storeName" class="form-input" value="${s.storeName}">
                <input type="text" id="receipt-edit-tagLine" class="form-input" value="${s.tagLine || ''}">
                <input type="text" id="receipt-edit-address" class="form-input" value="${s.address}">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <input type="text" id="receipt-edit-phone" class="form-input" value="${s.phone}">
                  <input type="text" id="receipt-edit-gstNo" class="form-input" value="${s.gstNo}">
                </div>
                <textarea id="receipt-edit-receiptFooter" class="form-input" rows="2">${s.receiptFooter}</textarea>
              </div>
      ` : `
              <div class="thermal-header">
                <div class="thermal-title">${s.storeName}</div>
                <div>${s.tagLine || ''}</div>
                <div>${s.address}</div>
                <div>Ph: ${s.phone} | GSTIN: ${s.gstNo}</div>
              </div>
      `}

      ${isPreview ? '' : `
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
              <span>Bill No: <strong>${invoice.invoiceNo}</strong></span>
              <span>Date: ${invoice.date} ${invoice.time}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;">
              <span>Cashier: ${invoice.cashierName}</span>
              <span>Customer: ${invoice.customerName || 'Walk-in'}</span>
            </div>
      `}
            <div class="thermal-divider"></div>

            <table class="thermal-table">
              <thead>
                <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Rate</th><th style="text-align:right;">Total</th></tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr><td colspan="4" style="font-weight:bold;padding-top:4px;">${item.name}</td></tr>
                  <tr>
                    <td style="padding-left:8px;font-size:11px;color:#555;">${item.barcode}</td>
                    <td style="text-align:center;">${item.qty} ${item.unit}</td> 
                    <td style="text-align:right;">${curr}${item.rate}</td>
                    <td style="text-align:right;font-weight:bold;">${curr}${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="thermal-divider"></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;"><span>Subtotal:</span><span>${curr}${invoice.subtotal.toFixed(2)}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;"><span>CGST:</span><span>${curr}${cgst}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;"><span>SGST:</span><span>${curr}${sgst}</span></div>
            <div class="thermal-divider"></div>
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:bold;margin:4px 0;">
              <span>GRAND TOTAL:</span>
              <span>${curr}${invoice.grandTotal.toFixed(2)}</span>
            </div>
            <div style="text-align:center;font-size:11px;margin-top:10px;font-style:italic;">
              ${s.receiptFooter}
            </div>
    </div>
  `;

  if (isPreview) {
    // If it's a preview, return only the core receipt HTML
    return coreReceiptHtml;
  } else {
    // Otherwise, wrap it in the full modal structure
    return `
      <div class="modal-overlay" id="receipt-modal-overlay">
        <div class="modal-card" style="max-width: 580px;">
          <div class="modal-header" style="background: var(--bg-sidebar); color: #fff;">
            <div class="modal-title" style="color:#fff;">
              <i class="fa-solid fa-receipt" style="color:var(--secondary);"></i>
              <span>Invoice #${invoice.invoiceNo}</span>
            </div>
            <button class="btn-icon" id="close-receipt-modal" style="border:none;background:transparent;color:#fff;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body" style="background:#f1f5f9;padding:1rem;">
            ${coreReceiptHtml}
          </div>
          <div class="modal-footer">
            ${isEditMode ? `
            <button class="btn btn-outline" id="btn-cancel-receipt-edits"><i class="fa-solid fa-xmark"></i> Cancel</button>
            <button class="btn btn-primary" id="btn-save-receipt-edits"><i class="fa-solid fa-floppy-disk"></i> Apply Changes</button>
          ` : `
              <button class="btn btn-secondary" id="btn-edit-receipt">
                <i class="fa-solid fa-pen-to-square"></i> Edit Details
              </button>
              <button class="btn btn-primary" id="btn-print-receipt-trigger">
                <i class="fa-solid fa-print"></i> Print Receipt
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }
};

// 7. Dashboard Component
window.renderDashboard = function() {
  const store = window.store;
  const curr = store.settings.currency || '₹';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = store.invoices.filter(i => i.date === todayStr);
  const todaysSales = todayInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalRevenue = store.invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const lowStockCount = store.products.filter(p => p.stockQty <= p.minStockAlert).length;
  const recentInvoices = store.invoices.slice(0, 5);

  const totalProfit = (store.invoices || []).reduce((profitSum, invoice) => {
    const invoiceProfit = (invoice.items || []).reduce((itemSum, item) => {
      const product = store.products.find(p => p.id === item.productId);
      if (product) {
        const itemProfit = (item.rate - product.purchasePrice) * item.qty;
        return itemSum + itemProfit;
      }
      return itemSum;
    }, 0);
    return profitSum + invoiceProfit;
  }, 0);


  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="background: linear-gradient(135deg, var(--bg-card), var(--primary-light));">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h2 style="font-size:1.3rem;font-weight:800;">${store.settings.storeName} Dashboard</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);">Real-time POS activity, sales metrics, and inventory health.</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-primary" id="dash-new-bill"><i class="fa-solid fa-plus"></i> New Bill</button>
            <button class="btn btn-secondary" id="dash-add-product"><i class="fa-solid fa-box-archive"></i> Add Product</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Today's Revenue</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary);margin-top:0.2rem;">${curr}${(store.revenue?.today||todaysSales).toFixed(2)}</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">This Week</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--secondary);margin-top:0.2rem;">${curr}${(store.revenue?.week||0).toFixed(2)}</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">This Month</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--text-main);margin-top:0.2rem;">${curr}${(store.revenue?.month||0).toFixed(2)}</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Lifetime Revenue</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary);margin-top:0.2rem;">${curr}${(store.revenue?.lifetime||totalRevenue).toFixed(2)}</div>
        </div>
      </div>

      <div class="dashboard-grid-2col" style="gap:1rem;">
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
            <div style="font-weight:700;font-size:1.05rem;">Revenue Chart</div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <select id="dashboard-period-select" class="form-select" style="width:160px;">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="30m">This Month</option>
              </select>
              <select id="dashboard-chart-type" class="form-select" style="width:120px;">
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          <canvas id="revenueChart" style="width:10cm;height:10cm;max-width:100%;display:block;" aria-label="Revenue chart"></canvas>
        </div>

        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:0.75rem;">Quick Actions</div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn btn-danger" id="btn-reset-dashboard"><i class="fa-solid fa-power-off"></i> Reset Dashboard</button>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <select id="reset-scope-select" class="form-select" style="width:140px;">
                <option value="today">Today's Revenue</option>
                <option value="week">This Week's Revenue</option>
                <option value="month">This Month's Revenue</option>
                <option value="all">Lifetime Revenue</option>
              </select>
              <button class="btn btn-danger" id="btn-reset-confirm">Reset Counter</button>
            </div>
            <div style="margin-top:0.75rem;">
              <div style="font-weight:700;margin-bottom:0.5rem;">Dashboard Widgets</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                <div class="card card-small">Total Bills<br><strong>${store.invoices.length}</strong></div>
                <div class="card card-small">Products Sold<br><strong>${(store.salesHistory||[]).reduce((s,inv)=>s+ (inv.items?inv.items.reduce((a,i)=>a+(i.qty||0),0):0),0)}</strong></div>
                <div class="card card-small">Profit<br><strong style="color:var(--success);">${curr}${totalProfit.toFixed(2)}</strong></div>
                <div class="card card-small">Low Stock<br><strong>${lowStockCount}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">Recent Bills</div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Invoice #</th><th>Date & Time</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${recentInvoices.map(inv => `
                <tr>
                  <td><strong>${inv.invoiceNo}</strong></td>
                  <td>${inv.date} ${inv.time}</td>
                  <td>${inv.customerName || 'Walk-in'}</td>
                  <td>${inv.items.length} items</td>
                  <td><strong style="color:var(--primary);">${curr}${inv.grandTotal.toFixed(2)}</strong></td>
                  <td><span class="badge badge-success">${inv.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 8. Price List Component (Interactive Price Management Page)
window.renderPriceList = function(selectedCat = '', searchQ = '', sortOrder = 'name-asc', isEditMode = false) {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  const curr = store.settings.currency || '₹';
  let products = store.searchProducts(searchQ, selectedCat);

  if (sortOrder === 'price-asc') products.sort((a, b) => a.sellingPrice - b.sellingPrice);
  else if (sortOrder === 'price-desc') products.sort((a, b) => b.sellingPrice - a.sellingPrice);
  else products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2 style="font-weight:800;font-size:1.25rem;display:flex;align-items:center;gap:0.5rem;">
              <i class="fa-solid fa-tags" style="color:var(--secondary);"></i>
              <span>${t.priceListTitle} & Price Editor</span>
            </h2>
            <p style="font-size:0.82rem;color:var(--text-muted);">View, edit selling prices, update purchase rates, and print store display price sheets.</p>
          </div>
          
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" id="btn-add-price-item">
              <i class="fa-solid fa-plus"></i> Add Item
            </button>
            <button class="btn ${isEditMode ? 'btn-secondary' : 'btn-outline'}" id="toggle-pricelist-edit-mode">
              <i class="fa-solid ${isEditMode ? 'fa-check' : 'fa-pen-to-square'}"></i>
              <span>${isEditMode ? 'Exit Edit Mode' : 'Edit Prices Mode'}</span>
            </button>
            <button class="btn btn-primary" id="save-all-price-list-btn" style="${isEditMode ? '' : 'display:none;'}">
              <i class="fa-solid fa-floppy-disk"></i> Save All Changes
            </button>
            <button class="btn btn-primary" id="print-price-list-btn">
              <i class="fa-solid fa-print"></i> ${t.printableList}
            </button>
            <button class="btn btn-secondary" id="btn-export-pricelist-csv">
              <i class="fa-solid fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>

        <div class="responsive-grid-3col">
          <div class="styled-search-container">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="pricelist-search-input" class="form-input" placeholder="Search by product name, barcode, brand..." value="${searchQ}">
          </div>
          <select id="pricelist-cat-select" class="form-select">
            <option value="">${t.allCategories}</option>
            ${store.categories.map(c => `<option value="${c.name}" ${selectedCat === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <select id="pricelist-sort-select" class="form-select">
            <option value="name-asc" ${sortOrder === 'name-asc' ? 'selected' : ''}>Alphabetical (A-Z)</option>
            <option value="price-asc" ${sortOrder === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${sortOrder === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div id="printable-price-sheet" class="card">
        <div style="text-align:center;padding:1rem;border-bottom:2px solid var(--primary);margin-bottom:1rem;">
          <h2 style="font-weight:800;font-size:1.4rem;color:var(--primary);">${store.settings.storeName}</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);">${store.settings.address} | Ph: ${store.settings.phone}</p>
          <div style="font-size:0.9rem;font-weight:700;margin-top:0.4rem;text-transform:uppercase;letter-spacing:1px;color:var(--secondary);">
            Official Product Price Catalogue (${products.length} Products) ${isEditMode ? ' - [EDIT MODE]' : ''} <!-- (English / ಕನ್ನಡ) -->
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th style="text-align:right;">Purchase Price</th>
                <th style="text-align:right;">Selling Price</th>
                <th style="text-align:center;">Stock Qty</th>
              </tr>
            </thead>
            <tbody>
              ${products.length === 0 ? `
                <tr><td colspan="7" style="text-align:center;padding:2rem;">No products match your filter criteria.</td></tr>
              ` : products.map(p => `
                <tr data-prod-row="${p.id}">
                  <td><code style="font-size:0.82rem;font-weight:700;color:var(--primary);">${p.barcode}</code></td>
                  <td>
                    <div style="font-weight:700;">${p.name}</div>
                  </td>
                  <td style="text-align:center;">
                    ${isEditMode ? `
                      <select class="form-select price-edit-category" data-id="${p.id}" style="width:130px; margin:0 auto;">
                        ${store.categories.map(cat => `<option value="${cat.name}" ${cat.name === p.category ? 'selected' : ''}>${cat.name}</option>`).join('')}
                      </select>
                    ` : `<span class="badge badge-info">${p.category}</span>`}
                  </td>

                  <td style="text-align:center;">
                    ${isEditMode ? `
                      <select class="form-select price-edit-unit" data-id="${p.id}" style="width:100px; margin:0 auto;">
                        ${['Kg','g','ml','l','grams','Packet','Bottle','Piece'].map(unit => `<option value="${unit}" ${p.unit === unit ? 'selected' : ''}>${unit}</option>`).join('')}
                      </select>
                    ` : `<span class="price-unit-text">${p.unit}</span>`}
                  </td>

                  <!-- Purchase Price -->
                  <td style="text-align:right;">
                    ${isEditMode ? `
                      <input type="number" step="any" class="form-input price-edit-purchase" data-id="${p.id}" value="${p.purchasePrice}" style="width:90px;text-align:right;padding:0.25rem;">
                    ` : `${curr}${p.purchasePrice.toFixed(2)}`}
                  </td>

                  <!-- Selling Price -->
                  <td style="text-align:right;">
                    ${isEditMode ? `
                      <input type="number" step="any" class="form-input price-edit-selling" data-id="${p.id}" value="${p.sellingPrice || 0}" style="width:100px;text-align:right;padding:0.25rem;font-weight:800;color:var(--primary);">
                    ` : `<strong style="font-size:1.05rem;color:var(--primary);">${curr}${(p.sellingPrice || 0).toFixed(2)}</strong> / ${p.unit}`}
                  </td>

                  <!-- Stock Qty -->
                  <td style="text-align:center;">
                    ${isEditMode ? `
                      <div style="display:flex;flex-direction:column;gap:0.4rem;align-items:center;">
                        <input type="number" class="form-input price-edit-stock" data-id="${p.id}" value="${p.stockQty}" style="width:75px;text-align:center;padding:0.25rem;">
                        <button class="btn btn-danger btn-sm delete-price-item-btn" data-id="${p.id}" style="min-width:80px;">
                          <i class="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    ` : `
                      <span class="badge ${p.stockQty <= p.minStockAlert ? 'badge-danger' : 'badge-success'}">
                        ${p.stockQty} ${p.unit}
                      </span>
                    `}
                  </td>

                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.renderCategoryManagement = function() {
  const store = window.store;
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  const quickTabs = Array.isArray(store.settings.quickAccessTabs) && store.settings.quickAccessTabs.length > 0
    ? store.settings.quickAccessTabs
    : window.initialStoreSettings.quickAccessTabs || [];

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-layer-group"></i> ${t.categoryManagement}</h2>
          <p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.4rem;">Manage categories used across products, price lists, and quick-access tabs.</p>
        </div>
        <button class="btn btn-primary" id="btn-add-category"><i class="fa-solid fa-plus"></i> ${t.addCategory}</button>
      </div>

      <div class="card">
        <form id="category-management-form" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h3 style="font-weight:700; margin-bottom: 1rem;">Product Categories</h3>
            <div id="category-list-rows" style="display:flex;flex-direction:column;gap:0.75rem;">
              ${store.categories.map(cat => `
                <div class="category-row" data-id="${cat.id}" style="display:grid;grid-template-columns:1fr auto;gap:0.5rem;align-items:center;">
                  <input type="hidden" class="category-id" value="${cat.id}">
                  <input type="text" class="form-input category-name" placeholder="${t.categoryName}" value="${cat.name}">
                  <button type="button" class="btn btn-danger btn-sm delete-category-btn" title="${t.delete}" style="min-width:90px;"><i class="fa-solid fa-trash"></i></button>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h3 style="font-weight:700; margin-bottom: 1rem;">POS Quick Access Tabs</h3>
            <div id="quick-access-tabs-config">
              ${quickTabs.map((tab, idx) => `
                <div class="quick-access-tab-row" data-index="${idx}" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
                  <input type="text" class="form-input quick-access-tab-label" data-index="${idx}" placeholder="Label" value="${tab.label}">
                  <select class="form-select quick-access-tab-category" data-index="${idx}" style="min-width:120px;">
                    ${store.categories.map(cat => `<option value="${cat.name}" ${cat.name === tab.category ? 'selected' : ''}>${cat.name}</option>`).join('')}
                  </select>
                  <button type="button" class="btn btn-danger btn-sm remove-quick-tab" data-index="${idx}" title="Remove tab"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-add-quick-tab" style="margin-top:0.5rem;">Add Quick Tab</button>
          </div>
          <div style="margin-top:1rem;display:flex;justify-content:flex-end; grid-column: 1 / -1;">
            <button type="submit" class="btn btn-primary btn-lg">${t.saveCategories}</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

window.renderProductManagement = function(searchQuery = '', catFilter = '', isEditMode = false) {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  const products = store.searchProducts(searchQuery, catFilter);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-boxes-stacked"></i> Products & Inventory</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);">View and manage all product details including names, pricing, and stock levels.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" id="btn-add-new-product"><i class="fa-solid fa-plus"></i> Add Product</button>
            <button class="btn ${isEditMode ? 'btn-secondary' : 'btn-outline'}" id="toggle-prod-mgmt-edit-mode">
              <i class="fa-solid ${isEditMode ? 'fa-check' : 'fa-pen-to-square'}"></i>
              <span>${isEditMode ? 'Exit Edit Mode' : 'Customize Products'}</span>
            </button>
            <button class="btn btn-primary" id="save-all-prod-mgmt-btn" style="${isEditMode ? '' : 'display:none;'}">
              <i class="fa-solid fa-floppy-disk"></i> Save All Changes
            </button>
            <button class="btn btn-secondary" id="btn-import-prod-csv">
              <i class="fa-solid fa-file-import"></i> Import CSV
            </button>
          </div>
        </div>
        <div class="responsive-grid-2col">
          <div class="styled-search-container">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="prod-mgmt-search-input" class="form-input" placeholder="Search by product name, barcode..." value="${searchQuery}">
          </div>
          <select id="prod-mgmt-cat-select" class="form-select">
            <option value="">All Categories</option>
            ${store.categories.map(c => `<option value="${c.name}" ${catFilter === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Barcode</th><th>Name</th><th>Brand</th><th>Purchase</th><th>Selling</th><th>GST</th><th>Stock</th>${isEditMode ? '<th>Actions</th>' : ''}</tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr data-prod-row="${p.id}">
                  <td><code>${p.barcode}</code></td>
                  <td>${isEditMode ? `<input type="text" class="form-input prod-mgmt-edit-name" value="${p.name}">` : `<strong>${p.name}</strong>`}</td>
                  <td>${isEditMode ? `<input type="text" class="form-input prod-mgmt-edit-brand" value="${p.brand}" style="width:100px;">` : p.brand}</td>
                  <td>${isEditMode ? `<input type="number" class="form-input prod-mgmt-edit-purchase" value="${p.purchasePrice}" style="width:90px;">` : `${curr}${p.purchasePrice}`}</td>
                  <td>${isEditMode ? `<input type="number" class="form-input prod-mgmt-edit-selling" value="${p.sellingPrice}" style="width:90px;">` : `<strong style="color:var(--primary);">${curr}${p.sellingPrice}</strong>`}</td>
                  <td>${isEditMode ? `<input type="number" class="form-input prod-mgmt-edit-gst" value="${p.gstRate}" style="width:70px;">` : `${p.gstRate}%`}</td>
                  <td><span class="badge badge-success">${p.stockQty}</span></td>
                  ${isEditMode ? `<td style="text-align:center;"><button class="btn btn-danger btn-sm delete-product-btn" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button></td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 10. Inventory Management Component
window.renderInventoryManagement = function(searchQuery = '', catFilter = '', sortOrder = 'stock-asc', isEditMode = false) {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  let products = store.searchProducts(searchQuery, catFilter);

  if (sortOrder === 'stock-asc') products.sort((a, b) => a.stockQty - b.stockQty);
  else if (sortOrder === 'stock-desc') products.sort((a, b) => b.stockQty - a.stockQty);
  else products.sort((a, b) => a.name.localeCompare(b.name));

  const lowStockCount = products.filter(p => p.stockQty <= p.minStockAlert).length;

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-warehouse"></i> Inventory Control</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);">Manage stock levels, re-order points, and product status. ${lowStockCount} items are low on stock.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn ${isEditMode ? 'btn-secondary' : 'btn-outline'}" id="toggle-inventory-edit-mode">
              <i class="fa-solid ${isEditMode ? 'fa-check' : 'fa-pen-to-square'}"></i>
              <span>${isEditMode ? 'Exit Edit Mode' : 'Edit Stock Mode'}</span>
            </button>
            <button class="btn btn-primary" id="save-all-inventory-btn" style="${isEditMode ? '' : 'display:none;'}">
              <i class="fa-solid fa-floppy-disk"></i> Save All Changes
            </button>
            <button class="btn btn-secondary" id="btn-export-inventory-csv">
              <i class="fa-solid fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>
        <div class="responsive-grid-3col">
          <div class="styled-search-container">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="inventory-search-input" class="form-input" placeholder="Search by product name, barcode..." value="${searchQuery}">
          </div>
          <select id="inventory-cat-select" class="form-select">
            <option value="">All Categories</option>
            ${store.categories.map(c => `<option value="${c.name}" ${catFilter === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
          <select id="inventory-sort-select" class="form-select">
            <option value="name-asc" ${sortOrder === 'name-asc' ? 'selected' : ''}>Alphabetical (A-Z)</option>
            <option value="stock-asc" ${sortOrder === 'stock-asc' ? 'selected' : ''}>Stock: Low to High</option>
            <option value="stock-desc" ${sortOrder === 'stock-desc' ? 'selected' : ''}>Stock: High to Low</option>
          </select>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Product Name</th><th>Category</th><th style="text-align:center;">Current Stock</th><th style="text-align:center;">Min. Stock Alert</th>${isEditMode ? '<th>Actions</th>' : ''}</tr>
            </thead>
            <tbody> 
              ${products.map(p => `
                <tr data-prod-row="${p.id}">
                  <td><strong>${p.name}</strong><br><small style="color:var(--text-muted);">${p.nameKannada || ''}</small></td>
                  <td><span class="badge badge-info">${p.category}</span></td>
                  <td style="text-align:center;">
                    ${isEditMode ? `<input type="number" class="form-input inventory-edit-stock" value="${p.stockQty}" style="width:90px;text-align:center;">` : `<span class="badge ${p.stockQty <= p.minStockAlert ? 'badge-danger' : 'badge-success'}">${p.stockQty} ${p.unit}</span>`}
                  </td>
                  <td style="text-align:center;">
                    ${isEditMode ? `<input type="number" class="form-input inventory-edit-min-stock" value="${p.minStockAlert}" style="width:90px;text-align:center;">` : p.minStockAlert}
                  </td>
                  ${isEditMode ? `
                    <td style="text-align:center;">
                      <button class="btn btn-danger btn-sm delete-inventory-item-btn" data-id="${p.id}" title="Delete Product"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 11. Customer Management
window.renderCustomerManagement = function(isEditMode = false) {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  return `
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h2 style="font-weight:800;"><i class="fa-solid fa-users"></i> Customer Database</h2>
          <p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.4rem;">Manage customer contact, loyalty points, and purchase totals.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <button class="btn ${isEditMode ? 'btn-secondary' : 'btn-outline'}" id="toggle-customer-edit-mode">
            <i class="fa-solid ${isEditMode ? 'fa-check' : 'fa-pen-to-square'}"></i>
            <span>${isEditMode ? 'Exit Customer Edit' : 'Customer Edit Mode'}</span>
          </button>
          <button class="btn btn-primary" id="save-all-customer-btn" style="${isEditMode ? '' : 'display:none;'}">
            <i class="fa-solid fa-floppy-disk"></i> Save All Changes
          </button>
        </div>
      </div>
      <div class="card table-card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Purchases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${store.customers.map(c => `
                <tr data-cust-row="${c.id}">
                  <td>
                    ${isEditMode ? `<input type="text" class="form-input customer-edit-name" value="${c.name}">` : `<strong>${c.name}</strong>`}
                  </td>
                  <td>
                    ${isEditMode ? `<input type="tel" class="form-input customer-edit-mobile" value="${c.mobile}">` : c.mobile}
                  </td>
                  <td>${curr}${c.totalPurchases.toFixed(2)}</td>
                  <td style="text-align:center;display:flex;justify-content:center;gap:0.35rem;flex-wrap:wrap;">
                    ${isEditMode ? `
                      <button class="btn btn-primary btn-sm save-single-customer-btn" data-id="${c.id}"><i class="fa-solid fa-floppy-disk"></i> Save</button>
                      <button class="btn btn-danger btn-sm delete-customer-btn" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>
                    ` : `<span class="badge badge-primary">View Only</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 12. Supplier Management
window.renderSupplierManagement = function() {
  const store = window.store;
  return `
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h2 style="font-weight:800;"><i class="fa-solid fa-truck-field"></i> Suppliers Directory</h2>
          <p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.4rem;">Add, edit, and remove suppliers used for procurement and purchase records.</p>
        </div>
        <div>
          <button class="btn btn-primary" id="manage-suppliers-btn">
            <i class="fa-solid fa-pen-to-square"></i> Customize Suppliers
          </button>
        </div>
      </div>
      <div class="card table-card">
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Supplier</th><th>Company</th><th>Mobile</th><th>GSTIN</th></tr></thead>
            <tbody>
              ${store.suppliers.map(s => `<tr><td><strong>${s.name}</strong></td><td>${s.company || '-'}</td><td>${s.mobile || '-'}</td><td>${s.gstNo || '-'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 13. Bill History
window.renderBillHistory = function() {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  const lang = store.currentLang || 'en';
  const t = window.translations[lang] || window.translations.en;
  return `
    <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
        <h2 style="font-weight:800;"><i class="fa-solid fa-receipt"></i> ${t.billHistory}</h2>
        <button class="btn btn-danger" id="btn-clear-bill-history"><i class="fa-solid fa-trash"></i> ${t.clearAllHistory}</button>
      </div>
      <div class="table-container" style="margin-top:1rem;">
        <table class="table">
          <thead><tr><th>Invoice #</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${store.invoices.map(inv => {
              const status = inv.status || 'Completed';
              const statusClass = status === 'Fully Returned' ? 'badge-danger' : status === 'Partially Returned' ? 'badge-warning' : 'badge-success';
              return `<tr class="bill-history-row" data-invoice-id="${inv.id}" style="cursor:pointer;">
                <td><code>${inv.invoiceNo}</code></td>
                <td>${inv.date}</td>
                <td>${inv.customerName || 'Walk-in'}</td>
                <td><strong>${curr}${inv.grandTotal}</strong></td>
                <td><span class="badge ${statusClass}">${status}</span></td>
                <td style="display:flex; gap: 0.5rem;">
                  <button class="btn btn-primary btn-sm btn-view-invoice" data-invoice-id="${inv.id}" title="View Details"><i class="fa-solid fa-eye"></i> View</button>
                  <button class="btn btn-danger btn-sm btn-delete-invoice" data-invoice-id="${inv.id}" title="Delete this invoice"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// New Bill Detail Modal
window.renderBillDetailModal = function(invoice) {
  const store = window.store;
  const s = store.settings;
  const curr = s.currency || '₹';
  const totalItems = invoice.items.length;
  const totalQty = invoice.items.reduce((sum, item) => sum + item.qty, 0);
  const status = invoice.status || 'Completed';
  const statusClass = status === 'Fully Returned' ? 'badge-danger' : status === 'Partially Returned' ? 'badge-warning' : 'badge-success';

  return `
    <div class="modal-overlay" id="bill-detail-modal-overlay">
      <div class="modal-card" style="max-width: 900px;">
        <div class="modal-header" style="background: var(--primary); color: #fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-receipt"></i>
            <span>Bill Details - ${invoice.invoiceNo}</span>
          </div>
          <button class="btn-icon" id="close-bill-detail-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem 1.5rem; font-size: 0.85rem;">
              <div><strong>Customer:</strong> ${invoice.customerName}</div>
              <div><strong>Mobile:</strong> ${invoice.customerMobile || 'N/A'}</div>
              <div><strong>Cashier:</strong> ${invoice.cashierName}</div>
              <div><strong>Date:</strong> ${invoice.date} ${invoice.time}</div>
              <div><strong>Payment:</strong> ${invoice.paymentMethod}</div>
              <div><strong>Status:</strong> <span class="badge ${statusClass}">${status}</span></div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-outline btn-sm" id="btn-print-bill-detail"><i class="fa-solid fa-print"></i> Print</button>
              <button class="btn btn-primary btn-sm" id="btn-process-return"><i class="fa-solid fa-undo"></i> Return Items</button>
            </div>
          </div>

          <div class="card">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Barcode</th>
                    <th style="text-align:right;">Qty</th>
                    <th style="text-align:right;">Unit Price</th>
                    <th style="text-align:right;">Total</th>
                    <th style="text-align:center;">Returned Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td><strong>${item.name}</strong></td>
                      <td><code>${item.barcode}</code></td>
                      <td style="text-align:right;">${item.qty}</td>
                      <td style="text-align:right;">${curr}${item.rate.toFixed(2)}</td>
                      <td style="text-align:right;">${curr}${item.total.toFixed(2)}</td>
                      <td style="text-align:center;">
                        <span class="badge ${item.returnedQty > 0 ? 'badge-warning' : 'badge-secondary'}">${item.returnedQty || 0}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; margin-top: 1rem; gap: 1rem;">
            <div>
              <!-- Return History Section (placeholder) -->
              <div style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Return History</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">No returns processed for this bill yet.</div>
            </div>
            <div style="width: 280px; background: var(--bg-body); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem;">Bill Summary</div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                <div style="display:flex;justify-content:space-between;"><span>Subtotal:</span> <span>${curr}${invoice.subtotal.toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span>Discount:</span> <span>-${curr}${invoice.totalDiscount.toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span>GST:</span> <span>${curr}${invoice.totalGst.toFixed(2)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span>Round Off:</span> <span>${invoice.roundOff.toFixed(2)}</span></div>
                <hr style="border-color: var(--border); margin: 0.5rem 0;">
                <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.2rem;">
                  <span>Grand Total:</span>
                  <span style="color:var(--primary);">${curr}${invoice.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="bill-detail-close-btn">Close</button>
        </div>
      </div>
    </div>
  `;
};

// 14. Reports Component
window.renderReports = function() {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  const totalSales = store.invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalGst = store.invoices.reduce((acc, i) => acc + i.totalGst, 0);

  return `
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div class="card">
        <h2 style="font-weight:800;"><i class="fa-solid fa-chart-pie"></i> Store Financial Reports</h2>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="card"><h3>Total Revenue</h3><div style="font-size:1.8rem;font-weight:800;color:var(--primary);">${curr}${totalSales.toFixed(2)}</div></div>
        <div class="card"><h3>Total GST Collected</h3><div style="font-size:1.8rem;font-weight:800;color:var(--secondary);">${curr}${totalGst.toFixed(2)}</div></div>
      </div>
    </div>
  `;
};

// 15. User Management
window.renderUserManagement = function(isEditMode = false) {
  const store = window.store;
  const totalStaff = store.users.length;
  const presentCount = store.users.filter(u => u.attendanceStatus === 'Present').length;
  const absentCount = store.users.filter(u => u.attendanceStatus === 'Absent').length;

  return `
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h2 style="font-weight:800;"><i class="fa-solid fa-user-shield"></i> Staff Attendance & Roster</h2>
          <p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.4rem;">Manage staff accounts, assigned shift, and attendance status for today.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <button class="btn ${isEditMode ? 'btn-secondary' : 'btn-outline'}" id="toggle-user-edit-mode">
            <i class="fa-solid ${isEditMode ? 'fa-check' : 'fa-pen-to-square'}"></i>
            <span>${isEditMode ? 'Exit User Edit' : 'User Edit Mode'}</span>
          </button>
          <button class="btn btn-primary" id="save-all-user-btn" style="${isEditMode ? '' : 'display:none;'}">
            <i class="fa-solid fa-floppy-disk"></i> Save All Changes
          </button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:0.75rem;">
        <div class="card card-hover" style="padding:1rem;">
          <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">Total Staff</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary);">${totalStaff}</div>
        </div>
        <div class="card card-hover" style="padding:1rem;">
          <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">Present Today</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--success);">${presentCount}</div>
        </div>
        <div class="card card-hover" style="padding:1rem;">
          <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">Absent Today</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--danger);">${absentCount}</div>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Password/PIN</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Today</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${store.users.map(u => `
                <tr data-user-row="${u.id}">
                  <td>${isEditMode ? `<input type="text" class="form-input user-edit-username" value="${u.username}">` : `<strong>${u.username}</strong>`}</td>
                  <td>${isEditMode ? `<input type="text" class="form-input user-edit-name" value="${u.name}">` : u.name}</td>
                  <td>${isEditMode ? `<input type="password" class="form-input user-edit-pin" placeholder="New PIN" style="width:100px;">` : `****`}</td>
                  <td>${isEditMode ? `
                        <select class="form-select user-edit-role" style="width:120px;">
                          ${['Admin','Manager','Cashier'].map(role => `<option value="${role}" ${u.role === role ? 'selected' : ''}>${role}</option>`).join('')}
                        </select>` : `<span class="badge badge-primary">${u.role}</span>`}
                  </td>
                  <td>${isEditMode ? `
                        <select class="form-select user-edit-shift" style="width:120px;">
                          ${['Morning','Evening','Night'].map(shift => `<option value="${shift}" ${u.shift === shift ? 'selected' : ''}>${shift}</option>`).join('')}
                        </select>` : `<span class="badge badge-info">${u.shift || 'N/A'}</span>`}
                  </td>
                  <td style="text-align:center;">
                    ${isEditMode ? `
                      <select class="form-select user-edit-attendance" style="width:110px;">
                        <option value="Present" ${u.attendanceStatus === 'Present' ? 'selected' : ''}>Present</option>
                        <option value="Absent" ${u.attendanceStatus === 'Absent' ? 'selected' : ''}>Absent</option>
                      </select>
                    ` : `<span class="badge ${u.attendanceStatus === 'Present' ? 'badge-success' : 'badge-danger'}">${u.attendanceStatus}</span>`}
                  </td>
                  <td style="text-align:center;display:flex;justify-content:center;gap:0.35rem;flex-wrap:wrap;">
                    ${isEditMode ? `
                      <button class="btn btn-primary btn-sm save-single-user-btn" data-id="${u.id}"><i class="fa-solid fa-floppy-disk"></i> Save</button>
                      <button class="btn btn-danger btn-sm delete-user-btn" data-id="${u.id}"><i class="fa-solid fa-trash"></i></button>
                    ` : `<span class="badge badge-primary">Roster</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// My Profile Modal
window.renderMyProfileModal = function(user) {
  return `
    <div class="modal-overlay" id="profile-modal-overlay">
      <div class="modal-card" style="max-width: 500px;">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid fa-user-circle"></i>
            <span>My Profile</span>
          </div>
          <button class="btn-icon" id="close-profile-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form id="profile-form">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" class="form-input" value="${user.name}" disabled>
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <input type="text" class="form-input" value="${user.role}" disabled>
            </div>
            <hr style="margin: 1.5rem 0;">
            <h4 style="font-weight:700;margin-bottom:1rem;">Change PIN</h4>
            <div class="form-group">
              <label class="form-label">Current PIN</label>
              <input type="password" id="profile-current-pin" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">New PIN (min 4 digits)</label>
              <div style="position:relative;">
                <input type="password" id="profile-new-pin" class="form-input" required>
                <button type="button" id="toggle-new-pin-visibility" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--text-muted);cursor:pointer;">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New PIN</label>
              <input type="password" id="profile-confirm-pin" class="form-input" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('profile-modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" form="profile-form" type="submit">
            <i class="fa-solid fa-floppy-disk"></i> Update PIN
          </button>
        </div>
      </div>
    </div>
  `;
};

// 16. Settings Component
window.renderSettings = function() {
  const store = window.store;
  const s = store.settings;
  const lang = store.currentLang || 'en';
  const quickTabs = Array.isArray(s.quickAccessTabs) && s.quickAccessTabs.length > 0
    ? s.quickAccessTabs
    : window.initialStoreSettings.quickAccessTabs || [];

  // A mock invoice for the live preview
  const mockInvoice = {
    invoiceNo: "PREVIEW-1001",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    cashierName: store.currentUser ? store.currentUser.name : 'Admin',
    customerName: 'Sample Customer',
    items: [
      { name: "Sample Product 1 (Rice)", barcode: "8900000000001", qty: 2, unit: "Kg", rate: 60, total: 120 },
      { name: "Sample Product 2 (Oil)", barcode: "8900000000002", qty: 1, unit: "Ltr", rate: 150, total: 150 },
    ],
    subtotal: 270,
    totalGst: 13.5,
    grandTotal: 284,
  };

  return `
    <div class="settings-grid">
      <div class="card">
        <h2 style="font-weight:800;"><i class="fa-solid fa-gear"></i> Store Settings</h2>
        <form id="settings-form" style="margin-top:1rem;">
          
          <!-- Bill Printing Section -->
          <div style="padding: 0.75rem 1rem; background: var(--primary-light); border-left: 4px solid var(--primary); margin-bottom: 1.25rem; border-radius: var(--radius-md);">
            <div style="font-weight: 700; font-size: 1.05rem;">Bill Printing Settings</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Customize the text and layout for printed customer receipts.</p>
          </div>
          <div class="form-group"><label class="form-label">Store Name</label><input type="text" id="set-store-name" class="form-input live-preview-input" value="${s.storeName}"></div>
          <div class="form-group"><label class="form-label">Store Tagline / Header</label><input type="text" id="set-store-tagline" class="form-input live-preview-input" value="${s.tagLine || ''}"></div>
          <div class="form-group"><label class="form-label">Address</label><input type="text" id="set-store-address" class="form-input live-preview-input" value="${s.address}"></div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group"><label class="form-label">Phone Number</label><input type="text" id="set-store-phone" class="form-input live-preview-input" value="${s.phone || ''}"></div>
            <div class="form-group"><label class="form-label">GSTIN</label><input type="text" id="set-store-gst" class="form-input live-preview-input" value="${s.gstNo || ''}"></div>
          </div>
          <div class="form-group"><label class="form-label">Receipt Footer Text (Thank you, T&C, etc.)</label><textarea id="set-receipt-footer" class="form-input live-preview-input" rows="4">${s.receiptFooter || ''}</textarea></div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Paper Size</label>
              <select id="set-paper-size" class="form-select live-preview-input">
                <option value="80mm" ${s.paperSize === '80mm' ? 'selected' : ''}>80mm Thermal</option>
                <option value="58mm" ${s.paperSize === '58mm' ? 'selected' : ''}>58mm Thermal</option>
                <option value="A4" ${s.paperSize === 'A4' ? 'selected' : ''}>A4 Printer</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">UPI ID (for QR Code)</label><input type="text" id="set-store-upi" class="form-input" value="${s.upiId || ''}"></div>
          </div>
          <hr style="margin: 1.5rem 0;">

          <!-- Other Settings -->
          <div class="form-group">
            <label class="form-label">Dashboard Reset PIN (Optional)</label>
            <div style="position:relative;">
              <input type="password" id="set-dashboard-reset-pin" class="form-input" value="${s.dashboardResetPin || ''}" placeholder="Leave blank to use user PIN">
              <button type="button" id="toggle-dashboard-pin-visibility" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--text-muted);cursor:pointer;">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
            <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;">Set a specific PIN to reset the dashboard. If left blank, the current user's login PIN will be used.</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-top:1.5rem;">
            <button type="button" class="btn btn-outline" id="btn-reset-bill-settings"><i class="fa-solid fa-arrow-rotate-left"></i> Reset to Default</button>
            <button type="submit" class="btn btn-primary btn-lg"><i class="fa-solid fa-floppy-disk"></i> Save All Settings</button>
          </div>
        </form>
      </div>

      <div class="card">
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem;">Live Bill Preview</div>
        <div id="settings-receipt-preview-container" style="background:#f1f5f9;padding:1rem;border-radius:var(--radius-md);">
          ${window.renderReceiptModal(mockInvoice, s, false, true)}
        </div>
        <button class="btn btn-secondary" id="btn-print-test-bill" style="width:100%; margin-top:1rem;">
          <i class="fa-solid fa-print"></i> Print Test Bill
        </button>
      </div>
    </div>
  `;
};

window.renderAddEditProductModal = function(product = null) {
  const isEdit = !!product;
  return `
    <div class="modal-overlay" id="product-modal-overlay">
      <div class="modal-card" style="max-width:600px;">
        <div class="modal-header" style="background:var(--primary);color:#fff;">
          <div class="modal-title" style="color:#fff;">${isEdit ? 'Edit Product' : 'Add New Product'}</div>
          <button class="btn-icon" id="close-prod-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form id="product-form">
            <input type="hidden" id="prod-id" value="${product ? product.id : ''}">
            <div class="form-group"><label class="form-label">Barcode</label><input type="text" id="prod-barcode" class="form-input" required value="${product ? product.barcode : `890${Date.now().toString().slice(-10)}`}"></div>
            <div class="form-group"><label class="form-label">Product Name</label><input type="text" id="prod-name" class="form-input" required value="${product ? product.name : ''}"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
              <div class="form-group"><label class="form-label">Purchase Price</label><input type="number" step="any" id="prod-purchase-price" class="form-input" required value="${product ? product.purchasePrice : ''}"></div>
              <div class="form-group"><label class="form-label">Selling Price</label><input type="number" step="any" id="prod-selling-price" class="form-input" required value="${product ? product.sellingPrice : ''}"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
              <div class="form-group"><label class="form-label">Category</label>
                <select id="prod-category" class="form-select" required>
                  ${store.categories.map(cat => `<option value="${cat.name}" ${product && product.category === cat.name ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Unit</label>
                <select id="prod-unit" class="form-select" required>
                  ${['Kg','g','ml','l','grams','Packet','Bottle','Piece'].map(unit => `<option value="${unit}" ${product && product.unit === unit ? 'selected' : ''}>${unit}</option>`).join('')}
                </select>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
              <div class="form-group"><label class="form-label">Stock Qty</label><input type="number" step="any" id="prod-stock-qty" class="form-input" required value="${product ? product.stockQty : 0}"></div>
              <div class="form-group"><label class="form-label">Min Stock Alert</label><input type="number" step="any" id="prod-min-stock-alert" class="form-input" required value="${product ? product.minStockAlert : 10}"></div>
            </div>
            <div class="modal-footer"><button type="submit" class="btn btn-primary">Save Product</button></div>
          </form>
        </div>
      </div>
    </div>
  `;
};

window.renderAddCustomerModal = function(customer = null) {
  return `
    <div class="modal-overlay" id="customer-modal-overlay">
      <div class="modal-card" style="max-width:500px;">
        <div class="modal-header" style="background:var(--primary);color:#fff;">
          <div class="modal-title" style="color:#fff;">Add Customer</div>
          <button class="btn-icon" id="close-cust-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <form id="customer-form">
            <input type="hidden" id="cust-id" value="">
            <div class="form-group"><label class="form-label">Customer Name</label><input type="text" id="cust-name" class="form-input" required></div>
            <div class="form-group"><label class="form-label">Mobile</label><input type="tel" id="cust-mobile" class="form-input" required></div>
            <div class="modal-footer"><button type="submit" class="btn btn-primary">Save Customer</button></div>
          </form>
        </div>
      </div>
    </div>
  `;
};

// Generic Confirmation Modal
window.renderConfirmationModal = function(options) {
  const {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    icon = 'fa-triangle-exclamation',
    confirmButtonClass = 'btn-danger'
  } = options;

  return `
    <div class="modal-overlay" id="confirmation-modal-overlay">
      <div class="modal-card" style="max-width: 480px;">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid ${icon}" style="color: var(--danger);"></i>
            <span>${title}</span>
          </div>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
            ${message}
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="confirmation-cancel-btn">${cancelText}</button>
          <button class="btn ${confirmButtonClass}" id="confirmation-confirm-btn">${confirmText}</button>
        </div>
      </div>
    </div>
  `;
};
