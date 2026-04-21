"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: "", email: "", konu: "", mesaj: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mesaj.trim() || !form.ad.trim()) return;
    setStatus("loading");
    try {
      const sb = createClient();
      const { error } = await sb.from("gorusler").insert({
        tip: "iletisim",
        sayfa: "/iletisim",
        mesaj: `Ad: ${form.ad}\nKonu: ${form.konu}\n\n${form.mesaj}`,
        email: form.email || null,
      });
      if (error) throw error;
      setStatus("ok");
      setForm({ ad: "", email: "", konu: "", mesaj: "" });
    } catch {
      setStatus("err");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-ugavole-text mb-2">İletişim</h1>
      <p className="text-ugavole-muted mb-8">Görüş, öneri veya işbirliği teklifi için bize yazın.</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ugavole-text mb-1.5">Ad Soyad *</label>
            <input
              type="text"
              required
              value={form.ad}
              onChange={(e) => setForm((p) => ({ ...p, ad: e.target.value }))}
              className="w-full bg-ugavole-surface border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ugavole-text mb-1.5">E-posta</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-ugavole-surface border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors"
              placeholder="ornek@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-ugavole-text mb-1.5">Konu</label>
          <input
            type="text"
            value={form.konu}
            onChange={(e) => setForm((p) => ({ ...p, konu: e.target.value }))}
            className="w-full bg-ugavole-surface border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors"
            placeholder="Konunuz"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-ugavole-text mb-1.5">
            Mesaj * <span className="text-ugavole-muted font-normal">({form.mesaj.length}/1000)</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.mesaj}
            onChange={(e) => setForm((p) => ({ ...p, mesaj: e.target.value.slice(0, 1000) }))}
            className="w-full bg-ugavole-surface border border-ugavole-border focus:border-[#F5C518] rounded-xl px-4 py-3 text-ugavole-text text-sm outline-none transition-colors resize-none"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-2 bg-[#D4A017] dark:bg-[#F5C518] text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Send className="w-4 h-4" />
          )}
          Gönder
        </button>

        {status === "ok" && (
          <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            Mesajınız alındı, teşekkürler!
          </div>
        )}
        {status === "err" && (
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
            <AlertCircle className="w-4 h-4" />
            Hata oluştu. Lütfen tekrar deneyin.
          </div>
        )}
      </form>

      {/* Sosyal medya */}
      <div className="border-t border-ugavole-border pt-8">
        <h2 className="font-black text-ugavole-text mb-4">Sosyal Medyada Bul</h2>
        <div className="flex flex-wrap gap-3">
          <a href="https://facebook.com/ugavole" target="_blank" rel="noopener noreferrer"
             className="text-ugavole-body hover:text-[#1877F2] transition-colors text-sm font-bold">
            Facebook →
          </a>
          <a href="https://instagram.com/ugavole.cyp" target="_blank" rel="noopener noreferrer"
             className="text-ugavole-body hover:text-[#E1306C] transition-colors text-sm font-bold">
            Instagram →
          </a>
          <a href="https://youtube.com/ugavole" target="_blank" rel="noopener noreferrer"
             className="text-ugavole-body hover:text-[#FF0000] transition-colors text-sm font-bold">
            YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}
