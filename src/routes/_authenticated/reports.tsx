import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, BadgeIndianRupee, ChartNoAxesCombined, Clock3, Gauge } from "lucide-react";
import { Card, PageHeader } from "@/components/kit";
import { revenueTrend, inr } from "@/lib/data";
import { useRows } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Haulwise Logistics CRM" },
      { name: "description", content: "Revenue, margins, top customers and cost breakdown." },
      { property: "og:title", content: "Reports — Haulwise Logistics CRM" },
      { property: "og:description", content: "Revenue, margins, top customers and cost breakdown." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-soft)", fontSize: "12px" };
const pieColors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--chart-4)", "var(--danger)"];

function Insight({ label, value, change, icon: Icon, down = false }: { label: string; value: string; change: string; icon: typeof Gauge; down?: boolean }) {
  return (
    <Card className="dashboard-card p-5">
      <div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></span><span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${down ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{down ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}{change}</span></div>
      <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums">{value}</p>
    </Card>
  );
}

function ReportsPage() {
  const { data: customers = [] } = useRows("customers");
  const { data: expenses = [] } = useRows("expenses");
  const top = [...customers].sort((a, b) => Number(b.revenue) - Number(a.revenue)).slice(0, 5);
  const max = Number(top[0]?.revenue ?? 1) || 1;
  const categories = Object.entries(expenses.reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] ?? 0) + Number(expense.amount);
    return totals;
  }, {})).map(([name, value]) => ({ name, value }));
  const totalExpenses = categories.reduce((sum, category) => sum + category.value, 0);

  return (
    <div className="dashboard-body animate-fade-in">
      <PageHeader crumb="Insights / Reports" title="Performance intelligence" desc="Revenue, margin and operating-cost signals in one view." />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Report highlights">
        <Insight label="6-month revenue" value="₹320 L" change="18%" icon={BadgeIndianRupee} />
        <Insight label="Gross margin" value="31.2%" change="1.4 pts" icon={ChartNoAxesCombined} />
        <Insight label="On-time delivery" value="92%" change="2 pts" icon={Clock3} down />
        <Insight label="Revenue per trip" value="₹1.42 L" change="6%" icon={Gauge} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-12">
        <Card className="dashboard-card p-5 sm:p-6 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold">Monthly operating profit</p><p className="mt-1 text-xs text-muted-foreground">Revenue less expense · ₹ lakh</p></div><span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">Healthy trend</span></div>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend.map((item) => ({ month: item.m, revenue: item.revenue, profit: item.revenue - item.expense }))} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barGap={4}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.45 }} />
                <Bar dataKey="revenue" fill="var(--primary)" fillOpacity={0.16} radius={[4, 4, 0, 0]} maxBarSize={34} />
                <Bar dataKey="profit" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-5 text-[11px] font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary/20" />Revenue</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Profit</span></div>
        </Card>

        <Card className="dashboard-card p-5 sm:p-6 xl:col-span-4">
          <div><p className="text-sm font-bold">Expense mix</p><p className="mt-1 text-xs text-muted-foreground">Total {inr(totalExpenses)}</p></div>
          <div className="relative mt-3 h-56">
            {categories.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip contentStyle={tooltipStyle} formatter={(value) => inr(Number(value))} /><Pie data={categories} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="var(--card)" strokeWidth={3}>{categories.map((category, index) => <Cell key={category.name} fill={pieColors[index % pieColors.length]} />)}</Pie></PieChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-sm text-muted-foreground">No expense data yet.</div>}
            {categories.length > 0 && <div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="text-center"><p className="text-[10px] uppercase text-muted-foreground">Total</p><p className="font-display text-lg font-bold">{inr(totalExpenses)}</p></div></div>}
          </div>
          <div className="space-y-2.5">
            {categories.slice(0, 5).map((category, index) => <div key={category.name} className="flex items-center justify-between text-xs"><span className="flex min-w-0 items-center gap-2 text-muted-foreground"><i className="h-2 w-2 shrink-0 rounded-full" style={{ background: pieColors[index % pieColors.length] }} /><span className="truncate">{category.name}</span></span><span className="font-bold tabular-nums">{inr(category.value)}</span></div>)}
          </div>
        </Card>
      </section>

      <Card className="dashboard-card mt-5 overflow-hidden">
        <div className="border-b bg-muted/25 px-5 py-4"><p className="text-sm font-bold">Top customers by revenue</p><p className="mt-0.5 text-xs text-muted-foreground">Highest-value accounts in the current dataset</p></div>
        <div className="divide-y px-5">
          {top.map((customer, index) => (
            <div key={customer.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0"><div className="mb-2 flex justify-between gap-3"><span className="truncate text-sm font-semibold">{customer.name}</span><span className="text-xs font-bold tabular-nums sm:hidden">{inr(Number(customer.revenue))}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(Number(customer.revenue) / max) * 100}%` }} /></div></div>
              <span className="hidden min-w-28 text-right text-sm font-bold tabular-nums sm:block">{inr(Number(customer.revenue))}</span>
            </div>
          ))}
          {top.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No customer revenue data yet.</p>}
        </div>
      </Card>
    </div>
  );
}