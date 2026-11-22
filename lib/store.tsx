"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { companies as seedCompanies, type Company } from "@/lib/data";

type Store = { companies: Company[]; addCompany: (company: Company) => void; updateCompany: (id: string, patch: Partial<Company>) => void; removeCompany: (id: string) => void };
const StoreContext = createContext<Store | null>(null);
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Company[]>(seedCompanies);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem("safex-admin-companies"); if (saved) setItems(JSON.parse(saved)); } catch { /* use demo data if storage is unavailable */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("safex-admin-companies", JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<Store>(() => ({ companies: items,
    addCompany: company => setItems(current => [company, ...current]),
    updateCompany: (id, patch) => setItems(current => current.map(company => company.id === id ? { ...company, ...patch } : company)),
    removeCompany: id => setItems(current => current.filter(company => company.id !== id)),
  }), [items]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useCompanyStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useCompanyStore must be used inside DataProvider");
  return store;
}
