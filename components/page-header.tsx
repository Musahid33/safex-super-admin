import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{title}</h1>
          {meta}
        </div>
        {description && (
          <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-muted-foreground/50">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
