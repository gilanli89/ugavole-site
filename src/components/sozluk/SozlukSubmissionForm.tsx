"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import TurnstileWidget from "@/components/security/TurnstileWidget";
import { kategoriler, type Kategori } from "@/lib/sozluk-data";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SUBMISSIONS_READY =
  process.env.NEXT_PUBLIC_DICTIONARY_SUBMISSIONS_ENABLED === "true" &&
  TURNSTILE_SITE_KEY.length > 0;

type FormStatus = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = {
  word: "",
  aliases: "",
  definition: "",
  example: "",
  category: "günlük" as Kategori,
  rights_confirmed: false,
  website: "",
};

export default function SozlukSubmissionForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const idempotencyKey = useRef("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!SUBMISSIONS_READY || !turnstileToken) return;

    setStatus("loading");
    setError("");
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    const aliases = form.aliases
      .split(",")
      .map((alias) => alias.trim())
      .filter(Boolean)
      .slice(0, 6);

    try {
      const response = await fetch("/api/sozluk/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          ...form,
          aliases,
          turnstile_token: turnstileToken,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setTurnstileToken("");
        setTurnstileResetKey((value) => value + 1);
        setStatus("error");
        setError(result.error ?? "Kelime önerisi alınamadı. Lütfen tekrar deneyin.");
        return;
      }

      idempotencyKey.current = crypto.randomUUID();
      setForm(EMPTY_FORM);
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Kelime öneri sistemine ulaşılamadı. Lütfen tekrar deneyin.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-300/60 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <CheckCircle2 className="mx-auto mb-3 h-11 w-11 text-emerald-600" />
        <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">Kelimen taslağa alındı</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-emerald-800 dark:text-emerald-200">
          Ugavole editörü öneriyi kontrol edecek. Yalnız onaylanan kelimeler sözlükte yayınlanır.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-emerald-900"
        >
          Başka kelime öner
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-black text-ugavole-text">
          Kelime veya deyim <span className="text-red-600">*</span>
          <input
            required
            minLength={2}
            maxLength={80}
            value={form.word}
            onChange={(event) => setForm({ ...form, word: event.target.value })}
            placeholder="Örn. Babiç"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none transition-colors focus:border-ugavole-yellow"
          />
        </label>

        <label className="block text-sm font-black text-ugavole-text">
          Kategori <span className="text-red-600">*</span>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value as Kategori })}
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none focus:border-ugavole-yellow"
          >
            {kategoriler.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-black text-ugavole-text sm:col-span-2">
          Anlamı <span className="text-red-600">*</span>
          <textarea
            required
            minLength={3}
            maxLength={600}
            rows={3}
            value={form.definition}
            onChange={(event) => setForm({ ...form, definition: event.target.value })}
            placeholder="Kelimenin ne anlama geldiğini kısa ve açık biçimde yaz."
            className="mt-1.5 w-full resize-y rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none transition-colors focus:border-ugavole-yellow"
          />
          <span className="mt-1 block text-right text-xs font-normal text-ugavole-muted">{form.definition.length}/600</span>
        </label>

        <label className="block text-sm font-black text-ugavole-text sm:col-span-2">
          Alternatif yazılışlar <span className="font-normal text-ugavole-muted">(isteğe bağlı)</span>
          <input
            maxLength={300}
            value={form.aliases}
            onChange={(event) => setForm({ ...form, aliases: event.target.value })}
            placeholder="Babiç, babuş gibi; virgülle ayırabilirsin"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none transition-colors focus:border-ugavole-yellow"
          />
        </label>

        <label className="block text-sm font-black text-ugavole-text sm:col-span-2">
          Örnek kullanım <span className="font-normal text-ugavole-muted">(isteğe bağlı)</span>
          <input
            maxLength={400}
            value={form.example}
            onChange={(event) => setForm({ ...form, example: event.target.value })}
            placeholder="Kelimenin doğal biçimde geçtiği kısa bir cümle"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none transition-colors focus:border-ugavole-yellow"
          />
        </label>

        <label className="sr-only" aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-ugavole-border bg-ugavole-surface-2 p-4 text-sm leading-6 text-ugavole-body">
        <input
          required
          type="checkbox"
          checked={form.rights_confirmed}
          onChange={(event) => setForm({ ...form, rights_confirmed: event.target.checked })}
          className="mt-1"
        />
        <span>Bilginin doğru olduğuna inanıyorum ve Ugavole&apos;nin öneriyi düzenleyip yayınlamasına izin veriyorum.</span>
      </label>

      <div className="flex items-start gap-2 rounded-xl border border-ugavole-yellow/40 bg-ugavole-yellow/10 p-3 text-xs leading-5 text-ugavole-body">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ugavole-yellow-dark" />
        Her öneri önce taslak kuyruğuna düşer; admin onayı olmadan sözlükte görünmez.
      </div>

      {SUBMISSIONS_READY ? (
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          action="dictionary_submit"
          resetKey={turnstileResetKey}
          onTokenChange={setTurnstileToken}
        />
      ) : (
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          Kelime katkısı, güvenli moderasyon bağlantısı tamamlanana kadar kapalıdır.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !SUBMISSIONS_READY || !turnstileToken}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ugavole-yellow px-5 py-3.5 text-sm font-black text-black transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Taslağa alınıyor…" : "Editöre gönder"}
      </button>
    </form>
  );
}
