import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, PageHeader, StatusBadge } from "@/components/kit";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAppearance, type DensityPreset, type FontPreset, type ThemePreset } from "@/lib/appearance";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Haulwise Logistics CRM" },
      { name: "description", content: "Your profile, team members and roles." },
      { property: "og:title", content: "Settings — Haulwise Logistics CRM" },
      { property: "og:description", content: "Your profile, team members and roles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const ROLES = ["admin", "manager", "dispatcher", "accountant"] as const;
type Role = (typeof ROLES)[number];
const cap = (r: string) => (r[0]?.toUpperCase() ?? "") + r.slice(1);
const perms: [string, string][] = [
  ["Admin", "Everything, including users and roles"],
  ["Manager", "CRM, sales, operations and reports"],
  ["Dispatcher", "Shipments, fleet and trips"],
  ["Accountant", "Invoices, expenses and payments"],
];

function SettingsPage() {
  const [tab, setTab] = useState("Profile");
  const { theme, font, density, setTheme, setFont, setDensity } = useAppearance();
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
    if (!data?.me) return;
    const { error } = await supabase.from("profiles").update({ name: name ?? "" }).eq("id", data.me);
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
      <div className="mb-5 flex gap-1 overflow-x-auto border-b" role="tablist">
        {["Profile", "Appearance", "Team", "Roles"].map((t) => (
          <Button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} variant="ghost" className={`settings-tab rounded-none border-b-2 ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{t}</Button>
        ))}
      </div>
      {tab === "Profile" && mine && (
        <Card className="max-w-lg space-y-3 p-6">
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Name</span>
            <input value={name ?? mine.name} onChange={(e) => setName(e.target.value)} className="field w-full" /></label>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Email</span>
            <input value={mine.email} disabled className="field w-full opacity-60" /></label>
          <p className="text-sm text-muted-foreground">Your role: <StatusBadge status={cap(mine.role)} /></p>
          <Button onClick={saveName}>Save profile</Button>
        </Card>
      )}
      {tab === "Appearance" && (
        <div className="grid gap-5 xl:grid-cols-3">
          <AppearanceGroup title="Visual theme" description="Choose the workspace contrast and surface system." value={theme} onChange={(value) => setTheme(value as ThemePreset)} options={[['cyber', 'Cyber glass', 'Deep operational surfaces with electric signals'], ['graphite', 'Graphite', 'Neutral dark workspace for long sessions'], ['light', 'Light enterprise', 'Bright, crisp and presentation-ready']]} />
          <AppearanceGroup title="Typography" description="Set the information character across every page." value={font} onChange={(value) => setFont(value as FontPreset)} options={[['jakarta', 'Modern', 'Clear, balanced interface type'], ['technical', 'Technical', 'Precision-led command typography'], ['editorial', 'Editorial', 'Confident headings with readable body text']]} />
          <AppearanceGroup title="Density" description="Control how much information fits on screen." value={density} onChange={(value) => setDensity(value as DensityPreset)} options={[['compact', 'Compact', 'Maximum data visibility'], ['comfortable', 'Comfortable', 'Balanced default spacing'], ['spacious', 'Spacious', 'Relaxed scanning and touch targets']]} />
        </div>
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

function AppearanceGroup({ title, description, value, onChange, options }: { title: string; description: string; value: string; onChange: (value: string) => void; options: [string, string, string][] }) {
  return (
    <Card className="p-5">
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-2">
        {options.map(([key, label, note]) => (
          <Button key={key} type="button" onClick={() => onChange(key)} variant="outline" className={`h-auto w-full justify-start px-4 py-3 text-left ${value === key ? "appearance-choice" : ""}`}>
            <span className="min-w-0"><span className="block text-sm font-semibold">{label}</span><span className="mt-0.5 block whitespace-normal text-xs font-normal text-muted-foreground">{note}</span></span>
            <span className={`ml-auto h-2.5 w-2.5 shrink-0 rounded-full ${value === key ? "bg-primary" : "bg-muted"}`} />
          </Button>
        ))}
      </div>
    </Card>
  );
}
