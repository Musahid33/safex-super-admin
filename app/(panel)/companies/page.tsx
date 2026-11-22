import { Plus } from "lucide-react";
import Link from "next/link";

import { CompaniesTable } from "@/components/companies/companies-table";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Management"
        description="Manage seeded and browser-saved demo tenant records. Changes are local to this browser; live tenant provisioning is not connected."
        actions={
          <Button size="sm" asChild>
            <Link href="/companies/new">
              <Plus className="size-3.5" />
              Create Company
            </Link>
          </Button>
        }
      />
      <CompaniesTable />
    </div>
  );
}
