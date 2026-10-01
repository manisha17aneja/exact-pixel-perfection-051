import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — Haulwise" },
      { name: "description", content: "Choose a new password for your Haulwise account." },
      { property: "og:title", content: "Set new password — Haulwise" },
      { property: "og:description", content: "Choose a new password for your Haulwise account." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };
  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <form onSubmit={submit} className="surface w-full max-w-sm space-y-3 p-6">
        <h1 className="font-display text-xl font-semibold">Set a new password</h1>
        <input required type="password" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="field w-full" />
        <button className="btn btn-primary w-full justify-center">Update password</button>
      </form>
    </div>
  );
}
