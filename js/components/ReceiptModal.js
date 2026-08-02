// Receipt Modal Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderReceiptModal(invoice) {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const s = store.settings;
  const curr = s.currency || '₹';

  const cgst = (invoice.totalGst / 2).toFixed(2);
  const sgst = (invoice.totalGst / 2).toFixed(2);

  return `
    <div class="modal-overlay" id="receipt-modal-overlay">
      <div class="modal-card" style="max-width: 580px;">
        <div class="modal-header" style="background: var(--bg-sidebar); color: #fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-receipt" style="color:var(--secondary);"></i>
            <span>Invoice #${invoice.invoiceNo}</span>
          </div>
          <button class="btn-icon" id="close-receipt-modal" style="border:none;background:transparent;color:#fff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body" style="background:#f1f5f9;padding:1rem;">
          <!-- Printable Receipt Container -->
          <div id="printable-receipt" class="thermal-receipt">
            <div class="thermal-header">
              <div class="thermal-title">${s.storeName}</div>
              <div>${s.tagLine || ''}</div>
              <div>${s.address}</div>
              <div>Ph: ${s.phone} | GSTIN: ${s.gstNo}</div>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
              <span>Bill No: <strong>${invoice.invoiceNo}</strong></span>
              <span>Date: ${invoice.date} ${invoice.time}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;">
              <span>Cashier: ${invoice.cashierName}</span>
              <span>Customer: ${invoice.customerName || 'Walk-in'}</span>
            </div>

            <div class="thermal-divider"></div>

            <table class="thermal-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Rate</th>
                  <th style="text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td colspan="4" style="font-weight:bold;padding-top:4px;">${item.name}</td>
                  </tr>
                  <tr>
                    <td style="padding-left:8px;font-size:11px;color:#555;">${item.barcode}</td>
                    <td style="text-align:center;">${item.qty} ${item.unit}</td>
                    <td style="text-align:right;">${curr}${item.rate}</td>
                    <td style="text-align:right;font-weight:bold;">${curr}${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="thermal-divider"></div>

            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>Subtotal:</span>
              <span>${curr}${invoice.subtotal.toFixed(2)}</span>
            </div>
            ${invoice.totalDiscount > 0 ? `
              <div style="display:flex;justify-content:space-between;font-size:11px;">
                <span>Discount:</span>
                <span>-${curr}${invoice.totalDiscount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>CGST (2.5%/6%/9%):</span>
              <span>${curr}${cgst}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>SGST (2.5%/6%/9%):</span>
              <span>${curr}${sgst}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>Round Off:</span>
              <span>${curr}${invoice.roundOff || 0}</span>
            </div>

            <div class="thermal-divider"></div>

            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:bold;margin:4px 0;">
              <span>GRAND TOTAL:</span>
              <span>${curr}${invoice.grandTotal.toFixed(2)}</span>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px;">
              <span>Payment Mode: <strong>${invoice.paymentMethod}</strong></span>
              <span>Status: Paid</span>
            </div>

            <div style="text-align:center;margin-top:10px;" id="receipt-barcode-render">
              <!-- Barcode canvas injected dynamically -->
            </div>

            <div style="text-align:center;font-size:11px;margin-top:10px;font-style:italic;">
              ${s.receiptFooter}
            </div>
          </div>
        </div>

        <div class="modal-footer" style="flex-wrap:wrap;gap:0.5rem;">
          <button class="btn btn-outline" id="btn-share-whatsapp">
            <i class="fa-brands fa-whatsapp" style="color:#22c55e;"></i> WhatsApp
          </button>
          <button class="btn btn-outline" id="btn-share-email">
            <i class="fa-solid fa-envelope" style="color:#3b82f6;"></i> Email
          </button>
          <button class="btn btn-primary" id="btn-print-receipt-trigger">
            <i class="fa-solid fa-print"></i> Print Receipt
          </button>
        </div>
      </div>
    </div>
  `;
}
