"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

export function DonutChart({
  data,
  centerLabel = "Total",
  centerValue,
  size = 176,
  thickness = 16,
  className,
}: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 50 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = data.map((d, index) => ({
    d,
    index,
    dash: (d.value / total) * circumference,
    offset: data.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0),
  }));
  const activeItem = active !== null ? data[active] : null;

  return (
    <div className={cn("flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={thickness} />
          {segments.map(({ d, index, dash, offset }) => (
            <circle
              key={d.name}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={active === index ? thickness + 3 : thickness}
              strokeDasharray={`${Math.max(dash - 2, 0)} ${circumference - Math.max(dash - 2, 0)}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-200"
              style={{ opacity: active === null || active === index ? 1 : 0.4 }}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular tracking-tight text-foreground">
            {activeItem ? activeItem.value : (centerValue ?? total)}
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            {activeItem ? activeItem.name : centerLabel}
          </span>
        </div>
      </div>
      <div className="w-full space-y-2.5">
        {data.map((d, index) => (
          <div
            key={d.name}
            className={cn(
              "flex cursor-default items-center justify-between rounded-md px-2 py-1 text-[13px] transition-colors",
              active === index && "bg-muted/60",
            )}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
            <span className="flex items-baseline gap-2">
              <span className="tabular font-semibold text-foreground">{d.value}</span>
              <span className="w-9 text-right text-[11px] tabular text-muted-foreground">
                {Math.round((d.value / total) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
