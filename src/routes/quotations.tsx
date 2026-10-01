import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { quotations, inr } from "@/lib/data";

void StatusBadge; void inr;

export const Route = createFileRoute("/quotations")({
  head: () => ({
    meta: [
      { title: "Quotations — Haulwise Logistics CRM" },
      { name: "description", content: "Freight rate quotes sent to customers." },
      { property: "og:title", content: "Quotations — Haulwise Logistics CRM" },
      { property: "og:description", content: "Freight rate quotes sent to customers." },
    ],
  }),
  component: QuotationsPage,
});

function QuotationsPage() {
  return (
    <>
      <PageHeader crumb="Sales / Quotations" title="Quotations" desc="Freight rate quotes sent to customers." />
      <DataTable
        rows={quotations} idKey="id" filterKey="status" filters={["Draft","Sent","Accepted","Rejected"]}
        cols={[
          { key: "id", label: "Quote", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "lane", label: "Lane", render: (r) => r.lane },
          { key: "vehicle", label: "Vehicle", render: (r) => r.vehicle },
          { key: "amount", label: "Amount", render: (r) => <span className="tabular-nums font-medium">{inr(r.amount)}</span> },
          { key: "valid", label: "Valid till", render: (r) => r.valid },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
