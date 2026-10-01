import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haulwise — Logistics & Transport CRM" },
      { name: "description", content: "One CRM for leads, shipments, fleet, trips, invoices and payments." },
      { property: "og:title", content: "Haulwise — Logistics & Transport CRM" },
      { property: "og:description", content: "One CRM for leads, shipments, fleet, trips, invoices and payments." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) =>
      navigate({ to: data.session ? "/dashboard" : "/auth", replace: true }));
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-5 w-5" /> Loading Haulwise…</div>
    </div>
  );
}
