"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
PanelLeft,
Menu,
} from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
Sheet,
SheetContent,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet";

type AppShellProps = {
children: ReactNode;
};

const pageDetails: Record<
string,
{ title: string; description: string }

> = {
  "/overview": {
  title: "Overview Data",
  description: "Analytics Dashboard",
  },
  "/": {
  title: "Billing Counter",
  description: "Create customer bills and process payments.",
  },
  "/menu": {
  title: "Menu Management",
  description: "Add, edit, and manage your hotel food items.",
  },
  "/history": {
  title: "Bill History",
  description: "View your previous customer bills.",
  },
  "/settings": {
  title: "Settings",
  description: "Manage your billing application settings.",
  },
  };

  export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] =
  useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
  useState(false);

  const currentPage =
  pageDetails[pathname] ??
  (pathname.startsWith("/menu/")
  ? pageDetails["/menu"]
  : {
  title: "Hotel Billing System",
  description: "Manage your hotel billing application.",
  });

return ( <div className="flex h-dvh w-full overflow-hidden bg-[#F0FDF4]">
{/* Desktop Sidebar */}
<div
className={`hidden h-full shrink-0 overflow-hidden transition-[width] duration-300 md:block ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
> <AppSidebar collapsed={sidebarCollapsed} /> </div>


  {/* Main Workspace */}
  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
    {/* Desktop Topbar */}
    <header className="hidden h-14 shrink-0 items-center gap-3 border-b border-[#DCFCE7] bg-white px-5 md:flex">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={
          sidebarCollapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        onClick={() =>
          setSidebarCollapsed((current) => !current)
        }
        className="text-[#14532D] hover:bg-green-50"
      >
        <PanelLeft size={20} />
      </Button>

      <span className="font-bold text-[#14532D]">
        Hello User 😀
      </span>
    </header>

    {/* Mobile Topbar and Drawer */}
    <Sheet
      open={mobileSidebarOpen}
      onOpenChange={setMobileSidebarOpen}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#DCFCE7] bg-white px-3 md:hidden">
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open sidebar"
            className="text-[#14532D]"
          >
            <Menu size={21} />
          </Button>
        </SheetTrigger>

        <span className="truncate font-bold text-[#14532D]">
          Hotel Billing System
        </span>
      </header>

      <SheetContent
        side="left"
        className="w-64 border-none bg-[#14532D] p-0 text-white"
      >
        <SheetTitle className="sr-only">
          Hotel Navigation
        </SheetTitle>

        <AppSidebar
          onNavigate={() => setMobileSidebarOpen(false)}
        />
      </SheetContent>
    </Sheet>

    {/* Every page uses the same header and workspace */}
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:p-4 lg:p-5">
      <AppHeader
        title={currentPage.title}
        description={currentPage.description}
      />

      <section className="mt-4 min-h-0 flex-1">
        {children}
      </section>
    </main>
  </div>
</div>


);
}
