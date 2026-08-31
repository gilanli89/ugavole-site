"use client";

import { useState } from "react";
import { BookOpen, Check, Eye, ShieldAlert, X } from "lucide-react";
import type {
  DictionaryModerationItemDTO,
  PublishedDictionaryModerationItemDTO,
} from "@/lib/data/dictionary";

const STATUS_LABELS: Record<DictionaryModerationItemDTO["status"], string> = {
  pending: "Bekliyor",
  in_review: "İnceleniyor",
};

export default function DictionaryModerationPanel({
  initialItems,
  initialPublishedItems,
}: {
  initialItems: DictionaryModerationItemDTO[];
  initialPublishedItems: PublishedDictionaryModerationItemDTO[];
}) {
  const [items, setItems] = useState(initialItems);
  const [publishedItems, setPublishedItems] = useState(initialPublishedItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function applyAction(
    item: DictionaryModerationItemDTO,
    action: "review" | "approve" | "reject"
  ) {
    const note = action === "reject" ? window.prompt("Ret nedenini yazın:")?.trim() : "";
    if (action === "reject" && (!note || note.length < 3)) return;

    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/sozluk/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note, contentVersion: item.contentVersion }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Sözlük işlemi uygulanamadı");
        return;
      }

      if (action === "approve" || action === "reject") {
        setItems((current) => current.filter((candidate) => candidate.id !== item.id));
      } else {
        setItems((current) => current.map((candidate) =>
          candidate.id === item.id ? { ...candidate, status: "in_review" } : candidate
        ));
      }
    } catch {
      setError("Sözlük moderasyon servisine ulaşılamadı");
    } finally {
      setBusyId(null);
    }
  }

  async function unpublishItem(item: PublishedDictionaryModerationItemDTO) {
    const note = window.prompt("Yayından kaldırma nedenini yazın:")?.trim();
    if (!note || note.length < 3) return;

    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/sozluk/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unpublish",
          note,
          contentVersion: item.contentVersion,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Kelime yayından kaldırılamadı");
        return;
      }

      setPublishedItems((current) =>
        current.filter((candidate) => candidate.id !== item.id)
      );
    } catch {
      setError("Sözlük moderasyon servisine ulaşılamadı");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mb-10" aria-labelledby="dictionary-moderation-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ugavole-yellow-dark">
            <BookOpen className="h-4 w-4" /> Kıbrıslıca sözlük
          </p>
          <h2 id="dictionary-moderation-title" className="mt-1 text-2xl font-black text-ugavole-text">Sözlük önerileri</h2>
          <p className="mt-1 text-sm text-ugavole-muted">Onaylanan madde doğrudan sözlükte yayınlanır; haber veya sosyal paylaşım akışına girmez.</p>
        </div>
        <span className="rounded-full bg-ugavole-yellow/20 px-3 py-1.5 text-xs font-black text-ugavole-yellow-dark">
          {items.length} işlem bekliyor
        </span>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <ShieldAlert className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ugavole-border p-8 text-center text-sm text-ugavole-muted">
            Bekleyen sözlük önerisi yok.
          </div>
        )}

        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-ugavole-border bg-ugavole-surface p-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-ugavole-yellow/20 px-2.5 py-1 text-ugavole-yellow-dark">{STATUS_LABELS[item.status]}</span>
                  <span className="rounded-full bg-ugavole-surface-2 px-2.5 py-1 capitalize text-ugavole-muted">{item.category}</span>
                  <span className="text-ugavole-muted">{new Date(item.createdAt).toLocaleString("tr-TR")}</span>
                </div>
                <h3 className="text-xl font-black text-ugavole-text">{item.word}</h3>
                {item.aliases.length > 0 && <p className="mt-1 text-xs text-ugavole-muted">Alternatifler: {item.aliases.join(", ")}</p>}
                <p className="mt-3 text-sm font-semibold leading-6 text-ugavole-body">{item.definition}</p>
                {item.example && (
                  <p className="mt-2 border-l-2 border-ugavole-yellow pl-3 text-sm italic leading-6 text-ugavole-muted">&quot;{item.example}&quot;</p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {item.status === "pending" && (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => applyAction(item, "review")}
                    className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4" /> İncele
                  </button>
                )}
                {(item.status === "pending" || item.status === "in_review") && (
                  <>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => applyAction(item, "approve")}
                      className="flex items-center gap-1 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" /> Onayla ve yayınla
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => applyAction(item, "reject")}
                      className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" /> Reddet
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 border-t border-ugavole-border pt-8" aria-labelledby="published-dictionary-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-ugavole-muted">Topluluk sözlüğü</p>
            <h3 id="published-dictionary-title" className="mt-1 text-xl font-black text-ugavole-text">Son yayınlanan kelimeler</h3>
            <p className="mt-1 text-sm text-ugavole-muted">En son yayınlanan 100 topluluk maddesi. Yayından kaldırma işlemi AAL2 oturum ve zorunlu gerekçe ister.</p>
          </div>
          <span className="rounded-full bg-ugavole-surface-2 px-3 py-1.5 text-xs font-black text-ugavole-muted">
            {publishedItems.length} yayın
          </span>
        </div>

        <div className="space-y-3">
          {publishedItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ugavole-border p-7 text-center text-sm text-ugavole-muted">
              Yayınlanmış topluluk kelimesi yok.
            </div>
          )}

          {publishedItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-ugavole-border bg-ugavole-surface p-5">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Yayında</span>
                    <span className="rounded-full bg-ugavole-surface-2 px-2.5 py-1 capitalize text-ugavole-muted">{item.category}</span>
                    <span className="text-ugavole-muted">{new Date(item.publishedAt).toLocaleString("tr-TR")}</span>
                  </div>
                  <h4 className="text-lg font-black text-ugavole-text">{item.word}</h4>
                  {item.aliases.length > 0 && <p className="mt-1 text-xs text-ugavole-muted">Alternatifler: {item.aliases.join(", ")}</p>}
                  <p className="mt-2 text-sm leading-6 text-ugavole-body">{item.definition}</p>
                  {item.example && <p className="mt-2 text-sm italic leading-6 text-ugavole-muted">&quot;{item.example}&quot;</p>}
                </div>

                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => unpublishItem(item)}
                  className="flex shrink-0 items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"
                >
                  <X className="h-4 w-4" /> Yayından kaldır
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
