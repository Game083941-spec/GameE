"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard
} from "lucide-react";

export function Sidebar({ orgSlug }: { orgSlug: string }) {
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

  return (
    <div className="hidden border-r bg-muted/20 lg:block lg:w-64 shrink-0">
      <div className="flex h-14 items-center border-b px-6">
        <Link href={`/dashboard/${orgSlug}`} className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            GF
          </span>
          <span className="tracking-tight">GameFormHub</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                route.active ? "bg-muted text-foreground" : "hover:bg-muted"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
