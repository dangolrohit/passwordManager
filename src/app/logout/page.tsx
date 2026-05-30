"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/clientApi";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    api("/api/auth/logout", { method: "POST" }).finally(() => router.replace("/login"));
  }, [router]);

  return <main className="grid min-h-screen place-items-center text-sm text-slate-400">Signing out...</main>;
}
