"use client";

import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-sidebar-border lg:block">
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-[264px] animate-slide-in-left shadow-2xl">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileOpen(false)}
              className="absolute -right-11 top-3 text-white hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </Button>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <Header onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
