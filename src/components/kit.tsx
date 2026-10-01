import { useMemo, useState, type ReactNode } from "react";
import { Download, Search, Plus, X } from "lucide-react";
import { statusTone } from "@/lib/data";

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
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{crumb}</p>
        <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-tight">{title}</h1>
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
      <p className={`mt-1 text-xs text-${tone}`}>{delta}</p>
    </Card>
  );
}

export type Col<T> = { key: string; label: string; render: (r: T) => ReactNode; className?: string };

export function DataTable<T extends Record<string, any>>({
  rows, cols, idKey, filterKey, filters, onRow, addLabel, onAdd,
}: {
  rows: T[]; cols: Col<T>[]; idKey: keyof T; filterKey?: keyof T; filters?: string[];
  onRow?: (r: T) => void; addLabel?: string; onAdd?: () => void;
}) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const per = 5;
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
    const csv = [Object.keys(rows[0]).join(","), ...filtered.map((r) => Object.values(r).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "export.csv"; a.click();
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search…" className="field w-full pl-8" />
        </div>
        {filters && (
          <div className="flex gap-1 overflow-x-auto">
            {["All", ...filters].map((x) => (
              <button key={x} onClick={() => { setF(x); setPage(0); }} className={`chip ${f === x ? "chip-active" : ""}`}>{x}</button>
            ))}
          </div>
        )}
        <div className="ml-auto flex gap-2">
          {sel.size > 0 && <span className="self-center text-xs text-muted-foreground">{sel.size} selected</span>}
          <button onClick={exportCsv} className="btn btn-outline"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
          {addLabel && <button onClick={onAdd} className="btn btn-primary"><Plus className="h-4 w-4" />{addLabel}</button>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="w-10 px-3 py-2.5"><input type="checkbox" checked={view.length > 0 && view.every((r) => sel.has(String(r[idKey])))} onChange={(e) => setSel(e.target.checked ? new Set(view.map((r) => String(r[idKey]))) : new Set())} /></th>
              {cols.map((c) => <th key={c.key} className={`whitespace-nowrap px-3 py-2.5 font-medium ${c.className ?? ""}`}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={String(r[idKey])} onClick={() => onRow?.(r)} className="cursor-pointer border-b last:border-0 hover:bg-muted/60">
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
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-outline h-7 px-2 disabled:opacity-40">Prev</button>
          <span>{page + 1} / {pages}</span>
          <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="btn btn-outline h-7 px-2 disabled:opacity-40">Next</button>
        </div>
      </div>
    </Card>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l bg-card p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost h-8 w-8 p-0"><X className="h-4 w-4" /></button>
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
