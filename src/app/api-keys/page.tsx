"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { api } from "@/lib/clientApi";

type FamilyMember = { id: string; name: string; relation: string };
type ApiKeyRecord = { id: string; keyPrefix: string; isUsed: boolean; createdAt: string; familyMember: FamilyMember };

export default function ApiKeysPage() {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [oneTimeKey, setOneTimeKey] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [familyData, keysData] = await Promise.all([
      api<{ family: FamilyMember[] }>("/api/family"),
      api<{ apiKeys: ApiKeyRecord[] }>("/api/api-keys"),
    ]);
    setFamily(familyData.family);
    setApiKeys(keysData.apiKeys);
  }

  useEffect(() => {
    void Promise.resolve().then(load).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const data = await api<{ apiKey: string }>("/api/api-keys/generate", {
        method: "POST",
        body: JSON.stringify({ familyMemberId: form.get("familyMemberId") }),
      });
      setOneTimeKey(data.apiKey);
      setMessage("Generated. This key is shown only once.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Generation failed");
    }
  }

  async function revoke(id: string) {
    try {
      await api(`/api/api-keys/${id}`, { method: "DELETE" });
      setMessage("Key revoked");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Revoke failed");
    }
  }

  return (
    <AppShell>
      <section className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="mt-1 text-sm text-slate-400">Generate and revoke one-time keys for future extension login.</p>
        </header>
        <form onSubmit={submit} className="glass-panel flex flex-wrap items-center gap-3 rounded-md p-4">
          <select name="familyMemberId" required className="glass-field h-10 rounded-md px-3">
            <option value="">Select family member</option>
            {family.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <Button>Generate Key</Button>
          {message && <span className="text-sm text-slate-400">{message}</span>}
        </form>
        {oneTimeKey && <code className="glass-panel block overflow-x-auto rounded-md p-4 text-sm text-teal-100">{oneTimeKey}</code>}
        <div className="glass-panel rounded-md">
          <h2 className="border-b border-white/10 px-4 py-3 text-sm font-medium">Generated keys</h2>
          <div className="divide-y divide-white/10">
            {apiKeys.map((key) => (
              <div key={key.id} className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-5">
                <strong>{key.keyPrefix}</strong>
                <span className="text-slate-400">{key.familyMember.name}</span>
                <span>{key.isUsed ? "Used" : "Unused"}</span>
                <span className="text-slate-500">{new Date(key.createdAt).toLocaleString()}</span>
                <Button variant="danger" onClick={() => revoke(key.id)}>Revoke</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
