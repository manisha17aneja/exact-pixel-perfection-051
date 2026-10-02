import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Banknote,
  CircleAlert,
  PackageCheck,
  Route as RouteIcon,
  Truck,
  TrendingUp,
} from "lucide-react";
import { Card, PageHeader, StatusBadge } from "@/components/kit";
import { revenueTrend, inr } from "@/lib/data";
import { useRows } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Haulwise Logistics CRM" },
      { name: "description", content: "Live overview of shipments, fleet, revenue and receivables." },
      { property: "og:title", content: "Dashboard — Haulwise Logistics CRM" },
      { property: "og:description", content: "Live overview of shipments, fleet, revenue and receivables." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  boxShadow: "var(--shadow-soft)",
  fontSize: "12px",
};

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "primary",
  bars,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Truck;
  tone?: "primary" | "success" | "warning" | "danger";
  bars?: number[];
}) {
  const toneClass = {
    primary: "bg-accent text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }[tone];
  return (
    <Card className="group dashboard-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${toneClass}`}><Icon className="h-5 w-5" /></div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${toneClass}`}>{detail}</span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums">{value}</p>
      <div className="mt-4 flex h-7 items-end gap-1.5" aria-hidden="true">
        {(bars ?? [38, 58, 45, 74, 62, 88, 76]).map((height, index) => (
          <span key={index} className={`min-w-0 flex-1 rounded-t-sm ${index >= 5 ? "bg-primary" : "bg-primary/15"}`} style={{ height: `${height}%` }} />
        ))}
      </div>
    </Card>
  );
}

function Dashboard() {
  const { data: shipments = [] } = useRows("shipments");
  const { data: vehicles = [] } = useRows("vehicles");
  const { data: invoices = [] } = useRows("invoices");
  const { data: leads = [] } = useRows("leads");
  const { data: quotes = [] } = useRows("quotations");
  const { data: bookings = [] } = useRows("bookings");
  const { data: trips = [] } = useRows("trips");
  const sum = (status: string) => invoices.filter((invoice) => invoice.status === status).reduce((total, invoice) => total + Number(invoice.amount), 0);
  const active = shipments.filter((shipment) => shipment.status !== "Delivered").length;
  const delayed = shipments.filter((shipment) => shipment.status === "Delayed").length;
  const onTrip = vehicles.filter((vehicle) => vehicle.status === "On trip").length;
  const available = vehicles.filter((vehicle) => vehicle.status === "Available").length;
  const maintenance = vehicles.filter((vehicle) => vehicle.status === "Maintenance").length;
  const utilization = vehicles.length ? Math.round((onTrip / vehicles.length) * 100) : 0;
  const flow: [string, number, "/leads" | "/quotations" | "/bookings" | "/shipments" | "/trips" | "/invoices"][] = [
    ["Leads", leads.length, "/leads"],
    ["Quotes", quotes.length, "/quotations"],
    ["Booked", bookings.length, "/bookings"],
    ["In transit", trips.length, "/trips"],
    ["Delivered", shipments.filter((shipment) => shipment.status === "Delivered").length, "/shipments"],
    ["Invoiced", invoices.length, "/invoices"],
  ];

  return (
    <div className="dashboard-body animate-fade-in">
      <PageHeader crumb="Overview / Control room" title="Operations overview" desc="Live movement, fleet health and cash-flow signals across your network." />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
        <MetricCard label="Active shipments" value={String(active)} detail={delayed ? `${delayed} delayed` : "On track"} icon={PackageCheck} tone={delayed ? "danger" : "success"} />
        <MetricCard label="Fleet utilization" value={vehicles.length ? `${utilization}%` : "—"} detail={`${onTrip} on trip`} icon={Truck} tone={utilization > 85 ? "warning" : "primary"} bars={[42, 55, 64, 52, 72, 84, utilization || 36]} />
        <MetricCard label="Revenue collected" value={inr(sum("Paid"))} detail="Paid" icon={Banknote} tone="success" bars={[30, 42, 38, 65, 58, 73, 91]} />
        <MetricCard label="Overdue receivables" value={inr(sum("Overdue"))} detail={`${invoices.filter((invoice) => invoice.status === "Overdue").length} invoices`} icon={CircleAlert} tone="danger" bars={[60, 46, 70, 52, 42, 36, 28]} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <Card className="dashboard-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">Supply chain pipeline</p>
                <p className="mt-1 text-xs text-muted-foreground">From lead capture to invoice</p>
              </div>
              <Link to="/shipments" className="inline-flex items-center gap-1 text-xs font-bold text-primary">Manage flow <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="mt-7 overflow-x-auto pb-1">
              <div className="relative grid min-w-[620px] grid-cols-6">
                <div className="absolute left-[8%] right-[8%] top-4 h-0.5 bg-border" />
                {flow.map(([label, count, to], index) => (
                  <Link key={label} to={to} className="group relative z-10 flex flex-col items-center text-center">
                    <span className={`grid h-8 w-8 place-items-center rounded-full border-4 border-card text-[10px] font-bold transition-transform group-hover:scale-110 ${index < 3 ? "bg-primary text-primary-foreground" : index === 3 ? "bg-accent text-primary ring-4 ring-accent/60" : "bg-muted text-muted-foreground"}`}>
                      {index < 3 ? "✓" : count}
                    </span>
                    <span className="mt-3 text-[10px] font-bold uppercase text-foreground">{label}</span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">{count} records</span>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          <Card className="dashboard-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Revenue vs expenses</p>
                <p className="mt-1 text-xs text-muted-foreground">Six-month financial movement · ₹ lakh</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Revenue</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-warning" />Expenses</span>
              </div>
            </div>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.24} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--warning)" stopOpacity={0.18} /><stop offset="100%" stopColor="var(--warning)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="url(#revenueFill)" strokeWidth={2.5} activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 3 }} />
                  <Area type="monotone" dataKey="expense" stroke="var(--warning)" fill="url(#expenseFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-5 xl:col-span-4">
          <section className="fleet-panel overflow-hidden rounded-lg p-6 text-sidebar-accent-foreground shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-sidebar-muted">Fleet health</p>
                <p className="mt-1 text-sm font-semibold">Live capacity</p>
              </div>
              <RouteIcon className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full fleet-ring" style={{ "--fleet-value": `${utilization * 3.6}deg` } as React.CSSProperties}>
                <div className="grid h-20 w-20 place-items-center rounded-full bg-sidebar">
                  <div className="text-center"><p className="font-display text-2xl font-bold">{utilization}%</p><p className="text-[9px] uppercase text-sidebar-muted">Active</p></div>
                </div>
              </div>
              <dl className="min-w-0 space-y-4">
                <div><dt className="text-[9px] font-bold uppercase text-sidebar-muted">On trip</dt><dd className="mt-0.5 text-lg font-bold tabular-nums">{onTrip}</dd></div>
                <div><dt className="text-[9px] font-bold uppercase text-sidebar-muted">Available</dt><dd className="mt-0.5 text-lg font-bold tabular-nums">{available}</dd></div>
              </dl>
            </div>
            <Link to="/fleet" className="mt-7 flex h-10 items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent text-xs font-bold transition-colors hover:bg-sidebar-border">Open fleet board <ArrowRight className="h-3.5 w-3.5" /></Link>
          </section>

          <Card className="dashboard-card p-5">
            <div className="flex items-center justify-between"><p className="text-sm font-bold">Delivery performance</p><TrendingUp className="h-4 w-4 text-success" /></div>
            <div className="mt-5 space-y-5">
              {[
                ["Fleet in service", `${vehicles.length - maintenance}/${vehicles.length}`, vehicles.length ? ((vehicles.length - maintenance) / vehicles.length) * 100 : 0, "bg-success"],
                ["Trip allocation", `${onTrip} active`, utilization, "bg-primary"],
                ["Shipment completion", `${shipments.filter((s) => s.status === "Delivered").length} delivered`, shipments.length ? (shipments.filter((s) => s.status === "Delivered").length / shipments.length) * 100 : 0, "bg-warning"],
              ].map(([label, value, width, color]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-bold tabular-nums">{value}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${color}`} style={{ width: `${Number(width)}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Card className="dashboard-card mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b bg-muted/25 px-5 py-4">
          <div><p className="text-sm font-bold">Live shipments</p><p className="mt-0.5 text-xs text-muted-foreground">Most recent network movement</p></div>
          <Link to="/shipments" className="inline-flex items-center gap-1 text-xs font-bold text-primary">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead><tr className="border-b text-[10px] font-bold uppercase text-muted-foreground"><th className="px-5 py-3">Shipment</th><th className="px-5 py-3">Route & customer</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Status</th></tr></thead>
            <tbody className="divide-y">
              {shipments.slice(0, 5).map((shipment) => (
                <tr key={shipment.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-4 font-mono text-xs font-medium">{shipment.id}</td>
                  <td className="px-5 py-4"><p className="font-semibold">{shipment.origin} <span className="mx-1 text-muted-foreground">→</span> {shipment.dest}</p><p className="mt-0.5 text-xs text-muted-foreground">{shipment.customer}</p></td>
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${shipment.progress}%` }} /></div><span className="text-xs font-bold tabular-nums">{shipment.progress}%</span></div></td>
                  <td className="px-5 py-4"><StatusBadge status={shipment.status} /></td>
                </tr>
              ))}
              {shipments.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">No shipments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}