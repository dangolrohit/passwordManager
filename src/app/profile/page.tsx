"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/clientApi";

type User = { name: string; email: string; role: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    api<{ user: User }>("/api/auth/me").then((data) => setUser(data.user)).catch(() => setUser(null));
  }, []);

  return (
    <AppShell>
      <section className="grid gap-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
          <p className="text-lg font-medium">{user?.name || "Loading..."}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <p className="mt-3 text-sm text-teal-300">{user?.role}</p>
        </div>
      </section>
    </AppShell>
  );
}
