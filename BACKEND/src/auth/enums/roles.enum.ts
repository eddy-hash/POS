export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
}

// Numeric IDs used in DB / JWT payload (must match the roles table)
export const ROLE_ID: Record<UserRole, number> = {
  [UserRole.ADMIN]: 1,
  [UserRole.MANAGER]: 2,
  [UserRole.CASHIER]: 3,
};

export const ROLE_FROM_ID: Record<number, UserRole> = {
  1: UserRole.ADMIN,
  2: UserRole.MANAGER,
  3: UserRole.CASHIER,
};

// Re-export so existing imports of `Permission` from this file keep working
export { Permission } from '../../common/rbac/permissions.enum';
