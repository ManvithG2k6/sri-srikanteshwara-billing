// Customer Management Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderCustomerManagement(searchQ = '') {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const customers = store.customers.filter(c => 
    c.name.toLowerCase().includes(searchQ.toLowerCase()) || 
    c.mobile.includes(searchQ)
  );

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-users" style="color:var(--primary);"></i> Customer Database & Loyalty</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Manage customer profiles, outstanding balances, accumulated loyalty reward points, and purchase history.</p>
        </div>

        <button class="btn btn-primary" id="btn-add-customer-main">
          <i class="fa-solid fa-user-plus"></i> ${t.addCustomer}
        </button>
      </div>

      <div class="card">
        <div style="margin-bottom:1rem;">
          <input type="text" id="customer-search-input" class="form-input" placeholder="Search customer by name or mobile number..." value="${searchQ}">
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Address & GST</th>
                <th>Loyalty Points</th>
                <th>Outstanding Balance</th>
                <th>Total Purchases</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${customers.length === 0 ? `
                <tr><td colspan="8" style="text-align:center;padding:2rem;">No customers found.</td></tr>
              ` : customers.map(c => `
                <tr>
                  <td><code style="font-weight:700;">${c.id}</code></td>
                  <td><strong>${c.name}</strong></td>
                  <td>${c.mobile}</td>
                  <td>
                    <div>${c.address || 'N/A'}</div>
                    ${c.gstNo ? `<div style="font-size:0.75rem;color:var(--text-muted);">GST: ${c.gstNo}</div>` : ''}
                  </td>
                  <td><span class="badge badge-warning"><i class="fa-solid fa-star"></i> ${c.loyaltyPoints} Pts</span></td>
                  <td>
                    <strong style="color:${c.outstandingBalance > 0 ? 'var(--danger)' : 'var(--success)'};">
                      ${curr}${c.outstandingBalance.toFixed(2)}
                    </strong>
                  </td>
                  <td>${curr}${c.totalPurchases.toFixed(2)}</td>
                  <td style="text-align:right;">
                    <button class="btn-icon btn-edit-customer" data-id="${c.id}" title="Edit Customer">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon btn-delete-customer" data-id="${c.id}" title="Delete Customer" style="color:var(--danger);">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
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

export function renderAddCustomerModal(customer = null) {
  const isEdit = !!customer;
  return `
    <div class="modal-overlay" id="customer-modal-overlay">
      <div class="modal-card" style="max-width:500px;">
        <div class="modal-header" style="background:var(--primary);color:#fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-user-plus"></i> ${isEdit ? 'Edit Customer' : 'Add New Customer'}
          </div>
          <button class="btn-icon" id="close-cust-modal" style="border:none;background:transparent;color:#fff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <form id="customer-form">
            <input type="hidden" id="cust-id" value="${customer ? customer.id : ''}">

            <div class="form-group">
              <label class="form-label">Customer Name</label>
              <input type="text" id="cust-name" class="form-input" required value="${customer ? customer.name : ''}" placeholder="Full Name">
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input type="tel" id="cust-mobile" class="form-input" required value="${customer ? customer.mobile : ''}" placeholder="10-digit mobile number">
            </div>

            <div class="form-group">
              <label class="form-label">Address</label>
              <input type="text" id="cust-address" class="form-input" value="${customer ? customer.address : ''}" placeholder="Area / Street name">
            </div>

            <div class="form-group">
              <label class="form-label">GST Number (Optional)</label>
              <input type="text" id="cust-gst" class="form-input" value="${customer ? customer.gstNo || '' : ''}" placeholder="29XXXXX1234X1ZX">
            </div>

            <div class="modal-footer" style="padding:0;margin-top:1.5rem;">
              <button type="button" class="btn btn-outline" id="cancel-cust-btn">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Save Customer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
