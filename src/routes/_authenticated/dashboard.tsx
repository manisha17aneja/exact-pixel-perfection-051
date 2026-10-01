import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, Stat, StatusBadge } from "@/components/kit";
import { revenueTrend, inr } from "@/lib/data";
import { useRows } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Haulwise Logistics CRM" },
      { name: "description", content: "Live overview of shipments, fleet, revenue and receivables." },
      { property: "og:title", content: "Dashboard — Haulwise Logistics CRM" },
      { property: "og:description", content: "Live overview of shipments, fleet, revenue and receivables." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: shipments = [] } = useRows("shipments");
  const { data: vehicles = [] } = useRows("vehicles");
  const { data: invoices = [] } = useRows("invoices");
  const { data: leads = [] } = useRows("leads");
  const { data: quotes = [] } = useRows("quotations");
  const { data: bookings = [] } = useRows("bookings");
  const { data: trips = [] } = useRows("trips");
  const sum = (s: string) => invoices.filter((i) => i.status === s).reduce((a, b) => a + Number(b.amount), 0);
  const active = shipments.filter((s) => s.status !== "Delivered").length;
  const onTrip = vehicles.filter((v) => v.status === "On trip").length;
  const flow: [string, number, string][] = [
    ["Leads", leads.length, "/leads"], ["Quotations", quotes.length, "/quotations"], ["Bookings", bookings.length, "/bookings"],
    ["Shipments", shipments.length, "/shipments"], ["Trips", trips.length, "/trips"],
    ["Delivered", shipments.filter((s) => s.status === "Delivered").length, "/shipments"],
    ["Invoices", invoices.length, "/invoices"], ["Paid", invoices.filter((i) => i.status === "Paid").length, "/invoices"],
  ];
  return (
    <>
      <PageHeader crumb="Overview" title="Dashboard" desc="Here's what's moving across your network today." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active shipments" value={String(active)} delta={`${shipments.filter((s) => s.status === "Delayed").length} delayed`} tone={shipments.some((s) => s.status === "Delayed") ? "warning" : "success"} />
        <Stat label="Fleet utilisation" value={vehicles.length ? `${Math.round((onTrip / vehicles.length) * 100)}%` : "—"} delta={`${onTrip} of ${vehicles.length} on trip`} />
        <Stat label="Collected" value={inr(sum("Paid"))} delta={`${inr(sum("Pending"))} pending`} />
        <Stat label="Overdue receivables" value={inr(sum("Overdue"))} delta={`${invoices.filter((i) => i.status === "Overdue").length} invoices overdue`} tone="danger" />
      </div>
      <Card className="mt-4 p-4">
        <p className="mb-3 text-sm font-medium">Workflow pipeline</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {flow.map(([s, n, to]) => (
            <Link key={s} to={to as "/leads"} className="rounded-md border bg-muted/40 p-2.5 hover:border-primary">
              <p className="text-[11px] text-muted-foreground">{s}</p>
              <p className="font-display text-lg font-semibold tabular-nums">{n}</p>
            </Link>
          ))}
        </div>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <p className="text-sm font-medium">Revenue vs expenses <span className="text-muted-foreground">(₹ lakh, sample trend)</span></p>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <AreaChart data={revenueTrend}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Area dataKey="revenue" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.12} strokeWidth={2} />
                <Area dataKey="expense" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.08} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium">Fleet status</p>
          <div className="mt-4 space-y-3">
            {["On trip", "Available", "Maintenance"].map((s) => {
              const n = vehicles.filter((v) => v.status === s).length;
              return (
                <div key={s}>
                  <div className="mb-1 flex justify-between text-xs"><StatusBadge status={s} /><span className="tabular-nums">{n} / {vehicles.length}</span></div>
                  <div className="h-1.5 rounded bg-muted"><div className="h-full rounded bg-primary" style={{ width: `${vehicles.length ? (n / vehicles.length) * 100 : 0}%` }} /></div>
                </div>
              );
            })}
          </div>
          <Link to="/fleet" className="mt-5 inline-block text-xs font-medium text-primary">View fleet →</Link>
        </Card>
      </div>
      <Card className="mt-4">
        <div className="flex items-center justify-between border-b p-4">
          <p className="text-sm font-medium">Live shipments</p>
          <Link to="/shipments" className="text-xs font-medium text-primary">All shipments →</Link>
        </div>
        <div className="divide-y">
          {shipments.slice(0, 5).map((s) => (
            <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 sm:grid-cols-[120px_minmax(0,1fr)_160px_auto]">
              <span className="font-mono text-xs">{s.id}</span>
              <span className="hidden truncate text-sm sm:block">{s.origin} → {s.dest} · {s.customer}</span>
              <div className="hidden h-1.5 rounded bg-muted sm:block"><div className="h-full rounded bg-primary" style={{ width: `${s.progress}%` }} /></div>
              <StatusBadge status={s.status} />
            </div>
          ))}
          {shipments.length === 0 && <p className="p-6 text-sm text-muted-foreground">No shipments yet.</p>}
        </div>
      </Card>
    </>
  );
}
