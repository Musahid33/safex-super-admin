"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Gauge,
  Info,
  Loader2,
  Lock,
  Mail,
  ReceiptIndianRupee,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { PasswordStrength } from "@/components/password-strength";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADDONS, INDUSTRIES, PLAN_LIST } from "@/lib/data";
import { formatCurrency, passwordChecks, slugify } from "@/lib/format";
import type { BillingCycle, Company, CompanyDraftData, PlanName } from "@/lib/types";
import { useCompanyStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type WizardForm = {
  name: string;
  companyEmail: string;
  companyPhone: string;
  logoFileName: string;
  industry: string;
  subdomain: string;
  website: string;
  city: string;
  address: string;
  logoColor: string;
  adminName: string;
  adminDesignation: string;
  adminEmail: string;
  adminPhone: string;
  adminUsername: string;
  password: string;
  confirmPassword: string;
  plan: PlanName;
  cycle: BillingCycle;
  startDate: string;
  expiryDate: string;
  addons: string[];
  maxUsers: number;
  maxEmployees: number;
  maxLocations: number;
  storageLimit: number;
  apiLimit: number;
};

const STEPS: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Company details", description: "Identity and tenant URL", icon: Building2 },
  { title: "Admin account", description: "Owner and credentials", icon: ShieldCheck },
  { title: "Subscription", description: "Plan and billing cycle", icon: CreditCard },
  { title: "Add-ons", description: "Premium modules", icon: Sparkles },
  { title: "Limits", description: "Plan guardrails", icon: Gauge },
  { title: "Review", description: "Confirm and publish", icon: ClipboardCheck },
];

const LOGO_COLORS = ["#0F766E", "#2563EB", "#7C3AED", "#C2410C", "#0891B2", "#BE123C", "#15803D", "#A21CAF"];

const ADDON_ICONS: Record<string, LucideIcon> = {
  "asset-management": Boxes,
  "salary-slip": ReceiptIndianRupee,
  "email-integration": Mail,
};

const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const defaultStart = dateValue(new Date());
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear()+1);
const defaultExpiry = dateValue(oneYearFromNow);

const initialForm: WizardForm = {
  name: "",
  companyEmail: "",
  companyPhone: "",
  logoFileName: "",
  industry: "",
  subdomain: "",
  website: "",
  city: "",
  address: "",
  logoColor: LOGO_COLORS[0],
  adminName: "",
  adminDesignation: "Company Admin",
  adminEmail: "",
  adminPhone: "",
  adminUsername: "",
  password: "",
  confirmPassword: "",
  plan: "Growth",
  cycle: "Monthly",
  startDate: defaultStart,
  expiryDate: defaultExpiry,
  addons: ["asset-management"],
  maxUsers: 250,
  maxEmployees: 400,
  maxLocations: 15,
  storageLimit: 200,
  apiLimit: 150000,
};

function Field({
  label,
  hint,
  required,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="max-w-[62%] break-words text-right text-[12px] font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export function CreateCompanyWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const { companies, addCompany, ready } = useCompanyStore();
  const [draftHydrated, setDraftHydrated] = useState(false);
  const companyId = useRef("");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(initialForm);
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready || draftHydrated) return;
    const draft = draftId ? companies.find(company => company.id === draftId && company.status === "Draft") : undefined;
    if (draft) {
      companyId.current = draft.id;
      const [address = "", city = ""] = (draft.address ?? "").split(/,\s*(?=[^,]+$)/);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        ...initialForm,
        ...(draft.draftData ?? {
          name: draft.name,
          companyEmail: draft.email ?? "",
          companyPhone: draft.phone ?? "",
          industry: draft.industry,
          subdomain: draft.subdomain.replace(/\.safex\.app$/, ""),
          city,
          address,
          logoColor: draft.logoColor,
          adminName: draft.admin.name,
          adminDesignation: draft.admin.designation,
          adminEmail: draft.admin.email,
          adminPhone: draft.admin.phone,
          adminUsername: draft.admin.username,
          plan: draft.plan,
          cycle: draft.billingCycle,
          startDate: draft.subscriptionStart ?? draft.createdAt,
          expiryDate: draft.expiry,
          addons: draft.addons,
          maxUsers: draft.maxUsers,
          maxEmployees: draft.maxEmployees,
          maxLocations: draft.maxLocations,
          storageLimit: draft.storageLimit,
          apiLimit: draft.apiLimit,
        }),
        password: "",
        confirmPassword: "",
      });
      setSubdomainTouched(true);
    }
    // This is intentional one-time hydration of the selected persisted draft.
    setDraftHydrated(true);
  }, [ready, draftHydrated, draftId, companies]);

  const set = <K extends keyof WizardForm>(key: K, value: WizardForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const checks = passwordChecks(form.password);
  const plan = PLAN_LIST.find((item) => item.id === form.plan) ?? PLAN_LIST[1];

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.adminEmail);
  const companyEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.companyEmail);
  const passwordValid = checks.every((check) => check.valid);
  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;

  const stepErrors = useMemo<Record<number, Record<string, string>>>(() => {
    const step1 = {
      name: form.name.trim().length < 3 ? "Enter the registered company name" : "",
      industry: !form.industry ? "Select an industry" : "",
      subdomain:
        form.subdomain.length < 3
          ? "Tenant URL must be at least 3 characters"
          : !/^[a-z0-9-]+$/.test(form.subdomain)
            ? "Use lowercase letters, numbers and hyphens only"
            : "",
      city: !form.city.trim() ? "Enter the primary operating city" : "",
      companyEmail: !companyEmailValid ? "Enter a valid company email address" : "",
    };
    const step2 = {
      adminName: form.adminName.trim().length < 3 ? "Enter the company admin's full name" : "",
      adminEmail: !emailValid ? "Enter a valid work email address" : "",
      adminPhone: form.adminPhone.replace(/\D/g, "").length < 10 ? "Enter a 10-digit mobile number" : "",
      adminUsername: form.adminUsername.trim().length < 3 ? "Choose a username" : "",
      password: !passwordValid ? "Password must satisfy all requirements" : "",
      confirmPassword: !passwordsMatch ? "Passwords do not match" : "",
    };
    const step3 = {
      startDate: !form.startDate ? "Choose a subscription start date" : "",
      expiryDate: !form.expiryDate ? "Choose an expiry date" : form.expiryDate < form.startDate ? "Expiry must be on or after the start date" : "",
    };
    const step5 = {
      maxUsers: form.maxUsers < 1 ? "At least 1 user is required" : "",
      storageLimit: form.storageLimit < 1 ? "Storage must be at least 1 GB" : "",
    };
    return { 0: step1, 1: step2, 2: step3, 4: step5 };
  }, [form, emailValid, companyEmailValid, passwordValid, passwordsMatch]);

  const currentErrors = stepErrors[step] ?? {};
  const stepValid = Object.values(currentErrors).every((error) => !error);
  const isStepComplete = (index: number) =>
    Object.values(stepErrors[index] ?? {}).every((error) => !error);

  const addonMonthly = ADDONS.filter((addon) => form.addons.includes(addon.id)).reduce(
    (sum, addon) => sum + addon.price * (addon.unit.includes("user") ? form.maxUsers : 1),
    0,
  );
  const baseMonthly = form.cycle === "Annual" ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;
  const monthlyEstimate = baseMonthly + addonMonthly;
  const tenantUrl = `${form.subdomain || "company"}.safex.app`;

  const goNext = () => {
    if (!stepValid) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setStep((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const goBack = () => {
    setAttempted(false);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleName = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      subdomain: subdomainTouched ? prev.subdomain : slugify(value),
    }));
  };

  const handlePlan = (next: PlanName) => {
    const nextPlan = PLAN_LIST.find((item) => item.id === next) ?? PLAN_LIST[1];
    setForm((prev) => ({
      ...prev,
      plan: next,
      maxUsers: nextPlan.includedSeats,
      storageLimit: nextPlan.includedStorage,
      maxEmployees: Math.round(nextPlan.includedSeats * 1.6),
      maxLocations: next === "Enterprise" ? 50 : next === "Growth" ? 15 : 5,
      apiLimit: next === "Enterprise" ? 600000 : next === "Growth" ? 150000 : 40000,
    }));
  };

  const toggleAddon = (id: string) =>
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.includes(id) ? prev.addons.filter((item) => item !== id) : [...prev.addons, id],
    }));

  const getCompanyId = () => {
    if (!companyId.current) companyId.current = `cmp_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 11)}`;
    return companyId.current;
  };

  const buildCompany = (status: Company["status"], id: string): Company => {
    const now = new Date();
    const initials = form.name.trim().split(/\s+/).filter(Boolean).slice(0, 3).map(part => part[0]).join("").toUpperCase() || "NEW";
    const draftData: CompanyDraftData = {
      name: form.name, companyEmail: form.companyEmail, companyPhone: form.companyPhone, logoFileName: form.logoFileName,
      industry: form.industry, subdomain: form.subdomain, website: form.website, city: form.city, address: form.address,
      logoColor: form.logoColor, adminName: form.adminName, adminDesignation: form.adminDesignation,
      adminEmail: form.adminEmail, adminPhone: form.adminPhone, adminUsername: form.adminUsername,
      plan: form.plan, cycle: form.cycle, startDate: form.startDate, expiryDate: form.expiryDate,
      addons: form.addons, maxUsers: form.maxUsers, maxEmployees: form.maxEmployees,
      maxLocations: form.maxLocations, storageLimit: form.storageLimit, apiLimit: form.apiLimit,
    };
    return {
      id,
      name: form.name.trim() || "Untitled company",
      shortName: initials,
      initials,
      logoColor: form.logoColor,
      logoFileName: form.logoFileName || undefined,
      industry: form.industry || "Other",
      subdomain: `${form.subdomain || "company"}.safex.app`,
      sslStatus: "Issued",
      admin: { name: form.adminName || "Admin not assigned", designation: form.adminDesignation || "Company Admin", email: form.adminEmail || "", phone: form.adminPhone || "", username: form.adminUsername || "", lastLogin: "Never" },
      plan: form.plan,
      billingCycle: form.cycle,
      status,
      health: "Healthy",
      paymentStatus: "Pending",
      addons: form.addons,
      users: 0,
      maxUsers: Number(form.maxUsers) || 0,
      employees: 0,
      maxEmployees: Number(form.maxEmployees) || 0,
      locations: 0,
      maxLocations: Number(form.maxLocations) || 0,
      storageUsed: 0,
      storageLimit: Number(form.storageLimit) || 0,
      apiCalls: 0,
      apiLimit: Number(form.apiLimit) || 0,
      mrr: status === "Draft" ? 0 : monthlyEstimate,
      subscriptionStart: form.startDate,
      expiry: form.expiryDate,
      createdAt: dateValue(now),
      lastActive: now.toISOString(),
      country: "India",
      email: form.companyEmail,
      phone: form.companyPhone,
      website: form.website || undefined,
      address: [form.address, form.city].filter(Boolean).join(", "),
      ...(status === "Draft" ? { draftData } : {}),
    };
  };

  const saveDraft = () => {
    addCompany(buildCompany("Draft", getCompanyId()));
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 2600);
  };

  const publish = () => {
    addCompany(buildCompany("Active", getCompanyId()));
    setPublishing(true);
    window.setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 1100);
  };

  const copyTenantUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${tenantUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{draftId ? "Resume company draft" : "Create company"}</h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
            Create a demo tenant record with its own URL, company admin, plan, features and limits. Nothing is provisioned in a live service.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="text-muted-foreground">
            <Link href="/companies">
              <ArrowLeft className="size-3.5" />
              Back to companies
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={saveDraft}
          >
            <Save className="size-3.5" />
            Save draft
          </Button>
        </div>
      </div>

      {draftSaved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
          <CheckCircle2 className="size-3.5" /> Draft saved. You can resume this company from the Drafts tab.
        </div>
      )}

      <ol className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          const complete = index < step;
          const active = index === step;
          return (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => index <= step && setStep(index)}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                  active
                    ? "border-primary/40 bg-primary/[0.05] shadow-sm"
                    : complete
                      ? "border-border bg-card hover:border-primary/25"
                      : "border-border/70 bg-muted/20",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    active
                      ? "bg-primary text-primary-foreground"
                      : complete
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {complete ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[12px] font-medium",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="mt-0.5 hidden truncate text-[10px] text-muted-foreground xl:block">
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">
              {STEPS[step].title}
            </h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{STEPS[step].description}</p>
          </div>

          <div className="space-y-5 p-5">
            {step === 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Company name" required error={attempted ? currentErrors.name : ""}>
                    <Input
                      value={form.name}
                      onChange={(event) => handleName(event.target.value)}
                      placeholder="e.g. Tata Steel Works"
                    />
                  </Field>
                  <Field label="Industry" required error={attempted ? currentErrors.industry : ""}>
                    <Select value={form.industry} onValueChange={(value) => set("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Company email" required error={attempted ? currentErrors.companyEmail : ""}>
                    <Input type="email" value={form.companyEmail} onChange={(event) => set("companyEmail", event.target.value)} placeholder="hello@company.com" />
                  </Field>
                  <Field label="Company phone">
                    <Input type="tel" value={form.companyPhone} onChange={(event) => set("companyPhone", event.target.value)} placeholder="+91 98765 43210" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Tenant subdomain"
                    required
                    hint="Lowercase letters, numbers and hyphens. This becomes the tenant URL."
                    error={attempted ? currentErrors.subdomain : ""}
                  >
                    <div className="flex items-center rounded-lg border border-input bg-background shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/20 dark:bg-card">
                      <Input
                        value={form.subdomain}
                        onChange={(event) => {
                          setSubdomainTouched(true);
                          set("subdomain", slugify(event.target.value));
                        }}
                        placeholder="company"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                      />
                      <span className="shrink-0 border-l border-border px-3 text-[12px] text-muted-foreground">
                        .safex.app
                      </span>
                    </div>
                  </Field>
                  <Field label="Website" hint="Optional. Used on the tenant login page.">
                    <Input
                      value={form.website}
                      onChange={(event) => set("website", event.target.value)}
                      placeholder="https://company.com"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Primary city" required error={attempted ? currentErrors.city : ""}>
                    <Input
                      value={form.city}
                      onChange={(event) => set("city", event.target.value)}
                      placeholder="e.g. Jamshedpur"
                    />
                  </Field>
                  <Field label="Registered country">
                    <Input value="India" disabled />
                  </Field>
                </div>

                <Field label="Registered address" hint="Shown on invoices and compliance reports.">
                  <Textarea
                    value={form.address}
                    onChange={(event) => set("address", event.target.value)}
                    placeholder="Plot 12, Industrial Estate, Jamshedpur, Jharkhand 831001"
                  />
                </Field>

                <Field label="Company logo" hint="Optional · PNG, JPG or SVG">
                  <Input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={(event) => set("logoFileName", event.target.files?.[0]?.name ?? "")} />
                  {form.logoFileName && <p className="text-[10px] text-muted-foreground">Selected: {form.logoFileName}</p>}
                </Field>

                <div className="space-y-2">
                  <Label>Brand colour</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    {LOGO_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => set("logoColor", color)}
                        aria-label={`Use ${color} as brand colour`}
                        className={cn(
                          "size-7 rounded-lg border-2 transition-transform hover:scale-105",
                          form.logoColor === color ? "border-foreground/60" : "border-transparent",
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {form.logoColor === color && <Check className="mx-auto size-3.5 text-white" />}
                      </button>
                    ))}
                    <span className="text-[11px] text-muted-foreground">
                      Used for the company avatar and tenant accents.
                    </span>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex items-start gap-2 rounded-lg border border-info/25 bg-info/10 px-3 py-2.5 text-[12px] leading-relaxed text-info">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  This user becomes the Company Admin — the first owner of the tenant with the Admin role and
                  all company-level permissions.
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name" required error={attempted ? currentErrors.adminName : ""}>
                    <Input
                      value={form.adminName}
                      onChange={(event) => set("adminName", event.target.value)}
                      placeholder="e.g. Rohit Malhotra"
                    />
                  </Field>
                  <Field label="Designation">
                    <Input value={form.adminDesignation} onChange={(event) => set("adminDesignation", event.target.value)} placeholder="e.g. EHS Manager" />
                  </Field>
                  <Field label="Work email" required error={attempted ? currentErrors.adminEmail : ""}>
                    <Input
                      type="email"
                      value={form.adminEmail}
                      onChange={(event) => set("adminEmail", event.target.value)}
                      placeholder="name@company.com"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Mobile number" required error={attempted ? currentErrors.adminPhone : ""}>
                    <Input
                      value={form.adminPhone}
                      onChange={(event) => set("adminPhone", event.target.value)}
                      placeholder="+91 98450 22114"
                    />
                  </Field>
                  <Field
                    label="Username"
                    required
                    hint="Used for password recovery and audit trails."
                    error={attempted ? currentErrors.adminUsername : ""}
                  >
                    <div className="flex items-center rounded-lg border border-input bg-background shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/20 dark:bg-card">
                      <span className="shrink-0 border-r border-border px-3 text-[12px] text-muted-foreground">@</span>
                      <Input
                        value={form.adminUsername}
                        onChange={(event) => set("adminUsername", slugify(event.target.value))}
                        placeholder="rohit.malhotra"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Password" required error={attempted ? currentErrors.password : ""}>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) => set("password", event.target.value)}
                        placeholder="Create a strong password"
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm password" required error={attempted ? currentErrors.confirmPassword : ""}>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(event) => set("confirmPassword", event.target.value)}
                      placeholder="Re-enter the password"
                    />
                  </Field>
                </div>

                <PasswordStrength password={form.password} />
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                  {PLAN_LIST.map((item) => {
                    const active = form.plan === item.id;
                    const price = form.cycle === "Annual" ? item.priceAnnual : item.priceMonthly;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePlan(item.id)}
                        className={cn(
                          "relative flex flex-col rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/30"
                            : "border-border hover:border-primary/30 hover:shadow-sm",
                        )}
                      >
                        {item.popular && (
                          <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-foreground">{item.name}</span>
                          <span
                            className={cn(
                              "flex size-4 items-center justify-center rounded-full border",
                              active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                            )}
                          >
                            {active && <Check className="size-3" />}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.tagline}</p>
                        <p className="mt-3 text-[17px] font-semibold tabular tracking-tight text-foreground">
                          {formatCurrency(price, { compact: true })}
                          <span className="text-[10px] font-normal text-muted-foreground">
                            /{form.cycle === "Annual" ? "yr" : "mo"}
                          </span>
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {item.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                              <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <Label>Billing cycle</Label>
                  <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
                    {(["Monthly", "Annual"] as BillingCycle[]).map((cycle) => (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => set("cycle", cycle)}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                          form.cycle === cycle
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {cycle}
                        {cycle === "Annual" && (
                          <span className="ml-1.5 rounded bg-success/15 px-1 py-0.5 text-[9px] font-semibold text-success">
                            Save 20%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Subscription start date" required error={attempted ? currentErrors.startDate : ""}>
                    <Input type="date" value={form.startDate} onChange={(event) => set("startDate", event.target.value)} />
                  </Field>
                  <Field label="Subscription expiry date" required error={attempted ? currentErrors.expiryDate : ""}>
                    <Input type="date" value={form.expiryDate} onChange={(event) => set("expiryDate", event.target.value)} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-3.5 sm:grid-cols-4">
                  {[
                    { label: "Included seats", value: plan.includedSeats },
                    { label: "Storage", value: `${plan.includedStorage} GB` },
                    { label: "Locations", value: plan.id === "Enterprise" ? 50 : plan.id === "Growth" ? 15 : 5 },
                    { label: "Support SLA", value: plan.id === "Enterprise" ? "99.9%" : plan.id === "Growth" ? "4 hours" : "Email" },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{row.label}</p>
                      <p className="mt-0.5 text-[13px] font-semibold tabular text-foreground">{row.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-3">
                  {ADDONS.map((addon) => {
                    const Icon = ADDON_ICONS[addon.id] ?? Sparkles;
                    const selected = form.addons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                          selected
                            ? "border-primary/50 bg-primary/[0.04] ring-1 ring-primary/20"
                            : "border-border hover:border-primary/25 hover:bg-muted/30",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg",
                            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold text-foreground">{addon.name}</span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              ₹{addon.price} / {addon.unit}
                            </span>
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground">
                            {addon.description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-1 flex size-4 shrink-0 items-center justify-center rounded border",
                            selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Add-ons are billed on top of the base plan and can be enabled or disabled later from the
                  company&apos;s Features tab.
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Maximum users" error={attempted ? currentErrors.maxUsers : ""}>
                    <Input
                      type="number"
                      min={1}
                      value={form.maxUsers}
                      onChange={(event) => set("maxUsers", Number(event.target.value))}
                    />
                  </Field>
                  <Field label="Maximum employees">
                    <Input
                      type="number"
                      min={1}
                      value={form.maxEmployees}
                      onChange={(event) => set("maxEmployees", Number(event.target.value))}
                    />
                  </Field>
                  <Field label="Maximum locations">
                    <Input
                      type="number"
                      min={1}
                      value={form.maxLocations}
                      onChange={(event) => set("maxLocations", Number(event.target.value))}
                    />
                  </Field>
                  <Field label="Storage limit (GB)" error={attempted ? currentErrors.storageLimit : ""}>
                    <Input
                      type="number"
                      min={1}
                      value={form.storageLimit}
                      onChange={(event) => set("storageLimit", Number(event.target.value))}
                    />
                  </Field>
                  <Field label="Monthly API calls" className="sm:col-span-2">
                    <Input
                      type="number"
                      min={1000}
                      step={1000}
                      value={form.apiLimit}
                      onChange={(event) => set("apiLimit", Number(event.target.value))}
                    />
                  </Field>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2.5 text-[12px] text-warning">
                  <Gauge className="mt-0.5 size-3.5 shrink-0" />
                  Limits are hard caps enforced at the tenant boundary. Users see an upgrade prompt when a limit is
                  reached.
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-border">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-[12px] font-semibold text-foreground">Company</p>
                    </div>
                    <div className="px-4 py-2">
                      <SummaryRow label="Name" value={form.name || "—"} />
                      <SummaryRow label="Industry" value={form.industry || "—"} />
                      <SummaryRow label="Company email" value={form.companyEmail || "—"} />
                      <SummaryRow label="Company phone" value={form.companyPhone || "—"} />
                      <SummaryRow label="City" value={form.city || "—"} />
                      <SummaryRow
                        label="Tenant URL"
                        value={<span className="font-mono text-[11px]">{tenantUrl}</span>}
                      />
                      <SummaryRow
                        label="Brand colour"
                        value={
                          <span className="flex items-center gap-1.5">
                            <span className="size-3 rounded" style={{ backgroundColor: form.logoColor }} />
                            {form.logoColor}
                          </span>
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-[12px] font-semibold text-foreground">Company admin</p>
                    </div>
                    <div className="px-4 py-2">
                      <SummaryRow label="Name" value={form.adminName || "—"} />
                      <SummaryRow label="Designation" value={form.adminDesignation || "Company Admin"} />
                      <SummaryRow label="Email" value={form.adminEmail || "—"} />
                      <SummaryRow label="Phone" value={form.adminPhone || "—"} />
                      <SummaryRow label="Username" value={form.adminUsername ? `@${form.adminUsername}` : "—"} />
                      <SummaryRow
                        label="Password"
                        value={
                          <span className="flex items-center gap-1 text-success">
                            <Lock className="size-3" /> Meets policy
                          </span>
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-[12px] font-semibold text-foreground">Subscription</p>
                    </div>
                    <div className="px-4 py-2">
                      <SummaryRow label="Plan" value={plan.name} />
                      <SummaryRow label="Billing cycle" value={form.cycle} />
                      <SummaryRow label="Subscription period" value={`${form.startDate} → ${form.expiryDate}`} />
                      <SummaryRow label="Base price" value={`${formatCurrency(baseMonthly)} / month`} />
                      <SummaryRow
                        label="Add-ons"
                        value={
                          form.addons.length
                            ? ADDONS.filter((addon) => form.addons.includes(addon.id))
                                .map((addon) => addon.name)
                                .join(", ")
                            : "None"
                        }
                      />
                      <SummaryRow
                        label="Estimated total"
                        value={`${formatCurrency(monthlyEstimate)} / month`}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-[12px] font-semibold text-foreground">Limits</p>
                    </div>
                    <div className="px-4 py-2">
                      <SummaryRow label="Users" value={form.maxUsers.toLocaleString("en-IN")} />
                      <SummaryRow label="Employees" value={form.maxEmployees.toLocaleString("en-IN")} />
                      <SummaryRow label="Locations" value={form.maxLocations} />
                      <SummaryRow label="Storage" value={`${form.storageLimit} GB`} />
                      <SummaryRow label="API calls" value={`${form.apiLimit.toLocaleString("en-IN")} / month`} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3.5">
                  <p className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                    <Rocket className="size-3.5 text-primary" /> What publishing does
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] text-muted-foreground sm:grid-cols-2">
                    {[
                      "Creates the isolated tenant and database schema",
                      "Creates the Company Admin user with the Admin role",
                      "Assigns all base features plus selected add-ons",
                      "Applies plan limits and generates the tenant URL",
                      "Seeds default roles and permission sets",
                      "Writes an immutable activity-log entry",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 size-3 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="sm" onClick={goBack} disabled={step === 0} className="gap-2">
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)} className="gap-2">
                <Eye className="size-3.5" /> Preview
              </Button>
              {step === STEPS.length - 1 ? (
                <Button size="sm" onClick={publish} disabled={publishing} className="gap-2">
                  {publishing ? <Loader2 className="size-3.5 animate-spin" /> : <Rocket className="size-3.5" />}
                  {publishing ? "Provisioning…" : "Publish company"}
                </Button>
              ) : (
                <Button size="sm" onClick={goNext} className="gap-2">
                  Continue <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                style={{ backgroundColor: form.logoColor }}
              >
                {(form.name || "New").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{form.name || "New company"}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">{tenantUrl}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { label: "Plan", value: plan.name },
                { label: "Billing", value: form.cycle },
                { label: "Users", value: `${form.maxUsers.toLocaleString("en-IN")} seats` },
                { label: "Add-ons", value: form.addons.length ? `${form.addons.length} selected` : "None" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Estimated monthly</p>
              <p className="mt-1 text-[17px] font-semibold tabular tracking-tight text-foreground">
                {formatCurrency(monthlyEstimate)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Base {formatCurrency(baseMonthly)} + add-ons {formatCurrency(addonMonthly)}
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-[11px] text-muted-foreground">
              <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
              All 16 base safety modules are included and cannot be disabled.
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-[12px] font-semibold text-foreground">Provisioning checklist</p>
            <ul className="mt-2 space-y-2">
              {[
                { label: "Company details", done: isStepComplete(0) },
                { label: "Admin account", done: isStepComplete(1) },
                { label: "Plan & billing", done: true },
                { label: "Add-ons", done: true },
                { label: "Limits", done: isStepComplete(4) },
                { label: "Review", done: step === 5 },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.done ? (
                    <CheckCircle2 className="size-3.5 text-success" />
                  ) : (
                    <span className="size-3.5 rounded-full border border-border" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tenant preview</DialogTitle>
            <DialogDescription>
              This is how the company record will look once published. Nothing has been saved yet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tenant</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground">{form.name || "Untitled company"}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{tenantUrl}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {form.industry || "Industry not set"} · {form.city || "City not set"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Company admin</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground">{form.adminName || "Not set"}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{form.adminEmail || "Email not set"}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Role: Admin · Full company access</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-foreground">
                {plan.name} · {form.cycle}
              </p>
              <p className="text-[12px] font-semibold tabular text-foreground">{formatCurrency(monthlyEstimate)}/mo</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["16 base modules", ...form.addons.map((id) => ADDONS.find((a) => a.id === id)?.name ?? id)].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close preview
            </Button>
            <Button
              onClick={() => {
                setPreviewOpen(false);
                setStep(5);
              }}
              className="gap-2"
            >
              Go to review <ArrowRight className="size-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={published} onOpenChange={setPublished}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="size-5" />
            </div>
            <DialogTitle>Company published successfully</DialogTitle>
            <DialogDescription>
              {form.name || "The company"} is now live on its own isolated tenant with the{" "}
              {plan.name.toLowerCase()} plan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Tenant URL</p>
                <p className="truncate font-mono text-[12px] text-foreground">https://{tenantUrl}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyTenantUrl} className="gap-1.5">
                <Copy className="size-3" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-2 text-[11px]">
              <div>
                <p className="text-muted-foreground">Company admin</p>
                <p className="mt-0.5 font-medium text-foreground">{form.adminName || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Login email</p>
                <p className="mt-0.5 truncate font-medium text-foreground">{form.adminEmail || "—"}</p>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5">
            {[
              "Tenant provisioned with an isolated workspace",
              "Company Admin user created with the Admin role",
              `${plan.name} plan, limits and ${form.addons.length} add-on(s) applied`,
              "Default roles and permissions seeded",
              "Activity log entry written",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPublished(false)}>
              Stay here
            </Button>
            <Button onClick={() => router.push("/companies")} className="gap-2">
              View companies <ArrowRight className="size-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
