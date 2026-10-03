import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({
    meta: [
      { title: "Trips & Routes — Haulwise Logistics CRM" },
      { name: "description", content: "Vehicle trips, distance and fuel spend per route." },
      { property: "og:title", content: "Trips & Routes — Haulwise Logistics CRM" },
      { property: "og:description", content: "Vehicle trips, distance and fuel spend per route." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripsPage,
});

const STATUSES: string[] = ["Planned", "In transit", "Delayed", "Completed"];
const fields: FieldDef[] = [
  { key: "route", label: "Route", type: "text", required: true },
  { key: "km", label: "Distance (km)", type: "number" },
  { key: "vehicle", label: "Vehicle", type: "text" },
  { key: "driver", label: "Driver", type: "text" },
  { key: "start", label: "Start date", type: "text" },
  { key: "fuel", label: "Fuel cost (₹)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function TripsPage() {
  return (
    <CrudPage
      table="trips" idKey="id" title="Trips & Routes" crumb="Operations / Trips" desc="Vehicle trips, distance and fuel spend per route." addLabel="New trip"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "Trip", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "route", label: "Route", render: (r: any) => r.route },
        { key: "km", label: "Distance", render: (r: any) => <>{r.km} km</> },
        { key: "vehicle", label: "Vehicle / Driver", render: (r: any) => <div><p className="font-medium">{r.vehicle}</p><p className="text-xs text-muted-foreground">{r.driver}</p></div> },
        { key: "start", label: "Start", render: (r: any) => r.start },
        { key: "fuel", label: "Fuel", render: (r: any) => <span className="tabular-nums font-medium">{inr(Number(r.fuel))}</span> },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
