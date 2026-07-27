"use client";

import Image from "next/image";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { Menu, PlusCircle, LogOut, User as UserIcon, Settings, Code, Check, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        <SheetTrigger className="shrink-0 lg:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px]">
          <nav className="grid gap-4 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" priority />
              <span className="tracking-tight">GameFormHub</span>
            </Link>
            <div className="grid gap-2 mt-4">
              <Link href={`/dashboard/${currentOrgSlug}`} className="text-muted-foreground hover:text-foreground">Overview</Link>
              <Link href={`/dashboard/${currentOrgSlug}/forms`} className="text-muted-foreground hover:text-foreground">Forms</Link>
              <Link href={`/dashboard/${currentOrgSlug}/members`} className="text-muted-foreground hover:text-foreground">Members</Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Organization Switcher & Branding */}
        <div className="flex-1 flex items-center gap-4 sm:flex-initial sm:mr-auto">
          <Link href="/" className="hidden lg:flex items-center gap-2 font-bold tracking-tight text-lg mr-4">
             <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-md shadow-sm" priority />
              GameFormHub
          </Link>

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
              <DropdownMenuLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Organizations</DropdownMenuLabel>
              <DropdownMenuGroup>
                {organizations?.map((org) => (
                  <DropdownMenuItem key={org.id} className="cursor-pointer p-0">
                    <Link href={`/dashboard/${org.slug}`} className="flex items-center justify-between w-full px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-sm bg-muted flex items-center justify-center font-bold text-[10px]">
                           {org.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[120px]">{org.name}</span>
                      </div>
                      {org.slug === currentOrgSlug && <Check className="h-4 w-4 text-primary" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary p-0">
                <Link href="/onboarding" className="flex items-center w-full px-2 py-1.5">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create Organization</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full h-9 w-9 ring-2 ring-transparent hover:ring-primary/20 transition-all outline-none">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
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
                <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary p-0">
                  <Link href="/dashboard/admin" className="flex items-center w-full px-2 py-1.5">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Super Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem className="cursor-pointer p-0">
              <Link href="/dashboard/profile" className="flex items-center w-full px-2 py-1.5">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-0">
              <Link href="/dashboard/settings" className="flex items-center w-full px-2 py-1.5">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer p-0">
              <Link href="/dashboard/api" className="flex items-center w-full px-2 py-1.5">
                <Code className="mr-2 h-4 w-4" />
                <span>Developer API</span>
              </Link>
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
