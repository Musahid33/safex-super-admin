import { Suspense } from "react";

import { CreateCompanyWizard } from "@/components/companies/create-company-wizard";

export default function NewCompanyPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
      <CreateCompanyWizard />
    </Suspense>
  );
}
