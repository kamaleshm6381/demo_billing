"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
ReceiptText,
Utensils,
History,
Settings,
ChartColumnIncreasing,
ChevronRight,
} from "lucide-react";

const navigationItems = [
{
label: "Billing Overview",
icon: ChartColumnIncreasing,
href: "/overview",
description: "Sales and analytics",
},
{
label: "Billing Counter",
icon: ReceiptText,
href: "/",
description: "Create customer bills",
},
{
label: "Menu Management",
icon: Utensils,
href: "/menu",
description: "Manage food items",
},
{
label: "Bill History",
icon: History,
href: "/history",
description: "View previous bills",
},
{
label: "Settings",
icon: Settings,
href: "/settings",
description: "Application settings",
},
];

type AppSidebarProps = {
collapsed?: boolean;
onNavigate?: () => void;
};

export function AppSidebar({
collapsed = false,
onNavigate,
}: AppSidebarProps) {
const pathname = usePathname();

return (
<aside
className={`flex h-full min-h-0 shrink-0 flex-col overflow-hidden
        border-r border-green-800/40 bg-[#14532D] text-white
        transition-[width] duration-300
        ${collapsed ? "w-20 p-3" : "w-64 p-5"}`}
>
<div
className={`mb-9 flex shrink-0 items-center ${
          collapsed ? "justify-center" : "gap-3"
        }`}
> <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16A34A] shadow-sm"> <Utensils size={23} /> </div>


    {!collapsed && (
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold tracking-tight">
          Demo v-1.0
        </h1>
        <p className="text-xs text-green-200">
          Hotel Billing System
        </p>
      </div>
    )}
  </div>

  {!collapsed && (
    <p className="mb-3 shrink-0 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-green-300">
      Main Menu
    </p>
  )}

  <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
    {navigationItems.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.href === "/"
          ? pathname === "/"
          : pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

      return (
        <Link
          key={item.href}
          href={item.href}
          title={collapsed ? item.label : item.description}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
          onClick={onNavigate}
          className={`group relative flex min-h-11 w-full items-center rounded-lg py-3 transition-all duration-200 ${
            collapsed
              ? "justify-center px-2"
              : "justify-start gap-3 px-3"
          } ${
            isActive
              ? "bg-[#16A34A] text-white shadow-sm"
              : "text-green-100 hover:bg-[#166534] hover:text-white"
          }`}
        >
          {isActive && (
            <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-white/90" />
          )}

          <Icon
            size={19}
            strokeWidth={isActive ? 2.4 : 1.8}
            className="shrink-0"
          />

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
                {item.label}
              </span>
              {isActive && (
                <ChevronRight
                  size={16}
                  className="shrink-0 text-green-100"
                />
              )}
            </>
          )}
        </Link>
      );
    })}
  </nav>

  <div className="mt-4 shrink-0 border-t border-green-800 pt-4">
    {!collapsed ? (
      <div className="rounded-lg bg-[#166534]/60 p-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <p className="text-xs font-medium text-green-50">
            Local Billing
          </p>
        </div>
        <p className="mt-2 text-[11px] text-green-200">
          Frontend Application
        </p>
      </div>
    ) : (
      <div
        title="Local Billing"
        className="flex justify-center"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
    )}
  </div>
</aside>

);
}
