// Supplier helper functions for directory customization

class SupplierHelpers {
  constructor(app) {
    this.app = app;
  }

  openSupplierManagementModal() {
    const store = window.store;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="supplier-management-modal-overlay">
        <div class="modal-card" style="max-width:760px;">
          <div class="modal-header" style="background:var(--primary);color:#fff;">
            <div class="modal-title" style="color:#fff;"><i class="fa-solid fa-truck-field"></i> Manage Suppliers</div>
            <button class="btn-icon" id="close-supplier-manage-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
              <div style="font-weight:700;">${store.suppliers.length} Suppliers</div>
              <button class="btn btn-primary btn-sm" id="add-new-supplier-btn"><i class="fa-solid fa-plus"></i> Add Supplier</button>
            </div>
            <div class="table-container" style="max-height:420px;overflow-y:auto;">
              <table class="table">
                <thead><tr><th>Supplier</th><th>Company</th><th>Mobile</th><th>GSTIN</th><th>Actions</th></tr></thead>
                <tbody>
                  ${store.suppliers.map(s => `
                    <tr data-supplier-id="${s.id}">
                      <td><strong>${s.name}</strong></td>
                      <td>${s.company || '-'}</td>
                      <td>${s.mobile || '-'}</td>
                      <td>${s.gstNo || '-'}</td>
                      <td style="display:flex;gap:0.35rem;justify-content:flex-end;flex-wrap:wrap;">
                        <button class="btn btn-secondary btn-sm edit-supplier-btn" data-id="${s.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-supplier-btn" data-id="${s.id}">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer"><button class="btn btn-outline" id="close-supplier-manage-modal-foot">Close</button></div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    const closeModal = () => modalContainer.remove();
    modalContainer.querySelector('#close-supplier-manage-modal')?.addEventListener('click', closeModal);
    modalContainer.querySelector('#close-supplier-manage-modal-foot')?.addEventListener('click', closeModal);

    modalContainer.querySelector('#add-new-supplier-btn')?.addEventListener('click', () => {
      this.openSupplierFormModal();
      closeModal();
    });

    modalContainer.querySelectorAll('.edit-supplier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const supplier = store.suppliers.find(s => s.id === id);
        if (!supplier) return;
        this.openSupplierFormModal(supplier);
        closeModal();
      });
    });

    modalContainer.querySelectorAll('.delete-supplier-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        const confirmed = await this.app.showConfirmation({ title: 'Delete Supplier?', message: 'Are you sure you want to delete this supplier?' });
        if (confirmed) {
          window.store.deleteSupplier(id);
          closeModal();
          this.app.showToast('Supplier deleted', 'danger');
          this.app.render();
        }
      });
    });
  }

  openSupplierFormModal(supplier = null) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="supplier-form-modal-overlay">
        <div class="modal-card" style="max-width:620px;">
          <div class="modal-header" style="background:var(--primary);color:#fff;">
            <div class="modal-title" style="color:#fff;">${supplier ? 'Edit Supplier' : 'Add Supplier'}</div>
            <button class="btn-icon" id="close-supplier-form-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <form id="supplier-form">
              <input type="hidden" id="supplier-id" value="${supplier ? supplier.id : ''}">
              <div class="form-group"><label class="form-label">Supplier Name</label><input type="text" id="supplier-name" class="form-input" required value="${supplier ? supplier.name : ''}"></div>
              <div class="form-group"><label class="form-label">Company</label><input type="text" id="supplier-company" class="form-input" value="${supplier ? supplier.company || '' : ''}"></div>
              <div class="form-group"><label class="form-label">Mobile</label><input type="tel" id="supplier-mobile" class="form-input" value="${supplier ? supplier.mobile || '' : ''}"></div>
              <div class="form-group"><label class="form-label">GSTIN</label><input type="text" id="supplier-gst" class="form-input" value="${supplier ? supplier.gstNo || '' : ''}"></div>
              <div class="modal-footer"><button type="submit" class="btn btn-primary">Save Supplier</button></div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    const closeModal = () => modalContainer.remove();
    modalContainer.querySelector('#close-supplier-form-modal')?.addEventListener('click', closeModal);

    const form = document.getElementById('supplier-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const supplierData = {
        id: document.getElementById('supplier-id').value || undefined,
        name: document.getElementById('supplier-name').value.trim(),
        company: document.getElementById('supplier-company').value.trim(),
        mobile: document.getElementById('supplier-mobile').value.trim(),
        gstNo: document.getElementById('supplier-gst').value.trim()
      };
      window.store.saveSupplier(supplierData);
      this.app.render();
      closeModal();
      this.app.showToast(supplier ? 'Supplier updated' : 'Supplier added');
    });
  }
}
