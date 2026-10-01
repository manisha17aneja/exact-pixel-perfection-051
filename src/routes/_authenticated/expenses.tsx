import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

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

const STATUSES: string[] = ["Submitted", "Approved", "Rejected"];
const fields: FieldDef[] = [
  { key: "category", label: "Category", type: "select", options: ["Fuel", "Toll", "Repair", "Driver allowance", "Loading labour", "Other"], required: true },
  { key: "date", label: "Date", type: "text" },
  { key: "trip", label: "Trip ID", type: "text" },
  { key: "vendor", label: "Paid to", type: "text" },
  { key: "amount", label: "Amount (₹)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function ExpensesPage() {
  return (
    <CrudPage
      table="expenses" idKey="id" title="Expenses" crumb="Finance / Expenses" desc="Fuel, tolls, repairs and other trip costs." addLabel="Add expense"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "ID", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "date", label: "Date", render: (r: any) => r.date },
        { key: "category", label: "Category", render: (r: any) => r.category },
        { key: "trip", label: "Trip", render: (r: any) => r.trip },
        { key: "vendor", label: "Paid to", render: (r: any) => r.vendor },
        { key: "amount", label: "Amount", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.amount))}</span> },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
