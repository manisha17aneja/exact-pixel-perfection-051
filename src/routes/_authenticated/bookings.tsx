import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — Haulwise Logistics CRM" },
      { name: "description", content: "Confirmed loads waiting for pickup." },
      { property: "og:title", content: "Bookings — Haulwise Logistics CRM" },
      { property: "og:description", content: "Confirmed loads waiting for pickup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingsPage,
});

const STATUSES: string[] = ["Pending", "Confirmed", "Completed", "Cancelled"];
const fields: FieldDef[] = [
  { key: "customer", label: "Customer", type: "text", required: true },
  { key: "lane", label: "Lane", type: "text" },
  { key: "pickup", label: "Pickup date/time", type: "text" },
  { key: "material", label: "Material", type: "text" },
  { key: "weight", label: "Weight", type: "text" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function BookingsPage() {
  return (
    <CrudPage
      table="bookings" idKey="id" title="Bookings" crumb="Sales / Bookings" desc="Confirmed loads waiting for pickup." addLabel="New booking"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "id", label: "Booking", render: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
        { key: "customer", label: "Customer", render: (r: any) => r.customer },
        { key: "lane", label: "Lane", render: (r: any) => r.lane },
        { key: "pickup", label: "Pickup", render: (r: any) => r.pickup },
        { key: "material", label: "Material", render: (r: any) => r.material },
        { key: "weight", label: "Weight", render: (r: any) => r.weight },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
