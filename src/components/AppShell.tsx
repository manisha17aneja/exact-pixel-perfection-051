import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Target, Building2, Package, Truck, Receipt, Users, FileText, ClipboardList,
  CalendarCheck, Route as RouteIcon, Wallet, BarChart3, Settings, Bell, Search, Plus, Menu, X,
} from "lucide-react";

type Item = { label: string; to?: "/" | "/leads" | "/customers" | "/shipments" | "/fleet" | "/invoices"; icon: any };
const nav: { section: string; items: Item[] }[] = [
  { section: "Overview", items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }] },
  { section: "CRM", items: [{ label: "Leads", to: "/leads", icon: Target }, { label: "Customers", to: "/customers", icon: Building2 }, { label: "Contacts", icon: Users }, { label: "Follow-ups", icon: CalendarCheck }] },
  { section: "Sales", items: [{ label: "Quotations", icon: FileText }, { label: "Bookings", icon: ClipboardList }] },
  { section: "Operations", items: [{ label: "Shipments", to: "/shipments", icon: Package }, { label: "Fleet", to: "/fleet", icon: Truck }, { label: "Trips & Routes", icon: RouteIcon }] },
  { section: "Finance", items: [{ label: "Invoices", to: "/invoices", icon: Receipt }, { label: "Expenses", icon: Wallet }] },
  { section: "Insights", items: [{ label: "Reports", icon: BarChart3 }, { label: "Settings", icon: Settings }] },
];

function SidebarBody({ onNav }: { onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground"><Truck className="h-4 w-4" /></div>
        <span className="font-display font-semibold tracking-tight">Haulwise</span>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {nav.map((g) => (
          <div key={g.section}>
            <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g.section}</p>
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
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"><SidebarBody /></aside>
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
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur">
          <button onClick={() => setOpen(true)} className="btn btn-ghost h-8 w-8 p-0 lg:hidden"><Menu className="h-4 w-4" /></button>
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search shipments, customers, invoices…" className="field w-full pl-8" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="relative">
              <button onClick={() => setQuick(!quick)} className="btn btn-primary"><Plus className="h-4 w-4" /><span className="hidden sm:inline">New</span></button>
              {quick && (
                <div className="surface absolute right-0 mt-2 w-44 p-1 text-sm">
                  {["Lead", "Quotation", "Booking", "Shipment", "Invoice"].map((x) => (
                    <button key={x} onClick={() => setQuick(false)} className="w-full rounded px-3 py-2 text-left hover:bg-muted">New {x}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="btn btn-ghost relative h-8 w-8 p-0"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /></button>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">MA</div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
