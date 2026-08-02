// Price List Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderPriceList(selectedCat = '', searchQ = '', sortOrder = 'name-asc') {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  let products = store.searchProducts(searchQ, selectedCat);

  // Sorting logic
  if (sortOrder === 'price-asc') {
    products.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sortOrder === 'price-desc') {
    products.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sortOrder === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <!-- Header Bar & Controls -->
      <div class="card" style="display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-tags" style="color:var(--secondary);"></i> ${t.priceListTitle}</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);">Browse item catalog, selling prices, and print store display price tags.</p>
          </div>
          <button class="btn btn-primary" id="print-price-list-btn">
            <i class="fa-solid fa-print"></i> ${t.printableList}
          </button>
        </div>

        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:0.75rem;">
          <input type="text" id="pricelist-search-input" class="form-input" placeholder="Search by name, barcode, brand..." value="${searchQ}">
          
          <select id="pricelist-cat-select" class="form-select">
            <option value="">${t.allCategories}</option>
            ${store.categories.map(c => `<option value="${c.name}" ${selectedCat === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <select id="pricelist-sort-select" class="form-select">
            <option value="name-asc" ${sortOrder === 'name-asc' ? 'selected' : ''}>Alphabetical (A-Z)</option>
            <option value="price-asc" ${sortOrder === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${sortOrder === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Printable Price Sheet Wrapper -->
      <div id="printable-price-sheet" class="card">
        <div style="text-align:center;padding:1rem;border-bottom:2px solid var(--primary);margin-bottom:1rem;">
          <h2 style="font-weight:800;font-size:1.4rem;color:var(--primary);">${store.settings.storeName}</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);">${store.settings.address} | Ph: ${store.settings.phone}</p>
          <div style="font-size:0.9rem;font-weight:700;margin-top:0.4rem;text-transform:uppercase;letter-spacing:1px;color:var(--secondary);">
            Official Product Price Catalogue (${products.length} Products)
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Product Name (English / ಕನ್ನಡ)</th>
                <th>Brand</th>
                <th>Category</th>
                <th style="text-align:right;">Selling Price</th>
                <th style="text-align:center;">Stock Available</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><code style="font-size:0.82rem;font-weight:700;color:var(--primary);">${p.barcode}</code></td>
                  <td>
                    <div style="font-weight:700;">${p.name}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">${p.nameKannada || ''}</div>
                  </td>
                  <td><span class="badge badge-info">${p.brand}</span></td>
                  <td>${p.category}</td>
                  <td style="text-align:right;"><strong style="font-size:1.05rem;color:var(--primary);">${curr}${p.sellingPrice.toFixed(2)}</strong> / ${p.unit}</td>
                  <td style="text-align:center;">
                    <span class="badge ${p.stockQty <= p.minStockAlert ? 'badge-danger' : 'badge-success'}">
                      ${p.stockQty} ${p.unit}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
