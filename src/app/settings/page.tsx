import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
          Configure `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`, and `NEXT_PUBLIC_APP_NAME` before deployment.
        </div>
      </section>
    </AppShell>
  );
}
