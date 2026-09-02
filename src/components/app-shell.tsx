import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navGroups, navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("workpilot-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : prefers);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("workpilot-theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
      <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles aria-hidden="true" className="size-4.5" />
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-semibold text-sidebar-foreground">
            WorkPilot AI
          </span>
          <span className="block text-[11px] text-sidebar-foreground/60">Workplace productivity</span>
        </span>
      ) : null}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="space-y-6">
      {navGroups.map((group) => (
        <div key={group} className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-sidebar-foreground/45 uppercase">
            {group}
          </p>
          {navItems
            .filter((item) => item.group === group)
            .map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-medium">{item.label}</span>
                    <span className="block truncate text-[11.5px] text-sidebar-foreground/50">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = navItems.find((i) => i.to === pathname);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavList />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/60 p-3">
            <p className="text-[11px] font-semibold tracking-wide text-sidebar-accent-foreground uppercase">
              Demo workspace
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-sidebar-foreground/60">
              No live AI model is connected. All output is labelled demo content.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[19rem] border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
                <Brand />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close navigation"
                  className="text-sidebar-foreground"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" className="size-5" />
                </Button>
              </div>
              <div className="overflow-y-auto px-3 py-5">
                <NavList onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{current?.label ?? "WorkPilot AI"}</p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {current?.description ?? "Workplace productivity suite"}
            </p>
          </div>

          <Badge variant="outline" className="hidden gap-1.5 border-ai/40 bg-ai-surface text-ai-foreground sm:inline-flex">
            Demo mode · no live model
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
          </Button>

          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">FP</AvatarFallback>
          </Avatar>
        </header>

        <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation for the primary surfaces */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur lg:hidden"
      >
        {navItems.slice(0, 5).map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon aria-hidden="true" className="size-5" />
              <span className="max-w-full truncate px-1">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
