// Settings Component
import { store } from '../store.js';

export function renderSettings() {
  const s = store.settings;

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card">
        <h2 style="font-weight:800;font-size:1.25rem;margin-bottom:0.25rem;"><i class="fa-solid fa-gear" style="color:var(--primary);"></i> Store Settings & Configuration</h2>
        <p style="font-size:0.82rem;color:var(--text-muted);">Customize receipt headers, GST numbers, currency symbols, and perform full JSON database backups.</p>
      </div>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;">
        <!-- Store Information Form -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;border-bottom:1px solid var(--border);padding-bottom:0.5rem;">
            Store & Receipt Customization
          </div>

          <form id="settings-form">
            <div class="form-group">
              <label class="form-label">Store Name</label>
              <input type="text" id="set-store-name" class="form-input" required value="${s.storeName}">
            </div>

            <div class="form-group">
              <label class="form-label">Store Tagline / Slogan</label>
              <input type="text" id="set-store-tagline" class="form-input" value="${s.tagLine || ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Address</label>
              <input type="text" id="set-store-address" class="form-input" required value="${s.address}">
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Phone Numbers</label>
                <input type="text" id="set-store-phone" class="form-input" required value="${s.phone}">
              </div>

              <div class="form-group">
                <label class="form-label">GSTIN / Tax Number</label>
                <input type="text" id="set-store-gst" class="form-input" required value="${s.gstNo}">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">UPI VPA (for QR Code)</label>
                <input type="text" id="set-store-upi" class="form-input" required value="${s.upiId}">
              </div>

              <div class="form-group">
                <label class="form-label">Thermal Printer Paper Width</label>
                <select id="set-thermal-width" class="form-select">
                  <option value="58mm" ${s.thermalWidth === '58mm' ? 'selected' : ''}>58mm Thermal Receipt</option>
                  <option value="80mm" ${s.thermalWidth === '80mm' ? 'selected' : ''}>80mm Thermal Receipt (Standard)</option>
                  <option value="A4" ${s.thermalWidth === 'A4' ? 'selected' : ''}>Standard A4 Invoice</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Receipt Footer Message</label>
              <input type="text" id="set-receipt-footer" class="form-input" value="${s.receiptFooter}">
            </div>

            <div style="display:flex;justify-content:flex-end;margin-top:1rem;">
              <button type="submit" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-floppy-disk"></i> Save Store Settings
              </button>
            </div>
          </form>
        </div>

        <!-- Backup & Restore Database -->
        <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="font-weight:700;font-size:1.05rem;border-bottom:1px solid var(--border);padding-bottom:0.5rem;">
            Database Backup & Restore
          </div>

          <p style="font-size:0.82rem;color:var(--text-muted);">
            Export all products, customer databases, sales invoices, and settings as a JSON file for safe offline storage.
          </p>

          <button class="btn btn-secondary btn-lg" id="btn-export-backup">
            <i class="fa-solid fa-download"></i> Download JSON Backup
          </button>

          <div style="border-top:1px solid var(--border);padding-top:1rem;">
            <div style="font-weight:700;font-size:0.88rem;margin-bottom:0.4rem;">Restore from Backup JSON</div>
            <label class="btn btn-outline" style="width:100%;cursor:pointer;">
              <i class="fa-solid fa-upload" style="color:var(--primary);"></i> Select Backup File
              <input type="file" id="btn-import-backup-file" accept=".json" style="display:none;">
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
}
