// Product Management Component
import { store } from '../store.js';
import { translations } from '../translations.js';

export function renderProductManagement(searchQuery = '', catFilter = '') {
  const lang = store.currentLang || 'en';
  const t = translations[lang] || translations.en;
  const curr = store.settings.currency || '₹';

  const products = store.searchProducts(searchQuery, catFilter);

  return `
    <div style="display:flex;flex-direction:column;gap:1.25rem;">
      <!-- Header & Action Controls -->
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
        <div>
          <h2 style="font-weight:800;font-size:1.25rem;"><i class="fa-solid fa-boxes-stacked" style="color:var(--primary);"></i> Product & Inventory Catalog</h2>
          <p style="font-size:0.82rem;color:var(--text-muted);">Manage grocery items, barcodes, prices, GST rates, stock alerts, and bulk Excel imports.</p>
        </div>

        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-primary" id="btn-add-new-product">
            <i class="fa-solid fa-plus"></i> ${t.addProduct}
          </button>
          <button class="btn btn-outline" id="btn-export-excel-products">
            <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> ${t.exportExcel}
          </button>
          <label class="btn btn-outline" style="cursor:pointer;">
            <i class="fa-solid fa-file-import" style="color:var(--secondary);"></i> ${t.importExcel}
            <input type="file" id="btn-import-excel-products" accept=".xlsx, .xls, .csv" style="display:none;">
          </label>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="card" style="display:grid;grid-template-columns:2fr 1fr;gap:0.75rem;">
        <input type="text" id="prod-mgmt-search" class="form-input" placeholder="Search by product name, barcode, brand..." value="${searchQuery}">
        
        <select id="prod-mgmt-cat-select" class="form-select">
          <option value="">${t.allCategories}</option>
          ${store.categories.map(c => `<option value="${c.name}" ${catFilter === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>

      <!-- Products Data Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Product Name (EN / KN)</th>
                <th>Brand & Category</th>
                <th>Purchase Rate</th>
                <th>Selling Price</th>
                <th>GST %</th>
                <th>Stock Qty</th>
                <th>Unit</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.length === 0 ? `
                <tr><td colspan="9" style="text-align:center;padding:2rem;">No products match your filter criteria.</td></tr>
              ` : products.map(p => `
                <tr>
                  <td><code style="font-weight:700;color:var(--primary);">${p.barcode}</code></td>
                  <td>
                    <div style="font-weight:700;">${p.name}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">${p.nameKannada || ''}</div>
                  </td>
                  <td>
                    <div style="font-weight:600;">${p.brand}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${p.category}</div>
                  </td>
                  <td>${curr}${p.purchasePrice}</td>
                  <td><strong style="color:var(--primary);">${curr}${p.sellingPrice}</strong></td>
                  <td>${p.gstRate}%</td>
                  <td>
                    <span class="badge ${p.stockQty <= p.minStockAlert ? 'badge-danger' : 'badge-success'}">
                      ${p.stockQty}
                    </span>
                  </td>
                  <td>${p.unit}</td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex;gap:0.25rem;">
                      <button class="btn-icon btn-print-barcode-single" data-id="${p.id}" title="Print Barcode Label" style="width:30px;height:30px;">
                        <i class="fa-solid fa-barcode"></i>
                      </button>
                      <button class="btn-icon btn-edit-product" data-id="${p.id}" title="Edit Product" style="width:30px;height:30px;">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button class="btn-icon btn-delete-product" data-id="${p.id}" title="Delete Product" style="width:30px;height:30px;color:var(--danger);">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
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

export function renderAddEditProductModal(product = null) {
  const isEdit = !!product;
  return `
    <div class="modal-overlay" id="product-modal-overlay">
      <div class="modal-card" style="max-width:640px;">
        <div class="modal-header" style="background:var(--primary);color:#fff;">
          <div class="modal-title" style="color:#fff;">
            <i class="fa-solid fa-box-open"></i> ${isEdit ? 'Edit Product' : 'Add New Product'}
          </div>
          <button class="btn-icon" id="close-prod-modal" style="border:none;background:transparent;color:#fff;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <form id="product-form">
            <input type="hidden" id="prod-id" value="${product ? product.id : ''}">
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Barcode (Numeric/Code128)</label>
                <input type="text" id="prod-barcode" class="form-input" required value="${product ? product.barcode : `890${Date.now().toString().slice(-10)}`}">
              </div>

              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="prod-category" class="form-select" required>
                  ${store.categories.map(c => `<option value="${c.name}" ${product && product.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Product Name (English)</label>
              <input type="text" id="prod-name" class="form-input" required value="${product ? product.name : ''}" placeholder="e.g. Freedom Sunflower Oil 1L">
            </div>

            <div class="form-group">
              <label class="form-label">Product Name (Kannada / ಕನ್ನಡ)</label>
              <input type="text" id="prod-name-kannada" class="form-input" value="${product ? product.nameKannada || '' : ''}" placeholder="e.g. ಫ್ರೀಡಂ ಸೂರ್ಯಕಾಂತಿ ಎಣ್ಣೆ 1 ಲೀ">
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Brand</label>
                <input type="text" id="prod-brand" class="form-input" required value="${product ? product.brand : 'SS Farm'}" placeholder="Brand name">
              </div>

              <div class="form-group">
                <label class="form-label">Unit</label>
                <select id="prod-unit" class="form-select" required>
                  <option value="Kg" ${product && product.unit === 'Kg' ? 'selected' : ''}>Kg</option>
                  <option value="Litre" ${product && product.unit === 'Litre' ? 'selected' : ''}>Litre</option>
                  <option value="Packet" ${product && product.unit === 'Packet' ? 'selected' : ''}>Packet</option>
                  <option value="Piece" ${product && product.unit === 'Piece' ? 'selected' : ''}>Piece</option>
                  <option value="Bottle" ${product && product.unit === 'Bottle' ? 'selected' : ''}>Bottle</option>
                  <option value="Gram" ${product && product.unit === 'Gram' ? 'selected' : ''}>Gram</option>
                  <option value="Box" ${product && product.unit === 'Box' ? 'selected' : ''}>Box</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Purchase Price (₹)</label>
                <input type="number" step="any" id="prod-purchase-price" class="form-input" required value="${product ? product.purchasePrice : ''}">
              </div>

              <div class="form-group">
                <label class="form-label">Selling Price (₹)</label>
                <input type="number" step="any" id="prod-selling-price" class="form-input" required value="${product ? product.sellingPrice : ''}">
              </div>

              <div class="form-group">
                <label class="form-label">GST % Rate</label>
                <select id="prod-gst-rate" class="form-select" required>
                  <option value="0" ${product && product.gstRate === 0 ? 'selected' : ''}>0% (Exempt)</option>
                  <option value="5" ${product && product.gstRate === 5 ? 'selected' : ''}>5%</option>
                  <option value="12" ${product && product.gstRate === 12 ? 'selected' : ''}>12%</option>
                  <option value="18" ${product && product.gstRate === 18 ? 'selected' : ''}>18%</option>
                  <option value="28" ${product && product.gstRate === 28 ? 'selected' : ''}>28%</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Stock Quantity</label>
                <input type="number" id="prod-stock-qty" class="form-input" required value="${product ? product.stockQty : 50}">
              </div>

              <div class="form-group">
                <label class="form-label">Min Stock Alert Level</label>
                <input type="number" id="prod-min-alert" class="form-input" required value="${product ? product.minStockAlert : 10}">
              </div>
            </div>

            <div class="modal-footer" style="padding-right:0;padding-left:0;padding-bottom:0;">
              <button type="button" class="btn btn-outline" id="cancel-prod-btn">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Save Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
