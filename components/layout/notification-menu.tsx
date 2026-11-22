"use client";

import { Bell, CheckCheck, CreditCard, LifeBuoy, ShieldAlert, TrendingUp, UserPlus } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/lib/data";
import { cn } from "@/lib/utils";

const icons = {
  billing: CreditCard,
  warning: ShieldAlert,
  support: LifeBuoy,
  domain: TrendingUp,
  company: UserPlus,
} as const;

export function NotificationMenu() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-card">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-[13px] font-semibold text-foreground">Notifications</p>
            <p className="text-[11px] text-muted-foreground">{unread} unread updates</p>
          </div>
          <button
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
            className="flex items-center gap-1 text-[11px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            <CheckCheck className="size-3" />
            Mark all read
          </button>
        </div>
        <div className="max-h-[340px] overflow-y-auto scrollbar-thin">
          {items.map((item) => {
            const Icon = icons[item.type as keyof typeof icons] ?? Bell;
            return (
              <button
                key={item.id}
                onClick={() =>
                  setItems((prev) =>
                    prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
                  )
                }
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50",
                  item.unread && "bg-primary/[0.03]",
                )}
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[12px] font-medium text-foreground">{item.title}</span>
                    {item.unread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground/70">{item.time}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-border p-2">
          <Button variant="ghost" className="w-full justify-center text-[12px]" size="sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
