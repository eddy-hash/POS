'use client';

import { usePermission } from '@/hooks/usePermission';
import type { Permission } from '@/constants/permissions';

export function useGuardedFetch(permission: Permission) {
  const { hasPermission } = usePermission();
  return { shouldFetch: hasPermission(permission) };
}
