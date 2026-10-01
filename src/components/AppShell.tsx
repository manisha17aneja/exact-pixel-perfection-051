import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Target, Building2, Package, Truck, Receipt, Users, FileText, ClipboardList,
  CalendarCheck, Route as RouteIcon, Wallet, BarChart3, Settings, Bell, Search, Plus, Menu, X, LogOut,
} from "lucide-react";

type Item = { label: string; to?: "/dashboard" | "/leads" | "/customers" | "/shipments" | "/fleet" | "/invoices" | "/contacts" | "/follow-ups" | "/quotations" | "/bookings" | "/trips" | "/expenses" | "/reports" | "/settings"; icon: any };
const nav: { section: string; items: Item[] }[] = [
  { section: "Overview", items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }] },
  { section: "CRM", items: [{ label: "Leads", to: "/leads", icon: Target }, { label: "Customers", to: "/customers", icon: Building2 }, { label: "Contacts", to: "/contacts", icon: Users }, { label: "Follow-ups", to: "/follow-ups", icon: CalendarCheck }] },
  { section: "Sales", items: [{ label: "Quotations", to: "/quotations", icon: FileText }, { label: "Bookings", to: "/bookings", icon: ClipboardList }] },
  { section: "Operations", items: [{ label: "Shipments", to: "/shipments", icon: Package }, { label: "Fleet", to: "/fleet", icon: Truck }, { label: "Trips & Routes", to: "/trips", icon: RouteIcon }] },
  { section: "Finance", items: [{ label: "Invoices", to: "/invoices", icon: Receipt }, { label: "Expenses", to: "/expenses", icon: Wallet }] },
  { section: "Insights", items: [{ label: "Reports", to: "/reports", icon: BarChart3 }, { label: "Settings", to: "/settings", icon: Settings }] },
];

function SidebarBody({ onNav }: { onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Truck className="h-4 w-4" /></div>
        <span className="font-display text-lg font-bold tracking-tight text-sidebar-accent-foreground">Haulwise</span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {nav.map((g) => (
          <div key={g.section}>
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">{g.section}</p>
            {g.items.map((i) =>
              i.to ? (
                <Link key={i.label} to={i.to} onClick={onNav} className={`nav-item ${path === i.to ? "nav-item-active" : ""}`}>
                  <i.icon className="h-4 w-4" />{i.label}
                </Link>
              ) : (
                <span key={i.label} className="nav-item cursor-default opacity-50" title="Coming in the next phase">
                  <i.icon className="h-4 w-4" />{i.label}<span className="ml-auto text-[10px]">Soon</span>
                </span>
              ),
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [quick, setQuick] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? "")); }, []);
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar lg:flex"><SidebarBody /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-sidebar">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4"><X className="h-4 w-4" /></button>
            <SidebarBody onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setOpen(true)} className="btn btn-ghost h-8 w-8 p-0 lg:hidden"><Menu className="h-4 w-4" /></button>
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search shipments, customers, invoices…" className="field w-full rounded-full pl-9" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative">
              <button onClick={() => setQuick(!quick)} className="btn btn-primary"><Plus className="h-4 w-4" /><span className="hidden sm:inline">New</span></button>
              {quick && (
                <div className="surface absolute right-0 z-50 mt-2 w-44 p-1 text-sm">
                  {([["Lead", "/leads"], ["Quotation", "/quotations"], ["Booking", "/bookings"], ["Shipment", "/shipments"], ["Invoice", "/invoices"]] as const).map(([x, to]) => (
                    <Link key={x} to={to} onClick={() => setQuick(false)} className="block w-full rounded px-3 py-2 text-left hover:bg-muted">New {x}</Link>
                  ))}
                </div>
              )}
            </div>
            <button className="btn btn-ghost relative h-8 w-8 p-0"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /></button>
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="grid h-8 w-8 place-items-center rounded-full bg-lime text-xs font-bold uppercase text-lime-foreground ring-2 ring-background">{email.slice(0, 2) || "··"}</button>
              {menu && (
                <div className="surface absolute right-0 z-50 mt-2 w-56 p-1 text-sm">
                  <p className="truncate px-3 py-2 text-xs text-muted-foreground">{email}</p>
                  <Link to="/settings" onClick={() => setMenu(false)} className="block rounded px-3 py-2 hover:bg-muted">Settings</Link>
                  <button onClick={signOut} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-danger hover:bg-muted"><LogOut className="h-4 w-4" />Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
