import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, Drawer, Field, PageHeader, Stat, StatusBadge } from "@/components/kit";
import { shipments } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/shipments")({
  head: () => ({
    meta: [
      { title: "Shipments — Haulwise Logistics CRM" },
      { name: "description", content: "Track every consignment from booking to delivery with live progress." },
      { property: "og:title", content: "Shipments — Haulwise Logistics CRM" },
      { property: "og:description", content: "Track every consignment from booking to delivery with live progress." },
    ],
  }),
  component: ShipmentsPage,
});

const steps = ["Booked", "Loading", "In transit", "Delivered"];

function ShipmentsPage() {
  const [open, setOpen] = useState<(typeof shipments)[number] | null>(null);
  const count = (s: string) => shipments.filter((x) => x.status === s).length;
  return (
    <>
      <PageHeader crumb="Operations / Shipments" title="Shipments" desc="Consignments across your network." />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="In transit" value={String(count("In transit"))} delta="On schedule" />
        <Stat label="Loading" value={String(count("Loading"))} delta="At origin" tone="warning" />
        <Stat label="Delayed" value={String(count("Delayed"))} delta="Needs attention" tone="danger" />
        <Stat label="Delivered today" value={String(count("Delivered"))} delta="POD pending: 0" />
      </div>
      <DataTable
        rows={shipments} idKey="id" filterKey="status" filters={["Booked", "Loading", "In transit", "Delayed", "Delivered"]} onRow={setOpen}
        cols={[
          { key: "id", label: "Shipment", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "lane", label: "Lane", render: (r) => `${r.origin} → ${r.dest}` },
          { key: "vehicle", label: "Vehicle / Driver", render: (r) => <div><p>{r.vehicle}</p><p className="text-xs text-muted-foreground">{r.driver}</p></div> },
          { key: "progress", label: "Progress", render: (r) => <div className="h-1.5 w-24 rounded bg-muted"><div className={`h-full rounded ${r.status === "Delayed" ? "bg-danger" : "bg-primary"}`} style={{ width: `${r.progress}%` }} /></div> },
          { key: "eta", label: "ETA", render: (r) => r.eta },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.id ?? ""}>
        {open && (
          <>
            <ol className="mb-6 space-y-3">
              {steps.map((s, i) => {
                const cur = steps.indexOf(open.status === "Delayed" ? "In transit" : open.status);
                const done = i <= cur;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className={`h-3 w-3 rounded-full border-2 ${done ? "border-primary bg-primary" : "border-border"}`} />
                    <span className={done ? "font-medium" : "text-muted-foreground"}>{s}</span>
                  </li>
                );
              })}
            </ol>
            <Field label="Customer" value={open.customer} />
            <Field label="Lane" value={`${open.origin} → ${open.dest}`} />
            <Field label="Weight" value={open.weight} />
            <Field label="Vehicle" value={open.vehicle} />
            <Field label="Driver" value={open.driver} />
            <Field label="ETA" value={open.eta} />
            <Field label="Status" value={<StatusBadge status={open.status} />} />
          </>
        )}
      </Drawer>
    </>
  );
}
