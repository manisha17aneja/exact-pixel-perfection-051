import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, Drawer, Field, PageHeader, StatusBadge } from "@/components/kit";
import { customers, shipments, inr } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Haulwise Logistics CRM" },
      { name: "description", content: "Customer accounts, shipment history, revenue and outstanding balances." },
      { property: "og:title", content: "Customers — Haulwise Logistics CRM" },
      { property: "og:description", content: "Customer accounts, shipment history, revenue and outstanding balances." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [open, setOpen] = useState<(typeof customers)[number] | null>(null);
  const [tab, setTab] = useState("Overview");
  return (
    <>
      <PageHeader crumb="CRM / Customers" title="Customers" desc="Every account you move freight for." />
      <DataTable
        rows={customers} idKey="id" filterKey="status" filters={["Active", "On hold", "Inactive"]} onRow={(r) => { setOpen(r); setTab("Overview"); }}
        cols={[
          { key: "name", label: "Company", render: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.id} · {r.city}</p></div> },
          { key: "contact", label: "Primary contact", render: (r) => r.contact },
          { key: "shipments", label: "Shipments", render: (r) => <span className="tabular-nums">{r.shipments}</span>, className: "text-right" },
          { key: "revenue", label: "Lifetime revenue", render: (r) => <span className="tabular-nums">{inr(r.revenue)}</span>, className: "text-right" },
          { key: "outstanding", label: "Outstanding", render: (r) => <span className={`tabular-nums ${r.outstanding ? "text-danger" : "text-muted-foreground"}`}>{r.outstanding ? inr(r.outstanding) : "—"}</span>, className: "text-right" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && (
          <>
            <div className="mb-4 flex gap-1 border-b">
              {["Overview", "Shipments"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
            {tab === "Overview" ? (
              <>
                <Field label="Contact" value={open.contact} />
                <Field label="City" value={open.city} />
                <Field label="Total shipments" value={open.shipments} />
                <Field label="Lifetime revenue" value={inr(open.revenue)} />
                <Field label="Outstanding" value={inr(open.outstanding)} />
                <Field label="Status" value={<StatusBadge status={open.status} />} />
              </>
            ) : (
              <div className="space-y-2">
                {shipments.filter((s) => s.customer === open.name).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div><p className="font-mono text-xs">{s.id}</p><p>{s.origin} → {s.dest}</p></div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
                {!shipments.some((s) => s.customer === open.name) && <p className="text-sm text-muted-foreground">No active shipments.</p>}
              </div>
            )}
          </>
        )}
      </Drawer>
    </>
  );
}
