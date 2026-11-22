import { CheckCircle2, Circle, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CompanyStatus, HealthStatus, PaymentStatus } from "@/lib/types";

export function StatusBadge({ status, className }: { status: CompanyStatus; className?: string }) {
  const map: Record<CompanyStatus, { variant: "success" | "info" | "warning" | "destructive" | "muted"; dot: string }> = {
    Active: { variant: "success", dot: "bg-success" },
    Trial: { variant: "info", dot: "bg-info" },
    Suspended: { variant: "destructive", dot: "bg-destructive" },
    Draft: { variant: "muted", dot: "bg-muted-foreground" },
    Archived: { variant: "warning", dot: "bg-warning" },
  };
  const config = map[status];
  return (
    <Badge variant={config.variant} className={className}>
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {status}
    </Badge>
  );
}

export function HealthIndicator({ health, showLabel = true }: { health: HealthStatus; showLabel?: boolean }) {
  const config = {
    Healthy: { color: "text-success", bar: "bg-success", Icon: CheckCircle2, label: "Healthy" },
    "At risk": { color: "text-warning", bar: "bg-warning", Icon: Clock3, label: "At risk" },
    Critical: { color: "text-destructive", bar: "bg-destructive", Icon: Circle, label: "Critical" },
  }[health];

  const Icon = config.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px]", config.color)}>
      <Icon className={cn("size-3.5", health === "Critical" && "fill-current")} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map = { Paid: "success", Pending: "warning", Overdue: "destructive" } as const;
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    Enterprise: "border-transparent bg-violet-500/10 text-violet-600 dark:text-violet-300",
    Growth: "border-transparent bg-primary/10 text-primary",
    Starter: "border-transparent bg-slate-500/10 text-slate-600 dark:text-slate-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold leading-5",
        map[plan] ?? map.Starter,
      )}
    >
      {plan}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, "destructive" | "warning" | "info" | "muted"> = {
    Urgent: "destructive",
    High: "warning",
    Medium: "info",
    Low: "muted",
  };
  return <Badge variant={map[priority] ?? "muted"}>{priority}</Badge>;
}

export function TicketStatusBadge({ status }: { status: string }) {
  const map: Record<string, "success" | "info" | "warning" | "muted"> = {
    Open: "info",
    "In progress": "warning",
    "Waiting on company": "muted",
    Resolved: "success",
  };
  return <Badge variant={map[status] ?? "muted"}>{status}</Badge>;
}

export function CompanyAvatar({
  initials,
  color,
  size = "md",
  className,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "size-7 rounded-md text-[10px]", md: "size-9 rounded-lg text-[11px]", lg: "size-12 rounded-xl text-sm" };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold tracking-wide text-white shadow-sm",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
