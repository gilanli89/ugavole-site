"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, LogOut, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "loading" | "enroll" | "challenge" | "error";

export default function MfaClient({ destination }: { destination: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [mode, setMode] = useState<Mode>("loading");
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;

    async function prepare() {
      try {
        const supabase = createClient();
        const aal = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal.error) throw aal.error;
        if (aal.data.currentLevel === "aal2") {
          router.replace(destination);
          router.refresh();
          return;
        }

        const factors = await supabase.auth.mfa.listFactors();
        if (factors.error) throw factors.error;
        const verifiedTotp = factors.data.totp[0];
        if (verifiedTotp) {
          if (!cancelled) {
            setFactorId(verifiedTotp.id);
            setMode("challenge");
          }
          return;
        }

        for (const factor of factors.data.all) {
          if (factor.factor_type === "totp" && factor.status === "unverified") {
            await supabase.auth.mfa.unenroll({ factorId: factor.id });
          }
        }

        const enrollment = await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: "Ugavole Editör",
          issuer: "Ugavole",
        });
        if (enrollment.error) throw enrollment.error;
        if (!cancelled) {
          setFactorId(enrollment.data.id);
          setQrCode(enrollment.data.totp.qr_code);
          setSecret(enrollment.data.totp.secret);
          setMode("enroll");
        }
      } catch {
        if (!cancelled) {
          setError("İkinci faktör hazırlanamadı. Oturumu kapatıp yeniden deneyin.");
          setMode("error");
        }
      }
    }

    void prepare();
    return () => {
      cancelled = true;
    };
  }, [destination, router]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factorId || !/^\d{6}$/.test(code)) return;
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const result = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (result.error) {
        setError("Kod geçersiz veya süresi dolmuş. Yeni kodu deneyin.");
        setCode("");
        return;
      }
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Doğrulama hizmetine ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setError("Oturum kapatılamadı; lütfen yeniden deneyin.");
        return;
      }
      router.replace("/giris");
      router.refresh();
    } catch {
      setError("Oturum hizmetine ulaşılamadı.");
    }
  }

  const qrSource = qrCode
    ? qrCode.startsWith("data:")
      ? qrCode
      : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrCode)}`
    : "";

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-lg items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-ugavole-border bg-ugavole-surface p-7 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="rounded-2xl bg-ugavole-yellow/20 p-3 text-ugavole-yellow-dark">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-ugavole-text">İki aşamalı doğrulama</h1>
              <p className="text-sm text-ugavole-muted">Editör işlemleri için zorunludur.</p>
            </div>
          </div>
          <button type="button" onClick={logout} className="rounded-xl p-2 text-ugavole-muted" aria-label="Çıkış yap">
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {mode === "loading" && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-ugavole-muted">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Güvenlik durumu hazırlanıyor…
          </div>
        )}

        {mode === "enroll" && qrSource && (
          <div className="mb-6 space-y-4">
            <p className="text-sm leading-relaxed text-ugavole-body">
              QR kodunu bir kimlik doğrulama uygulamasıyla tara; ardından uygulamadaki altı haneli kodu gir.
            </p>
            <div className="mx-auto w-fit rounded-2xl bg-white p-3">
              <Image src={qrSource} alt="Ugavole TOTP kurulum QR kodu" width={220} height={220} unoptimized />
            </div>
            <details className="rounded-xl border border-ugavole-border p-3 text-sm">
              <summary className="cursor-pointer font-bold text-ugavole-text">QR taranamıyorsa kurulum anahtarını göster</summary>
              <code className="mt-3 block break-all rounded-lg bg-ugavole-bg p-3 text-xs text-ugavole-body">{secret}</code>
            </details>
          </div>
        )}

        {(mode === "enroll" || mode === "challenge") && (
          <form onSubmit={verify} className="space-y-4">
            {mode === "challenge" && (
              <p className="text-sm leading-relaxed text-ugavole-body">
                Kimlik doğrulama uygulamandaki güncel altı haneli kodu gir.
              </p>
            )}
            <label className="block text-sm font-bold text-ugavole-text">
              Doğrulama kodu
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ugavole-muted" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-xl border border-ugavole-border bg-ugavole-bg py-3 pl-11 pr-4 font-mono text-lg tracking-[0.35em] text-ugavole-text outline-none focus:border-ugavole-yellow"
                />
              </div>
            </label>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {busy ? "Doğrulanıyor…" : "Doğrula ve devam et"}
            </button>
          </form>
        )}

        {mode === "error" && (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}
      </section>
    </main>
  );
}
