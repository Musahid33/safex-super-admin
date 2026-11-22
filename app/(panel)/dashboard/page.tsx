"use client";

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Database,
  FilePlus2,
  Globe2,
  HardDrive,
  LifeBuoy,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "@/components/chart-card";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ADDONS,
  KPIS,
  activeUsersTrend,
  addonRevenue,
  companyGrowth,
  companies as seedCompanies,
  currentUser,
  recentActivity,
  revenueTrend,
  subscriptionDistribution,
} from "@/lib/data";
import { formatCurrency, formatNumber, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCompanyStore } from "@/lib/store";

const activityStyles = {
  company: { icon: Building2, className: "bg-primary/10 text-primary" },
  billing: { icon: CreditCard, className: "bg-info/10 text-info" },
  support: { icon: LifeBuoy, className: "bg-warning/10 text-warning" },
  security: { icon: ShieldAlert, className: "bg-destructive/10 text-destructive" },
  domain: { icon: Globe2, className: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  feature: { icon: Sparkles, className: "bg-success/10 text-success" },
} as const;

const quickActions = [
  {
    title: "Create Company",
    description: "Provision a new isolated tenant",
    href: "/companies/new",
    icon: FilePlus2,
    primary: true,
  },
  {
    title: "View Companies",
    description: "Search and manage tenant workspaces", 
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Support Tickets",
    description: "3 tickets need attention",
    href: "/support",
    icon: LifeBuoy,
  },
];

export default function DashboardPage() {
  const { companies: liveCompanies } = useCompanyStore();
  const aggregateDelta = (key: "employees" | "users" | "storageUsed" | "mrr") => liveCompanies.reduce((sum, company) => sum + company[key], 0) - seedCompanies.reduce((sum, company) => sum + company[key], 0);
  const totalCompanies = liveCompanies.length;
  const activeCompanies = liveCompanies.filter(company => company.status === "Active").length;
  const trialCompanies = liveCompanies.filter(company => company.status === "Trial").length;
  const suspendedCompanies = liveCompanies.filter(company => company.status === "Suspended").length;
  const totalEmployees = KPIS.totalEmployees + aggregateDelta("employees");
  const activeUsers = KPIS.activeUsers + aggregateDelta("users");
  const monthlyRevenue = KPIS.monthlyRevenue + aggregateDelta("mrr");
  const storageUsed = Math.max(0, KPIS.storageUsed + aggregateDelta("storageUsed") / 1024);
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${currentUser.name.split(" ")[0]}`}
        description="Demo dashboard · The directory shows 19 seeded sample companies; user, revenue and trend figures are illustrative aggregates."
        meta={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <span className="size-1.5 animate-pulse-ring rounded-full bg-success" />
            Demo data
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Last 12 months
            </Button>
            <Button size="sm" asChild>
              <Link href="/companies/new">
                <Plus className="size-3.5" />
                Create Company
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Companies"
          value={formatNumber(totalCompanies)}
          icon={Building2}
          delta={KPIS.companyGrowth}
          trend={companyGrowth.map((d) => d.companies)}
        />
        <KpiCard
          label="Active Companies"
          value={formatNumber(activeCompanies)}
          icon={CheckCircle2}
          delta={8.4}
          accent="info"
          trend={companyGrowth.map((d) => d.active)}
        />
        <KpiCard
          label="Trial Companies"
          value={formatNumber(trialCompanies)}
          icon={Sparkles}
          delta={-3.2}
          accent="violet"
          trend={[12, 14, 13, 16, 18, 17, 21, 19]}
        />
        <KpiCard
          label="Suspended Companies"
          value={formatNumber(suspendedCompanies)}
          icon={ShieldAlert}
          delta={-1.1}
          accent="destructive"
          trend={[14, 13, 12, 13, 11, 10, 10, 9]}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Monthly Revenue"
          value={formatCurrency(monthlyRevenue, { compact: true })}
          icon={CreditCard}
          delta={KPIS.revenueGrowth}
          trend={revenueTrend.map((d) => d.revenue)}
        />
        <KpiCard
          label="Total Employees"
          value={formatNumber(totalEmployees, true)}
          icon={UsersRound}
          delta={6.8}
          accent="info"
          trend={activeUsersTrend.map((d) => d.users)}
        />
        <KpiCard
          label="Total Active Users"
          value={formatNumber(activeUsers, true)}
          icon={Users}
          delta={KPIS.activeUserGrowth}
          accent="violet"
          trend={activeUsersTrend.map((d) => d.users)}
        />
        <KpiCard
          label="Total Storage Used"
          value={`${storageUsed.toFixed(1)} TB`}
          icon={HardDrive}
          delta={11.2}
          accent="warning"
          trend={[4.2, 4.9, 5.4, 6.1, 6.8, 7.3, 7.9, 8.4]}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Company Growth"
          description="Total tenants vs. active tenants over the last 12 months"
          action={
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" /> Active
              </span>
              <span className="rounded-md border border-border px-2 py-0.5 font-medium text-success">
                +12.6% YoY
              </span>
            </div>
          }
        >
          <AreaChart
            data={companyGrowth}
            height={248}
            series={[
              { key: "companies", label: "Total", color: "hsl(var(--chart-2))" },
              { key: "active", label: "Active", color: "hsl(var(--chart-1))" },
            ]}
            formatValue={(v) => formatNumber(Math.round(v))}
          />
        </ChartCard>

        <ChartCard
          title="Subscription Distribution"
          description="Tenants by base plan"
          action={<BadgeCheck className="size-4 text-muted-foreground" />}
        >
          <div className="flex h-[248px] items-center">
            <DonutChart
              data={subscriptionDistribution}
              centerLabel="Aggregate estimate"
              centerValue="214"
              size={168}
              className="w-full flex-col gap-6 sm:flex-col"
            />
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Monthly Revenue"
          description="Recurring platform revenue against the board target"
          action={
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <TrendingUp className="size-3 text-success" />
              ₹128.5L this month
            </div>
          }
        >
          <AreaChart
            data={revenueTrend}
            height={240}
            series={[
              { key: "revenue", label: "Revenue (₹L)", color: "hsl(var(--chart-1))" },
              { key: "target", label: "Target (₹L)", color: "hsl(var(--chart-2))" },
            ]}
            formatValue={(v) => `₹${v.toFixed(0)}L`}
          />
        </ChartCard>

        <ChartCard
          title="Add-on Revenue"
          description="Premium module revenue, last 6 months (₹L)"
        >
          <BarChart
            data={addonRevenue}
            xKey="month"
            height={230}
            maxBarWidth={14}
            series={[
              { key: "asset", label: "Assets", color: "hsl(var(--chart-2))" },
              { key: "salary", label: "Salary Slip", color: "hsl(var(--chart-1))" },
              { key: "email", label: "Email", color: "hsl(var(--chart-3))" },
            ]}
            formatValue={(v) => `₹${v.toFixed(1)}L`}
          />
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
            <span className="text-[11px] text-muted-foreground">Add-on ARR contribution</span>
            <span className="text-[12px] font-semibold text-foreground">₹25.9L / mo</span>
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {recentActivity.length} events
              </span>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-[12px]">
              <Link href="/settings?tab=audit">
                Audit logs <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border/60">
              {recentActivity.slice(0, 6).map((event) => {
                const style = activityStyles[event.type];
                const Icon = style.icon;
                return (
                  <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                        style.className,
                      )}
                    >
                      <Icon className="size-3.5" />
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm",
                      action.primary
                        ? "border-primary/20 bg-primary/[0.04] hover:border-primary/40"
                        : "border-border hover:border-primary/25 hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        action.primary
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-foreground">{action.title}</span>
                      <span className="block text-[11px] text-muted-foreground">{action.description}</span>
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="size-3.5 text-muted-foreground" />
                Platform Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { label: "Storage used", value: "8.4 TB", percent: 68, color: "bg-primary" },
                { label: "API throughput", value: "2.4M / 5M", percent: 48, color: "bg-chart-2" },
                { label: "Active seats", value: "42.6K / 60K", percent: 71, color: "bg-chart-4" },
              ].map((row) => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular text-foreground">{row.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {ADDONS.map((addon) => (
          <Card key={addon.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-muted-foreground">{addon.name}</p>
                <p className="mt-1 text-lg font-semibold tabular tracking-tight text-foreground">
                  {formatCurrency(addon.revenue, { compact: true })}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">/ month</span>
                </p>
              </div>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {addon.companies} tenants
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{addon.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
