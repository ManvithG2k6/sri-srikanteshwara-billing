// Payment Modal Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderPaymentModal(grandTotal, selectedCustomer) {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';
  const upiVpa = store.settings.upiId || '9845012345@ybl';

  return `
    <div class="modal-overlay" id="payment-modal-overlay">
      <div class="modal-card" style="max-width: 520px;">
        <div class="modal-header" style="background: var(--primary); color: #fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-indian-rupee-sign" style="color:var(--secondary);"></i>
            <span>Complete Payment - ${curr}${grandTotal.toFixed(2)}</span>
          </div>
          <button class="btn-icon" id="close-payment-modal" style="border:none;background:transparent;color:#fff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Payment Method Tabs -->
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:0.5rem;margin-bottom:1.25rem;">
            <button class="btn pay-method-btn btn-primary" data-method="Cash">
              <i class="fa-solid fa-money-bill-wave"></i> Cash
            </button>
            <button class="btn pay-method-btn btn-outline" data-method="UPI">
              <i class="fa-solid fa-qrcode"></i> UPI QR
            </button>
            <button class="btn pay-method-btn btn-outline" data-method="Card">
              <i class="fa-solid fa-credit-card"></i> Card
            </button>
            <button class="btn pay-method-btn btn-outline" data-method="Mixed">
              <i class="fa-solid fa-sliders"></i> Mixed
            </button>
          </div>

          <!-- Cash Payment Tab Details -->
          <div id="pay-details-cash" class="pay-tab-content">
            <div class="form-group">
              <label class="form-label">${t.amountReceived}</label>
              <input type="number" step="any" id="cash-amount-received" class="form-input" value="${Math.ceil(grandTotal)}" style="font-size:1.25rem;font-weight:700;color:var(--primary);" autofocus>
            </div>

            <!-- Quick Cash Denomination Chips -->
            <div style="display:flex;gap:0.4rem;margin-bottom:1rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm cash-chip" data-val="${Math.ceil(grandTotal)}">Exact (${curr}${Math.ceil(grandTotal)})</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="100">${curr}100</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="200">${curr}200</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="500">${curr}500</button>
              <button class="btn btn-outline btn-sm cash-chip" data-val="2000">${curr}2000</button>
            </div>

            <div style="padding:1rem;background-color:var(--success-light);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:space-between;border:1px solid var(--success);">
              <span style="font-weight:600;color:var(--success);">${t.changeDue}:</span>
              <span id="cash-change-due" style="font-size:1.4rem;font-weight:800;color:var(--success);">${curr}0.00</span>
            </div>
          </div>

          <!-- UPI Payment Tab Details -->
          <div id="pay-details-upi" class="pay-tab-content" style="display:none;text-align:center;">
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem;">
              Scan UPI QR code with any app (GPay, PhonePe, Paytm, BHIM) to pay <strong>${curr}${grandTotal.toFixed(2)}</strong>
            </p>
            <div id="upi-qrcode-container" style="display:inline-block;padding:0.75rem;background:#fff;border-radius:var(--radius-lg);box-shadow:var(--shadow-md);margin-bottom:1rem;"></div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);">UPI ID: ${upiVpa}</div>
            
            <div class="form-group" style="margin-top:1rem;text-align:left;">
              <label class="form-label">UPI Reference / Txn ID (Optional)</label>
              <input type="text" id="upi-ref-id" class="form-input" placeholder="e.g. 423456789012">
            </div>
          </div>

          <!-- Card / Mixed Tab Details -->
          <div id="pay-details-card" class="pay-tab-content" style="display:none;">
            <div class="form-group">
              <label class="form-label">Card Machine Reference / Auth Code</label>
              <input type="text" id="card-auth-code" class="form-input" placeholder="e.g. POS-987654">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" id="cancel-payment-btn">${t.cancel}</button>
          <button class="btn btn-primary btn-lg" id="confirm-payment-btn" style="flex:1;">
            <i class="fa-solid fa-print"></i> ${t.completePayment}
          </button>
        </div>
      </div>
    </div>
  `;
}
