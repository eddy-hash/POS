'use client';

import { usePermission } from '@/hooks/usePermission';
import type { Permission } from '@/constants/permissions';
import type { Role } from '@/constants/roles';

interface PermissionGateProps {
  permission?: Permission;
  anyOf?: Permission[];
  roles?: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function PermissionGate({
  permission,
  anyOf,
  roles,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasRole } = usePermission();

  const allowed =
    (!permission || hasPermission(permission)) &&
    (!anyOf || hasAnyPermission(anyOf)) &&
    (!roles || hasRole(roles));

  return <>{allowed ? children : fallback}</>;
}
