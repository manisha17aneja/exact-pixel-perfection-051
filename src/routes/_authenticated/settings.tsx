import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { team } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Haulwise Logistics CRM" },
      { name: "description", content: "Company profile, team members and roles." },
      { property: "og:title", content: "Settings — Haulwise Logistics CRM" },
      { property: "og:description", content: "Company profile, team members and roles." },
    ],
  }),
  component: SettingsPage,
});

const perms: [string, string][] = [
  ["Admin", "Everything, including billing and users"],
  ["Manager", "CRM, sales, operations and reports"],
  ["Dispatcher", "Shipments, fleet and trips"],
  ["Accountant", "Invoices, expenses and payments"],
];

function SettingsPage() {
  const [tab, setTab] = useState("Company");
  return (
    <>
      <PageHeader crumb="Insights / Settings" title="Settings" desc="Manage your company and who can access what." />
      <div className="mb-4 flex gap-1 border-b">
        {["Company", "Users", "Roles"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`}>{t}</button>
        ))}
      </div>
      {tab === "Company" && (
        <Card className="max-w-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[["Company name", "Haulwise Logistics Pvt. Ltd."], ["GSTIN", "27AABCH1234F1Z5"], ["Head office", "Pune, Maharashtra"], ["Currency", "INR (₹)"], ["Support email", "ops@haulwise.in"], ["Phone", "+91 20 4000 1234"]].map(([l, v]) => (
              <label key={l} className="block text-sm">
                <span className="mb-1 block text-muted-foreground">{l}</span>
                <input defaultValue={v} className="field w-full" />
              </label>
            ))}
          </div>
          <button className="btn btn-primary mt-6">Save changes</button>
        </Card>
      )}
      {tab === "Users" && (
        <DataTable rows={team} idKey="id" addLabel="Invite user" cols={[
          { key: "name", label: "Name", render: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.email}</p></div> },
          { key: "role", label: "Role", render: (r) => <StatusBadge status={r.role} /> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]} />
      )}
      {tab === "Roles" && (
        <Card className="max-w-2xl divide-y">
          {perms.map(([r, d]) => (
            <div key={r} className="flex items-center justify-between gap-4 p-4">
              <div><p className="font-medium">{r}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              <StatusBadge status={r} />
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
