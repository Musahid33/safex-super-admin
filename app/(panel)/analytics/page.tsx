"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Download,
  HardDrive,
  LineChart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { ChartCard } from "@/components/chart-card";
import { PageHeader } from "@/components/page-header";
import { HealthIndicator, PlanBadge } from "@/components/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  KPIS,
  activeUsersTrend,
  addonRevenue,
  companies,
  companyGrowth,
  subscriptionDistribution,
  topCompanies,
} from "@/lib/data";
import { formatCurrency, formatNumber, percent } from "@/lib/format";
import { cn } from "@/lib/utils";

const industryCounts = Object.entries(
  companies.reduce<Record<string, number>>((acc, company) => {
    acc[company.industry] = (acc[company.industry] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([label, tenants]) => ({ label, tenants: tenants * 11 }))
  .sort((a, b) => b.tenants - a.tenants)
  .slice(0, 7);

const healthDistribution = [
  {
    name: "Healthy",
    value: companies.filter((company) => company.health === "Healthy").length,
    color: "var(--success)",
  },
  {
    name: "At risk",
    value: companies.filter((company) => company.health === "At risk").length,
    color: "var(--warning)",
  },
  {
    name: "Critical",
    value: companies.filter((company) => company.health === "Critical").length,
    color: "var(--destructive)",
  },
];

const kpis = [
  {
    label: "Tenant growth",
    value: "+12.6%",
    hint: "Illustrative aggregate, not directory count", 
    icon: Building2,
    bg: "bg-primary/10",
    accent: "text-primary",
    trend: companyGrowth.map((point) => point.companies),
  },
  {
    label: "Active users",
    value: formatNumber(KPIS.activeUsers, true),
    hint: "+9.2% month over month",
    icon: Users,
    bg: "bg-info/10",
    accent: "text-info",
    trend: activeUsersTrend.map((point) => point.users),
  },
  {
    label: "Trial conversion",
    value: "68.4%",
    hint: "19 trials in progress",
    icon: Target,
    bg: "bg-violet-500/10",
    accent: "text-violet-600 dark:text-violet-300",
    trend: [52, 55, 57, 60, 62, 64, 66, 68],
  },
  {
    label: "Feature adoption",
    value: "84.1%",
    hint: "Base modules adopted",
    icon: Sparkles,
    bg: "bg-warning/10",
    accent: "text-warning",
    trend: [62, 66, 69, 72, 76, 79, 82, 84],
  },
];

export default function AnalyticsPage() {
  const totalTenants = companies.length;
  const activeTenants = companies.filter((company) => company.status === "Active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Illustrative aggregate trends and metrics. The directory contains 19 seeded sample companies; this page is not a live production report."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <CalendarDays className="size-3.5" /> Last 12 months
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-3.5" /> Export report
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const max = Math.max(...kpi.trend);
          const min = Math.min(...kpi.trend);
          const points = kpi.trend
            .map((value, index) => {
              const x = (index / (kpi.trend.length - 1)) * 100;
              const y = 30 - ((value - min) / Math.max(max - min, 1)) * 26;
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-2 text-[22px] font-semibold leading-none tabular tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                </div>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", kpi.bg, kpi.accent)}>
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ArrowUpRight className="size-3 text-success" />
                  {kpi.hint}
                </p>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-6 w-16 shrink-0 opacity-80">
                  <polyline
                    points={points}
                    fill="none"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Tenant growth"
          description="Total vs. active companies, last 12 months"
          action={<Badge variant="success">186 aggregate active</Badge>}
        >
          <AreaChart
            data={companyGrowth}
            height={250}
            series={[
              { key: "companies", label: "Total tenants", color: "hsl(var(--chart-2))" },
              { key: "active", label: "Active", color: "hsl(var(--chart-1))" },
            ]}
            formatValue={(value) => formatNumber(Math.round(value))}
          />
        </ChartCard>

        <ChartCard title="Subscription mix" description="Tenants by base plan">
          <div className="flex h-[250px] items-center">
            <DonutChart
              data={subscriptionDistribution}
              centerLabel="Aggregate tenants"
              centerValue="214"
              size={166}
              className="w-full flex-col gap-5 sm:flex-col"
            />
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Industry distribution"
          description="Active tenants by industry vertical"
          action={<Badge variant="muted">Top 7 industries</Badge>}
        >
          <BarChart
            data={industryCounts}
            xKey="label"
            height={250}
            maxBarWidth={26}
            showLegend={false}
            series={[{ key: "tenants", label: "Tenants", color: "hsl(var(--chart-1))" }]}
            formatValue={(value) => `${Math.round(value)} tenants`}
          />
          <p className="mt-3 text-[11px] text-muted-foreground">
            Manufacturing and infrastructure remain the largest verticals, together representing 38% of the
            platform base.
          </p>
        </ChartCard>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Portfolio health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <DonutChart
              data={healthDistribution}
              centerLabel="Tenants"
              centerValue={String(totalTenants)}
              size={150}
              className="flex-col gap-4 sm:flex-col"
            />
            <div className="space-y-2.5 border-t border-border/60 pt-3">
              {[
                { label: "Active tenants", value: activeTenants, total: totalTenants },
                { label: "Storage utilised", value: 64, total: 100 },
                { label: "Seat utilisation", value: 71, total: 100 },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular text-foreground">
                      {row.label === "Active tenants"
                        ? `${row.value} / ${row.total}`
                        : `${percent(row.value, row.total)}%`}
                    </span>
                  </div>
                  <Progress value={percent(row.value, row.total)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Engagement"
          description="Monthly active users across all tenants"
          action={
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <TrendingUp className="size-3 text-success" /> +36.6% in 6 months
            </span>
          }
        >
          <AreaChart
            data={activeUsersTrend}
            height={220}
            series={[{ key: "users", label: "Active users", color: "hsl(var(--chart-2))" }]}
            formatValue={(value) => formatNumber(Math.round(value), true)}
          />
        </ChartCard>

        <ChartCard title="Add-on revenue" description="Last 6 months (₹ lakh)">
          <BarChart
            data={addonRevenue}
            xKey="month"
            height={200}
            maxBarWidth={12}
            series={[
              { key: "asset", label: "Assets", color: "hsl(var(--chart-2))" },
              { key: "salary", label: "Salary", color: "hsl(var(--chart-1))" },
              { key: "email", label: "Email", color: "hsl(var(--chart-3))" },
            ]}
            formatValue={(value) => `₹${value.toFixed(1)}L`}
          />
        </ChartCard>
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Top tenants by engagement</CardTitle>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Ranked by active seats and monthly recurring revenue
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
            <LineChart className="size-3.5" /> Full report
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Active users</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead className="pr-5 text-right">Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCompanies.map((company, index) => (
                <TableRow key={company.name}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="text-[12px] font-medium text-foreground">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={company.plan} />
                  </TableCell>
                  <TableCell className="text-[12px] tabular text-foreground">
                    {formatNumber(company.users)}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-[12px] tabular text-muted-foreground">
                      <HardDrive className="size-3" /> {company.storage} GB
                    </span>
                  </TableCell>
                  <TableCell className="text-[12px] font-medium tabular text-foreground">
                    {formatCurrency(company.revenue)}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <span className="inline-flex justify-end">
                      <HealthIndicator health={company.health as "Healthy" | "At risk" | "Critical"} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Activity className="size-3.5 text-primary" />
          Reports are recalculated hourly from tenant events. Figures exclude draft and archived companies.
        </p>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3" /> Updated 22 Nov 2026, 14:30 IST
        </span>
      </div>
    </div>
  );
}
