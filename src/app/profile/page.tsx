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
        <div className="glass-panel rounded-md p-4">
          <p className="text-lg font-medium">{user?.name || "Loading..."}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <p className="mt-3 text-sm text-teal-300">{user?.role === "ADMIN" ? "Parent" : user?.role}</p>
        </div>
      </section>
    </AppShell>
  );
}
