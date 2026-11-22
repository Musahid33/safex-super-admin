"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  hint?: string;
  trend?: number[];
  accent?: "primary" | "info" | "warning" | "destructive" | "violet";
}

const accentStyles = {
  primary: { iconBg: "bg-primary/10", iconColor: "text-primary", stroke: "hsl(var(--chart-1))" },
  info: { iconBg: "bg-info/10", iconColor: "text-info", stroke: "hsl(var(--chart-2))" },
  warning: { iconBg: "bg-warning/10", iconColor: "text-warning", stroke: "hsl(var(--chart-3))" },
  destructive: { iconBg: "bg-destructive/10", iconColor: "text-destructive", stroke: "hsl(var(--chart-4))" },
  violet: { iconBg: "bg-violet-500/10", iconColor: "text-violet-600 dark:text-violet-300", stroke: "hsl(var(--chart-4))" },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel = "vs last month",
  hint,
  trend,
  accent = "primary",
}: KpiCardProps) {
  const styles = accentStyles[accent];
  const positive = (delta ?? 0) >= 0;
  const DeltaIcon = delta === undefined ? Minus : positive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="truncate text-[12px] font-medium text-muted-foreground">{label}</p>
          <p className="text-[22px] font-semibold leading-none tracking-tight tabular text-foreground">{value}</p>
        </div>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", styles.iconBg, styles.iconColor)}>
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px]">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-semibold tabular",
                positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              <DeltaIcon className="size-3" />
              {Math.abs(delta)}%
            </span>
          )}
          <span className="truncate text-muted-foreground">{delta !== undefined ? deltaLabel : hint}</span>
        </div>
        {trend && (
          <Sparkline
            data={trend}
            width={68}
            height={22}
            color={styles.stroke}
            filled
            className="h-6 w-[68px] shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
