import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName =
  | "leads" | "customers" | "contacts" | "followups" | "quotations" | "bookings"
  | "shipments" | "vehicles" | "trips" | "expenses" | "invoices";
export type Row<T extends TableName> = Database["public"]["Tables"][T]["Row"];

export function useRows<T extends TableName>(table: T) {
  return useQuery({
    queryKey: ["rows", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Row<T>[];
    },
  });
}

export function useSaveRow(table: TableName, idKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ values, editingId }: { values: Record<string, unknown>; editingId?: string }) => {
      const q = editingId
        ? supabase.from(table).update(values as never).eq(idKey, editingId)
        : supabase.from(table).insert(values as never);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rows", table] }),
  });
}

export function useDeleteRows(table: TableName, idKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from(table).delete().in(idKey, ids);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rows", table] }),
  });
}
