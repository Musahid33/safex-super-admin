"use client";

import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Download,
  Globe2,
  KeyRound,
  Mail,
  MessageCircle,
  Plug,
  RefreshCw,
  ScrollText,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { TabNav } from "@/components/tab-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ADDONS,
  PLAN_LIST,
  auditLogs,
  paymentGateways as seedGateways,
  smtpConfig,
  whatsappConfig,
} from "@/lib/data";
import { formatCurrency, formatDateTime, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "plans", label: "Plans", icon: CreditCard },
  { value: "addons", label: "Add-ons", icon: Sparkles },
  { value: "smtp", label: "SMTP", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "payments", label: "Payment gateway", icon: Wallet },
  { value: "system", label: "System", icon: Settings2 },
  { value: "audit", label: "Audit logs", icon: ScrollText },
];

const SEVERITY_VARIANT = {
  info: "muted",
  warning: "warning",
  critical: "destructive",
} as const;

export function SettingsPanel({ defaultTab }: { defaultTab: string }) {
  const [tab, setTab] = useState(TABS.some((item) => item.value === defaultTab) ? defaultTab : "plans");
  const [planAvailability, setPlanAvailability] = useState<Record<string, boolean>>({
    Starter: true,
    Growth: true,
    Enterprise: true,
  });
  const [addonState, setAddonState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ADDONS.map((addon) => [addon.id, addon.enabled])),
  );
  const [smtp, setSmtp] = useState(smtpConfig);
  const updateSmtp = (patch: Partial<typeof smtpConfig>) => setSmtp((prev) => ({ ...prev, ...patch }));
  const [smtpTested, setSmtpTested] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState({ company: true, invoice: true, trial: false });
  const [gateways, setGateways] = useState(seedGateways);
  const [system, setSystem] = useState({
    maintenance: false,
    signup: false,
    mfa: true,
    sso: false,
    auditRetention: "24 months",
    sessionTimeout: "12 hours",
    region: "ap-south-1 (Mumbai)",
  });
  const [saved, setSaved] = useState<string | null>(null);
  const [auditQuery, setAuditQuery] = useState("");
  const [auditSeverity, setAuditSeverity] = useState("all");
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const notify = (message: string) => {
    setSaved(message);
    window.setTimeout(() => setSaved(null), 2600);
  };

  const filteredAudit = auditLogs
    .filter(
      (entry) =>
        !auditQuery.trim() ||
        entry.action.toLowerCase().includes(auditQuery.toLowerCase()) ||
        entry.actor.toLowerCase().includes(auditQuery.toLowerCase()) ||
        entry.target.toLowerCase().includes(auditQuery.toLowerCase()),
    )
    .filter((entry) => auditSeverity === "all" || entry.severity === auditSeverity);

  const toggleGateway = (id: string) =>
    setGateways((prev) =>
      prev.map((gateway) =>
        gateway.id === id
          ? {
              ...gateway,
              status: gateway.status === "Connected" ? "Not connected" : "Connected",
              mode: gateway.status === "Connected" ? "—" : "Test",
              lastSync: gateway.status === "Connected" ? "—" : "2026-11-22T14:30:00",
            }
          : gateway,
      ),
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure commercial plans, integrations and platform-wide security controls."
        actions={
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <Globe2 className="size-3.5" /> ap-south-1 · Mumbai
          </Button>
        }
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
          <CheckCircle2 className="size-3.5" /> {saved}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabNav tabs={TABS} />

        <TabsContent value="plans" className="mt-4 space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-info/25 bg-info/10 px-3.5 py-2.5 text-[12px] text-info">
            <CreditCard className="mt-0.5 size-3.5 shrink-0" />
            Plan pricing applies to new tenants. Existing contracts keep their negotiated rates until renewal.
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {PLAN_LIST.map((plan) => (
              <Card key={plan.id} className={cn(plan.popular && "border-primary/40 ring-1 ring-primary/20")}>
                <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-[14px]">{plan.name}</CardTitle>
                    <p className="mt-1 text-[11px] text-muted-foreground">{plan.companies} tenants</p>
                  </div>
                  <Switch
                    checked={planAvailability[plan.id]}
                    onCheckedChange={(checked) =>
                      setPlanAvailability((prev) => ({ ...prev, [plan.id]: checked }))
                    }
                    aria-label={`Enable ${plan.name}`}
                  />
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Monthly (₹)
                      </Label>
                      <Input defaultValue={plan.priceMonthly} type="number" className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Annual (₹)
                      </Label>
                      <Input defaultValue={plan.priceAnnual} type="number" className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Seats</Label>
                      <Input defaultValue={plan.includedSeats} type="number" className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Storage GB</Label>
                      <Input defaultValue={plan.includedStorage} type="number" className="h-8 text-[12px]" />
                    </div>
                  </div>
                  <ul className="space-y-1.5 border-t border-border/60 pt-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <Check className="mt-0.5 size-3 shrink-0 text-success" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => notify(`${plan.name} plan updated`)}>
                    Save plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="addons" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Premium add-ons</CardTitle>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Add-ons are sold on top of the base plans and billed per seat or per company.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notify("Add-on catalogue updated")}>
                Save catalogue
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {ADDONS.map((addon) => (
                <div
                  key={addon.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-3.5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{addon.name}</p>
                      <p className="mt-0.5 max-w-xl text-[11px] leading-relaxed text-muted-foreground">
                        {addon.description}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {addon.companies} tenants · {formatCurrency(addon.revenue, { compact: true })} monthly
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <div className="w-28">
                      <Label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                        Price (₹)
                      </Label>
                      <Input defaultValue={addon.price} type="number" className="h-8 text-[12px]" />
                    </div>
                    <div className="w-32">
                      <Label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                        Billing unit
                      </Label>
                      <Input defaultValue={addon.unit} className="h-8 text-[12px]" />
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <span className="text-[11px] text-muted-foreground">
                        {addonState[addon.id] ? "Available" : "Paused"}
                      </span>
                      <Switch
                        checked={addonState[addon.id]}
                        onCheckedChange={(checked) =>
                          setAddonState((prev) => ({ ...prev, [addon.id]: checked }))
                        }
                        aria-label={`Availability for ${addon.name}`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="mt-4 text-muted-foreground"
                      aria-label={`Delete ${addon.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Transactional email</CardTitle>
                <Badge variant={smtpTested || smtp.status === "Verified" ? "success" : "warning"}>
                  {smtpTested || smtp.status === "Verified" ? "Verified" : "Unverified"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>SMTP host</Label>
                    <Input value={smtp.host} onChange={(event) => updateSmtp({ host: event.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Port</Label>
                    <Input value={smtp.port} onChange={(event) => updateSmtp({ port: event.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Username</Label>
                    <Input
                      value={smtp.username}
                      onChange={(event) => updateSmtp({ username: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password</Label>
                    <Input type="password" defaultValue="safex-smtp-secret" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>From name</Label>
                    <Input
                      value={smtp.fromName}
                      onChange={(event) => updateSmtp({ fromName: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>From email</Label>
                    <Input
                      value={smtp.fromEmail}
                      onChange={(event) => updateSmtp({ fromEmail: event.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Encryption</Label>
                    <Select
                      value={smtp.encryption}
                      onValueChange={(value) => updateSmtp({ encryption: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TLS">TLS (recommended)</SelectItem>
                        <SelectItem value="SSL">SSL</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {smtpTested && (
                  <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
                    <CheckCircle2 className="size-3.5" /> Test email delivered successfully to priya.sharma@safex.app.
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setSmtpTested(true);
                      notify("SMTP connection verified");
                    }}
                  >
                    <Send className="size-3.5" /> Send test email
                  </Button>
                  <Button size="sm" onClick={() => notify("SMTP settings saved")}>
                    Save settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Delivery health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { label: "Delivered (24h)", value: "4,812" },
                  { label: "Bounced", value: "12" },
                  { label: "Complaints", value: "1" },
                  { label: "Domain reputation", value: "Excellent" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium tabular text-foreground">{row.value}</span>
                  </div>
                ))}
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
                  SPF, DKIM and DMARC records are configured for safex.app. All platform and tenant email is
                  routed through this server.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>WhatsApp Business</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {whatsappEnabled ? "Connected" : "Disabled"}
                  </span>
                  <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} aria-label="WhatsApp channel" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Provider</Label>
                    <Input defaultValue={whatsappConfig.provider} disabled />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone number ID</Label>
                    <Input defaultValue={whatsappConfig.phoneNumberId} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Business name</Label>
                    <Input defaultValue={whatsappConfig.businessName} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Access token</Label>
                    <Input type="password" defaultValue="wa-cloud-token-secret" />
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-border p-3.5">
                  <p className="text-[12px] font-semibold text-foreground">Notification triggers</p>
                  {[
                    { key: "company" as const, label: "Company provisioned or suspended" },
                    { key: "invoice" as const, label: "Invoice generated and payment reminders" },
                    { key: "trial" as const, label: "Trial expiry reminders (3 days before)" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3">
                      <span className="text-[12px] text-muted-foreground">{item.label}</span>
                      <Switch
                        checked={whatsappAlerts[item.key]}
                        onCheckedChange={(checked) =>
                          setWhatsappAlerts((prev) => ({ ...prev, [item.key]: checked }))
                        }
                        aria-label={item.label}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-t border-border pt-3">
                  <Button size="sm" onClick={() => notify("WhatsApp settings saved")}>
                    Save settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Channel status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Quality rating</span>
                    <Badge variant="success">{whatsappConfig.quality}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Approved templates</span>
                    <span className="font-medium text-foreground">{whatsappConfig.templateCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Messages (24h)</span>
                    <span className="font-medium tabular text-foreground">1,284</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">Delivery rate</span>
                    <span className="font-medium text-success">98.6%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {[
                    { name: "company_provisioned", status: "Approved" },
                    { name: "invoice_reminder", status: "Approved" },
                    { name: "trial_expiring", status: "Approved" },
                    { name: "domain_verified", status: "Pending" },
                  ].map((template) => (
                    <div key={template.name} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="truncate font-mono text-muted-foreground">{template.name}</span>
                      <Badge variant={template.status === "Approved" ? "success" : "warning"}>
                        {template.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {gateways.map((gateway) => {
              const connected = gateway.status === "Connected";
              return (
                <Card key={gateway.id}>
                  <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Wallet className="size-4" />
                      </span>
                      <div>
                        <CardTitle className="text-[13px]">{gateway.name}</CardTitle>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{gateway.mode} mode</p>
                      </div>
                    </div>
                    <Badge variant={connected ? "success" : "muted"}>{gateway.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{gateway.description}</p>
                    <div className="space-y-1.5 border-t border-border/60 pt-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last sync</span>
                        <span className="text-foreground">
                          {gateway.lastSync === "—" ? "—" : formatDateTime(gateway.lastSync)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Webhook</span>
                        <span className="flex items-center gap-1 text-success">
                          {connected ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3 text-muted-foreground" />}
                          {connected ? "Healthy" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={connected ? "outline" : "default"}
                      size="sm"
                      className="w-full gap-1.5"
                      onClick={() => {
                        toggleGateway(gateway.id);
                        notify(`${gateway.name} ${connected ? "disconnected" : "connected"}`);
                      }}
                    >
                      <Plug className="size-3.5" /> {connected ? "Manage connection" : "Connect gateway"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Webhook endpoint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <code className="break-all font-mono text-[11px] text-foreground">
                    https://api.safex.app/v1/billing/webhooks/payments
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={() => {
                      setCopiedWebhook(true);
                      window.setTimeout(() => setCopiedWebhook(false), 1800);
                    }}
                  >
                    <Copy className="size-3" /> {copiedWebhook ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                  <div>
                    <p className="text-[12px] font-medium text-foreground">Signing secret</p>
                    <p className="text-[11px] text-muted-foreground">
                      Rotate every 90 days. Last rotated 14 Sep 2026.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notify("Webhook secret rotated")}>
                    <RefreshCw className="size-3.5" /> Rotate secret
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Settlement summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Captured (Nov)</span>
                  <span className="font-medium tabular text-foreground">{formatCurrency(11820000, { compact: true })}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Refunds</span>
                  <span className="font-medium tabular text-foreground">{formatCurrency(64000, { compact: true })}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Gateway fees</span>
                  <span className="font-medium tabular text-foreground">{formatCurrency(236400, { compact: true })}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[12px]">
                  <span className="font-medium text-foreground">Net settled</span>
                  <span className="font-semibold tabular text-success">{formatCurrency(11519600, { compact: true })}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Platform controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {[
                  {
                    key: "maintenance" as const,
                    label: "Maintenance mode",
                    description: "Show a maintenance page to all company admins and employees.",
                  },
                  {
                    key: "signup" as const,
                    label: "Public tenant signup",
                    description: "Allow prospects to start a self-serve trial without sales approval.",
                  },
                  {
                    key: "mfa" as const,
                    label: "Require MFA for super admins",
                    description: "Enforce a TOTP second factor on every internal admin account.",
                  },
                  {
                    key: "sso" as const,
                    label: "SAML SSO enforcement",
                    description: "Allow internal admins to sign in only through the corporate identity provider.",
                  },
                ].map((row) => (
                  <div key={row.key} className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{row.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{row.description}</p>
                    </div>
                    <Switch
                      checked={system[row.key]}
                      onCheckedChange={(checked) => setSystem((prev) => ({ ...prev, [row.key]: checked }))}
                      aria-label={row.label}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>Data region</Label>
                    <Select value={system.region} onValueChange={(value) => setSystem({ ...system, region: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ap-south-1 (Mumbai)">ap-south-1 (Mumbai)</SelectItem>
                        <SelectItem value="ap-south-2 (Hyderabad)">ap-south-2 (Hyderabad)</SelectItem>
                        <SelectItem value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Session timeout</Label>
                    <Select
                      value={system.sessionTimeout}
                      onValueChange={(value) => setSystem({ ...system, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4 hours">4 hours</SelectItem>
                        <SelectItem value="8 hours">8 hours</SelectItem>
                        <SelectItem value="12 hours">12 hours</SelectItem>
                        <SelectItem value="24 hours">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Audit retention</Label>
                    <Select
                      value={system.auditRetention}
                      onValueChange={(value) => setSystem({ ...system, auditRetention: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12 months">12 months</SelectItem>
                        <SelectItem value="24 months">24 months</SelectItem>
                        <SelectItem value="36 months">36 months</SelectItem>
                        <SelectItem value="Indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-3">
                  <Button size="sm" onClick={() => notify("System settings saved")}>
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-[12px]">
                  {[
                    { label: "Environment", value: "Production" },
                    { label: "Release", value: "v4.18.2" },
                    { label: "Data region", value: system.region },
                    { label: "Status page", value: "All systems normal" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="text-right font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-warning" /> Danger zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    These actions affect every tenant and require a second approver.
                  </p>
                  <Button variant="destructive-outline" size="sm" className="w-full gap-1.5">
                    <KeyRound className="size-3.5" /> Rotate platform keys
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <ShieldCheck className="size-3.5" /> Export compliance pack
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Events today", value: "128", icon: Activity, tone: "bg-primary/10 text-primary" },
              { label: "Warnings", value: "6", icon: AlertTriangle, tone: "bg-warning/10 text-warning" },
              { label: "Critical", value: "1", icon: ShieldCheck, tone: "bg-destructive/10 text-destructive" },
              { label: "Retention", value: system.auditRetention, icon: ScrollText, tone: "bg-muted text-muted-foreground" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-border bg-card p-3.5 shadow-card">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                    <span className={cn("flex size-6 items-center justify-center rounded-md", item.tone)}>
                      <Icon className="size-3.5" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-[18px] font-semibold tabular text-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Audit log</CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                <Download className="size-3.5" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={auditQuery}
                    onChange={(event) => setAuditQuery(event.target.value)}
                    placeholder="Search action, actor or target…"
                    className="h-9 pl-8 text-[13px]"
                  />
                </div>
                <Select value={auditSeverity} onValueChange={setAuditSeverity}>
                  <SelectTrigger className="h-9 w-full sm:w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Action</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>When</TableHead>
                      <TableHead className="text-right">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudit.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-[11px] font-medium text-foreground">
                          {entry.action}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-[12px] text-muted-foreground">
                          {entry.actor}
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-[12px] text-foreground">
                          {entry.target}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">{entry.ip}</TableCell>
                        <TableCell className="whitespace-nowrap text-[11px] tabular text-muted-foreground">
                          {relativeTime(entry.timestamp)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={SEVERITY_VARIANT[entry.severity]}>{entry.severity}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAudit.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-[12px] text-muted-foreground">
                          No audit events match the current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
