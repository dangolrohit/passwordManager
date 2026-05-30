"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { api } from "@/lib/clientApi";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }),
      });
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Registration failed");
    }
  }

  return (
    <main className="glass-shell grid min-h-screen place-items-center px-4 text-slate-100">
      <form onSubmit={submit} className="glass-panel grid w-full max-w-md gap-4 rounded-md p-6">
        <div>
          <h1 className="text-2xl font-semibold">Create Parent Account</h1>
          <p className="mt-1 text-sm text-slate-400">Your account controls the family vault.</p>
        </div>
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" minLength={8} required />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <Button>Register</Button>
        <Link href="/login" className="text-sm text-teal-300 hover:text-teal-200">
          Back to login
        </Link>
      </form>
    </main>
  );
}
