"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { api } from "@/lib/clientApi";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-md border border-slate-800 bg-slate-900 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Family Password Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your private family vault.</p>
        </div>
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" required />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <Button>Login</Button>
        <Link href="/register" className="text-sm text-teal-300 hover:text-teal-200">
          Create admin account
        </Link>
      </form>
    </main>
  );
}
