"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CreditCard,
  Download,
  FileText,
  Layers,
  Percent,
  ReceiptIndianRupee,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/chart-card";
import { PageHeader } from "@/components/page-header";
import { PaymentBadge, PlanBadge } from "@/components/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ADDONS,
  KPIS,
  addonRevenue,
  companies,
  invoices,
  planCounts,
  revenueTrend,
} from "@/lib/data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const activeCompanies = companies.filter(
  (company) => company.status === "Active" || company.status === "Trial",
);
const totalMrr = activeCompanies.reduce((sum, company) => sum + company.mrr, 0);
const totalSeats = activeCompanies.reduce((sum, company) => sum + company.users, 0);
const arpu = Math.round(totalMrr / Math.max(activeCompanies.length, 1));
const collected = invoices.filter((invoice) => invoice.status === "Paid");
const outstanding = invoices.filter((invoice) => invoice.status !== "Paid");
const collectionRate = Math.round((collected.length / Math.max(invoices.length, 1)) * 100);

const kpis = [
  {
    label: "Monthly recurring revenue",
    value: formatCurrency(totalMrr, { compact: true }),
    hint: "+18.4% vs last month",
    icon: Wallet,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Annual run rate",
    value: formatCurrency(totalMrr * 12, { compact: true }),
    hint: "Committed contracts",
    icon: TrendingUp,
    accent: "text-info",
    bg: "bg-info/10",
  },
  {
    label: "Average revenue per account",
    value: formatCurrency(arpu, { compact: true }),
    hint: `${activeCompanies.length} paying tenants`,
    icon: Users,
    accent: "text-violet-600 dark:text-violet-300",
    bg: "bg-violet-500/10",
  },
  {
    label: "Collection rate",
    value: `${collectionRate}%`,
    hint: `${outstanding.length} invoices outstanding`,
    icon: Percent,
    accent: "text-warning",
    bg: "bg-warning/10",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription & billing"
        description="Platform-wide revenue, plan performance, invoices and add-on subscriptions across every SAFEX tenant."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Download className="size-3.5" /> Export revenue
            </Button>
            <Button size="sm" asChild>
              <Link href="/settings?tab=plans">
                <Layers className="size-3.5" /> Manage plans
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-2 text-[22px] font-semibold leading-none tabular tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ArrowUpRight className="size-3 text-success" />
                    {kpi.hint}
                  </p>
                </div>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", kpi.bg, kpi.accent)}>
                  <Icon className="size-4" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Recurring revenue"
          description="Platform revenue against target over the last 12 months (₹ lakh)"
          action={<Badge variant="success">₹128.5L this month</Badge>}
        >
          <AreaChart
            data={revenueTrend}
            height={260}
            series={[
              { key: "revenue", label: "Revenue", color: "hsl(var(--chart-1))" },
              { key: "target", label: "Target", color: "hsl(var(--chart-2))" },
            ]}
            formatValue={(value) => `₹${value.toFixed(0)}L`}
          />
        </ChartCard>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Revenue breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {[
              { label: "Base subscriptions", value: totalMrr - 423000, percent: 88, color: "bg-primary" },
              { label: "Add-on subscriptions", value: 423000, percent: 12, color: "bg-chart-4" },
            ].map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium tabular text-foreground">{formatCurrency(row.value)}</span>
                </div>
                <Progress value={row.percent} indicatorClassName={row.color} />
                <p className="text-[10px] text-muted-foreground">{row.percent}% of monthly revenue</p>
              </div>
            ))}

            <div className="space-y-2 border-t border-border/60 pt-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Net revenue retention</span>
                <span className="font-medium text-success">112.6%</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Gross churn</span>
                <span className="font-medium text-foreground">{KPIS.churnRate}%</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-medium text-warning">
                  {formatCurrency(outstanding.reduce((sum, invoice) => sum + invoice.amount, 0), { compact: true })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              <ReceiptIndianRupee className="mt-0.5 size-3.5 shrink-0 text-primary" />
              GST invoices are generated automatically on every successful payment.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {planCounts.map((plan) => {
          const tenants = companies.filter((company) => company.plan === plan.id && company.status !== "Draft");
          const mrr = tenants.reduce((sum, company) => sum + company.mrr, 0);
          return (
            <Card key={plan.id} className={cn("relative", plan.popular && "border-primary/40 ring-1 ring-primary/20")}>
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Most popular
                </span>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[14px]">{plan.name}</CardTitle>
                  <PlanBadge plan={plan.id} />
                </div>
                <p className="text-[11px] text-muted-foreground">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[20px] font-semibold tabular tracking-tight text-foreground">
                    {formatCurrency(plan.priceMonthly, { compact: true })}
                  </span>
                  <span className="text-[11px] text-muted-foreground">/ month</span>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tenants</p>
                    <p className="mt-0.5 text-[14px] font-semibold tabular text-foreground">{plan.companies}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">MRR</p>
                    <p className="mt-0.5 text-[14px] font-semibold tabular text-foreground">
                      {formatCurrency(mrr, { compact: true })}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <Check className="mt-0.5 size-3 shrink-0 text-success" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "default" : "outline"} size="sm" className="w-full" asChild>
                  <Link href="/settings?tab=plans">Configure plan</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle>Invoices</CardTitle>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Latest platform invoices across all tenants
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
              <Download className="size-3.5" /> Export
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Invoice</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.slice(0, 9).map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="pl-5">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                        <FileText className="size-3.5 text-muted-foreground" />
                        {invoice.id}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-[12px] text-foreground">
                      {invoice.company}
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={invoice.plan} />
                    </TableCell>
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
                      <Button variant="ghost" size="icon-sm" aria-label={`Download ${invoice.id}`}>
                        <Download className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Add-on performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {ADDONS.map((addon) => (
                <div key={addon.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-foreground">{addon.name}</p>
                    <Badge variant={addon.enabled ? "success" : "muted"}>
                      {addon.enabled ? "Available" : "Paused"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="text-[15px] font-semibold tabular text-foreground">
                        {formatCurrency(addon.revenue, { compact: true })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{addon.companies} tenants subscribed</p>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      ₹{addon.price} / {addon.unit}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Add-on revenue trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <BarChart
                data={addonRevenue.slice(-4)}
                xKey="month"
                height={150}
                maxBarWidth={11}
                showLegend={false}
                series={[
                  { key: "asset", label: "Assets", color: "hsl(var(--chart-2))" },
                  { key: "salary", label: "Salary", color: "hsl(var(--chart-1))" },
                  { key: "email", label: "Email", color: "hsl(var(--chart-3))" },
                ]}
                formatValue={(value) => `₹${value.toFixed(1)}L`}
              />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <span className="text-[11px] text-muted-foreground">Monthly add-on revenue</span>
                <span className="text-[12px] font-semibold text-foreground">₹25.9L</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <BadgeCheck className="size-3.5 text-success" />
          {formatNumber(totalSeats)} paid seats across {activeCompanies.length} active tenants · figures shown in INR
        </p>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <CreditCard className="size-3" /> Next billing run 01 Dec 2026
        </span>
      </div>
    </div>
  );
}
