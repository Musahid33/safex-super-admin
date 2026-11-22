import { SettingsPanel } from "@/components/settings/settings-panel";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  return <SettingsPanel defaultTab={tab ?? "plans"} />;
}
