import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Activity, ArrowRight, Boxes, CheckCircle2, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Haulwise Logistics CRM" },
      { name: "description", content: "Sign in to your Haulwise logistics workspace." },
      { property: "og:title", content: "Sign in — Haulwise Logistics CRM" },
      { property: "og:description", content: "Sign in to your Haulwise logistics workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <div className="auth-grid min-h-screen bg-background p-4 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)] lg:p-6">
      <section className="auth-visual relative hidden min-h-[calc(100vh-3rem)] overflow-hidden border border-border p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-3">
          <div className="brand-mark"><Truck className="h-4 w-4" /></div>
          <div><span className="block font-display text-lg font-bold">Haulwise</span><span className="block font-mono text-[9px] uppercase text-muted-foreground">Network OS</span></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-[10px] uppercase text-primary">Freight intelligence / live</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[1.05]">Every shipment. One operational command layer.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Run sales, dispatch, fleet and finance from a single high-clarity workspace built for transport teams.</p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[['Live network', Activity], ['Unified fleet', Truck], ['End-to-end flow', Boxes]].map(([label, Icon]) => <div key={String(label)} className="telemetry-tile"><Icon className="h-4 w-4 text-primary" /><span>{String(label)}</span></div>)}
          </div>
        </div>
        <p className="relative z-10 flex items-center gap-2 font-mono text-[9px] uppercase text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" />Secure workspace connection</p>
      </section>
      <section className="grid min-h-[calc(100vh-2rem)] place-items-center p-2 sm:p-8 lg:min-h-0">
      <div className="auth-panel surface w-full max-w-md p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="brand-mark"><Truck className="h-4 w-4" /></div><span className="font-display text-lg font-semibold">Haulwise</span></div>
        <p className="font-mono text-[10px] uppercase text-primary">Workspace access</p>
        <h2 className="mt-3 font-display text-2xl font-semibold">{mode === "in" ? "Welcome back" : mode === "up" ? "Create your account" : "Reset password"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{mode === "reset" ? "We'll send a secure recovery link." : "Continue to your logistics control room."}</p>
        {mode !== "reset" && (
          <>
            <Button type="button" onClick={google} variant="outline" className="mt-6 w-full">Continue with Google</Button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
          </>
        )}
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="field w-full" />}
          <input required type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="field w-full" />
          {mode !== "reset" && <input required type="password" minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="field w-full" />}
          <Button disabled={busy} className="w-full">{busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}<ArrowRight /></Button>
        </form>
        <div className="mt-4 flex justify-between text-xs">
          <button onClick={() => setMode(mode === "up" ? "in" : "up")} className="text-primary">{mode === "up" ? "Have an account? Sign in" : "New here? Create account"}</button>
          {mode === "in" && <button onClick={() => setMode("reset")} className="text-muted-foreground">Forgot password?</button>}
        </div>
      </div>
      </section>
    </div>
  );
}
