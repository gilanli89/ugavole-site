"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle, Send, ShieldCheck } from "lucide-react";
import { UGC_CATEGORIES, UGC_TYPES } from "@/lib/content/ugc";
import TurnstileWidget from "@/components/security/TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SUBMISSIONS_READY =
  process.env.NEXT_PUBLIC_UGC_SUBMISSIONS_ENABLED === "true" &&
  TURNSTILE_SITE_KEY.length > 0;

const TYPE_LABELS: Record<(typeof UGC_TYPES)[number], string> = {
  story: "Hikâye / deneyim",
  list: "Liste fikri",
  poll: "Oylama fikri",
  quiz: "Quiz fikri",
  tip: "İhbar / duyuru",
};

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = {
  type: "story" as (typeof UGC_TYPES)[number],
  title: "",
  excerpt: "",
  content: "",
  category: UGC_CATEGORIES[0],
  location: "",
  author_name: "",
  author_email: "",
  source_url: "",
  rights_confirmed: false,
  privacy_confirmed: false,
  website: "",
};

export default function UGCForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const idempotencyKey = useRef("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({ ...form, turnstile_token: turnstileToken }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setTurnstileToken("");
        setTurnstileResetKey((value) => value + 1);
        setStatus("error");
        setErrorMsg(result.error ?? "Gönderi alınamadı. Lütfen tekrar deneyin.");
        return;
      }

      idempotencyKey.current = crypto.randomUUID();
      setForm(EMPTY_FORM);
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Gönderi sistemine ulaşılamadı. Lütfen tekrar deneyin.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-600" />
        <h3 className="mb-2 text-lg font-black text-green-900">Katkın inceleme kuyruğunda</h3>
        <p className="mb-4 text-sm text-green-800">
          Editör onaylamadan yayınlanmaz, reklama açılmaz ve sosyal medyada paylaşılmaz.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="rounded-full bg-green-800 px-6 py-2 text-sm font-bold text-white"
        >
          Yeni katkı gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-ugavole-text">
          İçerik biçimi
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value as typeof form.type })}
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          >
            {UGC_TYPES.map((type) => (
              <option key={type} value={type}>{TYPE_LABELS[type]}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-ugavole-text">
          Kategori
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value as typeof form.category })}
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          >
            {UGC_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-ugavole-text sm:col-span-2">
          Başlık <span className="text-red-600">*</span>
          <input
            type="text"
            minLength={8}
            maxLength={180}
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Kıbrıs'ta herkesin yaşadığı 10 şey…"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none focus:border-ugavole-yellow"
          />
        </label>

        <label className="block text-sm font-bold text-ugavole-text sm:col-span-2">
          Kısa özet
          <input
            type="text"
            maxLength={360}
            value={form.excerpt}
            onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
            placeholder="İnsanların neden okumak isteyeceğini bir cümlede anlat."
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          />
        </label>

        <label className="block text-sm font-bold text-ugavole-text sm:col-span-2">
          Anlatımın <span className="text-red-600">*</span>
          <textarea
            minLength={80}
            maxLength={20_000}
            required
            rows={9}
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            placeholder="Olayı, liste maddelerini veya quiz fikrini ayrıntılı anlat. Paragrafları boş satırla ayırabilirsin."
            className="mt-1.5 w-full resize-y rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal outline-none focus:border-ugavole-yellow"
          />
          <span className="mt-1 block text-right text-xs font-normal text-ugavole-muted">{form.content.length}/20.000</span>
        </label>

        <label className="block text-sm font-bold text-ugavole-text">
          Konum
          <input
            type="text"
            maxLength={120}
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            placeholder="Girne, Lefkoşa, Karpaz…"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          />
        </label>

        <label className="block text-sm font-bold text-ugavole-text">
          Kaynak bağlantısı
          <input
            type="url"
            maxLength={1000}
            value={form.source_url}
            onChange={(event) => setForm({ ...form, source_url: event.target.value })}
            placeholder="https://…"
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          />
        </label>

        <label className="block text-sm font-bold text-ugavole-text">
          Adın <span className="text-red-600">*</span>
          <input
            type="text"
            minLength={2}
            maxLength={100}
            required
            value={form.author_name}
            onChange={(event) => setForm({ ...form, author_name: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          />
        </label>

        <label className="block text-sm font-bold text-ugavole-text">
          E-posta <span className="text-red-600">*</span>
          <input
            type="email"
            maxLength={254}
            required
            value={form.author_email}
            onChange={(event) => setForm({ ...form, author_email: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-ugavole-border bg-ugavole-bg px-4 py-3 font-normal"
          />
        </label>

        <label className="sr-only" aria-hidden="true">
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
          />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-ugavole-border bg-ugavole-surface-2 p-4 text-sm text-ugavole-body">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={form.rights_confirmed}
            onChange={(event) => setForm({ ...form, rights_confirmed: event.target.checked })}
            className="mt-1"
          />
          <span>Bu içeriği paylaşma hakkım olduğunu ve Ugavole&apos;ye düzenleme/yayınlama izni verdiğimi onaylıyorum.</span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={form.privacy_confirmed}
            onChange={(event) => setForm({ ...form, privacy_confirmed: event.target.checked })}
            className="mt-1"
          />
          <span>İletişim bilgilerimin yalnız moderasyon ve gönderim takibi için işlenmesini kabul ediyorum.</span>
        </label>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Yeni gönderiler daima ön moderasyondadır. Onaysız içerikte reklam veya otomatik sosyal paylaşım çalışmaz.
      </div>

      {SUBMISSIONS_READY ? (
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          resetKey={turnstileResetKey}
          onTokenChange={setTurnstileToken}
        />
      ) : (
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Katkı formu bot koruması kurulana kadar güvenli biçimde kapalıdır.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !SUBMISSIONS_READY || !turnstileToken}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-black text-white transition-opacity disabled:opacity-50 dark:bg-white dark:text-black"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Güvenli kuyruğa alınıyor…" : "Editöre gönder"}
      </button>
    </form>
  );
}
