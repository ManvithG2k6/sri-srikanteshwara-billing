// Login Modal Component
import { store } from '../store.js';

export function renderLoginModal() {
  return `
    <div class="modal-overlay" id="login-modal-overlay">
      <div class="modal-card" style="max-width: 440px;">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: #fff;">
          <div class="modal-title" style="color: #fff;">
            <i class="fa-solid fa-store" style="color: var(--secondary);"></i>
            <span>Sri Srikanteshwara Store Login</span>
          </div>
        </div>

        <div class="modal-body">
          <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;">
            Select your staff role or user account to access the billing and inventory software.
          </p>

          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Role / Account</label>
              <select class="form-select" id="login-user-select" required>
                ${store.users.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Password / PIN (Default: 1234)</label>
              <div style="position:relative;">
                <input type="password" class="form-input" id="login-pin-input" value="1234" required placeholder="Enter PIN or password">
                <button type="button" id="toggle-pin-visibility" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:var(--text-muted);cursor:pointer;">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;font-size:0.82rem;">
              <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;">
                <input type="checkbox" id="remember-me-check" checked> Remember Me
              </label>
              <a href="#" id="forgot-password-link" style="color:var(--primary);text-decoration:none;font-weight:600;">Forgot Password?</a>
            </div>

            <div style="margin-bottom:1rem;">
              <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-bottom:0.4rem;">QUICK DEMO LOGINS:</div>
              <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-1">Admin</button>
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-2">Manager</button>
                <button type="button" class="btn btn-outline btn-sm quick-demo-btn" data-user="user-3">Cashier</button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In to Software
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}
