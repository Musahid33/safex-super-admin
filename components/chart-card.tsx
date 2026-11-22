import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-[13px]">{title}</CardTitle>
          {description && <CardDescription className="text-[12px]">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("pb-5", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
