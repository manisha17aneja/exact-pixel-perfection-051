import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { contacts, inr } from "@/lib/data";

void StatusBadge; void inr;

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Haulwise Logistics CRM" },
      { name: "description", content: "People you work with at each customer account." },
      { property: "og:title", content: "Contacts — Haulwise Logistics CRM" },
      { property: "og:description", content: "People you work with at each customer account." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <>
      <PageHeader crumb="CRM / Contacts" title="Contacts" desc="People you work with at each customer account." />
      <DataTable
        rows={contacts} idKey="id"
        cols={[
          { key: "name", label: "Name", render: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.role}</p></div> },
          { key: "company", label: "Company", render: (r) => r.company },
          { key: "phone", label: "Phone", render: (r) => r.phone },
          { key: "email", label: "Email", render: (r) => r.email },
        ]}
      />
    </>
  );
}
