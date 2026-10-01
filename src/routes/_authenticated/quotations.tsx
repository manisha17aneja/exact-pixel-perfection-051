import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/quotations")({
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

const STATUSES: string[] = ["Draft", "Sent", "Accepted", "Rejected"];
const fields: FieldDef[] = [
  { key: "customer", label: "Customer", type: "text", required: true },
  { key: "lane", label: "Lane", type: "text" },
  { key: "vehicle", label: "Vehicle type", type: "text" },
  { key: "amount", label: "Amount (₹)", type: "number" },
  { key: "valid", label: "Valid till", type: "text" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function QuotationsPage() {
  return (
    <CrudPage
      table="quotations" idKey="id" title="Quotations" crumb="Sales / Quotations" desc="Freight rate quotes sent to customers." addLabel="New quotation"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "Quote", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "customer", label: "Customer", render: (r: any) => r.customer },
        { key: "lane", label: "Lane", render: (r: any) => r.lane },
        { key: "vehicle", label: "Vehicle", render: (r: any) => r.vehicle },
        { key: "amount", label: "Amount", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.amount))}</span> },
        { key: "valid", label: "Valid till", render: (r: any) => r.valid },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
