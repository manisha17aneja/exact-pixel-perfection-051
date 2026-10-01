import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { bookings, inr } from "@/lib/data";

void StatusBadge; void inr;

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — Haulwise Logistics CRM" },
      { name: "description", content: "Confirmed loads waiting for pickup." },
      { property: "og:title", content: "Bookings — Haulwise Logistics CRM" },
      { property: "og:description", content: "Confirmed loads waiting for pickup." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  return (
    <>
      <PageHeader crumb="Sales / Bookings" title="Bookings" desc="Confirmed loads waiting for pickup." />
      <DataTable
        rows={bookings} idKey="id" filterKey="status" filters={["Pending","Confirmed","Completed","Cancelled"]}
        cols={[
          { key: "id", label: "Booking", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "lane", label: "Lane", render: (r) => r.lane },
          { key: "pickup", label: "Pickup", render: (r) => r.pickup },
          { key: "material", label: "Material", render: (r) => r.material },
          { key: "weight", label: "Weight", render: (r) => r.weight },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
