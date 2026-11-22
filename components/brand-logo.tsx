import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_12px_-2px_rgba(16,185,129,0.45)]">
        <ShieldCheck className="size-[18px]" strokeWidth={2.4} />
      </span>
      {!compact && (
        <div className="leading-none">
          <p className="text-[15px] font-semibold tracking-tight text-white">
            SAFEX
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-sidebar-muted">
            Super Admin
          </p>
        </div>
      )}
    </div>
  );
}
