"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/clientApi";

type Dashboard = {
  totalPasswords: number;
  totalFamilyMembers: number;
  assignedPasswords: number;
  activeExtensionSessions: number;
  health?: { hosting: string; database: string; latencyMs: number };
  recentAuditLogs: { id: string; actorName: string; action: string; createdAt: string }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const cards = data
    ? [
        ["Total passwords", data.totalPasswords],
        ["Family members", data.totalFamilyMembers],
        ["Shared passwords", data.assignedPasswords],
        ["Active sessions", data.activeExtensionSessions],
      ]
    : [];

  useEffect(() => {
    api<Dashboard>("/api/dashboard").then(setData).catch(() => setData(null));
  }, []);

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="mt-1 text-sm text-slate-400">Family vault health and access at a glance.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-md p-4">
          <p className="text-sm text-slate-400">Hosting</p>
          <strong className="mt-3 block text-lg text-teal-200">{data?.health?.hosting || "checking"}</strong>
        </div>
        <div className="glass-panel rounded-md p-4">
          <p className="text-sm text-slate-400">Database</p>
          <strong className="mt-3 block text-lg text-teal-200">{data?.health?.database || "checking"}</strong>
        </div>
        <div className="glass-panel rounded-md p-4">
          <p className="text-sm text-slate-400">API latency</p>
          <strong className="mt-3 block text-lg">{data?.health ? `${data.health.latencyMs}ms` : "checking"}</strong>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {data ? (
          cards.map(([label, value]) => (
            <div key={label} className="glass-panel rounded-md p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <strong className="mt-3 block text-3xl">{value}</strong>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Loading...</p>
        )}
      </div>
      <div className="glass-panel rounded-md">
        <h2 className="border-b border-white/10 px-4 py-3 text-sm font-medium">Recent activity</h2>
        <div className="divide-y divide-white/10">
          {data?.recentAuditLogs.length ? (
            data.recentAuditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span>{log.actorName} · {log.action}</span>
                <span className="shrink-0 text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-slate-400">No activity yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
