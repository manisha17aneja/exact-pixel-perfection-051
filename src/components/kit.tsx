import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download, Search, Plus, X, Trash2 } from "lucide-react";
import { statusTone } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone[status] ?? "neutral";
  return (
    <span className={`badge badge-${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PageHeader({ crumb, title, desc, action }: { crumb: string; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="page-heading mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b pb-5">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase text-primary">{crumb}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{desc}</p>
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`surface ${className}`}>{children}</div>;
}

export function Stat({ label, value, delta, tone = "success" }: { label: string; value: string; delta: string; tone?: "success" | "danger" | "warning" }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className={`mt-1 text-xs ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-danger"}`}>{delta}</p>
    </Card>
  );
}

export type Col<T> = { key: string; label: string; render: (r: T) => ReactNode; className?: string };

export function DataTable<T extends Record<string, any>>({
  rows, cols, idKey, filterKey, filters, onRow, addLabel, onAdd, onBulkDelete,
}: {
  rows: T[]; cols: Col<T>[]; idKey: keyof T | string; filterKey?: keyof T | string | undefined; filters?: string[] | undefined;
  onRow?: (r: T) => void; addLabel?: string; onAdd?: () => void; onBulkDelete?: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const per = 8;
  const filtered = useMemo(
    () => rows.filter((r) =>
      (f === "All" || !filterKey || r[filterKey] === f) &&
      JSON.stringify(r).toLowerCase().includes(q.toLowerCase())),
    [rows, q, f, filterKey],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const view = filtered.slice(page * per, page * per + per);
  const toggle = (id: string) => {
    const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n);
  };
  const exportCsv = () => {
    const csv = [Object.keys(rows[0] ?? {}).join(","), ...filtered.map((r) => Object.values(r).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "export.csv"; a.click();
  };

  return (
    <Card className="overflow-hidden">
      <div className="table-toolbar flex flex-wrap items-center gap-2 border-b p-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search…" className="field w-full pl-8" />
        </div>
        {filters && (
          <div className="flex gap-1 overflow-x-auto">
            {["All", ...filters].map((x) => (
              <Button key={x} onClick={() => { setF(x); setPage(0); }} variant={f === x ? "secondary" : "ghost"} size="sm">{x}</Button>
            ))}
          </div>
        )}
        <div className="ml-auto flex gap-2">
          {sel.size > 0 && <span className="self-center text-xs text-muted-foreground">{sel.size} selected</span>}
          {sel.size > 0 && onBulkDelete && <Button onClick={() => { onBulkDelete([...sel]); setSel(new Set()); }} variant="destructive" size="sm"><Trash2 />Delete</Button>}
          <Button onClick={exportCsv} variant="outline" size="sm"><Download /><span className="hidden sm:inline">Export</span></Button>
          {addLabel && <Button onClick={onAdd} size="sm"><Plus />{addLabel}</Button>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="data-grid w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b text-left font-mono text-[10px] uppercase text-muted-foreground">
              <th className="w-10 px-3 py-2.5"><input type="checkbox" checked={view.length > 0 && view.every((r) => sel.has(String(r[idKey])))} onChange={(e) => setSel(e.target.checked ? new Set(view.map((r) => String(r[idKey]))) : new Set())} /></th>
              {cols.map((c) => <th key={c.key} className={`whitespace-nowrap px-3 py-2.5 font-medium ${c.className ?? ""}`}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={String(r[idKey])} onClick={() => onRow?.(r)} className="cursor-pointer border-b last:border-0 hover:bg-accent/40">
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.has(String(r[idKey]))} onChange={() => toggle(String(r[idKey]))} /></td>
                {cols.map((c) => <td key={c.key} className={`whitespace-nowrap px-3 py-3 ${c.className ?? ""}`}>{c.render(r)}</td>)}
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={cols.length + 1} className="p-8 text-center text-muted-foreground">No records match.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
        <span>{filtered.length} records</span>
        <div className="flex items-center gap-2">
          <Button aria-label="Previous page" disabled={page === 0} onClick={() => setPage(page - 1)} variant="outline" size="icon" className="h-7 w-7"><ChevronLeft /></Button>
          <span className="font-mono">{page + 1} / {pages}</span>
          <Button aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} variant="outline" size="icon" className="h-7 w-7"><ChevronRight /></Button>
        </div>
      </div>
    </Card>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" onClick={onClose} />
      <aside className="drawer-panel relative h-full w-full max-w-md overflow-y-auto border-l bg-card p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <Button aria-label="Close" onClick={onClose} variant="ghost" size="icon"><X /></Button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
