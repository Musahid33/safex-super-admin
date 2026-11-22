"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { CompanyDetail } from "@/components/companies/company-detail";
import { Button } from "@/components/ui/button";
import { useCompanyStore } from "@/lib/store";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useSearchParams();
  const { companies, ready, updateCompany } = useCompanyStore();
  if (!ready) return <div className="h-48 animate-pulse rounded-xl border border-border bg-card"/>;
  const company = companies.find(item => item.id === id);
  if (!company) return <div className="mx-auto max-w-lg py-20 text-center"><div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground"><Building2 className="size-5"/></div><h1 className="text-lg font-semibold">Company not found</h1><p className="mt-1 text-sm text-muted-foreground">This tenant may have been deleted or the link is invalid.</p><Button asChild variant="outline" className="mt-5"><Link href="/companies">Back to companies</Link></Button></div>;
  return <CompanyDetail company={company} defaultTab={query.get("tab") ?? "overview"} openEdit={query.get("edit")==="1"} openLogin={query.get("login")==="1"} onUpdate={patch=>updateCompany(company.id,patch)}/>;
}
