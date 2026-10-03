import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Haulwise Logistics CRM" },
      { name: "description", content: "Your trucks, trailers and reefers at a glance." },
      { property: "og:title", content: "Fleet — Haulwise Logistics CRM" },
      { property: "og:description", content: "Your trucks, trailers and reefers at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FleetPage,
});

const STATUSES: string[] = ["Available", "On trip", "Maintenance"];
const fields: FieldDef[] = [
  { key: "reg", label: "Registration number", type: "text", required: true },
  { key: "type", label: "Type", type: "text" },
  { key: "capacity", label: "Capacity", type: "text" },
  { key: "driver", label: "Driver", type: "text" },
  { key: "location", label: "Last location", type: "text" },
  { key: "service", label: "Next service", type: "text" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function FleetPage() {
  return (
    <CrudPage
      table="vehicles" idKey="reg" title="Fleet" crumb="Operations / Fleet" desc="Your trucks, trailers and reefers at a glance." addLabel="Add vehicle"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "reg", label: "Registration", render: (r: any) => <span className="font-mono text-xs">{r.reg}</span> },
        { key: "type", label: "Type", render: (r: any) => r.type },
        { key: "capacity", label: "Capacity", render: (r: any) => r.capacity },
        { key: "driver", label: "Driver", render: (r: any) => r.driver },
        { key: "location", label: "Last location", render: (r: any) => r.location },
        { key: "service", label: "Next service", render: (r: any) => r.service },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
