"use client";

import { ChevronsUpDown, LogOut, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/nav";
import { currentUser } from "@/lib/data";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <BrandLogo />
        </Link>
      </div>

      <div className="px-3 pt-4">
        <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-white/[0.03] px-2.5 py-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
            SP
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-sidebar-foreground">SAFEX Platform</p>
            <p className="text-[10px] text-sidebar-muted">Production · India</p>
          </div>
          <ChevronsUpDown className="size-3.5 text-sidebar-muted" />
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted/70">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "text-sidebar-muted hover:bg-white/[0.04] hover:text-sidebar-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "size-[16px] shrink-0 transition-colors",
                      active ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground",
                    )}
                    strokeWidth={1.9}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="pt-1">
          <Link
            href="/companies/new"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg border border-dashed border-sidebar-border px-2.5 py-2 text-[12px] font-medium text-sidebar-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Plus className="size-3.5" />
            Create company
          </Link>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2">
          <ShieldCheck className="size-3.5 text-success" />
          <p className="flex-1 text-[11px] text-sidebar-muted">All systems operational</p>
          <span className="size-1.5 animate-pulse-ring rounded-full bg-success" />
        </div>
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-[10px] font-semibold text-white ring-1 ring-white/10">
            {currentUser.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-sidebar-foreground">{currentUser.name}</p>
            <p className="truncate text-[10px] text-sidebar-muted">{currentUser.role}</p>
          </div>
          <LogoutButton>
            <button
              className="rounded-md p-1.5 text-sidebar-muted transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}
