import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/CrudPage";
import { StatusBadge } from "@/components/kit";
import { inr } from "@/lib/data";

void inr; void StatusBadge;

export const Route = createFileRoute("/_authenticated/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow-ups — Haulwise Logistics CRM" },
      { name: "description", content: "Calls, reminders and meetings owed to customers." },
      { property: "og:title", content: "Follow-ups — Haulwise Logistics CRM" },
      { property: "og:description", content: "Calls, reminders and meetings owed to customers." },
    ],
  }),
  component: FollowUpsPage,
});

const STATUSES: string[] = ["Today", "Scheduled", "Done"];
const fields: FieldDef[] = [
  { key: "subject", label: "Subject", type: "text", required: true },
  { key: "with_name", label: "With (customer)", type: "text" },
  { key: "due", label: "Due", type: "text" },
  { key: "owner", label: "Owner", type: "text" },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

function FollowUpsPage() {
  return (
    <CrudPage
      table="followups" idKey="id" title="Follow-ups" crumb="CRM / Follow-ups" desc="Calls, reminders and meetings owed to customers." addLabel="Add follow-up"
      statuses={STATUSES}
      fields={fields}
      cols={[
        { key: "subject", label: "Subject", render: (r: any) => <span className="font-medium">{r.subject}</span> },
        { key: "with_name", label: "With", render: (r: any) => r.with_name },
        { key: "due", label: "Due", render: (r: any) => r.due },
        { key: "owner", label: "Owner", render: (r: any) => r.owner },
        { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
