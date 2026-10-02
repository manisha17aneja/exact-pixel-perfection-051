import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Target, Building2, Package, Truck, Receipt, Users, FileText, ClipboardList,
  CalendarCheck, Route as RouteIcon, Wallet, BarChart3, Settings, Bell, Search, Plus, Menu, X, LogOut,
  Command, ChevronDown, Activity,
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
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="brand-mark"><Truck className="h-4 w-4" /></div>
        <div><span className="block font-display text-lg font-bold text-sidebar-accent-foreground">Haulwise</span><span className="block font-mono text-[8px] uppercase text-sidebar-muted">Network OS</span></div>
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
      <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase text-sidebar-primary"><Activity className="h-3 w-3" />System status</p>
        <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-sidebar-accent-foreground"><span className="status-pulse" />Operational</p>
      </div>
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
    <div className="app-frame flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"><SidebarBody /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar">
            <Button onClick={() => setOpen(false)} variant="ghost" size="icon" className="absolute right-3 top-3 text-sidebar-foreground"><X /></Button>
            <SidebarBody onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="top-command sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6">
          <Button onClick={() => setOpen(true)} variant="ghost" size="icon" className="lg:hidden"><Menu /></Button>
          <div className="hidden min-w-fit items-center gap-2 lg:flex"><Command className="h-4 w-4 text-primary" /><span className="font-mono text-[10px] uppercase text-muted-foreground">Control room</span></div>
          <div className="hidden h-4 w-px bg-border lg:block" />
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input aria-label="Global search" placeholder="Search tracking ID, customer, invoice…" className="field w-full pl-9" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative">
              <Button onClick={() => setQuick(!quick)}><Plus /><span className="hidden sm:inline">New record</span><ChevronDown className="hidden h-3 w-3 sm:block" /></Button>
              {quick && (
                <div className="surface absolute right-0 z-50 mt-2 w-44 p-1 text-sm">
                  {([["Lead", "/leads"], ["Quotation", "/quotations"], ["Booking", "/bookings"], ["Shipment", "/shipments"], ["Invoice", "/invoices"]] as const).map(([x, to]) => (
                    <Link key={x} to={to} onClick={() => setQuick(false)} className="block w-full rounded px-3 py-2 text-left hover:bg-muted">New {x}</Link>
                  ))}
                </div>
              )}
            </div>
            <Button aria-label="Notifications" variant="ghost" size="icon" className="relative"><Bell /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" /></Button>
            <div className="relative">
              <Button aria-label="Account menu" onClick={() => setMenu(!menu)} variant="outline" size="icon" className="font-mono text-[10px] uppercase">{email.slice(0, 2) || "··"}</Button>
              {menu && (
                <div className="surface absolute right-0 z-50 mt-2 w-56 p-1 text-sm">
                  <p className="truncate px-3 py-2 text-xs text-muted-foreground">{email}</p>
                  <Link to="/settings" onClick={() => setMenu(false)} className="block rounded px-3 py-2 hover:bg-muted">Settings</Link>
                  <Button onClick={signOut} variant="ghost" className="w-full justify-start text-danger"><LogOut />Sign out</Button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="workspace flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
