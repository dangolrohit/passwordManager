"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/clientApi";

type Log = { id: string; actorName: string; actorType: string; action: string; createdAt: string };

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    api<{ logs: Log[] }>("/api/audit-logs").then((data) => setLogs(data.logs)).catch(() => setLogs([]));
  }, []);

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <p className="mt-1 text-sm text-slate-400">Important parent and extension actions.</p>
        </header>
        <div className="glass-panel divide-y divide-white/10 rounded-md">
          {logs.map((log) => (
            <div key={log.id} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-4">
              <strong>{log.action}</strong>
              <span className="text-slate-400">{log.actorName}</span>
              <span>{log.actorType}</span>
              <span className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
