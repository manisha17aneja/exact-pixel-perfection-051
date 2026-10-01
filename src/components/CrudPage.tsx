import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DataTable, Drawer, PageHeader, type Col } from "@/components/kit";
import { useDeleteRows, useRows, useSaveRow, type TableName } from "@/lib/db";

export type FieldDef = { key: string; label: string; type?: "text" | "number" | "select"; options?: string[]; required?: boolean };

export function CrudPage({
  table, idKey = "id", title, crumb, desc, cols, fields, statuses, addLabel, above,
}: {
  table: TableName; idKey?: string; title: string; crumb: string; desc: string;
  cols: Col<any>[]; fields: FieldDef[]; statuses?: string[] | undefined; addLabel: string;
  above?: (rows: any[]) => ReactNode;
}) {
  const { data = [], isLoading, error } = useRows(table);
  const save = useSaveRow(table, idKey);
  const del = useDeleteRows(table, idKey);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const start = (row?: any) => {
    setEditing(row ?? null);
    const init: Record<string, string> = {};
    fields.forEach((f) => (init[f.key] = row ? String(row[f.key] ?? "") : f.type === "select" ? f.options?.[0] ?? "" : ""));
    setForm(init);
    setOpen(true);
  };

  const submit = async () => {
    const missing = fields.find((f) => f.required && !form[f.key]?.trim());
    if (missing) { toast.error(`${missing.label} is required`); return; }
    const values: Record<string, unknown> = {};
    fields.forEach((f) => (values[f.key] = f.type === "number" ? Number(form[f.key]) || 0 : form[f.key]?.trim()));
    try {
      await save.mutateAsync({ values, editingId: editing?.[idKey] });
      toast.success(editing ? "Changes saved" : `${title.replace(/s$/, "")} added`);
      setOpen(false);
    } catch (e: any) { toast.error(e.message ?? "Could not save"); }
  };

  const remove = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} record${ids.length > 1 ? "s" : ""}?`)) return;
    try { await del.mutateAsync(ids); toast.success("Deleted"); setOpen(false); }
    catch (e: any) { toast.error(e.message ?? "Could not delete"); }
  };

  return (
    <>
      <PageHeader crumb={crumb} title={title} desc={desc} />
      {above?.(data)}
      {error ? (
        <p className="surface p-6 text-sm text-danger">Couldn't load records. Please refresh.</p>
      ) : isLoading ? (
        <p className="surface p-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <DataTable rows={data} idKey={idKey} cols={cols} filterKey={statuses ? "status" : undefined} filters={statuses}
          onRow={start} addLabel={addLabel} onAdd={() => start()} onBulkDelete={remove} />
      )}
      <Drawer open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing[idKey]}` : addLabel}>
        <div className="space-y-3">
          {fields.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="mb-1 block text-muted-foreground">{f.label}{f.required && " *"}</span>
              {f.type === "select" ? (
                <select value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="field w-full">
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type === "number" ? "number" : "text"} value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="field w-full" />
              )}
            </label>
          ))}
          <button onClick={submit} disabled={save.isPending} className="btn btn-primary w-full justify-center disabled:opacity-60">
            {save.isPending ? "Saving…" : editing ? "Save changes" : "Create"}
          </button>
          {editing && (
            <button onClick={() => remove([editing[idKey]])} className="btn btn-outline w-full justify-center text-danger">
              <Trash2 className="h-4 w-4" />Delete
            </button>
          )}
        </div>
      </Drawer>
    </>
  );
}
