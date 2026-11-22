"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type AreaSeries = {
  key: string;
  label: string;
  color: string;
};

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey?: string;
  series: AreaSeries[];
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
  showLegend?: boolean;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    path += ` C ${midX},${prev.y} ${midX},${curr.y} ${curr.x},${curr.y}`;
  }
  return path;
}

export function AreaChart({
  data,
  xKey = "month",
  series,
  height = 260,
  formatValue = (v) => v.toLocaleString("en-IN"),
  className,
  showLegend = true,
}: AreaChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const { min, max, ticks } = useMemo(() => {
    const values = data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0));
    const rawMax = Math.max(...values, 1);
    const rawMin = Math.min(...values, 0);
    const padded = rawMax * 1.12;
    const step = (padded - rawMin) / 4;
    return {
      min: rawMin,
      max: padded,
      ticks: Array.from({ length: 5 }, (_, i) => rawMin + step * i),
    };
  }, [data, series]);

  const toY = (value: number) => 100 - ((value - min) / (max - min)) * 100;
  const toX = (index: number) => (index / Math.max(data.length - 1, 1)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex" style={{ height }}>
        <div className="flex w-12 shrink-0 flex-col justify-between pb-6 pr-2 text-right">
          {[...ticks].reverse().map((tick, i) => (
            <span key={i} className="text-[10px] font-medium tabular leading-none text-muted-foreground/80">
              {formatValue(tick)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 top-0 bottom-6">
            {ticks.map((_, i) => (
              <div
                key={i}
                className="absolute inset-x-0 border-t border-dashed border-border/70"
                style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
              />
            ))}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              onMouseLeave={() => setHover(null)}
            >
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {series.map((s, si) => {
                const points = data.map((d, i) => ({ x: toX(i), y: toY(Number(d[s.key]) || 0) }));
                const line = smoothPath(points);
                if (si === 0) {
                  return (
                    <g key={s.key}>
                      <path d={`${line} L 100,100 L 0,100 Z`} fill={`url(#area-${s.key})`} stroke="none" />
                      <path
                        d={line}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                }
                return (
                  <path
                    key={s.key}
                    d={line}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={1.75}
                    strokeDasharray={si > 1 ? "4 4" : undefined}
                    strokeLinecap="round"
                    opacity={si > 1 ? 0.55 : 0.95}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {hover !== null && (
                <line
                  x1={toX(hover)}
                  x2={toX(hover)}
                  y1={0}
                  y2={100}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.45}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            <div className="absolute inset-0 flex">
              {data.map((_, i) => (
                <div
                  key={i}
                  className="relative h-full flex-1"
                  onMouseEnter={() => setHover(i)}
                >
                  {hover === i && (
                    <>
                      {series.map((s) => (
                        <span
                          key={s.key}
                          className="absolute z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow-sm"
                          style={{
                            left: `${toX(i)}%`,
                            top: `${toY(Number(data[i][s.key]) || 0)}%`,
                            backgroundColor: s.color,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>

            {hover !== null && (
              <div
                className="pointer-events-none absolute top-1 z-20 w-[168px] -translate-x-1/2 rounded-lg border border-border bg-popover p-2.5 shadow-popover"
                style={{
                  left: `${Math.min(Math.max(toX(hover), 12), 86)}%`,
                }}
              >
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {data[hover][xKey]}
                </p>
                <div className="space-y-1">
                  {series.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                      <span className="tabular font-semibold text-foreground">
                        {formatValue(Number(data[hover][s.key]) || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between">
            {data.map((d, i) => (
              <span
                key={i}
                className={cn(
                  "text-[10px] font-medium text-muted-foreground/80 transition-colors",
                  hover === i && "text-foreground",
                )}
              >
                {d[xKey]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="mt-3 flex flex-wrap items-center gap-4 pl-12">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
