"use client";

import {
  Activity,
  ArrowLeft,
  Ban,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  HardDrive,
  Info,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  CompanyAvatar,
  HealthIndicator,
  PaymentBadge,
  PlanBadge,
  StatusBadge,
  TicketStatusBadge,
} from "@/components/status-badges";
import { TabNav } from "@/components/tab-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ADDONS,
  BASE_FEATURES,
  INDUSTRIES,
  PLAN_LIST,
  auditLogs,
  invoices,
  recentActivity,
  tickets,
} from "@/lib/data";
import {
  daysUntil,
  formatBytesFromGb,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  percent,
  relativeTime,
} from "@/lib/format";
import type { Company, PlanName } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "subscription", label: "Subscription" },
  { value: "features", label: "Features" },
  { value: "limits", label: "Limits" },
  { value: "domain", label: "Domain" },
  { value: "activity", label: "Activity" },
];

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="max-w-[62%] break-words text-right text-[12px] font-medium text-foreground">
        {children}
      </span>
    </div>
  );
}

function UsageRow({
  label,
  used,
  limit,
  unit,
  icon: Icon,
  color = "bg-primary",
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  icon: typeof Users;
  color?: string;
}) {
  const value = percent(used, limit);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="size-3.5" />
          {label}
        </span>
        <span className="tabular font-medium text-foreground">
          {formatNumber(used)}
          {unit ?? ""} / {formatNumber(limit)}
          {unit ?? ""}
        </span>
      </div>
      <Progress
        value={value}
        indicatorClassName={cn(value >= 95 ? "bg-destructive" : value >= 80 ? "bg-warning" : color)}
      />
    </div>
  );
}

export function CompanyDetail({
  company,
  defaultTab,
  openEdit,
  openLogin,
  onUpdate,
}: {
  company: Company;
  defaultTab: string;
  openEdit: boolean;
  openLogin: boolean;
  onUpdate: (patch: Partial<Company>) => void;
}) {
  const [tab, setTab] = useState(TABS.some((item) => item.value === defaultTab) ? defaultTab : "overview");
  const suspended = company.status === "Suspended";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canOpenTenant = company.status === "Active" || company.status === "Trial";
  const [loginOpen, setLoginOpen] = useState(openLogin && canOpenTenant);
  const [editOpen, setEditOpen] = useState(openEdit);
  const [editForm, setEditForm] = useState(() => ({ name: company.name, industry: company.industry, plan: company.plan, adminName: company.admin.name, adminEmail: company.admin.email, subdomain: company.subdomain, customDomain: company.customDomain ?? "" }));
  const [copied, setCopied] = useState(false);
  const domainVerified = company.sslStatus === "Active";
  const addonState = Object.fromEntries(ADDONS.map((addon) => [addon.id, company.addons.includes(addon.id)]));
  const [limits, setLimits] = useState({
    users: company.maxUsers,
    employees: company.maxEmployees,
    locations: company.maxLocations,
    storage: company.storageLimit,
    api: company.apiLimit,
  });
  const [savedLimits, setSavedLimits] = useState(false);

  const plan = PLAN_LIST.find((item) => item.id === company.plan) ?? PLAN_LIST[1];
  const planPrice = company.billingCycle === "Annual" ? plan.priceAnnual : plan.priceMonthly;
  const baseMonthly = company.billingCycle === "Annual" ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;
  const companyInvoices = invoices.filter((invoice) => invoice.company === company.name);
  const companyTickets = tickets.filter((ticket) => ticket.company === company.name);
  const companyAudit = auditLogs.filter(
    (entry) =>
      entry.target.toLowerCase().includes(company.name.toLowerCase()) ||
      entry.target.toLowerCase().includes(company.shortName.toLowerCase()),
  );
  const enabledAddons = ADDONS.filter((addon) => addonState[addon.id]);
  const addonMonthly = enabledAddons.reduce(
    (sum, addon) => sum + addon.price * (addon.unit.includes("user") ? limits.users : 1),
    0,
  );
  const monthlyTotal = baseMonthly + addonMonthly;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${company.subdomain}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const saveLimits = () => {
    onUpdate({ maxUsers: limits.users, maxEmployees: limits.employees, maxLocations: limits.locations, storageLimit: limits.storage, apiLimit: limits.api });
    setSavedLimits(true);
    window.setTimeout(() => setSavedLimits(false), 2500);
  };

  const toggleAddon = (id: string, checked: boolean) => {
    const next = { ...addonState, [id]: checked };
    onUpdate({ addons: ADDONS.filter(addon => next[addon.id]).map(addon => addon.id) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Link href="/companies" className="flex items-center gap-1.5 transition-colors hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Companies
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground">{company.name}</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <CompanyAvatar initials={company.initials} color={company.logoColor} size="lg" />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[22px] font-semibold tracking-tight text-foreground">
                  {company.name}
                </h1>
                <StatusBadge status={suspended ? "Suspended" : company.status} />
                <PlanBadge plan={company.plan} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-3.5" /> {company.industry}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {company.address}
                </span>
                <a
                  href={`https://${company.subdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-mono text-[11px] transition-colors hover:text-primary"
                >
                  <Globe2 className="size-3.5" />
                  {company.subdomain}
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <HealthIndicator health={company.health} />
                <span className="text-muted-foreground/40">·</span>
                <PaymentBadge status={company.paymentStatus} />
                <span className="text-muted-foreground/40">·</span>
                <span className="text-[11px] text-muted-foreground">
                  Customer since {formatDate(company.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={copyUrl}>
              <Copy className="size-3.5" />
              {copied ? "Copied" : "Tenant URL"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled={!canOpenTenant} title={!canOpenTenant ? "Activate the company before opening its admin portal" : "Open this tenant's Company Admin portal"} onClick={() => setLoginOpen(true)}>
              <LogIn className="size-3.5" /> Login as Company Admin
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => { setEditForm({ name: company.name, industry: company.industry, plan: company.plan, adminName: company.admin.name, adminEmail: company.admin.email, subdomain: company.subdomain, customDomain: company.customDomain ?? "" }); setEditOpen(true); }}>
              <Pencil className="size-3.5" /> Edit
            </Button>
            <Button
              variant={suspended ? "default" : "destructive-outline"}
              size="sm"
              className="gap-2"
              onClick={() => setConfirmOpen(true)}
            >
              {suspended ? <CheckCircle2 className="size-3.5" /> : <Ban className="size-3.5" />}
              {suspended ? "Activate" : "Suspend"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active users",
            value: `${formatNumber(company.users)}`,
            hint: `of ${formatNumber(limits.users)} seats`,
            icon: Users,
            progress: percent(company.users, limits.users),
          },
          {
            label: "Locations",
            value: `${company.locations}`,
            hint: `of ${limits.locations} allowed`,
            icon: MapPin,
            progress: percent(company.locations, limits.locations),
          },
          {
            label: "Storage used",
            value: formatBytesFromGb(company.storageUsed),
            hint: `of ${formatBytesFromGb(limits.storage)}`,
            icon: HardDrive,
            progress: percent(company.storageUsed, limits.storage),
          },
          {
            label: "Monthly recurring",
            value: formatCurrency(company.mrr, { compact: true }),
            hint: `${company.billingCycle} billing`,
            icon: CreditCard,
            progress: null,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-muted-foreground">{stat.label}</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.hint}</p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
              </div>
              {stat.progress !== null && (
                <Progress
                  value={stat.progress}
                  className="mt-3"
                  indicatorClassName={cn(
                    stat.progress >= 95 ? "bg-destructive" : stat.progress >= 80 ? "bg-warning" : "bg-primary",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabNav tabs={TABS} />

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Company information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                  <div>
                    <DetailRow label="Legal name">{company.name}</DetailRow>
                    <DetailRow label="Industry">{company.industry}</DetailRow>
                    <DetailRow label="Registered address">{company.address}</DetailRow>
                    <DetailRow label="Country">{company.country}</DetailRow>
                    <DetailRow label="Website">
                      <a
                        href={`https://${company.subdomain}`}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {company.subdomain}
                      </a>
                    </DetailRow>
                  </div>
                  <div>
                    <DetailRow label="Company ID">
                      <span className="font-mono text-[11px]">{company.id}</span>
                    </DetailRow>
                    <DetailRow label="Created">{formatDate(company.createdAt)}</DetailRow>
                    <DetailRow label="Last active">{relativeTime(company.lastActive)}</DetailRow>
                    <DetailRow label="Payment">
                      <PaymentBadge status={company.paymentStatus} />
                    </DetailRow>
                    <DetailRow label="Health">
                      <HealthIndicator health={company.health} />
                    </DetailRow>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between">
                    <PlanBadge plan={company.plan} />
                    <span className="text-[12px] font-semibold tabular text-foreground">
                      {formatCurrency(planPrice)}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        /{company.billingCycle === "Annual" ? "yr" : "mo"}
                      </span>
                    </span>
                  </div>
                  <div className="space-y-1.5 border-t border-border/60 pt-2">
                    <DetailRow label="Billing cycle">{company.billingCycle}</DetailRow>
                    <DetailRow label="Renewal">{formatDate(company.expiry)}</DetailRow>
                    <DetailRow label="Days remaining">
                      <span className={daysUntil(company.expiry) <= 30 ? "text-warning" : ""}>
                        {Math.max(0, daysUntil(company.expiry))} days
                      </span>
                    </DetailRow>
                    <DetailRow label="Add-ons">{company.addons.length} enabled</DetailRow>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setTab("subscription")}
                  >
                    Manage subscription
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Usage this cycle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 pt-0">
                  <UsageRow
                    label="Users"
                    used={company.users}
                    limit={limits.users}
                    icon={Users}
                  />
                  <UsageRow
                    label="Storage"
                    used={company.storageUsed}
                    limit={limits.storage}
                    unit=" GB"
                    icon={HardDrive}
                  />
                  <UsageRow
                    label="API calls"
                    used={company.apiCalls}
                    limit={limits.api}
                    icon={Server}
                    color="bg-chart-2"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Company admin</CardTitle>
                <Badge variant="muted">Primary owner</Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-[12px] font-semibold text-primary">
                    {company.admin.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">{company.admin.name}</p>
                    <p className="text-[11px] text-muted-foreground">{company.admin.designation}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-border/60 pt-2">
                  <DetailRow label="Email">
                    <span className="break-all">{company.admin.email}</span>
                  </DetailRow>
                  <DetailRow label="Phone">{company.admin.phone}</DetailRow>
                  <DetailRow label="Username">@{company.admin.username}</DetailRow>
                  <DetailRow label="Last login">{formatDateTime(company.admin.lastLogin)}</DetailRow>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Mail className="size-3.5" /> Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <RefreshCw className="size-3.5" /> Reset password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Enabled add-ons</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {ADDONS.map((addon) => {
                    const enabled = company.addons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={cn(
                          "rounded-lg border p-3",
                          enabled ? "border-primary/25 bg-primary/[0.03]" : "border-border bg-muted/20 opacity-70",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-medium text-foreground">{addon.name}</p>
                          {enabled ? (
                            <CheckCircle2 className="size-3.5 text-success" />
                          ) : (
                            <Lock className="size-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          ₹{addon.price} / {addon.unit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                <div>
                  <CardTitle>Current plan</CardTitle>
                  <p className="mt-1 text-[12px] text-muted-foreground">{plan.tagline}</p>
                </div>
                <PlanBadge plan={company.plan} />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Contract value", value: formatCurrency(planPrice) },
                    { label: "Billing cycle", value: company.billingCycle },
                    { label: "Start date", value: formatDate(company.subscriptionStart ?? company.createdAt) },
                    { label: "Renewal date", value: formatDate(company.expiry) },
                    { label: "Seats included", value: formatNumber(plan.includedSeats) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-[13px] font-semibold tabular text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
                    <p className="text-[12px] font-semibold text-foreground">Add-on subscriptions</p>
                    <p className="text-[11px] text-muted-foreground">{formatCurrency(addonMonthly)} / month</p>
                  </div>
                  <div className="divide-y divide-border/60">
                    {ADDONS.map((addon) => {
                      const enabled = company.addons.includes(addon.id);
                      return (
                        <div key={addon.id} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                          <div>
                            <p className="text-[12px] font-medium text-foreground">{addon.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              ₹{addon.price} / {addon.unit}
                            </p>
                          </div>
                          {enabled ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="muted">Not subscribed</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                    Change plan
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={() => setTab("features")}>
                    <Sparkles className="size-3.5" /> Manage add-ons
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Billing summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <DetailRow label="Base plan">{formatCurrency(planPrice)}</DetailRow>
                <DetailRow label="Add-ons">{formatCurrency(addonMonthly)}</DetailRow>
                <DetailRow label="Estimated / month">{formatCurrency(monthlyTotal)}</DetailRow>
                <DetailRow label="Payment status">
                  <PaymentBadge status={company.paymentStatus} />
                </DetailRow>
                <DetailRow label="Next invoice">{formatDate(company.expiry)}</DetailRow>
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Upgrades are prorated automatically. Downgrades apply from the next renewal.
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Invoice history</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                  <Download className="size-3.5" /> Export
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">Invoice</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5 text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(companyInvoices.length
                      ? companyInvoices
                      : invoices.slice(0, 3).map((invoice) => ({
                          ...invoice,
                          company: company.name,
                        }))
                    ).map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="pl-5">
                          <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                            <FileText className="size-3.5 text-muted-foreground" />
                            {invoice.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <PlanBadge plan={invoice.plan} />
                        </TableCell>
                        <TableCell className="text-[12px] text-muted-foreground">{invoice.cycle}</TableCell>
                        <TableCell className="text-[12px] tabular text-muted-foreground">
                          {formatDate(invoice.issued)}
                        </TableCell>
                        <TableCell className="text-[12px] font-medium tabular text-foreground">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <PaymentBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <Button variant="ghost" size="icon-sm" aria-label="Download invoice">
                            <Download className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-4 space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-info/25 bg-info/10 px-3.5 py-2.5 text-[12px] leading-relaxed text-info">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            All 16 base features are included in every plan and cannot be disabled. Add-on features can be enabled
            or disabled for this company at any time.
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Premium add-on features</CardTitle>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Enable modules for {company.name}. Changes apply immediately.
                </p>
              </div>
              <Badge variant="muted">{enabledAddons.length} of {ADDONS.length} enabled</Badge>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {ADDONS.map((addon) => (
                <div
                  key={addon.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{addon.name}</p>
                      <p className="mt-0.5 max-w-xl text-[11px] leading-relaxed text-muted-foreground">
                        {addon.description}
                      </p>
                      <p className="mt-1 text-[11px] font-medium tabular text-foreground">
                        ₹{addon.price}
                        <span className="font-normal text-muted-foreground"> / {addon.unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:pl-4">
                    <span className="text-[11px] text-muted-foreground">
                      {addonState[addon.id] ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={addonState[addon.id]}
                      onCheckedChange={(checked) => toggleAddon(addon.id, checked)}
                      aria-label={`Toggle ${addon.name}`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Base features</CardTitle>
              <Badge variant="success">
                <Lock className="size-3" /> Locked on
              </Badge>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {BASE_FEATURES.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-foreground">{feature.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle>Plan limits and usage</CardTitle>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Hard caps enforced at the tenant boundary.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={saveLimits}>
                  <Check className="size-3.5" /> Save changes
                </Button>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                {savedLimits && (
                  <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
                    <CheckCircle2 className="size-3.5" /> Limits updated for {company.name}.
                  </div>
                )}
                {[
                  { key: "users" as const, label: "Users", used: company.users, step: 10 },
                  { key: "employees" as const, label: "Employees", used: company.employees, step: 10 },
                  { key: "locations" as const, label: "Locations", used: company.locations, step: 1 },
                  { key: "storage" as const, label: "Storage (GB)", used: company.storageUsed, step: 10 },
                  { key: "api" as const, label: "API calls / month", used: company.apiCalls, step: 1000 },
                ].map((row) => (
                  <div key={row.key} className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex-1">
                        <p className="text-[12px] font-medium text-foreground">{row.label}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Progress
                            value={percent(row.used, limits[row.key])}
                            className="max-w-xs flex-1"
                            indicatorClassName={cn(
                              percent(row.used, limits[row.key]) >= 95
                                ? "bg-destructive"
                                : percent(row.used, limits[row.key]) >= 80
                                  ? "bg-warning"
                                  : "bg-primary",
                            )}
                          />
                          <span className="w-24 text-right text-[11px] tabular text-muted-foreground">
                            {formatNumber(row.used)} used
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-36">
                        <Label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                          Limit
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          step={row.step}
                          value={limits[row.key]}
                          onChange={(event) =>
                            setLimits((prev) => ({ ...prev, [row.key]: Number(event.target.value) }))
                          }
                          className="h-8 text-[12px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Plan allowances</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <DetailRow label="Plan">{plan.name}</DetailRow>
                  <DetailRow label="Seats included">{formatNumber(plan.includedSeats)}</DetailRow>
                  <DetailRow label="Storage included">{formatBytesFromGb(plan.includedStorage)}</DetailRow>
                  <DetailRow label="Locations">
                    {plan.id === "Enterprise" ? 50 : plan.id === "Growth" ? 15 : 5}
                  </DetailRow>
                  <DetailRow label="API calls">
                    {formatNumber(plan.id === "Enterprise" ? 500000 : plan.id === "Growth" ? 150000 : 40000)}
                  </DetailRow>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Enforcement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-0 text-[12px] text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Gauge className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    Users see an upgrade prompt when a hard limit is reached.
                  </p>
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    Lowering a limit below current usage blocks new records but never deletes data.
                  </p>
                  <p className="flex items-start gap-2">
                    <Activity className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    All limit changes are written to the platform audit log.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="domain" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Domains</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => onUpdate({ sslStatus: "Active" })}
                >
                  <RefreshCw className="size-3.5" /> Verify domain
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex flex-col gap-3 rounded-lg border border-border p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Globe2 className="size-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[12px] font-medium text-foreground">{company.subdomain}</p>
                        <Badge variant="success">Primary</Badge>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Managed SAFEX subdomain · DNS handled automatically
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={copyUrl}>
                    <Copy className="size-3" /> {copied ? "Copied" : "Copy URL"}
                  </Button>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-border p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300">
                      <ExternalLink className="size-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[12px] font-medium text-foreground">
                          {company.customDomain ?? "No custom domain configured"}
                        </p>
                        {company.customDomain && (
                          <Badge variant={domainVerified ? "success" : "warning"}>
                            {domainVerified ? "Verified" : "Pending"}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {company.customDomain
                          ? "Customer-managed domain with automatic SSL"
                          : "Add a custom domain from the company edit panel"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setEditForm({ name: company.name, industry: company.industry, plan: company.plan, adminName: company.admin.name, adminEmail: company.admin.email, subdomain: company.subdomain, customDomain: company.customDomain ?? "" }); setEditOpen(true); }}>
                    <Plus className="size-3" /> Add domain
                  </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="border-b border-border bg-muted/40 px-3.5 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      DNS records
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          type: "CNAME",
                          name: company.customDomain?.split(".")[0] ?? "safety",
                          value: "edge.safex.app",
                        },
                        {
                          type: "TXT",
                          name: "_safex-verify",
                          value: `safex-verify=${company.id.replace("cmp_", "")}`,
                        },
                      ].map((record) => (
                        <TableRow key={record.type}>
                          <TableCell className="font-mono text-[11px] font-medium text-foreground">
                            {record.type}
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-muted-foreground">
                            {record.name}
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-muted-foreground">
                            {record.value}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={domainVerified ? "success" : "warning"}>
                              {domainVerified ? "Propagated" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>SSL certificate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className={cn("size-4", domainVerified ? "text-success" : "text-warning")}
                    />
                    <span className="text-[13px] font-medium text-foreground">
                      {domainVerified ? "Issued and active" : "Awaiting verification"}
                    </span>
                  </div>
                  <DetailRow label="Provider">Let&apos;s Encrypt</DetailRow>
                  <DetailRow label="Issued">{formatDate(company.createdAt)}</DetailRow>
                  <DetailRow label="Expires">{formatDate(company.expiry)}</DetailRow>
                  <DetailRow label="Renewal">Automatic</DetailRow>
                  <DetailRow label="HTTPS enforced">
                    <Badge variant={domainVerified ? "success" : "muted"}>
                      {domainVerified ? "Yes" : "Pending"}
                    </Badge>
                  </DetailRow>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Domain health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {[
                    { label: "DNS resolution", ok: domainVerified },
                    { label: "Certificate chain", ok: domainVerified },
                    { label: "HSTS enabled", ok: domainVerified },
                    { label: "Redirects to HTTPS", ok: domainVerified },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{item.label}</span>
                      {item.ok ? (
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="size-3.5" /> Pass
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-warning">
                          <RefreshCw className="size-3.5" /> Pending
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border/60">
                  {recentActivity.slice(0, 7).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Activity className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-foreground">{event.title}</p>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] text-muted-foreground">{relativeTime(event.timestamp)}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">{event.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Support tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {(companyTickets.length ? companyTickets : tickets.slice(0, 3)).map((ticket) => (
                  <Link
                    key={ticket.id}
                    href="/support"
                    className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{ticket.id}</span>
                      <TicketStatusBadge status={ticket.status} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] font-medium text-foreground">{ticket.subject}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {ticket.assignedTo} · {relativeTime(ticket.updatedAt)}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle>Audit log</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">Event</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>IP address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="pr-5 text-right">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(companyAudit.length ? companyAudit : auditLogs.slice(0, 4)).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="pl-5 font-mono text-[11px] font-medium text-foreground">
                          {entry.action}
                        </TableCell>
                        <TableCell className="text-[12px] text-muted-foreground">{entry.actor}</TableCell>
                        <TableCell className="max-w-[240px] truncate text-[12px] text-foreground">
                          {entry.target}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">{entry.ip}</TableCell>
                        <TableCell className="text-[12px] tabular text-muted-foreground">
                          {formatDateTime(entry.timestamp)}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <Badge
                            variant={
                              entry.severity === "critical"
                                ? "destructive"
                                : entry.severity === "warning"
                                  ? "warning"
                                  : "muted"
                            }
                          >
                            {entry.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><LogIn className="size-5"/></div>
            <DialogTitle>Open Company Admin portal?</DialogTitle>
            <DialogDescription>Continue to the separate tenant portal for {company.name}. This control-plane demo does not impersonate the administrator or transfer credentials.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-[12px]">
            <p className="font-medium text-foreground">{company.admin.name} · {company.admin.designation}</p>
            <p className="mt-1 text-muted-foreground">{company.admin.email}</p>
            <p className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground"><Globe2 className="size-3.5"/>https://{company.subdomain}</p>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">Actual secure sign-in / impersonation must be implemented by the separate Company Portal. No Company Admin interface is hosted in this repository.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginOpen(false)}>Cancel</Button>
            <Button onClick={() => { window.open(`https://${company.subdomain}`, "_blank", "noopener,noreferrer"); setLoginOpen(false); }} className="gap-2"><LogIn className="size-3.5"/>Open company portal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{suspended ? "Activate this company?" : "Suspend this company?"}</DialogTitle>
            <DialogDescription>
              {suspended ? (
                <>
                  <span className="font-medium text-foreground">{company.name}</span> will regain access to its
                  tenant at {company.subdomain}.
                </>
              ) : (
                <>
                  All <span className="font-medium text-foreground">{formatNumber(company.users)}</span> users of{" "}
                  <span className="font-medium text-foreground">{company.name}</span> will lose access immediately.
                  Billing continues unless the subscription is cancelled.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={suspended ? "default" : "destructive"}
              onClick={() => {
                onUpdate({ status: suspended ? "Active" : "Suspended" });
                setConfirmOpen(false);
              }}
            >
              {suspended ? "Activate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit company</DialogTitle>
            <DialogDescription>Update the tenant profile and subscription assignment.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Company name</Label>
              <Input value={editForm.name} onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select value={editForm.industry} onValueChange={(value) => setEditForm((prev) => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plan</Label>
              <Select value={editForm.plan} onValueChange={(value) => setEditForm((prev) => ({ ...prev, plan: value as PlanName }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(PLAN_LIST.map((item) => item.id) as PlanName[]).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Admin name</Label>
              <Input value={editForm.adminName} onChange={(event) => setEditForm((prev) => ({ ...prev, adminName: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Admin email</Label>
              <Input type="email" value={editForm.adminEmail} onChange={(event) => setEditForm((prev) => ({ ...prev, adminEmail: event.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tenant subdomain</Label>
              <Input value={editForm.subdomain} onChange={(event) => setEditForm((prev) => ({ ...prev, subdomain: event.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Custom domain</Label>
              <Input placeholder="safety.company.com" value={editForm.customDomain} onChange={(event) => setEditForm((prev) => ({ ...prev, customDomain: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const customDomain = editForm.customDomain.trim();
                const domainChanged = customDomain !== (company.customDomain ?? "");
                const initials = editForm.name.trim().split(/\s+/).filter(Boolean).slice(0, 3).map(part => part[0]).join("").toUpperCase();
                const selectedPlan = PLAN_LIST.find(item => item.id === editForm.plan) ?? plan;
                onUpdate({
                  name: editForm.name.trim(), shortName: initials, initials, industry: editForm.industry, plan: editForm.plan,
                  admin: { ...company.admin, name: editForm.adminName.trim(), email: editForm.adminEmail.trim() },
                  email: editForm.adminEmail.trim(), subdomain: editForm.subdomain.trim(), customDomain: customDomain || undefined,
                  sslStatus: domainChanged ? "Pending" : company.sslStatus,
                  mrr: company.billingCycle === "Annual" ? Math.round(selectedPlan.priceAnnual / 12) : selectedPlan.priceMonthly,
                });
                setEditOpen(false);
              }}
            >Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
