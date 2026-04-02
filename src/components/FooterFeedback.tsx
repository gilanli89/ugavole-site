"use client";

import { useState } from "react";
import { X, Send, CheckCircle, AlertCircle, Bug, Lightbulb, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TIPLER = [
  { value: "hata",  label: "Hata Bildir", icon: Bug,       color: "text-red-400"    },
  { value: "oneri", label: "Öneri",       icon: Lightbulb, color: "text-yellow-400" },
  { value: "genel", label: "Genel Görüş", icon: ThumbsUp,  color: "text-green-400"  },
];

export default function FooterFeedback() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState("genel");
  const [mesaj, setMesaj] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const sayfa = typeof window !== "undefined" ? window.location.pathname : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaj.trim()) return;
    setStatus("loading");
    try {
      const sb = createClient();
      const { error } = await sb.from("gorusler").insert({
        tip, sayfa, mesaj: mesaj.trim(), email: email.trim() || null,
      });
      if (error) throw error;
      setStatus("ok");
      setMesaj(""); setEmail("");
      setTimeout(() => { setStatus("idle"); setOpen(false); }, 3000);
    } catch {
      setStatus("err");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-ugavole-yellow transition-colors text-left"
      >
        Görüş Bildir
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-ugavole-surface border border-ugavole-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ugavole-border">
              <div>
                <h3 className="font-black text-ugavole-text">Görüş veya hata bildir</h3>
                <p className="text-xs text-ugavole-muted mt-0.5">{sayfa || "/"}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-ugavole-surface-2 transition-colors text-ugavole-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="flex gap-2">
                {TIPLER.map(({ value, label, icon: Icon, color }) => (
                  <button key={value} type="button" onClick={() => setTip(value)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                      tip === value
                        ? "border-[#F5C518] bg-[#F5C518]/10 text-ugavole-text"
                        : "border-ugavole-border text-ugavole-muted hover:border-ugavole-text"
                    }`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                    {label}
                  </button>
                ))}
              </div>
              <div>
                <textarea required rows={4} value={mesaj}
                  onChange={(e) => setMesaj(e.target.value.slice(0, 500))}
                  placeholder="Mesajınızı yazın..."
                  className="w-full bg-ugavole-bg border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors resize-none" />
                <p className="text-xs text-ugavole-muted mt-1 text-right">{mesaj.length}/500</p>
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta (opsiyonel)"
                className="w-full bg-ugavole-bg border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors" />
              <button type="submit" disabled={status === "loading" || !mesaj.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#D4A017] dark:bg-[#F5C518] text-black font-black py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {status === "loading" ? <span className="animate-spin">⏳</span> : <Send className="w-4 h-4" />}
                Gönder
              </button>
              {status === "ok" && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold justify-center">
                  <CheckCircle className="w-4 h-4" /> Teşekkürler, görüşünüz alındı!
                </div>
              )}
              {status === "err" && (
                <div className="flex items-center gap-2 text-red-400 text-sm font-bold justify-center">
                  <AlertCircle className="w-4 h-4" /> Hata oluştu. Tekrar deneyin.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
