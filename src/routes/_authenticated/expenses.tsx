import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { expenses, inr } from "@/lib/data";

void StatusBadge; void inr;

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Haulwise Logistics CRM" },
      { name: "description", content: "Fuel, tolls, repairs and other trip costs." },
      { property: "og:title", content: "Expenses — Haulwise Logistics CRM" },
      { property: "og:description", content: "Fuel, tolls, repairs and other trip costs." },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  return (
    <>
      <PageHeader crumb="Finance / Expenses" title="Expenses" desc="Fuel, tolls, repairs and other trip costs." />
      <DataTable
        rows={expenses} idKey="id" filterKey="status" filters={["Submitted","Approved","Rejected"]}
        cols={[
          { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "date", label: "Date", render: (r) => r.date },
          { key: "category", label: "Category", render: (r) => r.category },
          { key: "trip", label: "Trip", render: (r) => r.trip },
          { key: "vendor", label: "Paid to", render: (r) => r.vendor },
          { key: "amount", label: "Amount", render: (r) => <span className="tabular-nums font-medium">{inr(r.amount)}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
