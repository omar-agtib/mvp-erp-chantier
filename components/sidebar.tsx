"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Wrench,
  AlertTriangle,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Projets", href: "/projects", icon: FolderKanban },
  { name: "Inventaire", href: "/inventory", icon: Package },
  { name: "Outillage", href: "/tools", icon: Wrench },
  { name: "Signalements", href: "/issues", icon: AlertTriangle },
  { name: "Facturation", href: "/invoices", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Function to check screen size and update sidebar state
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint (1024px)
      setCollapsed(mobile);
    };

    // Check on initial mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">
              ERP Chantier
            </span>
            <span className="text-xs text-muted-foreground">v1.0 MVP</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn("w-5 h-5 shrink-0", isActive && "text-primary")}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-sidebar-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Paramètres</span>}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 justify-center text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
