import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  UserRound,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  exact?: boolean;
};

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Company Management", href: "/companies", icon: Building2 },
      { label: "Subscription", href: "/subscription", icon: CreditCard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [{ label: "Support", href: "/support", icon: LifeBuoy, badge: "3" }],
  },
  {
    label: "Workspace",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "My Profile", href: "/profile", icon: UserRound },
    ],
  },
];

export const searchablePages = [
  ...navGroups.flatMap((group) => group.items),
  { label: "Create Company", href: "/companies/new", icon: Building2 },
];
