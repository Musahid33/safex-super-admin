"use client";

import {
  Activity,
  ArrowUpDown,
  Ban,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Gauge,
  Globe2,
  Layers,
  LogIn,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CompanyAvatar, HealthIndicator, PlanBadge, StatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADDONS, INDUSTRIES } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCompanyStore } from "@/lib/store";

type TabKey = "all" | "drafts" | "archived";

const PAGE_SIZE = 8;

export function CompaniesTable() {
  const { companies, updateCompany, removeCompany } = useCompanyStore();
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [plan, setPlan] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: "users" | "expiry" | "name"; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });
  const [confirm, setConfirm] = useState<{ type: "suspend" | "activate" | "delete"; company: Company } | null>(
    null,
  );

  const counts = {
    all: companies.filter((c) => c.status !== "Draft" && c.status !== "Archived").length,
    drafts: companies.filter((c) => c.status === "Draft").length,
    archived: companies.filter((c) => c.status === "Archived").length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = companies
      .filter((company) => {
        if (tab === "drafts") return company.status === "Draft";
        if (tab === "archived") return company.status === "Archived";
        return company.status !== "Draft" && company.status !== "Archived";
      })
      .filter(
        (company) =>
          !q ||
          company.name.toLowerCase().includes(q) ||
          company.subdomain.toLowerCase().includes(q) ||
          company.admin.name.toLowerCase().includes(q) ||
          company.industry.toLowerCase().includes(q),
      )
      .filter((company) => status === "all" || company.status === status)
      .filter((company) => industry === "all" || company.industry === industry)
      .filter((company) => plan === "all" || company.plan === plan)
      .sort((a, b) => {
        if (sort.key === "users") return sort.dir === "asc" ? a.users - b.users : b.users - a.users;
        if (sort.key === "expiry")
          return sort.dir === "asc"
            ? new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
            : new Date(b.expiry).getTime() - new Date(a.expiry).getTime();
        return sort.dir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      });
    return rows;
  }, [companies, tab, query, status, industry, plan, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const activeFilters = [status, industry, plan].filter((value) => value !== "all").length;

  const resetFilters = () => {
    setStatus("all");
    setIndustry("all");
    setPlan("all");
    setQuery("");
    setPage(0);
  };

  const toggleSort = (key: "users" | "expiry" | "name") => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };

  const applyConfirm = () => {
    if (!confirm) return;
    const { type, company } = confirm;
    if (type === "delete") removeCompany(company.id);
    else updateCompany(company.id, { status: type === "suspend" ? "Suspended" : "Active" });
    setConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-[300px]">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder="Search companies, subdomains or admins…"
                className="h-9 pl-8 text-[13px]"
              />
            </div>

            <Button
              variant={showFilters || activeFilters ? "secondary" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="size-3.5" />
              Filters
              {activeFilters > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </Button>

            {activeFilters > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 self-start text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
              >
                <X className="size-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Download className="size-3.5" />
              Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/companies/new">
                <Plus className="size-3.5" />
                Create Company
              </Link>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-3 border-b border-border bg-muted/30 p-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</p>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(0);
                }}
              >
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Industry</p>
              <Select
                value={industry}
                onValueChange={(value) => {
                  setIndustry(value);
                  setPage(0);
                }}
              >
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  {INDUSTRIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Subscription plan
              </p>
              <Select
                value={plan}
                onValueChange={(value) => {
                  setPlan(value);
                  setPage(0);
                }}
              >
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="All plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All plans</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border px-4 pt-3">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as TabKey);
              setPage(0);
            }}
          >
            <TabsList className="h-9 border-0 bg-transparent p-0">
              {[
                { key: "all", label: "All Companies", count: counts.all },
                { key: "drafts", label: "Drafts", count: counts.drafts },
                { key: "archived", label: "Archived", count: counts.archived },
              ].map((item) => (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className="gap-2 rounded-none border-b-2 border-transparent px-3 pb-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  {item.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular",
                      tab === item.key
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="hidden pb-2.5 text-[11px] text-muted-foreground sm:block">
            {filtered.length} of {companies.length} tenants
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[260px]">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                  Company <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Add-ons</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("users")} className="flex items-center gap-1 hover:text-foreground">
                  Users <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Locations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("expiry")} className="flex items-center gap-1 hover:text-foreground">
                  Expiry <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((company) => (
              <TableRow key={company.id} className="group">
                <TableCell>
                  <Link href={`/companies/${company.id}`} className="flex items-center gap-3">
                    <CompanyAvatar initials={company.initials} color={company.logoColor} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground group-hover:text-primary">
                        {company.name}
                      </p>
                      <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <Globe2 className="size-2.5" />
                        {company.subdomain}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="text-[12px] font-medium text-foreground">{company.admin.name}</p>
                  <p className="text-[11px] text-muted-foreground">{company.admin.designation}</p>
                </TableCell>
                <TableCell>
                  <PlanBadge plan={company.plan} />
                </TableCell>
                <TableCell>
                  {company.addons.length ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted">
                          <Sparkles className="size-3" />
                          {company.addons.length} active
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuLabel>Enabled add-ons</DropdownMenuLabel>
                        {company.addons.map((id) => (
                          <DropdownMenuItem key={id} disabled>
                            <CheckCircle2 className="!text-success" />
                            {ADDONS.find((a) => a.id === id)?.name ?? id}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-[11px] text-muted-foreground/70">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-medium tabular text-foreground">
                      {formatNumber(company.users)}
                      <span className="text-muted-foreground"> / {formatNumber(company.maxUsers)}</span>
                    </span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          company.users / company.maxUsers > 0.95
                            ? "bg-warning"
                            : "bg-primary",
                        )}
                        style={{ width: `${Math.min(100, (company.users / company.maxUsers) * 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[12px] tabular text-foreground">{company.locations}</TableCell>
                <TableCell>
                  <StatusBadge status={company.status} />
                </TableCell>
                <TableCell>
                  <p className="text-[12px] tabular text-foreground">{formatDate(company.expiry)}</p>
                  <p className="text-[10px] text-muted-foreground">{company.billingCycle}</p>
                </TableCell>
                <TableCell>
                  <HealthIndicator health={company.health} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-60 transition-opacity group-hover:opacity-100 data-[state=open]:bg-muted data-[state=open]:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}`}>
                          <Eye /> View details
                        </Link>
                      </DropdownMenuItem>
                      {company.status === "Draft" ? (
                        <DropdownMenuItem asChild>
                          <Link href={`/companies/new?draft=${company.id}`}>
                            <Pencil /> Resume draft
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link href={`/companies/${company.id}?tab=overview&edit=1`}>
                            <Pencil /> Edit company
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}?tab=subscription`}>
                          <Layers /> Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}?tab=features`}>
                          <Sparkles /> Features
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}?tab=limits`}>
                          <Gauge /> Limits
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}?tab=domain`}>
                          <Globe2 /> Domain
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}?tab=activity`}>
                          <Activity /> Activity
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild disabled={company.status !== "Active" && company.status !== "Trial"}>
                        <Link href={`/companies/${company.id}?login=1`}>
                          <LogIn /> Login as Company Admin
                        </Link>
                      </DropdownMenuItem>
                      {company.status === "Suspended" ? (
                        <DropdownMenuItem
                          onSelect={() => setConfirm({ type: "activate", company })}
                          className="text-success focus:text-success"
                        >
                          <CheckCircle2 className="!text-success" /> Activate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onSelect={() => setConfirm({ type: "suspend", company })}
                          className="text-warning focus:text-warning"
                        >
                          <Ban className="!text-warning" /> Suspend
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onSelect={() => setConfirm({ type: "delete", company })}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="!text-destructive" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Building2 className="size-5" />
            </span>
            <p className="text-[13px] font-medium text-foreground">No companies match your filters</p>
            <p className="max-w-sm text-[12px] text-muted-foreground">
              Try adjusting the search query, status, industry or plan filters.
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length ? currentPage * PAGE_SIZE + 1 : 0}</span>–
            <span className="font-medium text-foreground">
              {Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{filtered.length}</span> companies
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage === 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={cn(
                    "size-7 rounded-md text-[11px] font-medium tabular transition-colors",
                    index === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirm?.type === "delete"
                ? "Delete company permanently?"
                : confirm?.type === "suspend"
                  ? "Suspend this company?"
                  : "Activate this company?"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.type === "delete" && (
                <>
                  <span className="font-medium text-foreground">{confirm.company.name}</span> and its tenant
                  data, users and domain bindings will be queued for deletion. This action cannot be undone.
                </>
              )}
              {confirm?.type === "suspend" && (
                <>
                  All <span className="font-medium text-foreground">{confirm.company.users}</span> users of{" "}
                  <span className="font-medium text-foreground">{confirm.company.name}</span> will lose access
                  immediately. Billing continues unless the subscription is cancelled.
                </>
              )}
              {confirm?.type === "activate" && (
                <>
                  <span className="font-medium text-foreground">{confirm.company.name}</span> will regain access
                  to the tenant at {confirm.company.subdomain}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm?.type === "delete" ? "destructive" : "default"}
              onClick={applyConfirm}
            >
              {confirm?.type === "delete" ? "Delete company" : confirm?.type === "suspend" ? "Suspend" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
