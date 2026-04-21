"use client";

import { useState } from "react";
import { Upload, ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

const CATEGORIES = ["Gündem", "Siyaset", "Ekonomi", "Spor", "Kültür", "Teknoloji", "Diğer"];

type Status = "idle" | "loading" | "success" | "error";

export default function UGCForm() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Gündem",
    author_name: "",
    author_email: "",
    source_url: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // Supabase entegrasyonu eklenince buraya bağlanacak
      // Şimdilik simüle ediyoruz
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("success");
      setForm({
        title: "",
        excerpt: "",
        content: "",
        category: "Gündem",
        author_name: "",
        author_email: "",
        source_url: "",
      });
    } catch {
      setStatus("error");
      setErrorMsg("Haber gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-green-800 mb-2">Haberiniz Alındı!</h3>
        <p className="text-sm text-green-700 mb-4">
          Haberiniz editörlerimiz tarafından incelendikten sonra yayınlanacaktır.
          Genellikle 2-4 saat içinde değerlendirilir.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          Yeni Haber Gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Haber Başlığı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Haberinizin başlığını yazın..."
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kaynak URL <span className="text-gray-400 font-normal">(opsiyonel)</span>
          </label>
          <input
            type="url"
            value={form.source_url}
            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kısa Özet
          </label>
          <input
            type="text"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Haberin kısa özeti (isteğe bağlı)..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Haber İçeriği <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Haberinizin detaylı içeriğini buraya yazın..."
            required
            rows={6}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 resize-none"
          />
        </div>

        {/* Görsel yükleme (placeholder) */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kapak Görseli <span className="text-gray-400 font-normal">(opsiyonel)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors cursor-pointer">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Görsel yüklemek için tıklayın veya sürükleyin
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — Maks. 5MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Adınız
          </label>
          <input
            type="text"
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            placeholder="Adınız Soyadınız"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            E-posta
          </label>
          <input
            type="email"
            value={form.author_email}
            onChange={(e) => setForm({ ...form, author_email: e.target.value })}
            placeholder="ornek@email.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
        <strong>Not:</strong> Gönderilen haberler editörlerimiz tarafından incelenir. Yanıltıcı, hakaret
        içeren veya telif hakkı ihlali olan içerikler yayınlanmaz.
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !form.title || !form.content}
        className="w-full py-3 bg-red-700 text-white rounded-xl font-semibold text-sm hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {status === "loading" ? "Gönderiliyor..." : "Haberi Gönder"}
      </button>
    </form>
  );
}
