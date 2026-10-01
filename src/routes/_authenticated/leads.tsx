import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, Drawer, Field, PageHeader, StatusBadge } from "@/components/kit";
import { leads as seed, inr } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Haulwise Logistics CRM" },
      { name: "description", content: "Track freight leads from first contact to qualified opportunity." },
      { property: "og:title", content: "Leads — Haulwise Logistics CRM" },
      { property: "og:description", content: "Track freight leads from first contact to qualified opportunity." },
    ],
  }),
  component: LeadsPage,
});

type Lead = (typeof seed)[number];

function LeadsPage() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState<Lead | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", route: "", value: "" });

  const save = () => {
    if (!form.name || !form.company) return;
    setRows([{ id: `LD-${1043 + rows.length - seed.length}`, name: form.name, company: form.company, route: form.route || "—", value: Number(form.value) || 0, source: "Manual", status: "New", owner: "Manisha A." }, ...rows]);
    setForm({ name: "", company: "", route: "", value: "" }); setAdding(false);
  };

  return (
    <>
      <PageHeader crumb="CRM / Leads" title="Leads" desc="Prospective shippers and their expected lane value." />
      <DataTable
        rows={rows} idKey="id" filterKey="status" filters={["New", "Contacted", "Qualified", "Negotiation", "Lost"]}
        onRow={setOpen} addLabel="Add lead" onAdd={() => setAdding(true)}
        cols={[
          { key: "id", label: "ID", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "name", label: "Contact", render: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.company}</p></div> },
          { key: "route", label: "Lane", render: (r) => r.route },
          { key: "value", label: "Est. value", render: (r) => <span className="tabular-nums">{inr(r.value)}</span>, className: "text-right" },
          { key: "source", label: "Source", render: (r) => r.source },
          { key: "owner", label: "Owner", render: (r) => r.owner },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.company ?? ""}>
        {open && (
          <>
            <Field label="Lead ID" value={open.id} />
            <Field label="Contact" value={open.name} />
            <Field label="Lane" value={open.route} />
            <Field label="Estimated value" value={inr(open.value)} />
            <Field label="Source" value={open.source} />
            <Field label="Owner" value={open.owner} />
            <Field label="Status" value={<StatusBadge status={open.status} />} />
            <button className="btn btn-primary mt-6 w-full justify-center">Convert to enquiry</button>
          </>
        )}
      </Drawer>
      <Drawer open={adding} onClose={() => setAdding(false)} title="New lead">
        <div className="space-y-3">
          {(["name", "company", "route", "value"] as const).map((k) => (
            <label key={k} className="block text-sm">
              <span className="mb-1 block capitalize text-muted-foreground">{k === "route" ? "Lane (e.g. Pune → Delhi)" : k === "value" ? "Estimated value (₹)" : k}</span>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="field w-full" />
            </label>
          ))}
          <button onClick={save} className="btn btn-primary w-full justify-center">Save lead</button>
        </div>
      </Drawer>
    </>
  );
}
