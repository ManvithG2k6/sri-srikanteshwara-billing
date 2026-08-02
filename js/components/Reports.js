// Reports & Analytics Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderReports() {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const totalSales = store.invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalGst = store.invoices.reduce((acc, i) => acc + i.totalGst, 0);
  
  // Calculate approximate Gross Profit (Selling Price - Purchase Price)
  let totalCost = 0;
  store.invoices.forEach(inv => {
    inv.items.forEach(item => {
      const prod = store.products.find(p => p.id === item.productId);
      if (prod) {
        totalCost += (prod.purchasePrice * item.qty);
      }
    });
  });
  const grossProfit = Math.max(0, totalSales - totalCost - totalGst);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-chart-pie" style="color:var(--primary);"></i> Store Reports & GST Summary</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Generate financial audit logs, tax reports (CGST/SGST), and profit margins.</p>
        </div>

        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-outline" id="btn-export-reports-excel">
            <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> Export Excel Report
          </button>
        </div>
      </div>

      <!-- Financial Metrics Bar -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
        <div class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Total Sales Revenue</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary);margin-top:0.2rem;">${curr}${totalSales.toFixed(2)}</div>
        </div>

        <div class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Total GST Tax Collected</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--secondary);margin-top:0.2rem;">${curr}${totalGst.toFixed(2)}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);">CGST: ${curr}${(totalGst/2).toFixed(2)} | SGST: ${curr}${(totalGst/2).toFixed(2)}</div>
        </div>

        <div class="card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Estimated Gross Profit</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--success);margin-top:0.2rem;">${curr}${grossProfit.toFixed(2)}</div>
        </div>
      </div>

      <!-- Reports Detail Tabs & Tables -->
      <div class="card">
        <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">
          <i class="fa-solid fa-table-list" style="color:var(--primary);"></i> GST Sales Summary Report
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Taxable Value</th>
                <th>CGST Amount</th>
                <th>SGST Amount</th>
                <th>Total Tax</th>
                <th>Invoice Amount</th>
              </tr>
            </thead>
            <tbody>
              ${store.invoices.map(inv => {
                const taxVal = inv.grandTotal - inv.totalGst;
                const halfGst = (inv.totalGst / 2).toFixed(2);
                return `
                  <tr>
                    <td><strong>${inv.invoiceNo}</strong></td>
                    <td>${inv.date}</td>
                    <td>${curr}${taxVal.toFixed(2)}</td>
                    <td>${curr}${halfGst}</td>
                    <td>${curr}${halfGst}</td>
                    <td><strong style="color:var(--secondary);">${curr}${inv.totalGst.toFixed(2)}</strong></td>
                    <td><strong style="color:var(--primary);">${curr}${inv.grandTotal.toFixed(2)}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
