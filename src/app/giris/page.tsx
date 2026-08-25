"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { safeAdminDestination } from "@/lib/auth/safe-redirect";

function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("error") === "config"
      ? "Yönetim girişi henüz sunucuda yapılandırılmadı."
      : ""
  );
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { error?: string; mfaRequired?: boolean };

      if (!response.ok) {
        setError(result.error ?? "Giriş yapılamadı");
        return;
      }

      const next = searchParams.get("next");
      const destination = safeAdminDestination(next, window.location.origin);
      router.replace(result.mfaRequired ? `/mfa?next=${encodeURIComponent(destination)}` : destination);
      router.refresh();
    } catch {
      setError("Giriş hizmetine ulaşılamadı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-ugavole-border bg-ugavole-surface p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-2xl bg-ugavole-yellow/20 p-3 text-ugavole-yellow-dark">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-ugavole-text">Editör girişi</h1>
            <p className="text-sm text-ugavole-muted">Ugavole moderasyon merkezi</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-bold text-ugavole-text">
            E-posta
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none focus:border-ugavole-yellow"
            />
          </label>
          <label className="block text-sm font-bold text-ugavole-text">
            Parola
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none focus:border-ugavole-yellow"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-black text-white transition-opacity disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? "Kontrol ediliyor…" : "Giriş yap"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<main className="min-h-[65vh]" />}>
      <GirisForm />
    </Suspense>
  );
}
