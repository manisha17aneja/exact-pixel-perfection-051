import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

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

const STATUSES: string[] = [];
const fields: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "email", label: "Email", type: "text" },
];

function ContactsPage() {
  return (
    <CrudPage
      table="contacts" idKey="id" title="Contacts" crumb="CRM / Contacts" desc="People you work with at each customer account." addLabel="Add contact"
      statuses={undefined}
      fields={fields}
      cols={[
        { key: "name", label: "Name", render: (r: any) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.role}</p></div> },
        { key: "company", label: "Company", render: (r: any) => r.company },
        { key: "phone", label: "Phone", render: (r: any) => r.phone },
        { key: "email", label: "Email", render: (r: any) => r.email },
      ]}
    />
  );
}
