"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Field, TextArea } from "@/components/Field";
import { api } from "@/lib/clientApi";

type RecordMap = Record<string, unknown>;

type FieldDef = {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
};

type Props = {
  title: string;
  description: string;
  endpoint: string;
  listKey: string;
  submitLabel: string;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  afterSubmit?: (data: RecordMap) => void;
};

export function ResourcePage({ title, description, endpoint, listKey, submitLabel, fields, hidden, afterSubmit }: Props) {
  const [items, setItems] = useState<RecordMap[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const empty = useMemo(() => Object.fromEntries(fields.map((field) => [field.name, ""])), [fields]);

  const load = useCallback(async function load() {
    setLoading(true);
    try {
      const data = await api<Record<string, RecordMap[]>>(endpoint);
      setItems(data[listKey] || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, listKey]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const data = await api<RecordMap>(endpoint, {
        method: "POST",
        body: JSON.stringify({ ...form, ...hidden }),
      });
      setForm(empty);
      setMessage("Saved");
      afterSubmit?.(data);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </header>
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-800 bg-slate-900/50 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) =>
            field.textarea ? (
              <div key={field.name} className="md:col-span-2">
                <TextArea
                  label={field.label}
                  value={form[field.name] || ""}
                  required={field.required}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              </div>
            ) : (
              <Field
                key={field.name}
                label={field.label}
                type={field.type || "text"}
                value={form[field.name] || ""}
                required={field.required}
                onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
              />
            ),
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          {message && <span className="text-sm text-slate-400">{message}</span>}
        </div>
      </form>
      <div className="overflow-hidden rounded-md border border-slate-800">
        <div className="border-b border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium">Records</div>
        {loading ? (
          <div className="p-4 text-sm text-slate-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-slate-400">No records yet.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {items.map((item) => (
              <div key={String(item.id)} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-3">
                <strong>{String(item.platformName || item.name || item.keyPrefix || item.action || item.id)}</strong>
                <span className="text-slate-400">{String(item.websiteUrl || item.relation || item.actorName || "")}</span>
                <span className="text-slate-500">{item.createdAt ? new Date(String(item.createdAt)).toLocaleString() : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
