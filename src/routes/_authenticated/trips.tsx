import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { trips, inr } from "@/lib/data";

void StatusBadge; void inr;

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({
    meta: [
      { title: "Trips & Routes — Haulwise Logistics CRM" },
      { name: "description", content: "Vehicle trips, distance and fuel spend per route." },
      { property: "og:title", content: "Trips & Routes — Haulwise Logistics CRM" },
      { property: "og:description", content: "Vehicle trips, distance and fuel spend per route." },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  return (
    <>
      <PageHeader crumb="Operations / Trips" title="Trips & Routes" desc="Vehicle trips, distance and fuel spend per route." />
      <DataTable
        rows={trips} idKey="id" filterKey="status" filters={["Planned","In transit","Delayed","Completed"]}
        cols={[
          { key: "id", label: "Trip", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "route", label: "Route", render: (r) => r.route },
          { key: "km", label: "Distance", render: (r) => <span className="tabular-nums">{r.km} km</span> },
          { key: "vehicle", label: "Vehicle / Driver", render: (r) => <div><p>{r.vehicle}</p><p className="text-xs text-muted-foreground">{r.driver}</p></div> },
          { key: "start", label: "Start", render: (r) => r.start },
          { key: "fuel", label: "Fuel", render: (r) => <span className="tabular-nums">{r.fuel ? inr(r.fuel) : "—"}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
