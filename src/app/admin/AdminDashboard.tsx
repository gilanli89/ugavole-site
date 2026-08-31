"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeDollarSign, Check, Eye, LogOut, Megaphone, Send, ShieldAlert, X } from "lucide-react";
import type { ModerationItemDTO } from "@/lib/data/moderation";
import type {
  DictionaryModerationItemDTO,
  PublishedDictionaryModerationItemDTO,
} from "@/lib/data/dictionary";
import type { SocialPlatform } from "@/lib/social/types";
import DictionaryModerationPanel from "./DictionaryModerationPanel";

const STATUS_LABELS: Record<ModerationItemDTO["status"], string> = {
  pending: "Bekliyor",
  in_review: "İnceleniyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export default function AdminDashboard({
  initialItems,
  initialDictionaryItems,
  initialPublishedDictionaryItems,
  editorName,
  socialPlatforms,
}: {
  initialItems: ModerationItemDTO[];
  initialDictionaryItems: DictionaryModerationItemDTO[];
  initialPublishedDictionaryItems: PublishedDictionaryModerationItemDTO[];
  editorName: string;
  socialPlatforms: SocialPlatform[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function applyAction(
    item: ModerationItemDTO,
    action: "review" | "approve" | "reject"
  ) {
    const note = action === "reject" ? window.prompt("Ret nedenini yazın:")?.trim() : "";
    if (action === "reject" && (!note || note.length < 3)) return;

    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, contentVersion: item.contentVersion }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "İşlem uygulanamadı");
        return;
      }

      const nextStatus = action === "review" ? "in_review" : action === "approve" ? "approved" : "rejected";
      setItems((current) => current.map((candidate) =>
        candidate.id === item.id ? { ...candidate, status: nextStatus } : candidate
      ));
    } catch {
      setError("Moderasyon servisine ulaşılamadı");
    } finally {
      setBusyId(null);
    }
  }

  async function publishItem(
    item: ModerationItemDTO,
    adEligible: boolean,
    socialReady: boolean
  ) {
    const summary = socialReady
      ? `İçerik yayınlanacak, reklam uygun sayılacak ve ${socialPlatforms.join(", ")} kuyruğuna alınacak.`
      : adEligible
        ? "İçerik yayınlanacak ve reklam uygun sayılacak; sosyal paylaşım yapılmayacak."
        : "İçerik reklam ve otomatik sosyal paylaşım kapalı olarak yayınlanacak.";
    if (!window.confirm(`${summary}\n\nTelif, kaynak ve politika kontrolünü tamamladığını onaylıyor musun?`)) return;

    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          contentVersion: item.contentVersion,
          adEligible,
          socialReady,
          platforms: socialReady ? socialPlatforms : undefined,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Yayın işlemi uygulanamadı");
        return;
      }
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch {
      setError("Yayın servisine ulaşılamadı");
    } finally {
      setBusyId(null);
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-ugavole-yellow-dark">Ugavole editör merkezi</p>
          <h1 className="text-3xl font-black text-ugavole-text">Moderasyon kuyruğu</h1>
          <p className="mt-1 text-sm text-ugavole-muted">Giriş: {editorName}</p>
        </div>
        <button type="button" onClick={logout} className="flex items-center gap-2 rounded-xl border border-ugavole-border px-4 py-2 text-sm font-bold text-ugavole-text">
          <LogOut className="h-4 w-4" /> Çıkış
        </button>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["pending", "in_review", "approved", "rejected"] as const).map((status) => (
          <div key={status} className="rounded-2xl border border-ugavole-border bg-ugavole-surface p-4">
            <p className="text-2xl font-black text-ugavole-text">{items.filter((item) => item.status === status).length}</p>
            <p className="text-xs font-bold text-ugavole-muted">{STATUS_LABELS[status]}</p>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <ShieldAlert className="h-4 w-4" /> {error}
        </div>
      )}

      <DictionaryModerationPanel
        initialItems={initialDictionaryItems}
        initialPublishedItems={initialPublishedDictionaryItems}
      />

      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-widest text-ugavole-yellow-dark">Yazılar ve içerikler</p>
        <h2 className="mt-1 text-2xl font-black text-ugavole-text">İçerik önerileri</h2>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ugavole-border p-12 text-center text-ugavole-muted">Kuyruk boş.</div>
        )}
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-ugavole-border bg-ugavole-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-ugavole-yellow/20 px-2.5 py-1 text-ugavole-yellow-dark">{STATUS_LABELS[item.status]}</span>
                  <span className="rounded-full bg-ugavole-surface-2 px-2.5 py-1 text-ugavole-muted">{item.type} · {item.category}</span>
                  {item.location && <span className="rounded-full bg-ugavole-surface-2 px-2.5 py-1 text-ugavole-muted">{item.location}</span>}
                </div>
                <h2 className="text-xl font-black text-ugavole-text">{item.title}</h2>
                {item.excerpt && <p className="mt-2 text-sm text-ugavole-body">{item.excerpt}</p>}
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ugavole-body">{item.preview}</p>
                <div className="mt-4 text-xs text-ugavole-muted">
                  <p>Katkıcı: {item.authorName}{item.authorEmail ? ` · ${item.authorEmail}` : ""}</p>
                  <p>Gönderim: {new Date(item.createdAt).toLocaleString("tr-TR")}</p>
                  {item.sourceUrl && <a className="font-bold underline" href={item.sourceUrl} target="_blank" rel="noreferrer">Kaynağı aç</a>}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {item.status === "pending" && (
                  <button type="button" disabled={busyId === item.id} onClick={() => applyAction(item, "review")} className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 disabled:opacity-50">
                    <Eye className="h-4 w-4" /> İncele
                  </button>
                )}
                {(item.status === "pending" || item.status === "in_review") && (
                  <button type="button" disabled={busyId === item.id} onClick={() => applyAction(item, "approve")} className="flex items-center gap-1 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 disabled:opacity-50">
                    <Check className="h-4 w-4" /> Onayla
                  </button>
                )}
                {(item.status === "pending" || item.status === "in_review" || item.status === "approved") && (
                  <button type="button" disabled={busyId === item.id} onClick={() => applyAction(item, "reject")} className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50">
                    <X className="h-4 w-4" /> Reddet
                  </button>
                )}
                {item.status === "approved" && (
                  <>
                    <button type="button" disabled={busyId === item.id} onClick={() => publishItem(item, false, false)} className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-black text-gray-800 disabled:opacity-50">
                      <Send className="h-4 w-4" /> Yayınla
                    </button>
                    <button type="button" disabled={busyId === item.id} onClick={() => publishItem(item, true, false)} className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800 disabled:opacity-50">
                      <BadgeDollarSign className="h-4 w-4" /> Reklamlı yayınla
                    </button>
                    {socialPlatforms.length > 0 && (
                      <button type="button" disabled={busyId === item.id} onClick={() => publishItem(item, true, true)} className="flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-2 text-xs font-black text-purple-800 disabled:opacity-50">
                        <Megaphone className="h-4 w-4" /> Yayınla + paylaş
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
