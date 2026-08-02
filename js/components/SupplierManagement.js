// Supplier Management Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderSupplierManagement() {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-truck-field" style="color:var(--secondary);"></i> Supplier Directory</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Manage oil mills, rice distributors, grocery wholesalers, and pending payables.</p>
        </div>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Company Name</th>
                <th>Mobile & Email</th>
                <th>Address & GSTIN</th>
                <th>Total Purchases</th>
                <th>Pending Amount</th>
              </tr>
            </thead>
            <tbody>
              ${store.suppliers.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.company}</td>
                  <td>
                    <div>${s.mobile}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${s.email}</div>
                  </td>
                  <td>
                    <div>${s.address}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">GST: ${s.gstNo}</div>
                  </td>
                  <td>${curr}${s.totalPurchases.toLocaleString()}</td>
                  <td>
                    <strong style="color:${s.pendingAmount > 0 ? 'var(--danger)' : 'var(--success)'};">
                      ${curr}${s.pendingAmount.toLocaleString()}
                    </strong>
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
