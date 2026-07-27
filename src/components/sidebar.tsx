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
  Shield,
  Gamepad2,
  Trophy,
  LogOut,
  Bell
} from "lucide-react";
import { logout } from "@/actions/auth";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar({ orgSlug, isSuperAdmin, userEmail }: { orgSlug: string; isSuperAdmin?: boolean; userEmail?: string }) {
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
      href: `/dashboard/${orgSlug}/notifications`,
      label: "Notifications",
      icon: Bell,
      active: pathname === `/dashboard/${orgSlug}/notifications`,
    },
    {
      href: `/dashboard/${orgSlug}/teams`,
      label: "Teams",
      icon: Trophy,
      active: pathname === `/dashboard/${orgSlug}/teams`,
    },
    {
      href: `/dashboard/${orgSlug}/matches`,
      label: "Matches & History",
      icon: Gamepad2,
      active: pathname === `/dashboard/${orgSlug}/matches`,
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
    <div className="hidden border-r bg-muted/20 lg:flex lg:flex-col lg:w-64 shrink-0 h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md shadow-sm" priority />
          ESportHub
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1.5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              prefetch={true}
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

      <div className="p-4 border-t border-border/50 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail || 'gamer'}&backgroundColor=18181b`} 
              alt="User Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {userEmail ? userEmail.split('@')[0] : 'Gamer'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail || 'Player'}
            </p>
          </div>
          <ThemeToggle />
          <button 
            onClick={() => logout()}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
