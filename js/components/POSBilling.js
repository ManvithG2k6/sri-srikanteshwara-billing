// POS Billing Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderPOSBilling(cartState, activeCategoryFilter = '', searchQuery = '') {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  // Filter products for quick selection grid
  const filteredProducts = store.searchProducts(searchQuery, activeCategoryFilter);

  // Cart summary calculations
  const subtotal = cartState.items.reduce((acc, item) => acc + (item.rate * item.qty - item.discount), 0);
  
  // Tax breakdown (GST calculated per item rate & rate category)
  let totalGst = 0;
  cartState.items.forEach(item => {
    const itemTotal = (item.rate * item.qty - item.discount);
    if (item.gstRate > 0) {
      // Tax calculation
      const gstAmt = (itemTotal * item.gstRate) / 100;
      totalGst += gstAmt;
    }
  });

  const billDiscount = cartState.billDiscount || 0;
  const rawTotal = Math.max(0, subtotal + totalGst - billDiscount);
  const roundedTotal = cartState.enableRoundOff ? Math.round(rawTotal) : rawTotal;
  const roundOffDiff = (roundedTotal - rawTotal).toFixed(2);

  // Selected customer details
  const selectedCustomer = store.customers.find(c => c.id === cartState.customerId);

  return `
    <div class="pos-container">
      <!-- POS Left Panel: Product Search & Quick Grid -->
      <div class="pos-left-panel">
        <!-- Search Bar with Live Auto-complete -->
        <div class="pos-search-bar">
          <i class="fa-solid fa-magnifying-glass pos-search-icon"></i>
          <input type="text" 
                 id="pos-product-search" 
                 class="pos-search-input" 
                 placeholder="${t.searchPlaceholder}" 
                 value="${searchQuery}" 
                 autocomplete="off"
                 autofocus>
        </div>

        <!-- Category Pills Bar -->
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

        <!-- Product Grid -->
        <div class="pos-product-grid">
          ${filteredProducts.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted);">
              <i class="fa-solid fa-box-open" style="font-size:2.5rem;margin-bottom:0.5rem;"></i>
              <div>No products found matching your search query.</div>
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

        <!-- Keyboard Shortcuts Bar -->
        <div class="shortcut-pill-bar">
          <div><span class="shortcut-key">F1</span> New</div>
          <div><span class="shortcut-key">F2</span> Search Focus</div>
          <div><span class="shortcut-key">F4</span> Customer</div>
          <div><span class="shortcut-key">F8</span> Pay & Print</div>
          <div><span class="shortcut-key">F10</span> Hold Draft</div>
        </div>
      </div>

      <!-- POS Right Panel: Active Cart & Total -->
      <div class="pos-cart-panel">
        <div class="cart-header">
          <div style="font-weight:700;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <i class="fa-solid fa-cart-shopping" style="color:var(--primary);"></i>
            <span>Active Cart (${cartState.items.length})</span>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button class="btn btn-outline btn-sm" id="btn-hold-draft" title="Hold Bill (F10)">
              <i class="fa-solid fa-pause"></i> Drafts (${store.drafts.length})
            </button>
            <button class="btn btn-outline btn-sm" id="btn-clear-cart" title="Clear Cart">
              <i class="fa-solid fa-trash-can" style="color:var(--danger);"></i>
            </button>
          </div>
        </div>

        <!-- Customer Selection Bar -->
        <div class="cart-customer-bar">
          <div style="display:flex;align-items:center;gap:0.5rem;overflow:hidden;">
            <i class="fa-solid fa-user-tag" style="color:var(--primary);"></i>
            <div style="overflow:hidden;">
              <div style="font-weight:700;font-size:0.85rem;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                ${selectedCustomer ? selectedCustomer.name : t.walkInCustomer}
              </div>
              ${selectedCustomer ? `
                <div style="font-size:0.72rem;color:var(--text-muted);">
                  Mob: ${selectedCustomer.mobile} | Pts: <strong style="color:var(--secondary);">${selectedCustomer.loyaltyPoints}</strong>
                  ${selectedCustomer.outstandingBalance > 0 ? `| Bal: <strong style="color:var(--danger);">${curr}${selectedCustomer.outstandingBalance}</strong>` : ''}
                </div>
              ` : ''}
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-select-customer">
            <i class="fa-solid fa-user-plus"></i> Select
          </button>
        </div>

        <!-- Cart Items List -->
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
                <div class="cart-item-sub">
                  ${curr}${item.rate} / ${item.unit} | GST: ${item.gstRate}%
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="qty-control-group">
                <button class="qty-btn btn-cart-minus" data-index="${idx}">-</button>
                <input type="number" step="any" class="qty-input cart-qty-input" data-index="${idx}" value="${item.qty}">
                <button class="qty-btn btn-cart-plus" data-index="${idx}">+</button>
              </div>

              <!-- Total & Delete -->
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

        <!-- Summary & Totals -->
        <div class="cart-summary-box">
          <div class="summary-line">
            <span>${t.subtotal}</span>
            <span>${curr}${subtotal.toFixed(2)}</span>
          </div>

          <div class="summary-line">
            <span>${t.gstTax}</span>
            <span>${curr}${totalGst.toFixed(2)}</span>
          </div>

          <div class="summary-line" style="display:flex;align-items:center;justify-content:space-between;">
            <span>${t.billDiscount}</span>
            <input type="number" id="cart-bill-discount-input" value="${billDiscount}" style="width:70px;padding:0.15rem 0.4rem;text-align:right;border:1px solid var(--border);border-radius:4px;">
          </div>

          <div class="summary-line">
            <span>${t.roundOff}</span>
            <span>${roundOffDiff > 0 ? `+${roundOffDiff}` : roundOffDiff}</span>
          </div>

          <div class="summary-line grand-total">
            <span>${t.grandTotal}</span>
            <span>${curr}${roundedTotal.toFixed(2)}</span>
          </div>
        </div>

        <!-- POS Checkout Action Buttons -->
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
}
