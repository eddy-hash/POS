export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',

  // Products
  VIEW_PRODUCTS = 'view_products',
  CREATE_PRODUCT = 'create_product',
  EDIT_PRODUCT = 'edit_product',
  DELETE_PRODUCT = 'delete_product',

  // Inventory
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',

  // POS / Sales
  VIEW_POS = 'view_pos',
  PROCESS_SALE = 'process_sale',
  VOID_SALE = 'void_sale',
  VIEW_SALES = 'view_sales',
  SALE_READ = 'sale_read',
  SALE_CREATE = 'sale_create',
  SALE_DELETE = 'sale_delete',

  // Customers
  VIEW_CUSTOMERS = 'view_customers',
  MANAGE_CUSTOMERS = 'manage_customers',
  CUSTOMER_READ = 'customer_read',
  CUSTOMER_CREATE = 'customer_create',
  CUSTOMER_UPDATE = 'customer_update',
  CUSTOMER_DELETE = 'customer_delete',

  // Expenses
  EXPENSE_READ = 'expense_read',
  EXPENSE_CREATE = 'expense_create',
  EXPENSE_UPDATE = 'expense_update',
  EXPENSE_DELETE = 'expense_delete',

  // Purchases
  PURCHASE_READ = 'purchase_read',
  PURCHASE_CREATE = 'purchase_create',
  PURCHASE_DELETE = 'purchase_delete',

  // Reports
  VIEW_REPORTS = 'view_reports',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',

  // Users
  VIEW_USERS = 'view_users',

  // Suppliers
  VIEW_SUPPLIERS = 'view_suppliers',
  MANAGE_SUPPLIERS = 'manage_suppliers',
}
