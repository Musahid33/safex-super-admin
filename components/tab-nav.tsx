"use client";

import type { LucideIcon } from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

/** Underline-style tab strip shared by the settings, profile and company detail panels. */
export function TabNav({ tabs }: { tabs: TabItem[] }) {
  return (
    <div className="overflow-x-auto">
      <TabsList className="h-auto w-max justify-start border-0 bg-transparent p-0">
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-2.5 pt-1 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {Icon && <Icon className="size-3.5" />}
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
}
