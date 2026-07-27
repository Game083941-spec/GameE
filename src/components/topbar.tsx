"use client";

import Image from "next/image";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { Menu, PlusCircle, LogOut, User as UserIcon, Settings, Code, Check, Shield, LayoutDashboard, FileText, Users, Trophy, Gamepad2, CreditCard, Bell } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopbarProps {
  user: any;
  organizations: any[];
  currentOrgSlug?: string;
  isSuperAdmin?: boolean;
}

export function Topbar({ user, organizations = [], currentOrgSlug, isSuperAdmin }: TopbarProps) {
  const currentOrg = organizations?.find((o) => o.slug === currentOrgSlug);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 shrink-0 lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px]">
          <nav className="grid gap-4 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" priority />
              <span className="tracking-tight">ESportHub</span>
            </Link>
            <div className="grid gap-3 mt-4">
              <Link href={`/dashboard/${currentOrgSlug}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="h-5 w-5" /> Overview
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/forms`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <FileText className="h-5 w-5" /> Forms
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/members`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Users className="h-5 w-5" /> Members
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/notifications`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" /> Notifications
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/teams`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Trophy className="h-5 w-5" /> Teams
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/matches`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Gamepad2 className="h-5 w-5" /> Matches & History
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/billing`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <CreditCard className="h-5 w-5" /> Billing
              </Link>
              <Link href={`/dashboard/${currentOrgSlug}/settings`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" /> Settings
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="flex-1 flex items-center gap-4 sm:flex-initial sm:mr-auto">
          {!organizations || organizations.length <= 1 ? (
            <div className="w-[220px] shadow-sm flex items-center border rounded-md px-4 py-2 bg-background text-sm font-medium">
              <div className="flex items-center gap-2 truncate">
                <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center font-bold text-[10px]">
                  {currentOrg ? currentOrg.name.charAt(0).toUpperCase() : "O"}
                </div>
                <span className="truncate">{currentOrg ? currentOrg.name : "Organization"}</span>
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-[220px] justify-between shadow-sm flex items-center border rounded-md px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                <div className="flex items-center gap-2 truncate">
                  <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center font-bold text-[10px]">
                    {currentOrg ? currentOrg.name.charAt(0).toUpperCase() : "O"}
                  </div>
                  <span className="truncate">{currentOrg ? currentOrg.name : "Select Organization"}</span>
                </div>
                <span className="opacity-50 text-xs">▼</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Organizations</DropdownMenuLabel>
                  {organizations?.map((org) => (
                    <DropdownMenuItem key={org.id} className="cursor-pointer p-0" render={<Link href={`/dashboard/${org.slug}`} className="flex items-center justify-between w-full px-2 py-1.5" />}>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center font-bold text-[10px]">
                           {org.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[120px]">{org.name}</span>
                      </div>
                      {org.slug === currentOrgSlug && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary p-0" render={<Link href="/onboarding" className="flex items-center w-full px-2 py-1.5" />}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full h-9 w-9 ring-2 ring-transparent hover:ring-primary/20 transition-all outline-none">
            <Avatar className="h-9 w-9 overflow-hidden bg-zinc-900 border border-zinc-800">
              <AvatarImage src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'gamer'}&backgroundColor=18181b`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.user_metadata?.full_name && (
                  <p className="font-medium text-sm">{user.user_metadata.full_name}</p>
                )}
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            {isSuperAdmin && (
              <>
                <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary p-0" render={<Link href="/dashboard/admin" className="flex items-center w-full px-2 py-1.5" />}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Super Admin Panel</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem className="cursor-pointer p-0" render={<Link href="/dashboard/profile" className="flex items-center w-full px-2 py-1.5" />}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-0" render={<Link href="/dashboard/settings" className="flex items-center w-full px-2 py-1.5" />}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer p-0" render={<Link href="/dashboard/api" className="flex items-center w-full px-2 py-1.5" />}>
              <Code className="mr-2 h-4 w-4" />
              <span>Developer API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive p-0">
                <button type="submit" className="w-full flex items-center px-2 py-1.5">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
