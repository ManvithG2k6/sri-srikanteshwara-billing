// Draft helper functions for POS drafts

class DraftHelpers {
  constructor(app) {
    this.app = app;
  }

  openDraftsModal() {
    const store = window.store;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="drafts-modal-overlay">
        <div class="modal-card" style="max-width:720px;">
          <div class="modal-header" style="background:var(--primary);color:#fff;">
            <div class="modal-title" style="color:#fff;"><i class="fa-solid fa-file-alt"></i> Saved Drafts</div>
            <button class="btn-icon" id="close-drafts-modal" style="border:none;background:transparent;color:#fff;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            ${store.drafts.length === 0 ? `
              <div style="text-align:center;padding:2rem;color:var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size:2.5rem;margin-bottom:0.75rem;"></i>
                <div>No drafts saved yet.</div>
              </div>
            ` : `
              <div class="table-container" style="max-height:420px;overflow-y:auto;">
                <table class="table">
                  <thead>
                    <tr><th>Draft</th><th>Items</th><th>Customer</th><th>Saved</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    ${store.drafts.map(draft => {
                      const customer = store.customers.find(c => c.id === draft.customerId);
                      return `
                        <tr data-draft-id="${draft.id}">
                          <td><strong>${draft.id}</strong></td>
                          <td>${draft.items.length}</td>
                          <td>${customer ? customer.name : 'Walk-in'}</td>
                          <td>${draft.timestamp}</td>
                          <td style="display:flex;gap:0.35rem;flex-wrap:wrap;justify-content:flex-end;">
                            <button class="btn btn-primary btn-sm load-draft-btn" data-id="${draft.id}">Load</button>
                            <button class="btn btn-danger btn-sm delete-draft-btn" data-id="${draft.id}">Delete</button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="dismiss-drafts-modal">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    const closeModal = () => modalContainer.remove();
    modalContainer.querySelector('#close-drafts-modal')?.addEventListener('click', closeModal);
    modalContainer.querySelector('#dismiss-drafts-modal')?.addEventListener('click', closeModal);

    modalContainer.querySelectorAll('.load-draft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const draftId = btn.getAttribute('data-id');
        if (!draftId) return;
        const draft = window.store.drafts.find(d => d.id === draftId);
        if (!draft) return;

        this.app.cartState = {
          items: JSON.parse(JSON.stringify(draft.items)),
          customerId: draft.customerId || 'walk-in',
          billDiscount: draft.billDiscount || 0,
          enableRoundOff: draft.enableRoundOff !== undefined ? draft.enableRoundOff : true
        };
        this.app.render();
        closeModal();
        this.app.showToast('Draft loaded');
      });
    });

    modalContainer.querySelectorAll('.delete-draft-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const draftId = btn.getAttribute('data-id');
        if (!draftId) return;
        const confirmed = await this.app.showConfirmation({ title: 'Delete Draft?', message: 'Are you sure you want to delete this saved draft?' });
        if (confirmed) {
          window.store.deleteDraftBill(draftId);
          closeModal();
          this.app.showToast('Draft deleted', 'danger');
          this.app.render(); // Re-render after modal is closed
        }
      });
    });
  }
}
