'use client';

import { useAuth } from '@/context/AuthContext';
import { normalizeRole, type Role } from '@/constants/roles';
import { getPermissionsForRole, type Permission } from '@/constants/permissions';

export function usePermission() {
  const { user } = useAuth();
  const role: Role | null = user?.role ? normalizeRole(user.role) : null;

  const hasPermission = (perm: Permission): boolean => {
    if (!role) return false;
    return getPermissionsForRole(role).includes(perm);
  };

  const hasAnyPermission = (perms: Permission[]): boolean =>
    perms.some(hasPermission);

  const hasAllPermissions = (perms: Permission[]): boolean =>
    perms.every(hasPermission);

  const hasRole = (roleOrRoles: Role | Role[]): boolean => {
    if (!role) return false;
    const list = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return list.includes(role);
  };

  return { role, hasPermission, hasAnyPermission, hasAllPermissions, hasRole };
}
