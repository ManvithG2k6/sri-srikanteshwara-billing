// Sidebar Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderSidebar(activeNav, onNavigate) {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const user = store.currentUser || { name: 'Admin', role: 'Admin' };
  const lowStockCount = store.products.filter(p => p.stockQty <= p.minStockAlert).length;

  const navItems = [
    { id: 'pos', label: t.posBilling, icon: 'fa-calculator', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'dashboard', label: t.dashboard, icon: 'fa-chart-line', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'price-list', label: t.priceList, icon: 'fa-tags', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'products', label: t.products, icon: 'fa-boxes-stacked', badge: lowStockCount > 0 ? `${lowStockCount}` : null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'inventory', label: t.inventory, icon: 'fa-warehouse', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'customers', label: t.customers, icon: 'fa-users', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'suppliers', label: t.suppliers, icon: 'fa-truck-field', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'bills', label: t.billHistory, icon: 'fa-receipt', badge: null, roles: ['Admin', 'Manager', 'Cashier'] },
    { id: 'reports', label: t.reports, icon: 'fa-file-invoice-dollar', badge: null, roles: ['Admin', 'Manager'] },
    { id: 'users', label: t.userManagement, icon: 'fa-user-shield', badge: null, roles: ['Admin'] },
    { id: 'settings', label: t.settings, icon: 'fa-gear', badge: null, roles: ['Admin'] },
  ];

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="store-logo-icon">
          <i class="fa-solid fa-store"></i>
        </div>
        <div class="store-title-container">
          <div class="store-name" title="${t.storeName}">${t.storeName}</div>
          <div class="store-subtitle">${t.storeSubtitle}</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Store Operations</div>
        ${navItems
          .filter(item => item.roles.includes(user.role))
          .map(item => `
            <a class="nav-item ${activeNav === item.id ? 'active' : ''}" data-nav="${item.id}">
              <i class="fa-solid ${item.icon}"></i>
              <span style="flex:1;">${item.label}</span>
              ${item.badge ? `<span class="badge badge-danger">${item.badge}</span>` : ''}
            </a>
          `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-badge">
          <div class="user-avatar">${user.name.charAt(0)}</div>
          <div class="user-details">
            <div class="user-name">${user.name}</div>
            <div class="user-role"><i class="fa-solid fa-shield-halved" style="color:var(--secondary);"></i> ${user.role}</div>
          </div>
          <button class="btn-icon" id="logout-btn" title="Logout" style="width:32px;height:32px;border:none;background:transparent;color:#94a3b8;">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  `;
}
