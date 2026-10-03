import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — Haulwise Logistics CRM" },
      { name: "description", content: "Billing and collections for completed shipments." },
      { property: "og:title", content: "Invoices — Haulwise Logistics CRM" },
      { property: "og:description", content: "Billing and collections for completed shipments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvoicesPage,
});

const STATUSES: string[] = ["Draft", "Pending", "Paid", "Overdue"];
const fields: FieldDef[] = [
  { key: "customer", label: "Customer", type: "text", required: true },
  { key: "shipment", label: "Shipment ID", type: "text" },
  { key: "issued", label: "Issued", type: "text" },
  { key: "due", label: "Due", type: "text" },
  { key: "amount", label: "Amount (₹)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function InvoicesPage() {
  return (
    <CrudPage
      table="invoices" idKey="id" title="Invoices" crumb="Finance / Invoices" desc="Billing and collections for completed shipments." addLabel="New invoice"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "Invoice", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "customer", label: "Customer", render: (r: any) => r.customer },
        { key: "shipment", label: "Shipment", render: (r: any) => r.shipment },
        { key: "issued", label: "Issued", render: (r: any) => r.issued },
        { key: "due", label: "Due", render: (r: any) => r.due },
        { key: "amount", label: "Amount", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.amount))}</span> },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
