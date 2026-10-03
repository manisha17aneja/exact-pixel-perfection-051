import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/shipments")({
  head: () => ({
    meta: [
      { title: "Shipments — Haulwise Logistics CRM" },
      { name: "description", content: "Consignments across your network." },
      { property: "og:title", content: "Shipments — Haulwise Logistics CRM" },
      { property: "og:description", content: "Consignments across your network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShipmentsPage,
});

const STATUSES: string[] = ["Booked", "Loading", "In transit", "Delayed", "Delivered"];
const fields: FieldDef[] = [
  { key: "customer", label: "Customer", type: "text", required: true },
  { key: "origin", label: "Origin", type: "text", required: true },
  { key: "dest", label: "Destination", type: "text", required: true },
  { key: "vehicle", label: "Vehicle", type: "text" },
  { key: "driver", label: "Driver", type: "text" },
  { key: "eta", label: "ETA", type: "text" },
  { key: "weight", label: "Weight", type: "text" },
  { key: "progress", label: "Progress (%)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function ShipmentsPage() {
  return (
    <CrudPage
      table="shipments" idKey="id" title="Shipments" crumb="Operations / Shipments" desc="Consignments across your network." addLabel="New shipment"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "Shipment", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "customer", label: "Customer", render: (r: any) => r.customer },
        { key: "lane", label: "Lane", render: (r: any) => <>{r.origin} → {r.dest}</> },
        { key: "vehicle", label: "Vehicle / Driver", render: (r: any) => <div><p className="font-medium">{r.vehicle}</p><p className="text-xs text-muted-foreground">{r.driver}</p></div> },
        { key: "progress", label: "Progress", render: (r: any) => <div className="h-1.5 w-24 rounded bg-muted"><div className={`h-full rounded ${r.status === "Delayed" ? "bg-danger" : "bg-primary"}`} style={{ width: `${r.progress}%` }} /></div> },
        { key: "eta", label: "ETA", render: (r: any) => r.eta },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
