import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — Haulwise" },
      { name: "description", content: "Choose a new password for your Haulwise account." },
      { property: "og:title", content: "Set new password — Haulwise" },
      { property: "og:description", content: "Choose a new password for your Haulwise account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };
  return (
    <div className="auth-grid grid min-h-screen place-items-center bg-background p-4">
      <form onSubmit={submit} className="auth-panel surface w-full max-w-sm space-y-4 p-7">
        <p className="font-mono text-[10px] uppercase text-primary">Secure access</p>
        <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">Use at least six characters to protect your workspace.</p>
        <input required type="password" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" className="field w-full" />
        <Button className="w-full">Update password</Button>
      </form>
    </div>
  );
}
