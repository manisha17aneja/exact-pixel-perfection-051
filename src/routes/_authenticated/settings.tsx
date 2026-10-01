import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, PageHeader, StatusBadge } from "@/components/kit";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Haulwise Logistics CRM" },
      { name: "description", content: "Your profile, team members and roles." },
      { property: "og:title", content: "Settings — Haulwise Logistics CRM" },
      { property: "og:description", content: "Your profile, team members and roles." },
    ],
  }),
  component: SettingsPage,
});

const ROLES = ["admin", "manager", "dispatcher", "accountant"] as const;
type Role = (typeof ROLES)[number];
const cap = (r: string) => r[0]!.toUpperCase() + r.slice(1);
const perms: [string, string][] = [
  ["Admin", "Everything, including users and roles"],
  ["Manager", "CRM, sales, operations and reports"],
  ["Dispatcher", "Shipments, fleet and trips"],
  ["Accountant", "Invoices, expenses and payments"],
];

function SettingsPage() {
  const [tab, setTab] = useState("Profile");
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const [{ data: u }, { data: profiles }, { data: roles }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("*"),
      ]);
      const me = u.user?.id;
      return {
        me,
        isAdmin: !!roles?.some((r) => r.user_id === me && r.role === "admin"),
        team: (profiles ?? []).map((p) => ({ ...p, role: roles?.find((r) => r.user_id === p.id)?.role ?? "dispatcher" })),
      };
    },
  });
  const mine = data?.team.find((t) => t.id === data.me);
  const [name, setName] = useState<string | null>(null);

  const saveName = async () => {
    const { error } = await supabase.from("profiles").update({ name: name ?? "" }).eq("id", data!.me!);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved"); qc.invalidateQueries({ queryKey: ["team"] });
  };
  const changeRole = async (userId: string, role: Role) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) { toast.error(error.message); return; }
    toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["team"] });
  };

  return (
    <>
      <PageHeader crumb="Insights / Settings" title="Settings" desc="Manage your profile and who can access what." />
      <div className="mb-4 flex gap-1 border-b">
        {["Profile", "Team", "Roles"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`}>{t}</button>
        ))}
      </div>
      {tab === "Profile" && mine && (
        <Card className="max-w-lg space-y-3 p-6">
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Name</span>
            <input value={name ?? mine.name} onChange={(e) => setName(e.target.value)} className="field w-full" /></label>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Email</span>
            <input value={mine.email} disabled className="field w-full opacity-60" /></label>
          <p className="text-sm text-muted-foreground">Your role: <StatusBadge status={cap(mine.role)} /></p>
          <button onClick={saveName} className="btn btn-primary">Save profile</button>
        </Card>
      )}
      {tab === "Team" && (
        <Card className="divide-y">
          {data?.team.map((m) => (
            <div key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
              <div className="min-w-0"><p className="truncate font-medium">{m.name || m.email}</p><p className="truncate text-xs text-muted-foreground">{m.email}</p></div>
              {data.isAdmin && m.id !== data.me ? (
                <select value={m.role} onChange={(e) => changeRole(m.id, e.target.value as Role)} className="field">
                  {ROLES.map((r) => <option key={r} value={r}>{cap(r)}</option>)}
                </select>
              ) : <StatusBadge status={cap(m.role)} />}
            </div>
          ))}
          <p className="p-4 text-xs text-muted-foreground">New teammates join by creating an account on the sign-in page. {data?.isAdmin ? "You can then change their role here." : "Only admins can change roles."}</p>
        </Card>
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
