import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge } from "@/components/kit";
import { followups, inr } from "@/lib/data";

void StatusBadge; void inr;

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

function FollowUpsPage() {
  return (
    <>
      <PageHeader crumb="CRM / Follow-ups" title="Follow-ups" desc="Calls, reminders and meetings owed to customers." />
      <DataTable
        rows={followups} idKey="id" filterKey="status" filters={["Today","Scheduled","Done"]}
        cols={[
          { key: "subject", label: "Subject", render: (r) => <span className="font-medium">{r.subject}</span> },
          { key: "with", label: "With", render: (r) => r.with },
          { key: "due", label: "Due", render: (r) => r.due },
          { key: "owner", label: "Owner", render: (r) => r.owner },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </>
  );
}
