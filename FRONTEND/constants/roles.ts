export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.CASHIER]: 'Cashier',
};

// Numeric IDs — must match backend `roles` table
export const ROLE_ID: Record<Role, number> = {
  [ROLES.ADMIN]: 1,
  [ROLES.MANAGER]: 2,
  [ROLES.CASHIER]: 3,
};

export const ROLE_FROM_ID: Record<number, Role> = {
  1: ROLES.ADMIN,
  2: ROLES.MANAGER,
  3: ROLES.CASHIER,
};

export function normalizeRole(input?: string | null): Role {
  const v = (input ?? '').toLowerCase();
  if (v === 'admin' || v === 'manager' || v === 'cashier') return v as Role;
  return ROLES.CASHIER; // safe fallback for any stale 'viewer'
}
