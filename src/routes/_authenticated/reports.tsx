import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, Stat } from "@/components/kit";
import { customers, expenses, revenueTrend, inr } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Haulwise Logistics CRM" },
      { name: "description", content: "Revenue, margins, top customers and cost breakdown." },
      { property: "og:title", content: "Reports — Haulwise Logistics CRM" },
      { property: "og:description", content: "Revenue, margins, top customers and cost breakdown." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const top = [...customers].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const max = top[0]?.revenue ?? 1;
  const cats = Object.entries(expenses.reduce<Record<string, number>>((a, e) => ((a[e.category] = (a[e.category] ?? 0) + e.amount), a), {}));
  return (
    <>
      <PageHeader crumb="Insights / Reports" title="Reports" desc="How the business performed over the last six months." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="6-month revenue" value="₹320 L" delta="+18% vs prior period" />
        <Stat label="Gross margin" value="31.2%" delta="+1.4 pts" />
        <Stat label="On-time delivery" value="92%" delta="-2 pts" tone="warning" />
        <Stat label="Avg. revenue / trip" value="₹1.42 L" delta="+6%" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm font-medium">Monthly profit <span className="text-muted-foreground">(₹ lakh)</span></p>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <BarChart data={revenueTrend.map((r) => ({ m: r.m, profit: r.revenue - r.expense }))}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="profit" fill="var(--primary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium">Top customers by revenue</p>
          <div className="mt-4 space-y-3">
            {top.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm"><span>{c.name}</span><span className="tabular-nums">{inr(c.revenue)}</span></div>
                <div className="h-1.5 rounded bg-muted"><div className="h-full rounded bg-primary" style={{ width: `${(c.revenue / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="mt-4 p-4">
        <p className="mb-3 text-sm font-medium">Expense breakdown (this week)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {cats.map(([k, v]) => (
            <div key={k} className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="font-display text-lg font-semibold tabular-nums">{inr(v)}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
