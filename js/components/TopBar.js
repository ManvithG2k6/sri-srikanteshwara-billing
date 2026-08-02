// TopBar Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderTopBar(pageTitle) {
  const lang = store.currentLang || 'en';
  const theme = store.currentTheme || 'light';
  const t = translations[lang] || translations.en;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return `
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="page-title">${pageTitle}</h1>
      </div>

      <div class="topbar-right">
        <div class="scanner-status-indicator" title="USB Barcode Scanner Ready">
          <span class="pulse-dot"></span>
          <i class="fa-solid fa-barcode"></i>
          <span>Scanner Ready</span>
        </div>

        <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;display:flex;flex-direction:column;align-items:flex-end;line-height:1.2;">
          <span style="color:var(--text-main);">${timeStr}</span>
          <span>${dateStr}</span>
        </div>

        <button class="lang-toggle-btn" id="toggle-lang-btn" title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ">
          <i class="fa-solid fa-language" style="color:var(--secondary);"></i>
          <span>${lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
        </button>

        <button class="btn-icon" id="toggle-theme-btn" title="Toggle Theme (Dark/Light)">
          <i class="fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
        </button>
      </div>
    </header>
  `;
}
