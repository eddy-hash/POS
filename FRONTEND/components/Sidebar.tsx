'use client';
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Products", href: "/dashboard/products", icon: CubeIcon },
  { name: "Sales", href: "/dashboard/sales", icon: CurrencyDollarIcon },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCardIcon },
  { name: "Purchases", href: "/dashboard/purchases", icon: TruckIcon },
  { name: "Customers", href: "/dashboard/customers", icon: UsersIcon },
  { name: "Reports", href: "/dashboard/reports", icon: ChartBarIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("remembered_email");
    localStorage.removeItem("remember_me");
    router.push("/");
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-gradient-to-b from-slate-900 to-slate-800
          border-r border-slate-700/50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          shadow-2xl shadow-slate-900/30
        `}
      >
        <div
          className={`
            flex items-center gap-3 px-4 h-16
            border-b border-slate-700/50
            ${isCollapsed ? "justify-center" : "justify-start"}
          `}
        >
          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className="object-cover"
              priority
              sizes="40px"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-tight">
                Smart POS
              </span>
              <span className="text-slate-400 text-[8px] font-medium tracking-wider uppercase">
                Administration
              </span>
            </div>
          )}
        </div>

        <nav className="h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-2.5 py-2 rounded-lg
                transition-all duration-200 group text-sm
                ${
                  isActive(item.href)
                    ? "bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/5"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <item.icon
                className={`
                  h-5 w-5 flex-shrink-0 transition-colors
                  ${
                    isActive(item.href)
                      ? "text-emerald-400"
                      : "text-slate-400 group-hover:text-emerald-400"
                  }
                `}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">
                  {item.name}
                </span>
              )}
              {!isCollapsed && isActive(item.href) && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 p-3 space-y-1.5 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-2.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 text-sm"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-2.5 py-2 rounded-lg
              text-red-400 hover:text-red-300 hover:bg-red-500/10
              transition-all duration-200 text-sm
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
