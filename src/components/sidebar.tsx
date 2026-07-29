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
  Bell,
  Megaphone,
  Database,
} from "lucide-react";
import { logout } from "@/actions/auth";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { EventBanner } from "@/components/EventBanner";

export function Sidebar({
  orgSlug,
  isSuperAdmin,
  userEmail,
  memberRole = "VIEWER",
  sidebarPermissions = [],
  globalRole,
}: {
  orgSlug: string;
  isSuperAdmin?: boolean;
  userEmail?: string;
  memberRole?: string;
  sidebarPermissions?: string[];
  globalRole?: string;
}) {
  const pathname = usePathname();

  let routes = [
    {
      id: "overview",
      href: `/dashboard/${orgSlug}`,
      label: "Revenue Dashboard",
      icon: LayoutDashboard,
      active: pathname === `/dashboard/${orgSlug}`,
    },
    {
      id: "forms",
      href: `/dashboard/${orgSlug}/forms`,
      label: "Create Tournament",
      icon: FileText,
      active: pathname === `/dashboard/${orgSlug}/forms`,
    },
    {
      id: "adpage",
      href: `/dashboard/${orgSlug}/adpage`,
      label: "Ad Page",
      icon: Megaphone,
      active: pathname === `/dashboard/${orgSlug}/adpage`,
    },
    {
      id: "members",
      href: `/dashboard/${orgSlug}/members`,
      label: "Members",
      icon: Users,
      active: pathname === `/dashboard/${orgSlug}/members`,
    },
    {
      id: "notifications",
      href: `/dashboard/${orgSlug}/notifications`,
      label: "Send IDP",
      icon: Bell,
      active: pathname === `/dashboard/${orgSlug}/notifications`,
    },
    {
      id: "teams",
      href: `/dashboard/${orgSlug}/teams`,
      label: "Current Events",
      icon: Trophy,
      active: pathname === `/dashboard/${orgSlug}/teams`,
    },
    {
      id: "analytics-teams",
      href: `/dashboard/${orgSlug}/analytics-teams`,
      label: "Permanent Teams",
      icon: Database,
      active: pathname === `/dashboard/${orgSlug}/analytics-teams`,
    },
    {
      id: "matches",
      href: `/dashboard/${orgSlug}/matches`,
      label: "Matches & History",
      icon: Gamepad2,
      active: pathname === `/dashboard/${orgSlug}/matches`,
    },
    {
      id: "billing",
      href: `/dashboard/${orgSlug}/billing`,
      label: "Billing",
      icon: CreditCard,
      active: pathname === `/dashboard/${orgSlug}/billing`,
    },
    {
      id: "settings",
      href: `/dashboard/${orgSlug}/settings`,
      label: "Settings",
      icon: Settings,
      active: pathname === `/dashboard/${orgSlug}/settings`,
    },
    {
      id: "event-registration",
      href: `/dashboard/${orgSlug}/event-registration`,
      label: "Event Registration",
      icon: Megaphone,
      active: pathname === `/dashboard/${orgSlug}/event-registration`,
      highlight: true,
    },
  ];

  if (globalRole === "USER_ADMIN") {
    const allowed = ["overview", "forms", "notifications", "teams", "analytics-teams", "adpage"];
    routes = routes.filter(route => allowed.includes(route.id));
  }
  else if (!isSuperAdmin && memberRole === "MODERATOR") {
    routes = routes.filter(route =>
      route.id === "overview" || sidebarPermissions.includes(route.id)
    );
  } else if (!isSuperAdmin && memberRole === "VIEWER") {
    routes = routes.filter(route => route.id === "overview");
  }

  if (isSuperAdmin) {
    routes.push({
      id: "superadmin",
      href: "/dashboard/admin",
      label: "Super Admin Panel",
      icon: Shield,
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <div className="hidden border-r bg-muted/20 lg:flex lg:flex-col lg:w-64 shrink-0 h-screen">
      {/* ── Logo ── */}
      <div className="p-4 border-b border-border/50 shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} className="rounded-md shadow-sm" priority />
          ESportHub
        </Link>
      </div>

      {/* ── Nav links — scrollable middle section ── */}
      <div className="flex-1 overflow-y-auto py-6 min-h-0">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1.5">
          {routes.map((route) => {
            const isHighlight = (route as any).highlight;
            return (
              <Link
                key={route.href}
                href={route.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  route.active && !isHighlight
                    ? "bg-primary/10 text-primary shadow-sm"
                    : isHighlight
                    ? route.active
                      ? "text-white shadow-md"
                      : "text-violet-300 hover:text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={
                  isHighlight
                    ? {
                        background: route.active
                          ? "linear-gradient(135deg,#7c3aed,#06b6d4)"
                          : "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.15))",
                        border: "1px solid rgba(124,58,237,0.4)",
                      }
                    : undefined
                }
              >
                <route.icon
                  className={cn(
                    "h-4 w-4",
                    isHighlight
                      ? "text-violet-400"
                      : route.active
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                {route.label}
                {isHighlight && (
                  <span
                    className="ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(124,58,237,0.35)", color: "#c4b5fd" }}
                  >
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Logout — always pinned at the bottom ── */}
      <div className="p-4 border-t border-border/50 bg-muted/10 shrink-0">
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
