// Bill History Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderBillHistory(searchQ = '') {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const invoices = store.invoices.filter(inv => 
    inv.invoiceNo.toLowerCase().includes(searchQ.toLowerCase()) ||
    (inv.customerName && inv.customerName.toLowerCase().includes(searchQ.toLowerCase())) ||
    (inv.customerMobile && inv.customerMobile.includes(searchQ))
  );

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-receipt" style="color:var(--primary);"></i> Invoice History & Returns</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Lookup past store invoices, reprint thermal receipts, cancel bills, and restock returned grocery items.</p>
        </div>
      </div>

      <div class="card">
        <div style="margin-bottom:1rem;">
          <input type="text" id="bill-history-search-input" class="form-input" placeholder="Search by Invoice #, Customer Name or Mobile..." value="${searchQ}">
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date & Time</th>
                <th>Cashier</th>
                <th>Customer Name</th>
                <th>Items Count</th>
                <th>Grand Total</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.length === 0 ? `
                <tr><td colspan="9" style="text-align:center;padding:2rem;">No invoices match your search.</td></tr>
              ` : invoices.map(inv => `
                <tr>
                  <td><code style="font-weight:700;color:var(--primary);">${inv.invoiceNo}</code></td>
                  <td>${inv.date} ${inv.time}</td>
                  <td>${inv.cashierName}</td>
                  <td>${inv.customerName || 'Walk-in'}</td>
                  <td>${inv.items.length} items</td>
                  <td><strong style="color:var(--primary);">${curr}${inv.grandTotal.toFixed(2)}</strong></td>
                  <td><span class="badge badge-info">${inv.paymentMethod}</span></td>
                  <td><span class="badge ${inv.status === 'Completed' ? 'badge-success' : 'badge-danger'}">${inv.status}</span></td>
                  <td style="text-align:right;">
                    <button class="btn btn-outline btn-sm btn-reprint-bill" data-id="${inv.id}">
                      <i class="fa-solid fa-print"></i> Reprint
                    </button>
                    ${inv.status === 'Completed' ? `
                      <button class="btn btn-danger btn-sm btn-cancel-bill" data-id="${inv.id}">
                        <i class="fa-solid fa-ban"></i> Return
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
