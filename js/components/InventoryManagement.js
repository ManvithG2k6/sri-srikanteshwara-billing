// Inventory Management Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderInventoryManagement() {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const lowStockProducts = store.products.filter(p => p.stockQty <= p.minStockAlert);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <!-- Header -->
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-warehouse" style="color:var(--secondary);"></i> Inventory & Stock Control</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Manage stock in/out, low stock notifications, purchase entries, and supplier re-orders.</p>
        </div>

        <button class="btn btn-primary" id="btn-open-stock-in-modal">
          <i class="fa-solid fa-boxes-packing"></i> Stock In / Purchase Entry
        </button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
        <!-- Low Stock Alerts Panel -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;">
            <span style="color:var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock Alerts (${lowStockProducts.length})</span>
            <span class="badge badge-danger">Action Needed</span>
          </div>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Min Alert Threshold</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${lowStockProducts.length === 0 ? `
                  <tr><td colspan="4" style="text-align:center;padding:1.5rem;color:var(--success);">All products are sufficiently stocked!</td></tr>
                ` : lowStockProducts.map(p => `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${p.name}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${p.barcode}</div>
                    </td>
                    <td><strong style="color:var(--danger);">${p.stockQty} ${p.unit}</strong></td>
                    <td>${p.minStockAlert} ${p.unit}</td>
                    <td>
                      <button class="btn btn-primary btn-sm quick-stock-add-btn" data-id="${p.id}">
                        <i class="fa-solid fa-plus"></i> Refill +50
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Supplier Purchase Orders & Stock In History -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">
            <i class="fa-solid fa-truck-ramp-box" style="color:var(--primary);"></i> Active Suppliers Overview
          </div>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Contact</th>
                  <th>Total Purchases</th>
                  <th>Pending Payables</th>
                </tr>
              </thead>
              <tbody>
                ${store.suppliers.map(sup => `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${sup.name}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">${sup.company}</div>
                    </td>
                    <td>${sup.mobile}</td>
                    <td>${curr}${sup.totalPurchases.toLocaleString()}</td>
                    <td>
                      <strong style="color:${sup.pendingAmount > 0 ? 'var(--danger)' : 'var(--success)'};">
                        ${curr}${sup.pendingAmount.toLocaleString()}
                      </strong>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
