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
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/passwords/new", label: "Add Password", icon: Plus },
  { href: "/passwords", label: "Manage Passwords", icon: KeyRound },
  { href: "/family", label: "Manage Family", icon: Users },
  { href: "/assignments", label: "Assign Passwords", icon: ShieldCheck },
  { href: "/api-keys", label: "API Keys", icon: Fingerprint },
  { href: "/sessions", label: "Extension Sessions", icon: MonitorCog },
  { href: "/audit-logs", label: "Audit Logs", icon: Activity },
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950/95 px-4 py-5 lg:block">
        <Link href="/dashboard" className="mb-7 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-md bg-teal-400 text-slate-950">
            <KeyRound size={20} />
          </span>
          <span>
            <span className="block text-base font-semibold">Family Password Manager</span>
            <span className="text-xs text-slate-400">Private family vault</span>
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
                  active && "bg-slate-800 text-white",
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
      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
