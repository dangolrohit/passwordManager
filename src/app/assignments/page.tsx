"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { api } from "@/lib/clientApi";

type FamilyMember = { id: string; name: string; relation: string };
type PasswordItem = { id: string; platformName: string; websiteUrl: string };
type Assignment = { id: string; password: PasswordItem; familyMember: FamilyMember; createdAt: string };

export default function AssignmentsPage() {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [familyData, passwordData, assignmentData] = await Promise.all([
      api<{ family: FamilyMember[] }>("/api/family"),
      api<{ passwords: PasswordItem[] }>("/api/passwords"),
      api<{ assignments: Assignment[] }>("/api/assignments"),
    ]);
    setFamily(familyData.family);
    setPasswords(passwordData.passwords);
    setAssignments(assignmentData.assignments);
  }

  useEffect(() => {
    void Promise.resolve().then(load).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const passwordIds = form.getAll("passwordIds").map(String);
    try {
      await api("/api/assignments", {
        method: "POST",
        body: JSON.stringify({ familyMemberId: form.get("familyMemberId"), passwordIds }),
      });
      setMessage("Assigned");
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Assignment failed");
    }
  }

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold">Access</h1>
          <p className="mt-1 text-sm text-slate-400">Share multiple passwords with one family member.</p>
        </header>
        <form onSubmit={submit} className="glass-panel grid gap-4 rounded-md p-4">
          <select name="familyMemberId" required className="glass-field h-10 rounded-md px-3">
            <option value="">Select family member</option>
            {family.map((member) => <option key={member.id} value={member.id}>{member.name} ({member.relation})</option>)}
          </select>
          <div className="grid gap-2 md:grid-cols-2">
            {passwords.map((password) => (
              <label key={password.id} className="glass-field flex items-center gap-2 rounded-md p-3 text-sm">
                <input type="checkbox" name="passwordIds" value={password.id} />
                <span>{password.platformName}</span>
                <span className="text-slate-500">{password.websiteUrl}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button>Assign</Button>
            {message && <span className="text-sm text-slate-400">{message}</span>}
          </div>
        </form>
        <div className="glass-panel rounded-md">
          <h2 className="border-b border-white/10 px-4 py-3 text-sm font-medium">Current access</h2>
          <div className="divide-y divide-white/10">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-3">
                <strong>{assignment.familyMember.name}</strong>
                <span className="text-slate-400">{assignment.password.platformName}</span>
                <span className="text-slate-500">{new Date(assignment.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
