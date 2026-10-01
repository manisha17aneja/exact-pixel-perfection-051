import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Haulwise Logistics CRM" },
      { name: "description", content: "Every account you move freight for." },
      { property: "og:title", content: "Customers — Haulwise Logistics CRM" },
      { property: "og:description", content: "Every account you move freight for." },
    ],
  }),
  component: CustomersPage,
});

const STATUSES: string[] = ["Active", "On hold", "Inactive"];
const fields: FieldDef[] = [
  { key: "name", label: "Company name", type: "text", required: true },
  { key: "contact", label: "Primary contact", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "shipments", label: "Total shipments", type: "number" },
  { key: "revenue", label: "Lifetime revenue (₹)", type: "number" },
  { key: "outstanding", label: "Outstanding (₹)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function CustomersPage() {
  return (
    <CrudPage
      table="customers" idKey="id" title="Customers" crumb="CRM / Customers" desc="Every account you move freight for." addLabel="Add customer"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "name", label: "Company", render: (r: any) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.city}</p></div> },
        { key: "contact", label: "Primary contact", render: (r: any) => r.contact },
        { key: "shipments", label: "Shipments", render: (r: any) => r.shipments },
        { key: "revenue", label: "Lifetime revenue", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.revenue))}</span> },
        { key: "outstanding", label: "Outstanding", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.outstanding))}</span> },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
