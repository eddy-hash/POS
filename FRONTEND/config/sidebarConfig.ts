import {
  HomeIcon,
  CubeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { PERMISSIONS, type Permission } from '@/constants/permissions';

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission;
}

/**
 * Only includes routes that actually exist under app/dashboard/.
 * Verified: account, activity, expenses, products, profile, purchases,
 *           reports, sales, security, settings, + /dashboard root
 */
export const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard',           icon: HomeIcon,           permission: PERMISSIONS.VIEW_DASHBOARD },
  { name: 'Products',  href: '/dashboard/products',  icon: CubeIcon,           permission: PERMISSIONS.VIEW_PRODUCTS },
  { name: 'Sales',     href: '/dashboard/sales',     icon: CurrencyDollarIcon, permission: PERMISSIONS.VIEW_SALES },
  { name: 'Expenses',  href: '/dashboard/expenses',  icon: CreditCardIcon,     permission: PERMISSIONS.EXPENSE_READ },
  { name: 'Purchases', href: '/dashboard/purchases', icon: TruckIcon,          permission: PERMISSIONS.PURCHASE_READ },
  { name: 'Reports',   href: '/dashboard/reports',   icon: ChartBarIcon,       permission: PERMISSIONS.VIEW_REPORTS },
  { name: 'Settings',  href: '/dashboard/settings',  icon: Cog6ToothIcon,      permission: PERMISSIONS.VIEW_SETTINGS },
];
