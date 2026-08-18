// Customer helper functions for walk-in / POS selection

class CustomerHelpers {
  constructor(app) {
    this.app = app;
  }

  openCustomerSelectModal() {
    const store = window.store;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="customer-select-modal-overlay">
        <div class="modal-card" style="max-width:620px;">
          <div class="modal-header" style="background:var(--primary);color:#fff;">
            <div class="modal-title" style="color:#fff;"><i class="fa-solid fa-user-plus"></i> Choose Customer</div>
            <button class="btn-icon" id="close-customer-select-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
              <button class="btn btn-outline btn-sm" id="select-walkin-customer">Walk-in Customer</button>
              <button class="btn btn-primary btn-sm" id="add-new-walkin-customer">Add New Customer</button>
            </div>
            <div class="table-container">
              <table class="table">
                <thead><tr><th>Name</th><th>Mobile</th><th>Actions</th></tr></thead>
                <tbody>
                  ${store.customers.map(c => `
                    <tr data-customer-id="${c.id}">
                      <td><strong>${c.name}</strong></td>
                      <td>${c.mobile}</td>
                      <td style="display:flex;gap:0.25rem;justify-content:flex-end;">
                        <button class="btn btn-primary btn-sm select-existing-customer-btn" data-id="${c.id}">Select</button>
                        <button class="btn btn-danger btn-sm delete-customer-record-btn" data-id="${c.id}">Delete</button>
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
    document.body.appendChild(modalContainer);

    const closeBtn = document.getElementById('close-customer-select-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => modalContainer.remove());

    const walkinBtn = document.getElementById('select-walkin-customer');
    if (walkinBtn) walkinBtn.addEventListener('click', () => {
      this.app.cartState.customerId = 'walk-in';
      this.app.render();
      modalContainer.remove();
      this.app.showToast('Using walk-in customer');
    });

    const addBtn = document.getElementById('add-new-walkin-customer');
    if (addBtn) addBtn.addEventListener('click', () => {
      modalContainer.remove();
      this.openAddCustomerModal();
    });

    document.querySelectorAll('.select-existing-customer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        this.app.cartState.customerId = id;
        this.app.render();
        modalContainer.remove();
        const customer = window.store.customers.find(c => c.id === id);
        this.app.showToast(`Selected ${customer ? customer.name : 'customer'}`);
      });
    });

    document.querySelectorAll('.delete-customer-record-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        const confirmed = await this.app.showConfirmation({ title: 'Delete Customer?', message: 'Are you sure you want to delete this customer permanently?' });
        if (confirmed) {
          const customer = window.store.customers.find(c => c.id === id);
          window.store.deleteCustomer(id);
          this.app.render();
          modalContainer.remove();
          this.app.showToast(`${customer ? customer.name : 'Customer'} deleted`, 'danger');
        }
      });
    });
  }

  openAddCustomerModal(existingCustomer = null) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = window.renderAddCustomerModal(existingCustomer);
    document.body.appendChild(modalContainer);

    const closeBtn = document.getElementById('close-cust-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => modalContainer.remove());

    const form = document.getElementById('customer-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('cust-id');
        const nameInp = document.getElementById('cust-name');
        const mobileInp = document.getElementById('cust-mobile');
        const id = idInput.value || `cust-${Date.now()}`;
        const customerData = {
          id,
          name: nameInp.value.trim(),
          mobile: mobileInp.value.trim(),
          address: '',
          gstNo: '',
          outstandingBalance: 0,
          totalPurchases: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        window.store.saveCustomer(customerData);
        this.app.cartState.customerId = id;
        this.app.render();
        modalContainer.remove();
        this.app.showToast('Customer added and selected');
      });
    }
  }
}
