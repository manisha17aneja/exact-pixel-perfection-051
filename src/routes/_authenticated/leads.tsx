import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Haulwise Logistics CRM" },
      { name: "description", content: "Prospective shippers and their expected lane value." },
      { property: "og:title", content: "Leads — Haulwise Logistics CRM" },
      { property: "og:description", content: "Prospective shippers and their expected lane value." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadsPage,
});

const STATUSES: string[] = ["New", "Contacted", "Qualified", "Negotiation", "Lost"];
const fields: FieldDef[] = [
  { key: "name", label: "Contact name", type: "text", required: true },
  { key: "company", label: "Company", type: "text", required: true },
  { key: "route", label: "Lane (e.g. Pune → Delhi)", type: "text" },
  { key: "value", label: "Estimated value (₹)", type: "number" },
  { key: "source", label: "Source", type: "select", options: ["Website", "Referral", "Cold call", "LinkedIn", "Trade show", "Manual"] },
  { key: "owner", label: "Owner", type: "text" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function LeadsPage() {
  return (
    <CrudPage
      table="leads" idKey="id" title="Leads" crumb="CRM / Leads" desc="Prospective shippers and their expected lane value." addLabel="Add lead"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "ID", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "name", label: "Contact", render: (r: any) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.company}</p></div> },
        { key: "route", label: "Lane", render: (r: any) => r.route },
        { key: "value", label: "Est. value", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.value))}</span> },
        { key: "source", label: "Source", render: (r: any) => r.source },
        { key: "owner", label: "Owner", render: (r: any) => r.owner },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
