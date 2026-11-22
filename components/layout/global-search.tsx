"use client";

import { ArrowRight, Building2, CornerDownLeft, FileText, Search, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badges";
import { companies } from "@/lib/data";
import { searchablePages } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const companyResults = companies
      .filter(
        (company) =>
          !q ||
          company.name.toLowerCase().includes(q) ||
          company.subdomain.includes(q) ||
          company.industry.toLowerCase().includes(q),
      )
      .slice(0, 5);
    const pageResults = searchablePages.filter((page) => !q || page.label.toLowerCase().includes(q));
    return { companyResults, pageResults };
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-full max-w-[360px] items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-border hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 truncate">Search companies, tickets, settings…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideClose className="top-[18%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Global search</DialogTitle>
          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search companies, pages and actions…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2 scrollbar-thin">
            {results.companyResults.length > 0 && (
              <div className="mb-1">
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Companies
                </p>
                {results.companyResults.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => go(`/companies/${company.id}`)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: company.logoColor }}
                    >
                      {company.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-foreground">
                        {company.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {company.subdomain} · {company.plan}
                      </span>
                    </span>
                    <StatusBadge status={company.status} />
                    <CornerDownLeft className="size-3 text-muted-foreground/50" />
                  </button>
                ))}
              </div>
            )}

            {results.pageResults.length > 0 && (
              <div>
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigate
                </p>
                {results.pageResults.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.href}
                      onClick={() => go(page.href)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="flex-1 text-[13px] text-foreground">{page.label}</span>
                      <ArrowRight className="size-3 text-muted-foreground/50" />
                    </button>
                  );
                })}
              </div>
            )}

            {results.companyResults.length === 0 && results.pageResults.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Search className="size-4" />
                </span>
                <p className="text-[13px] font-medium text-foreground">No results for “{query}”</p>
                <p className="text-[12px] text-muted-foreground">
                  Try a company name, subdomain or page like “analytics”.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-border bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="size-3" /> Companies & pages
            </span>
            <span className={cn("ml-auto flex items-center gap-1")}>
              <Building2 className="size-3" /> {results.companyResults.length} companies
            </span>
            <span className="flex items-center gap-1">
              <Settings2 className="size-3" /> Global search
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
