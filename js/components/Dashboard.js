// Dashboard Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderDashboard(onNavigate) {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = store.invoices.filter(i => i.date === todayStr);
  const todaysSales = todayInvoices.reduce((acc, i) => acc + i.grandTotal, 0);

  const totalRevenue = store.invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const lowStockCount = store.products.filter(p => p.stockQty <= p.minStockAlert).length;
  const recentInvoices = store.invoices.slice(0, 5);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <!-- Quick Action Header -->
      <div class="card" style="background: linear-gradient(135deg, var(--bg-card), var(--primary-light));">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h2 style="font-size:1.3rem;font-weight:800;color:var(--text-main);">${t.storeName} Dashboard</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);">Real-time POS activity, sales metrics, and inventory health.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" id="dash-new-bill"><i class="fa-solid fa-plus"></i> ${t.newBill}</button>
            <button class="btn btn-secondary" id="dash-add-product"><i class="fa-solid fa-box-archive"></i> ${t.addProduct}</button>
            <button class="btn btn-outline" id="dash-add-customer"><i class="fa-solid fa-user-plus"></i> ${t.addCustomer}</button>
          </div>
        </div>
      </div>

      <!-- Key Metrics Row -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
        <div class="card card-hover">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t.todaysSales}</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--primary);margin-top:0.2rem;">${curr}${todaysSales.toFixed(2)}</div>
              <div style="font-size:0.75rem;color:var(--success);font-weight:600;"><i class="fa-solid fa-arrow-trend-up"></i> ${todayInvoices.length} Bills Today</div>
            </div>
            <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
              <i class="fa-solid fa-receipt"></i>
            </div>
          </div>
        </div>

        <div class="card card-hover">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t.totalRevenue}</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--secondary);margin-top:0.2rem;">${curr}${totalRevenue.toFixed(2)}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${store.invoices.length} Lifetime Invoices</div>
            </div>
            <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--secondary-light);color:var(--secondary);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
              <i class="fa-solid fa-indian-rupee-sign"></i>
            </div>
          </div>
        </div>

        <div class="card card-hover">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t.productsInStock}</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--text-main);margin-top:0.2rem;">${store.products.length} Items</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${store.categories.length} Categories</div>
            </div>
            <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--accent-light);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
          </div>
        </div>

        <div class="card card-hover">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t.lowStockAlerts}</div>
              <div style="font-size:1.6rem;font-weight:800;color:var(--danger);margin-top:0.2rem;">${lowStockCount} Items</div>
              <div style="font-size:0.75rem;color:var(--danger);font-weight:600;">Requires Re-order</div>
            </div>
            <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:var(--danger-light);color:var(--danger);display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Tables Layout -->
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;">
        <!-- Sales Trend Chart Card -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;">
            <span><i class="fa-solid fa-chart-line" style="color:var(--primary);"></i> Sales Trend Overview</span>
            <span class="badge badge-primary">Last 7 Days</span>
          </div>
          <div style="height:260px;position:relative;">
            <canvas id="salesTrendChart"></canvas>
          </div>
        </div>

        <!-- Category Sales Distribution -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">
            <i class="fa-solid fa-chart-pie" style="color:var(--secondary);"></i> Category Breakdown
          </div>
          <div style="height:260px;position:relative;">
            <canvas id="categoryPieChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Bills Table -->
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
          <div style="font-weight:700;font-size:1.05rem;">
            <i class="fa-solid fa-clock-rotate-left" style="color:var(--accent);"></i> ${t.recentBills}
          </div>
          <button class="btn btn-outline btn-sm" id="view-all-bills-btn">View All Bills</button>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${recentInvoices.map(inv => `
                <tr>
                  <td><strong>${inv.invoiceNo}</strong></td>
                  <td>${inv.date} ${inv.time}</td>
                  <td>${inv.customerName || 'Walk-in'}</td>
                  <td>${inv.items.length} items</td>
                  <td><strong style="color:var(--primary);">${curr}${inv.grandTotal.toFixed(2)}</strong></td>
                  <td><span class="badge badge-info">${inv.paymentMethod}</span></td>
                  <td><span class="badge badge-success">${inv.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
