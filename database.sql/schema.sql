-- Sri Srikanteshwara Store SQL schema
-- Generated to match the current SPA data model.

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_kannada TEXT
);

CREATE TABLE suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    mobile TEXT,
    email TEXT,
    address TEXT,
    gst_no TEXT,
    total_purchases REAL DEFAULT 0,
    pending_amount REAL DEFAULT 0
);

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    barcode TEXT UNIQUE,
    name TEXT NOT NULL,
    name_kannada TEXT,
    brand TEXT,
    category TEXT,
    purchase_price REAL DEFAULT 0,
    selling_price REAL DEFAULT 0,
    gst_rate REAL DEFAULT 0,
    stock_qty INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 0,
    unit TEXT,
    expiry_date TEXT,
    supplier_id TEXT,
    image TEXT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT,
    address TEXT,
    gst_no TEXT,
    outstanding_balance REAL DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    total_purchases REAL DEFAULT 0,
    created_at TEXT
);

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    pin TEXT,
    status TEXT,
    last_login TEXT,
    shift TEXT,
    attendance_status TEXT,
    attendance_this_month INTEGER DEFAULT 0
);

CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    customer_id TEXT,
    customer_name TEXT,
    customer_mobile TEXT,
    cashier_id TEXT,
    cashier_name TEXT,
    subtotal REAL DEFAULT 0,
    total_discount REAL DEFAULT 0,
    total_gst REAL DEFAULT 0,
    grand_total REAL DEFAULT 0,
    round_off REAL DEFAULT 0,
    payment_method TEXT,
    payment_details TEXT,
    status TEXT,
    date TEXT,
    time TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE invoice_items (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    product_id TEXT,
    barcode TEXT,
    name TEXT,
    unit TEXT,
    qty REAL DEFAULT 0,
    rate REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    gst_rate REAL DEFAULT 0,
    gst_amount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    user_name TEXT,
    action TEXT,
    details TEXT
);

CREATE TABLE store_settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE drafts (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    data TEXT
);

-- Example seed values
INSERT INTO categories (id, name, name_kannada) VALUES
('cat-1', 'Edible Oils & Ghee', 'ಖಾದ್ಯ ತೈಲಗಳು ಮತ್ತು ತುಪ್ಪ'),
('cat-2', 'Rice & Grains', 'ಅಕ್ಕಿ ಮತ್ತು ಧಾನ್ಯಗಳು'),
('cat-3', 'Dals & Pulses', 'ಬೇಳೆಕಾಳುಗಳು'),
('cat-4', 'Flours & Rava', 'ಹಿಟ್ಟು ಮತ್ತು ರವೆ'),
('cat-5', 'Spices & Masala', 'ಮಸಾಲೆ ಮತ್ತು ಉಪ್ಪು'),
('cat-6', 'Dairy & Bakery', 'ಹಾಲಿನ ಉತ್ಪನ್ನಗಳು'),
('cat-7', 'Tea, Coffee & Drinks', 'ಟೀ, ಕಾಫಿ ಮತ್ತು ಪಾನೀಯಗಳು'),
('cat-8', 'Soaps & Cleaning', 'ಸಾಬೂನು ಮತ್ತು ನೈರ್ಮಲ್ಯ');

INSERT INTO suppliers (id, name, company, mobile, email, address, gst_no, total_purchases, pending_amount) VALUES
('sup-1', 'Karnataka Oil Traders', 'KOT Oils Ltd', '9845012345', 'sales@kotoils.com', 'APMC Yard, Yeshwanthpur, Bengaluru', '29AAACK1234F1Z5', 450000, 25000),
('sup-2', 'Srikanteshwara Grain Mills', 'SS Grain Mills', '9880198765', 'info@ssgrains.in', 'Industrial Area, Mandya', '29AABCS9876E1Z1', 680000, 0),
('sup-3', 'KMF Nandini Distributor', 'Nandini Milk Agency', '9448055443', 'dist@nandini.coop', 'Mysuru Road, Mysuru', '29KMFDK4321P1Z9', 210000, 5000);

INSERT INTO customers (id, name, mobile, address, gst_no, outstanding_balance, loyalty_points, total_purchases, created_at) VALUES
('cust-101', 'Ramesh Kumar', '9845112233', 'Saraswathipuram, Mysuru', '', 0, 125, 14500, '2026-01-10'),
('cust-102', 'Shankara Gowda', '9900887766', 'Kuvempunagar, Mysuru', '29AABCU5544R1Z3', 450, 340, 38200, '2026-02-15'),
('cust-103', 'Meenakshi Amma', '9740556677', 'Gokulam 3rd Stage, Mysuru', '', 0, 85, 9200, '2026-03-01');

INSERT INTO users (id, username, name, role, pin, status, last_login, shift, attendance_status, attendance_this_month) VALUES
('user-1', 'admin', 'Srikanteshwara (Owner)', 'Admin', '1234', 'Active', '2026-08-02 20:45', 'Morning', 'Present', 22),
('user-2', 'manager', 'Manjunath (Manager)', 'Manager', '1234', 'Active', '2026-08-02 18:30', 'Evening', 'Present', 20),
('user-3', 'cashier', 'Basavaraj (Billing)', 'Cashier', '1234', 'Active', '2026-08-02 20:40', 'Evening', 'Absent', 18);

INSERT INTO invoices (id, invoice_no, customer_id, customer_name, customer_mobile, cashier_id, cashier_name, subtotal, total_discount, total_gst, grand_total, round_off, payment_method, payment_details, status, date, time) VALUES
('inv-1001', 'SS-2026-1001', 'cust-101', 'Ramesh Kumar', '9845112233', 'user-3', 'Basavaraj (Billing)', 410, 5, 12.38, 405, 0, 'UPI', 'TxnID: UPI/98451/9876', 'Completed', '2026-08-02', '19:15:30');

INSERT INTO invoice_items (id, invoice_id, product_id, barcode, name, unit, qty, rate, discount, gst_rate, gst_amount, total) VALUES
('item-1', 'inv-1001', 'p-101', '8901234567890', 'Freedom Refined Sunflower Oil 1L Pouch', 'Packet', 2, 130, 0, 5, 12.38, 260),
('item-2', 'inv-1001', 'p-301', '8901111111111', 'Unpolished Toor Dal Premium 1kg', 'Kg', 1, 155, 5, 0, 0, 150);

INSERT INTO store_settings (key, value) VALUES
('storeName', 'Sri Srikanteshwara Provision & Oil Store'),
('tagLine', 'Quality Provisions & Edible Oils Since 1998'),
('address', 'No. 45, Main Market Road, Near Temple Square, Mysuru - 570001'),
('phone', '+91 98450 12345 / 0821-2456789'),
('gstNo', '29ABCDE1234F1Z9'),
('upiId', '9845012345@ybl'),
('receiptFooter', 'Thank you for shopping at Sri Srikanteshwara! Visit Again.'),
('currency', '₹'),
('taxInclusive', 'true'),
('thermalWidth', '80mm'),
('autoPrint', 'true'),
('enableKannada', 'true');
