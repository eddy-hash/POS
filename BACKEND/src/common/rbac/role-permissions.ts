import { UserRole } from '../../auth/enums/roles.enum';
import { Permission } from './permissions.enum';

const MANAGER_PERMS: Permission[] = [
  Permission.VIEW_DASHBOARD,
  Permission.VIEW_PRODUCTS, Permission.CREATE_PRODUCT,
  Permission.EDIT_PRODUCT, Permission.DELETE_PRODUCT,
  Permission.VIEW_INVENTORY, Permission.MANAGE_INVENTORY,
  Permission.VIEW_POS, Permission.PROCESS_SALE, Permission.VOID_SALE,
  Permission.VIEW_SALES, Permission.SALE_READ, Permission.SALE_CREATE, Permission.SALE_DELETE,
  Permission.VIEW_CUSTOMERS, Permission.MANAGE_CUSTOMERS,
  Permission.CUSTOMER_READ, Permission.CUSTOMER_CREATE,
  Permission.CUSTOMER_UPDATE, Permission.CUSTOMER_DELETE,
  Permission.EXPENSE_READ, Permission.EXPENSE_CREATE,
  Permission.EXPENSE_UPDATE, Permission.EXPENSE_DELETE,
  Permission.PURCHASE_READ, Permission.PURCHASE_CREATE, Permission.PURCHASE_DELETE,
  Permission.VIEW_REPORTS, Permission.VIEW_FINANCIAL_REPORTS,
  Permission.VIEW_SUPPLIERS, Permission.MANAGE_SUPPLIERS,
  Permission.VIEW_USERS,
];

const CASHIER_PERMS: Permission[] = [
  Permission.VIEW_DASHBOARD,
  Permission.VIEW_POS, Permission.PROCESS_SALE,
  Permission.VIEW_SALES, Permission.SALE_READ, Permission.SALE_CREATE,
  Permission.VIEW_CUSTOMERS, Permission.MANAGE_CUSTOMERS,
  Permission.CUSTOMER_READ, Permission.CUSTOMER_CREATE, Permission.CUSTOMER_UPDATE,
  // Read-only financial visibility
  Permission.EXPENSE_READ,
  Permission.PURCHASE_READ,
  // No VIEW_PRODUCTS, no VIEW_REPORTS, no CREATE/UPDATE/DELETE anywhere
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.MANAGER]: MANAGER_PERMS,
  [UserRole.CASHIER]: CASHIER_PERMS,
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
