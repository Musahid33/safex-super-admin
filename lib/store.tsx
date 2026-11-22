"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { companies as seedCompanies } from "@/lib/data";
import type { Company } from "@/lib/types";
import { TENANT_BASE_DOMAIN } from "@/lib/tenant-domain";

type CompanyStore = {
  companies: Company[];
  ready: boolean;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  removeCompany: (id: string) => void;
};
const StoreContext = createContext<CompanyStore | null>(null);
const STORAGE_KEY = "safex-super-admin-companies-v2";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = (parsed as Company[]).map(company => ({
            ...company,
            subdomain: company.subdomain.replace(/\.safex\.app$/i, `.${TENANT_BASE_DOMAIN}`),
          }));
          // Intentional one-time hydration from browser storage before demo mutations are enabled.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCompanies(migrated);
        }
      }
    } catch { /* keep the seed data if browser storage is unavailable */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(companies)); } catch { /* demo mode remains usable without storage */ }
    }
  }, [companies, ready]);
  const value = useMemo<CompanyStore>(() => ({
    companies,
    ready,
    addCompany: company => setCompanies(current => [company, ...current.filter(item => item.id !== company.id)]),
    updateCompany: (id, patch) => setCompanies(current => current.map(item => item.id === id ? { ...item, ...patch } : item)),
    removeCompany: id => setCompanies(current => current.filter(item => item.id !== id)),
  }), [companies, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useCompanyStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useCompanyStore must be used within DataProvider");
  return store;
}
