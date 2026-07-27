"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield
} from "lucide-react";

export function Sidebar({ orgSlug, isSuperAdmin }: { orgSlug: string; isSuperAdmin?: boolean }) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/dashboard/${orgSlug}`,
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === `/dashboard/${orgSlug}`,
    },
    {
      href: `/dashboard/${orgSlug}/forms`,
      label: "Forms",
      icon: FileText,
      active: pathname === `/dashboard/${orgSlug}/forms`,
    },
    {
      href: `/dashboard/${orgSlug}/members`,
      label: "Members",
      icon: Users,
      active: pathname === `/dashboard/${orgSlug}/members`,
    },
    {
      href: `/dashboard/${orgSlug}/billing`,
      label: "Billing",
      icon: CreditCard,
      active: pathname === `/dashboard/${orgSlug}/billing`,
    },
    {
      href: `/dashboard/${orgSlug}/settings`,
      label: "Settings",
      icon: Settings,
      active: pathname === `/dashboard/${orgSlug}/settings`,
    },
  ];

  if (isSuperAdmin) {
    routes.push({
      href: "/dashboard/admin",
      label: "Super Admin Panel",
      icon: Shield,
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <div className="hidden border-r bg-muted/20 lg:block lg:w-64 shrink-0 h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1.5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                route.active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <route.icon className={cn("h-4 w-4", route.active ? "text-primary" : "text-muted-foreground")} />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
