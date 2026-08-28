import { Link, useRouterState } from "@tanstack/react-router";
import { Map, Stamp, User, Route as RouteIcon, CalendarCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/cicero";

type NavItem = { to: string; label: string; icon: typeof Map };

const VISITOR_NAV: NavItem[] = [
  { to: "/mappa", label: "Mappa", icon: Map },
  { to: "/timbri", label: "Timbri", icon: Stamp },
  { to: "/account", label: "Account", icon: User },
];

const GUIDE_NAV: NavItem[] = [
  { to: "/itinerari", label: "Itinerario", icon: RouteIcon },
  { to: "/prenotazioni", label: "Prenotazioni", icon: CalendarCheck },
  { to: "/account", label: "Account", icon: User },
];

export function AppShell({
  role,
  children,
  title,
  subtitle,
  action,
}: {
  role: Role;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = role === "cicerone" ? GUIDE_NAV : VISITOR_NAV;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background">
      {(title || action) && (
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-5 pb-4 pt-6 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              {title && <h1 className="font-display text-2xl font-bold">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
          </div>
        </header>
      )}
      <main className="flex-1 px-5 pb-28 pt-4">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-lg -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
        <ul className="flex">
          {items.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to} className="flex-1">
                <Link
                  to={item.to}
                  className={cn(
                    "tap-scale flex flex-col items-center gap-1 py-3 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      active ? "bg-primary/15" : "bg-transparent",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
