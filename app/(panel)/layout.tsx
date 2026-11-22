import { AppShell } from "@/components/layout/app-shell";
import { DataProvider } from "@/lib/store";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <DataProvider><AppShell>{children}</AppShell></DataProvider>;
}
