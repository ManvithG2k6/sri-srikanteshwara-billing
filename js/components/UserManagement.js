// User Management Component
import { store } from '../store.js';

export function renderUserManagement() {
  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-user-shield" style="color:var(--primary);"></i> Staff Accounts & Access Control</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Manage staff accounts, assign roles (Admin, Manager, Cashier), and view security audit logs.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
        <!-- Users Table -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">Staff Users</div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                ${store.users.map(u => `
                  <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.name}</td>
                    <td><span class="badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Manager' ? 'badge-warning' : 'badge-primary'}">${u.role}</span></td>
                    <td>${u.lastLogin || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Audit Logs Panel -->
        <div class="card">
          <div style="font-weight:700;font-size:1.05rem;margin-bottom:1rem;">
            <i class="fa-solid fa-list-check" style="color:var(--secondary);"></i> Audit Trail (Last 50 Actions)
          </div>
          <div style="max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:0.5rem;">
            ${store.auditLogs.map(log => `
              <div style="padding:0.6rem;background:var(--bg-main);border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.8rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.2rem;">
                  <strong style="color:var(--primary);">${log.action}</strong>
                  <span style="color:var(--text-muted);font-size:0.72rem;">${log.timestamp}</span>
                </div>
                <div style="color:var(--text-main);">${log.details}</div>
                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem;">User: ${log.userName}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
