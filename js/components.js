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
    { id: 'price-list', label: t.priceList, icon: 'fa-tags', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'products', label: t.products, icon: 'fa-boxes-stacked', badge: lowStockCount > 0 ? `${lowStockCount}` : null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'inventory', label: t.inventory, icon: 'fa-warehouse', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'customers', label: t.customers, icon: 'fa-users', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'suppliers', label: t.suppliers, icon: 'fa-truck-field', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'bills', label: t.billHistory, icon: 'fa-receipt', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'reports', label: t.reports, icon: 'fa-file-invoice-dollar', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'users', label: t.userManagement, icon: 'fa-user-shield', badge: null, roles: ['Admin'] },
    { id: 'settings', label: t.settings, icon: 'fa-gear', badge: null, roles: ['Admin'] },
  ];

  return `
    <aside class="sidebar">
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
        <div class="user-profile-badge">
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

  return `
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="page-title">${pageTitle}</h1>
      </div>

      <div class="topbar-right">
        <div class="scanner-status-indicator" title="USB Barcode Scanner Ready">
          <span class="pulse-dot"></span>
          <i class="fa-solid fa-barcode"></i>
          <span>Scanner Ready</span>
        </div>

        <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;display:flex;flex-direction:column;align-items:flex-end;line-height:1.2;">
          <span style="color:var(--text-main);">${timeStr}</span>
          <span>${dateStr}</span>
        </div>

        <button class="lang-toggle-btn" id="toggle-lang-btn" title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ">
          <i class="fa-solid fa-language" style="color:var(--secondary);"></i>
          <span>${lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
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
              <div style="position:relative;">
                <input type="password" class="form-input" id="login-pin-input" value="1234" required placeholder="Enter PIN or password">
                <button type="button" id="toggle-pin-visibility" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--text-muted);cursor:pointer;">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-space-between;margin-bottom:1.25rem;font-size:0.82rem;">
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

  return `
    <div class="pos-container">
      <div class="pos-left-panel">
        <div class="pos-search-bar">
          <i class="fa-solid fa-magnifying-glass pos-search-icon"></i>
          <input type="text" id="pos-product-search" class="pos-search-input" placeholder="${t.searchPlaceholder}" value="${searchQuery}" autocomplete="off" autofocus>
        </div>

        <div style="display:flex;gap:0.4rem;overflow-x:auto;padding-bottom:0.25rem;">
          <button class="btn btn-sm ${!activeCategoryFilter ? 'btn-primary' : 'btn-outline'} pos-cat-btn" data-cat="">
            ${t.allCategories}
          </button>
          ${store.categories.map(cat => `
            <button class="btn btn-sm ${activeCategoryFilter === cat.name ? 'btn-primary' : 'btn-outline'} pos-cat-btn" data-cat="${cat.name}">
              ${lang === 'kn' ? cat.nameKannada : cat.name}
            </button>
          `).join('')}
        </div>

        <div class="pos-product-grid">
          ${filteredProducts.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted);">
              <i class="fa-solid fa-box-open" style="font-size:2.5rem;margin-bottom:0.5rem;"></i>
              <div>No products found matching search query.</div>
            </div>
          ` : filteredProducts.map(p => `
            <div class="pos-product-card" data-product-id="${p.id}">
              <span class="badge ${p.stockQty <= p.minStockAlert ? 'badge-danger' : 'badge-success'} product-card-badge">
                ${p.stockQty} ${p.unit}
              </span>
              <div>
                <div class="product-card-name">${p.name}</div>
                <div class="product-card-kannada">${p.nameKannada || ''}</div>
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

        <div class="shortcut-pill-bar">
          <div><span class="shortcut-key">F1</span> New</div>
          <div><span class="shortcut-key">F2</span> Search Focus</div>
          <div><span class="shortcut-key">F4</span> Customer</div>
          <div><span class="shortcut-key">F8</span> Pay & Print</div>
          <div><span class="shortcut-key">F10</span> Hold Draft</div>
        </div>
      </div>

      <div class="pos-cart-panel">
        <div class="cart-header">
          <div style="font-weight:700;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <i class="fa-solid fa-cart-shopping" style="color:var(--primary);"></i>
            <span>Active Cart (${cartState.items.length})</span>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button class="btn btn-outline btn-sm" id="btn-hold-draft">
              <i class="fa-solid fa-pause"></i> Drafts (${store.drafts.length})
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
                <div style="font-size:0.72rem;color:var(--text-muted);">
                  Mob: ${selectedCustomer.mobile} | Pts: <strong style="color:var(--secondary);">${selectedCustomer.loyaltyPoints}</strong>
                </div>
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
            </div>
          ` : cartState.items.map((item, idx) => `
            <div class="cart-item-row">
              <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-sub">${curr}${item.rate} / ${item.unit} | GST: ${item.gstRate}%</div>
              </div>

              <div class="qty-control-group">
                <button class="qty-btn btn-cart-minus" data-index="${idx}">-</button>
                <input type="number" step="any" class="qty-input cart-qty-input" data-index="${idx}" value="${item.qty}">
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
          `).join('')}
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
              <input type="number" step="any" id="cash-amount-received" class="form-input" value="${Math.ceil(grandTotal)}" style="font-size:1.25rem;font-weight:700;color:var(--primary);" autofocus>
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
window.renderReceiptModal = function(invoice) {
  const store = window.store;
  const s = store.settings;
  const curr = s.currency || '₹';
  const cgst = (invoice.totalGst / 2).toFixed(2);
  const sgst = (invoice.totalGst / 2).toFixed(2);

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
          <div id="printable-receipt" class="thermal-receipt">
            <div class="thermal-header">
              <div class="thermal-title">${s.storeName}</div>
              <div>${s.tagLine || ''}</div>
              <div>${s.address}</div>
              <div>Ph: ${s.phone} | GSTIN: ${s.gstNo}</div>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
              <span>Bill No: <strong>${invoice.invoiceNo}</strong></span>
              <span>Date: ${invoice.date} ${invoice.time}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;">
              <span>Cashier: ${invoice.cashierName}</span>
              <span>Customer: ${invoice.customerName || 'Walk-in'}</span>
            </div>

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
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" id="btn-print-receipt-trigger">
            <i class="fa-solid fa-print"></i> Print Receipt
          </button>
        </div>
      </div>
    </div>
  `;
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
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Today's Sales</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary);margin-top:0.2rem;">${curr}${todaysSales.toFixed(2)}</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Total Revenue</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--secondary);margin-top:0.2rem;">${curr}${totalRevenue.toFixed(2)}</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Products in Stock</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--text-main);margin-top:0.2rem;">${store.products.length} Items</div>
        </div>
        <div class="card card-hover">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Low Stock Alerts</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--danger);margin-top:0.2rem;">${lowStockCount} Items</div>
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

// 8. Price List Component
window.renderPriceList = function(selectedCat = '', searchQ = '', sortOrder = 'name-asc') {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  let products = store.searchProducts(searchQ, selectedCat);

  if (sortOrder === 'price-asc') products.sort((a, b) => a.sellingPrice - b.sellingPrice);
  else if (sortOrder === 'price-desc') products.sort((a, b) => b.sellingPrice - a.sellingPrice);
  else products.sort((a, b) => a.name.localeCompare(b.name));

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;">
        <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-tags"></i> Store Price List</h2>
        <button class="btn btn-primary" id="print-price-list-btn"><i class="fa-solid fa-print"></i> Print Price Sheet</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Barcode</th><th>Product Name</th><th>Brand</th><th>Category</th><th>Selling Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><code>${p.barcode}</code></td>
                  <td><strong>${p.name}</strong> (${p.nameKannada || ''})</td>
                  <td>${p.brand}</td>
                  <td>${p.category}</td>
                  <td><strong style="color:var(--primary);">${curr}${p.sellingPrice}</strong> / ${p.unit}</td>
                  <td><span class="badge badge-success">${p.stockQty} ${p.unit}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// 9. Product Management Component
window.renderProductManagement = function(searchQuery = '', catFilter = '') {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  const products = store.searchProducts(searchQuery, catFilter);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;">
        <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-boxes-stacked"></i> Products & Inventory</h2>
        <button class="btn btn-primary" id="btn-add-new-product"><i class="fa-solid fa-plus"></i> Add Product</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr><th>Barcode</th><th>Name</th><th>Brand</th><th>Purchase</th><th>Selling</th><th>GST</th><th>Stock</th></tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><code>${p.barcode}</code></td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.brand}</td>
                  <td>${curr}${p.purchasePrice}</td>
                  <td><strong style="color:var(--primary);">${curr}${p.sellingPrice}</strong></td>
                  <td>${p.gstRate}%</td>
                  <td><span class="badge badge-success">${p.stockQty}</span></td>
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
window.renderInventoryManagement = function() {
  const store = window.store;
  const lowStock = store.products.filter(p => p.stockQty <= p.minStockAlert);
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-warehouse"></i> Inventory Control</h2>
      <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;">Low stock items requiring re-order:</p>
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Product</th><th>Current Stock</th><th>Min Threshold</th></tr></thead>
          <tbody>
            ${lowStock.map(p => `<tr><td><strong>${p.name}</strong></td><td><span class="badge badge-danger">${p.stockQty} ${p.unit}</span></td><td>${p.minStockAlert}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// 11. Customer Management
window.renderCustomerManagement = function() {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-users"></i> Customer Database</h2>
      <div class="table-container" style="margin-top:1rem;">
        <table class="table">
          <thead><tr><th>Name</th><th>Mobile</th><th>Loyalty Points</th><th>Purchases</th></tr></thead>
          <tbody>
            ${store.customers.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.mobile}</td><td><span class="badge badge-warning">${c.loyaltyPoints} Pts</span></td><td>${curr}${c.totalPurchases}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// 12. Supplier Management
window.renderSupplierManagement = function() {
  const store = window.store;
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-truck-field"></i> Suppliers Directory</h2>
      <div class="table-container" style="margin-top:1rem;">
        <table class="table">
          <thead><tr><th>Supplier</th><th>Company</th><th>Mobile</th><th>GSTIN</th></tr></thead>
          <tbody>
            ${store.suppliers.map(s => `<tr><td><strong>${s.name}</strong></td><td>${s.company}</td><td>${s.mobile}</td><td>${s.gstNo}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// 13. Bill History
window.renderBillHistory = function() {
  const store = window.store;
  const curr = store.settings.currency || '₹';
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-receipt"></i> Invoice History</h2>
      <div class="table-container" style="margin-top:1rem;">
        <table class="table">
          <thead><tr><th>Invoice #</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            ${store.invoices.map(inv => `<tr><td><code>${inv.invoiceNo}</code></td><td>${inv.date}</td><td>${inv.customerName || 'Walk-in'}</td><td><strong>${curr}${inv.grandTotal}</strong></td><td><span class="badge badge-success">${inv.status}</span></td></tr>`).join('')}
          </tbody>
        </table>
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
window.renderUserManagement = function() {
  const store = window.store;
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-user-shield"></i> Staff Accounts</h2>
      <div class="table-container" style="margin-top:1rem;">
        <table class="table">
          <thead><tr><th>Username</th><th>Name</th><th>Role</th></tr></thead>
          <tbody>
            ${store.users.map(u => `<tr><td><strong>${u.username}</strong></td><td>${u.name}</td><td><span class="badge badge-primary">${u.role}</span></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// 16. Settings Component
window.renderSettings = function() {
  const store = window.store;
  const s = store.settings;
  return `
    <div class="card">
      <h2 style="font-weight:800;"><i class="fa-solid fa-gear"></i> Store Settings</h2>
      <form id="settings-form" style="margin-top:1rem;">
        <div class="form-group"><label class="form-label">Store Name</label><input type="text" id="set-store-name" class="form-input" value="${s.storeName}"></div>
        <div class="form-group"><label class="form-label">Address</label><input type="text" id="set-store-address" class="form-input" value="${s.address}"></div>
        <button type="submit" class="btn btn-primary">Save Settings</button>
      </form>
    </div>
  `;
};

window.renderAddEditProductModal = function(product = null) {
  const store = window.store;
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
            <div class="form-group"><label class="form-label">Name (Kannada)</label><input type="text" id="prod-name-kannada" class="form-input" value="${product ? product.nameKannada || '' : ''}"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
              <div class="form-group"><label class="form-label">Purchase Price</label><input type="number" step="any" id="prod-purchase-price" class="form-input" required value="${product ? product.purchasePrice : ''}"></div>
              <div class="form-group"><label class="form-label">Selling Price</label><input type="number" step="any" id="prod-selling-price" class="form-input" required value="${product ? product.sellingPrice : ''}"></div>
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
