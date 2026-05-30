"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Fingerprint,
  Home,
  KeyRound,
  LogOut,
  MonitorCog,
  Plus,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { api } from "@/lib/clientApi";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/passwords/new", label: "Add Password", icon: Plus },
  { href: "/passwords", label: "Passwords", icon: KeyRound },
  { href: "/family", label: "Family", icon: Users },
  { href: "/assignments", label: "Access", icon: ShieldCheck },
  { href: "/api-keys", label: "API Keys", icon: Fingerprint },
  { href: "/sessions", label: "Sessions", icon: MonitorCog },
  { href: "/audit-logs", label: "Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/logout", label: "Logout", icon: LogOut },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="glass-shell min-h-screen text-slate-100">
      <aside className="glass-panel fixed inset-y-4 left-4 hidden w-64 rounded-md px-3 py-4 lg:block">
        <Link href="/dashboard" className="mb-7 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-md bg-white text-slate-950">
            <KeyRound size={20} />
          </span>
          <span>
            <span className="block text-base font-semibold">Family Vault</span>
            <span className="text-xs text-slate-400">Parent-controlled access</span>
          </span>
        </Link>
        <nav className="grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-slate-300 hover:bg-slate-900 hover:text-white",
                  active && "bg-white/10 text-white",
                )}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
          <button onClick={logout} className="sr-only">Logout</button>
        </nav>
      </aside>
      <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center gap-2">
          <KeyRound size={18} />
          <strong>Family Vault</strong>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-md border border-white/10 px-3 py-2 text-xs text-slate-200">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
