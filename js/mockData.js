// Mock Dataset for Sri Srikanteshwara Provision and Oil Store

window.initialCategories = [
  { id: "cat-1", name: "Edible Oils & Ghee" },
  { id: "cat-2", name: "Rice & Grains" },
  { id: "cat-3", name: "Dals & Pulses" },
  { id: "cat-4", name: "Flours & Rava" },
  { id: "cat-5", name: "Spices & Masala" },
  { id: "cat-6", name: "Dairy & Bakery" },
  { id: "cat-7", name: "Tea, Coffee & Drinks" },
  { id: "cat-8", name: "Soaps & Cleaning" },
];

window.initialSuppliers = [
  { id: "sup-1", name: "Karnataka Oil Traders", company: "KOT Oils Ltd", mobile: "9845012345", email: "sales@kotoils.com", address: "APMC Yard, Yeshwanthpur, Bengaluru", gstNo: "29AAACK1234F1Z5", totalPurchases: 450000, pendingAmount: 25000 },
  { id: "sup-2", name: "Srikanteshwara Grain Mills", company: "SS Grain Mills", mobile: "9880198765", email: "info@ssgrains.in", address: "Industrial Area, Mandya", gstNo: "29AABCS9876E1Z1", totalPurchases: 680000, pendingAmount: 0 },
  { id: "sup-3", name: "KMF Nandini Distributor", company: "Nandini Milk Agency", mobile: "9448055443", email: "dist@nandini.coop", address: "Mysuru Road, Mysuru", gstNo: "29KMFDK4321P1Z9", totalPurchases: 210000, pendingAmount: 5000 }
];

window.initialProducts = [
  // Oils & Ghee
  {
    id: "p-101",
    barcode: "8901234567890",
    name: "Freedom Refined Sunflower Oil 1L Pouch", // No Kannada name
    brand: "Freedom",
    category: "Edible Oils & Ghee",
    purchasePrice: 112,
    sellingPrice: 130,
    gstRate: 5,
    stockQty: 85,
    minStockAlert: 15,
    unit: "Packet",
    expiryDate: "2027-02-15",
    supplierId: "sup-1",
    image: ""
  },
  {
    id: "p-102",
    barcode: "8901234567891",
    name: "Gemini Filtered Groundnut Oil 1L Bottle", // No Kannada name
    brand: "Gemini",
    category: "Edible Oils & Ghee",
    purchasePrice: 155,
    sellingPrice: 180,
    gstRate: 5,
    stockQty: 42,
    minStockAlert: 10,
    unit: "Bottle",
    expiryDate: "2027-04-10",
    supplierId: "sup-1",
    image: ""
  },
  {
    id: "p-103",
    barcode: "8901234567892",
    name: "Gold Winner Sunflower Oil 1L Can", // No Kannada name
    brand: "Gold Winner",
    category: "Edible Oils & Ghee",
    purchasePrice: 120,
    sellingPrice: 138,
    gstRate: 5,
    stockQty: 60,
    minStockAlert: 15,
    unit: "Bottle",
    expiryDate: "2027-01-20",
    supplierId: "sup-1",
    image: ""
  },
  {
    id: "p-104",
    barcode: "8901234567893",
    name: "Pure Coconut Oil 1L Tin", // No Kannada name
    brand: "Local Mill",
    category: "Edible Oils & Ghee",
    purchasePrice: 175,
    sellingPrice: 205,
    gstRate: 5,
    stockQty: 25,
    minStockAlert: 8,
    unit: "Piece",
    expiryDate: "2027-06-30",
    supplierId: "sup-1",
    image: ""
  },
  {
    id: "p-105",
    barcode: "8901234567894",
    name: "Nandini Pure Cow Ghee 500g Pack", // No Kannada name
    brand: "Nandini",
    category: "Edible Oils & Ghee",
    purchasePrice: 280,
    sellingPrice: 310,
    gstRate: 12,
    stockQty: 30,
    minStockAlert: 5,
    unit: "Packet",
    expiryDate: "2026-12-15",
    supplierId: "sup-3",
    image: ""
  },

  // Rice & Grains
  {
    id: "p-201",
    barcode: "8901000000001",
    name: "Sona Masoori Steam Rice 26kg Bag", // No Kannada name
    brand: "SS Special",
    category: "Rice & Grains",
    purchasePrice: 1250,
    sellingPrice: 1450,
    gstRate: 5,
    stockQty: 45,
    minStockAlert: 10,
    unit: "Piece",
    expiryDate: "2028-01-01",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-202",
    barcode: "8901000000002",
    name: "Bullet Raw Rice 1kg Loose", // No Kannada name
    brand: "SS Mill",
    category: "Rice & Grains",
    purchasePrice: 48,
    sellingPrice: 56,
    gstRate: 0,
    stockQty: 350,
    minStockAlert: 50,
    unit: "Kg",
    expiryDate: "2027-12-31",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-203",
    barcode: "8901000000003",
    name: "India Gate Basmati Rice Premium 5kg Pack", // No Kannada name
    brand: "India Gate",
    category: "Rice & Grains",
    purchasePrice: 520,
    sellingPrice: 610,
    gstRate: 5,
    stockQty: 18,
    minStockAlert: 5,
    unit: "Packet",
    expiryDate: "2027-09-15",
    supplierId: "sup-2",
    image: ""
  },

  // Dals & Pulses
  {
    id: "p-301",
    barcode: "8901111111111",
    name: "Unpolished Toor Dal Premium 1kg", // No Kannada name
    brand: "SS Farm Fresh",
    category: "Dals & Pulses",
    purchasePrice: 135,
    sellingPrice: 155,
    gstRate: 0,
    stockQty: 120,
    minStockAlert: 20,
    unit: "Kg",
    expiryDate: "2027-08-30",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-302",
    barcode: "8901111111112",
    name: "Yellow Moong Dal Split 1kg", // No Kannada name
    brand: "SS Farm Fresh",
    category: "Dals & Pulses",
    purchasePrice: 110,
    sellingPrice: 128,
    gstRate: 0,
    stockQty: 90,
    minStockAlert: 15,
    unit: "Kg",
    expiryDate: "2027-07-20",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-303",
    barcode: "8901111111113",
    name: "Chana Dal Premium 1kg", // No Kannada name
    brand: "SS Farm Fresh",
    category: "Dals & Pulses",
    purchasePrice: 82,
    sellingPrice: 95,
    gstRate: 0,
    stockQty: 110,
    minStockAlert: 20,
    unit: "Kg",
    expiryDate: "2027-10-10",
    supplierId: "sup-2",
    image: ""
  },

  // Flours & Rava
  {
    id: "p-401",
    barcode: "8902222222221",
    name: "Aashirvaad Shudh Chakki Atta 10kg Bag", // No Kannada name
    brand: "Aashirvaad",
    category: "Flours & Rava",
    purchasePrice: 380,
    sellingPrice: 425,
    gstRate: 5,
    stockQty: 40,
    minStockAlert: 10,
    unit: "Piece",
    expiryDate: "2026-11-30",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-402",
    barcode: "8902222222222",
    name: "Pure Ragi Flour 1kg Packet", // No Kannada name
    brand: "SS Mill",
    category: "Flours & Rava",
    purchasePrice: 40,
    sellingPrice: 48,
    gstRate: 0,
    stockQty: 150,
    minStockAlert: 25,
    unit: "Kg",
    expiryDate: "2026-10-15",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-403",
    barcode: "8902222222223",
    name: "Bansi Rava Premium 1kg", // No Kannada name
    brand: "SS Mill",
    category: "Flours & Rava",
    purchasePrice: 44,
    sellingPrice: 52,
    gstRate: 0,
    stockQty: 80,
    minStockAlert: 15,
    unit: "Kg",
    expiryDate: "2026-09-30",
    supplierId: "sup-2",
    image: ""
  },

  // Spices & Masala
  {
    id: "p-501",
    barcode: "8903333333331",
    name: "Tata Vacuum Evaporated Iodized Salt 1kg", // No Kannada name
    brand: "Tata",
    category: "Spices & Masala",
    purchasePrice: 22,
    sellingPrice: 28,
    gstRate: 0,
    stockQty: 200,
    minStockAlert: 40,
    unit: "Packet",
    expiryDate: "2028-05-01",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-502",
    barcode: "8903333333332",
    name: "MTR Sambar Powder 200g Pack", // No Kannada name
    brand: "MTR",
    category: "Spices & Masala",
    purchasePrice: 65,
    sellingPrice: 75,
    gstRate: 12,
    stockQty: 60,
    minStockAlert: 10,
    unit: "Packet",
    expiryDate: "2027-03-25",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-503",
    barcode: "8903333333333",
    name: "Everest Turmeric Powder 100g", // No Kannada name
    brand: "Everest",
    category: "Spices & Masala",
    purchasePrice: 30,
    sellingPrice: 36,
    gstRate: 5,
    stockQty: 90,
    minStockAlert: 15,
    unit: "Packet",
    expiryDate: "2027-05-15",
    supplierId: "sup-2",
    image: ""
  },

  // Dairy & Bakery
  {
    id: "p-601",
    barcode: "8904444444441",
    name: "Nandini Pasteurised Toned Milk 500ml", // No Kannada name
    brand: "Nandini",
    category: "Dairy & Bakery",
    purchasePrice: 22,
    sellingPrice: 24,
    gstRate: 0,
    stockQty: 6,
    minStockAlert: 10,
    unit: "Packet",
    expiryDate: "2026-08-04",
    supplierId: "sup-3",
    image: ""
  },
  {
    id: "p-602",
    barcode: "8904444444442",
    name: "Nandini Curd 500g Pouch", // No Kannada name
    brand: "Nandini",
    category: "Dairy & Bakery",
    purchasePrice: 28,
    sellingPrice: 32,
    gstRate: 0,
    stockQty: 25,
    minStockAlert: 8,
    unit: "Packet",
    expiryDate: "2026-08-06",
    supplierId: "sup-3",
    image: ""
  },

  // Soaps & Cleaning
  {
    id: "p-801",
    barcode: "8905555555551",
    name: "Mysore Sandal Soap 125g Single Bar", // No Kannada name
    brand: "Mysore Sandal",
    category: "Soaps & Cleaning",
    purchasePrice: 62,
    sellingPrice: 72,
    gstRate: 18,
    stockQty: 80,
    minStockAlert: 15,
    unit: "Piece",
    expiryDate: "2028-12-31",
    supplierId: "sup-2",
    image: ""
  },
  {
    id: "p-802",
    barcode: "8905555555552",
    name: "Vim Dishwash Bar Yellow 200g", // No Kannada name
    brand: "Vim",
    category: "Soaps & Cleaning",
    purchasePrice: 18,
    sellingPrice: 22,
    gstRate: 18,
    stockQty: 100,
    minStockAlert: 20,
    unit: "Piece",
    expiryDate: "2028-06-30",
    supplierId: "sup-2",
    image: ""
  }
];

window.initialCustomers = [
  { id: "cust-101", name: "Ramesh Kumar", mobile: "9845112233", address: "Saraswathipuram, Mysuru", gstNo: "", outstandingBalance: 0, totalPurchases: 14500, createdAt: "2026-01-10" },
  { id: "cust-102", name: "Shankara Gowda", mobile: "9900887766", address: "Kuvempunagar, Mysuru", gstNo: "29AABCU5544R1Z3", outstandingBalance: 450, totalPurchases: 38200, createdAt: "2026-02-15" },
  { id: "cust-103", name: "Meenakshi Amma", mobile: "9740556677", address: "Gokulam 3rd Stage, Mysuru", gstNo: "", outstandingBalance: 0, totalPurchases: 9200, createdAt: "2026-03-01" },
];

window.initialUsers = [
  { id: "user-1", username: "admin", name: "Srikanteshwara (Owner)", role: "Admin", pin: "1234", status: "Active", lastLogin: "2026-08-02 20:45", shift: "Morning", attendanceStatus: "Present", attendanceThisMonth: 22 },
  { id: "user-2", username: "manager", name: "Manjunath (Manager)", role: "Manager", pin: "1234", status: "Active", lastLogin: "2026-08-02 18:30", shift: "Evening", attendanceStatus: "Present", attendanceThisMonth: 20 },
  { id: "user-3", username: "cashier", name: "Basavaraj (Billing)", role: "Cashier", pin: "1234", status: "Active", lastLogin: "2026-08-02 20:40", shift: "Evening", attendanceStatus: "Absent", attendanceThisMonth: 18 },
];

window.initialInvoices = [
  {
    id: "inv-1001",
    invoiceNo: "SS-2026-1001",
    customerId: "cust-101",
    customerName: "Ramesh Kumar",
    customerMobile: "9845112233",
    cashierId: "user-3",
    cashierName: "Basavaraj (Billing)",
    items: [
      { productId: "p-101", barcode: "8901234567890", name: "Freedom Refined Sunflower Oil 1L Pouch", unit: "Packet", qty: 2, rate: 130, discount: 0, gstRate: 5, gstAmount: 12.38, total: 260 },
      { productId: "p-301", barcode: "8901111111111", name: "Unpolished Toor Dal Premium 1kg", unit: "Kg", qty: 1, rate: 155, discount: 5, gstRate: 0, gstAmount: 0, total: 150 }
    ],
    subtotal: 410,
    totalDiscount: 5,
    totalGst: 12.38,
    grandTotal: 405,
    roundOff: 0,
    paymentMethod: "UPI",
    paymentDetails: "TxnID: UPI/98451/9876",
    status: "Completed",
    date: "2026-08-02",
    time: "19:15:30"
  }
];

window.initialStoreSettings = {
  storeName: "Sri Srikanteshwara Provision & Oil Store",
  tagLine: "Quality Provisions & Edible Oils Since 1998",
  address: "No. 45, Main Market Road, Near Temple Square, Mysuru - 570001",
  phone: "+91 98450 12345 / 0821-2456789",
  gstNo: "29ABCDE1234F1Z9",
  upiId: "9845012345@ybl",
  receiptFooter: "Thank you for shopping at Sri Srikanteshwara! Visit Again.",
  currency: "₹",
  taxInclusive: true,
  thermalWidth: "80mm", // Legacy, replaced by paperSize
  paperSize: "80mm", // Default paper size for printing
  dashboardResetPin: "", // New setting for dashboard reset PIN
  autoPrint: true,
  shortcutBarEnabled: true,
  shortcutBarPosition: { x: 300, y: 520 },
  shortcutBarScale: 1,
  posCartWidth: 420, // Default width for the POS cart panel
  quickAccessTabs: [
    { label: 'Oils', category: 'Edible Oils & Ghee' },
    { label: 'Ghee', category: 'Edible Oils & Ghee' },
    { label: 'Milk Products', category: 'Dairy & Bakery' },
    { label: 'Rice', category: 'Rice & Grains' },
    { label: 'Grains', category: 'Rice & Grains' },
    { label: 'Dals', category: 'Dals & Pulses' },
    { label: 'Flours', category: 'Flours & Rava' },
    { label: 'Detergents', category: 'Soaps & Cleaning' }
  ]
};
