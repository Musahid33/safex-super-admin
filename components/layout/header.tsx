"use client";

import { ChevronDown, LogOut, Menu, Settings, UserRound } from "lucide-react";
import Link from "next/link";

import { GlobalSearch } from "@/components/layout/global-search";
import { LogoutButton } from "@/components/layout/logout-button";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@/lib/data";

export function Header({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </Button>

      <div className="flex-1">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationMenu />

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20">
              <span className="relative flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-[10px] font-semibold text-white">
                {currentUser.initials}
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-background bg-success" />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-[12px] font-medium leading-tight text-foreground">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] leading-tight text-muted-foreground">
                  {currentUser.role}
                </span>
              </span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case tracking-normal">
              <span className="block text-[12px] font-semibold text-foreground">{currentUser.name}</span>
              <span className="block text-[11px] font-normal text-muted-foreground">{currentUser.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound /> My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Workspace settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutButton>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                <LogOut className="!text-destructive" /> Log out
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
