"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { api } from "@/lib/clientApi";

type Session = { id: string; deviceName?: string; browserName?: string; isActive: boolean; createdAt: string; familyMember: { name: string } };

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  async function load() {
    const data = await api<{ sessions: Session[] }>("/api/sessions");
    setSessions(data.sessions);
  }

  useEffect(() => {
    void Promise.resolve().then(load).catch(() => setSessions([]));
  }, []);

  async function revoke(id: string) {
    await api(`/api/admin/sessions/${id}/revoke`, { method: "POST" });
    await load();
  }

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold">Extension Sessions</h1>
          <p className="mt-1 text-sm text-slate-400">Review and revoke extension sessions created by one-time API key login.</p>
        </header>
        <div className="divide-y divide-slate-800 rounded-md border border-slate-800">
          {sessions.map((session) => (
            <div key={session.id} className="grid gap-3 px-4 py-3 text-sm md:grid-cols-5">
              <strong>{session.familyMember.name}</strong>
              <span>{session.deviceName || "Unknown device"}</span>
              <span>{session.browserName || "Unknown browser"}</span>
              <span className={session.isActive ? "text-teal-300" : "text-slate-500"}>{session.isActive ? "Active" : "Revoked"}</span>
              {session.isActive && <Button variant="danger" onClick={() => revoke(session.id)}>Revoke</Button>}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
