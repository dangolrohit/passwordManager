"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/clientApi";

type Dashboard = {
  totalPasswords: number;
  totalFamilyMembers: number;
  assignedPasswords: number;
  activeExtensionSessions: number;
  recentAuditLogs: { id: string; actorName: string; action: string; createdAt: string }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const cards = data
    ? [
        ["Total passwords", data.totalPasswords],
        ["Total family members", data.totalFamilyMembers],
        ["Assigned passwords", data.assignedPasswords],
        ["Active extension sessions", data.activeExtensionSessions],
      ]
    : [];

  useEffect(() => {
    api<Dashboard>("/api/dashboard").then(setData).catch(() => setData(null));
  }, []);

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Vault activity and family access at a glance.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        {data ? cards.map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <strong className="mt-3 block text-3xl">{value}</strong>
          </div>
        )) : <p className="text-sm text-slate-400">Loading...</p>}
      </div>
      <div className="rounded-md border border-slate-800 bg-slate-900">
        <h2 className="border-b border-slate-800 px-4 py-3 text-sm font-medium">Recent audit logs</h2>
        <div className="divide-y divide-slate-800">
          {data?.recentAuditLogs.length ? data.recentAuditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{log.actorName} · {log.action}</span>
              <span className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          )) : <div className="p-4 text-sm text-slate-400">No audit logs yet.</div>}
        </div>
      </div>
    </section>
  );
}
