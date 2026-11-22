"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey?: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
  showLegend?: boolean;
  maxBarWidth?: number;
}

export function BarChart({
  data,
  xKey = "label",
  series,
  height = 240,
  formatValue = (v) => v.toLocaleString("en-IN"),
  className,
  showLegend = true,
  maxBarWidth = 18,
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(
    ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)),
    1,
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-dashed border-border/60" />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((d, index) => (
            <div
              key={String(d[xKey])}
              className="group relative flex h-full flex-1 items-end justify-center gap-0.5"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              {series.map((s) => {
                const value = Number(d[s.key]) || 0;
                return (
                  <div
                    key={s.key}
                    className="rounded-t-[3px] transition-all duration-300"
                    style={{
                      height: `${Math.max((value / max) * 100, 2)}%`,
                      width: `${maxBarWidth}px`,
                      backgroundColor: s.color,
                      opacity: hover === null || hover === index ? 1 : 0.45,
                    }}
                  />
                );
              })}
              {hover === index && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-[150px] -translate-x-1/2 rounded-lg border border-border bg-popover p-2.5 shadow-popover">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {d[xKey]}
                  </p>
                  {series.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                      <span className="tabular font-semibold text-foreground">
                        {formatValue(Number(d[s.key]) || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between gap-2 border-t border-border pt-2">
        {data.map((d) => (
          <span
            key={String(d[xKey])}
            className="flex-1 text-center text-[10px] font-medium text-muted-foreground/80"
          >
            {d[xKey]}
          </span>
        ))}
      </div>
      {showLegend && (
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
