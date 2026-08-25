"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export default function FooterFeedback() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left text-sm text-gray-400 transition-colors hover:text-ugavole-yellow"
      >
        Görüş Bildir
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Pencereyi kapat"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="relative w-full max-w-md rounded-2xl border border-ugavole-border bg-ugavole-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ugavole-border px-5 py-4">
              <h3 id="feedback-title" className="font-black text-ugavole-text">
                Görüş bildir
              </h3>
              <button
                type="button"
                aria-label="Pencereyi kapat"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-ugavole-muted transition-colors hover:bg-ugavole-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex gap-3 rounded-xl border border-ugavole-border bg-ugavole-bg p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ugavole-yellow" />
                <div>
                  <p className="text-sm font-bold text-ugavole-text">
                    Güvenli geri bildirim akışı hazırlanıyor.
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ugavole-muted">
                    Mesaj ve e-posta bilgisi şu anda bu pencereden alınmıyor. Form hazır olduğunda burada açılacak.
                  </p>
                </div>
              </div>
              <Link
                href="/iletisim"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex text-sm font-bold text-ugavole-yellow transition-opacity hover:opacity-80"
              >
                İletişim durumunu gör →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
