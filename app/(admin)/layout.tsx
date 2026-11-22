import { Shell } from "@/components/shell";
import { DataProvider } from "@/lib/store";
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <DataProvider><Shell>{children}</Shell></DataProvider>; }
