import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { vehicles } from "@/lib/data";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Haulwise Logistics CRM" },
      { name: "description", content: "Vehicles, assigned drivers, current location and service schedule." },
      { property: "og:title", content: "Fleet — Haulwise Logistics CRM" },
      { property: "og:description", content: "Vehicles, assigned drivers, current location and service schedule." },
    ],
  }),
  component: () => (
    <>
      <PageHeader crumb="Operations / Fleet" title="Fleet" desc="Your trucks, trailers and reefers at a glance." />
      <DataTable
        rows={vehicles} idKey="reg" filterKey="status" filters={["Available", "On trip", "Maintenance"]}
        cols={[
          { key: "reg", label: "Registration", render: (r) => <span className="font-mono text-xs font-medium">{r.reg}</span> },
          { key: "type", label: "Type", render: (r) => r.type },
          { key: "capacity", label: "Capacity", render: (r) => r.capacity },
          { key: "driver", label: "Driver", render: (r) => r.driver },
          { key: "location", label: "Last location", render: (r) => r.location },
          { key: "service", label: "Next service", render: (r) => <span className={r.service === "Due now" ? "text-warning font-medium" : ""}>{r.service}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  ),
});
