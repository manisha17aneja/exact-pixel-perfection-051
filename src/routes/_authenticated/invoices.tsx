import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, Stat, StatusBadge } from "@/components/kit";
import { invoices, inr } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — Haulwise Logistics CRM" },
      { name: "description", content: "Freight invoices, due dates, collections and overdue balances." },
      { property: "og:title", content: "Invoices — Haulwise Logistics CRM" },
      { property: "og:description", content: "Freight invoices, due dates, collections and overdue balances." },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const sum = (s: string) => invoices.filter((i) => i.status === s).reduce((a, b) => a + b.amount, 0);
  return (
    <>
      <PageHeader crumb="Finance / Invoices" title="Invoices" desc="Billing and collections for completed shipments." />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Collected" value={inr(sum("Paid"))} delta="This month" />
        <Stat label="Pending" value={inr(sum("Pending"))} delta="Within terms" tone="warning" />
        <Stat label="Overdue" value={inr(sum("Overdue"))} delta="Follow up today" tone="danger" />
        <Stat label="Drafts" value={String(invoices.filter((i) => i.status === "Draft").length)} delta="Ready to send" tone="warning" />
      </div>
      <DataTable
        rows={invoices} idKey="id" filterKey="status" filters={["Draft", "Pending", "Paid", "Overdue"]}
        cols={[
          { key: "id", label: "Invoice", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "customer", label: "Customer", render: (r) => r.customer },
          { key: "shipment", label: "Shipment", render: (r) => <span className="font-mono text-xs">{r.shipment}</span> },
          { key: "issued", label: "Issued", render: (r) => r.issued },
          { key: "due", label: "Due", render: (r) => r.due },
          { key: "amount", label: "Amount", render: (r) => <span className="tabular-nums font-medium">{inr(r.amount)}</span>, className: "text-right" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
