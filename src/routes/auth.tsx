import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Haulwise Logistics CRM" },
      { name: "description", content: "Sign in to your Haulwise logistics workspace." },
      { property: "og:title", content: "Sign in — Haulwise Logistics CRM" },
      { property: "og:description", content: "Sign in to your Haulwise logistics workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => data.session && navigate({ to: "/dashboard", replace: true }));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => s && navigate({ to: "/dashboard", replace: true }));
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
        setMode("in");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Password reset link sent to your email.");
        setMode("in");
      }
    } catch (err: any) { toast.error(err.message); }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <div className="surface w-full max-w-sm p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground"><Truck className="h-4 w-4" /></div>
          <span className="font-display text-lg font-semibold">Haulwise</span>
        </div>
        <h1 className="font-display text-xl font-semibold">{mode === "in" ? "Sign in" : mode === "up" ? "Create your account" : "Reset password"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Logistics & transport CRM</p>
        {mode !== "reset" && (
          <>
            <button onClick={google} className="btn btn-outline mt-5 w-full justify-center">Continue with Google</button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
          </>
        )}
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="field w-full" />}
          <input required type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="field w-full" />
          {mode !== "reset" && <input required type="password" minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="field w-full" />}
          <button disabled={busy} className="btn btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-xs">
          <button onClick={() => setMode(mode === "up" ? "in" : "up")} className="text-primary">{mode === "up" ? "Have an account? Sign in" : "New here? Create account"}</button>
          {mode === "in" && <button onClick={() => setMode("reset")} className="text-muted-foreground">Forgot password?</button>}
        </div>
      </div>
    </div>
  );
}
