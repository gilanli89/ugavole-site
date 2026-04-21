"use client";

import { useState, useMemo } from "react";
import { Search, RotateCcw, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { sozlukData, kategoriler, type SozlukEntry } from "@/lib/sozluk-data";

const ZORLUK_COLORS = {
  kolay: "text-green-400 bg-green-400/10",
  orta: "text-yellow-400 bg-yellow-400/10",
  zor: "text-red-400 bg-red-400/10",
};

const KATEGORI_COLORS: Record<string, string> = {
  günlük:        "bg-blue-600/20 text-blue-300",
  argo:          "bg-red-600/20 text-red-300",
  deyim:         "bg-purple-600/20 text-purple-300",
  "anlam farkı": "bg-orange-600/20 text-orange-300",
  ünlem:         "bg-green-600/20 text-green-300",
  yemek:         "bg-amber-600/20 text-amber-300",
  kültür:        "bg-pink-600/20 text-pink-300",
  sevgi:         "bg-rose-600/20 text-rose-300",
  doğa:          "bg-emerald-600/20 text-emerald-300",
  alet:          "bg-slate-600/20 text-slate-300",
  araç:          "bg-cyan-600/20 text-cyan-300",
  mekan:         "bg-indigo-600/20 text-indigo-300",
};

const GUNUN_KELIMESI = sozlukData.find((k) => k.id === 5)!;

function FlipCard({ entry }: { entry: SozlukEntry }) {
  const [flipped, setFlipped] = useState(false);
  const [quizState, setQuizState] = useState<"idle" | "known" | "unknown">("idle");

  return (
    <div className="perspective-1000">
      <div
        className={`relative h-52 cursor-pointer transition-transform duration-500 transform-style-3d ${flipped ? "rotate-y-180" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease",
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Ön yüz */}
        <div
          className="absolute inset-0 bg-white dark:bg-ugavole-surface border border-ugavole-yellow/30 rounded-2xl p-5 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-start justify-between">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${KATEGORI_COLORS[entry.kategori] ?? "bg-gray-600/20 text-gray-300"}`}>
              {entry.kategori}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ZORLUK_COLORS[entry.zorluk]}`}>
              {entry.zorluk}
            </span>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-2">{entry.emoji}</div>
            <h3 className="text-ugavole-yellow font-black text-2xl leading-tight">{entry.kibrisca}</h3>
          </div>

          <p className="text-xs text-gray-500 text-center">Anlamı için tıkla →</p>
        </div>

        {/* Arka yüz */}
        <div
          className="absolute inset-0 bg-gray-50 dark:bg-ugavole-surface-2 border border-ugavole-yellow/50 rounded-2xl p-5 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <p className="text-gray-900 dark:text-white font-black text-lg leading-snug mb-2">{entry.anlam}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">&quot;{entry.cumle}&quot;</p>
          </div>

          {quizState === "idle" ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setQuizState("known"); }}
                className="flex-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-xl py-2 text-sm font-bold hover:bg-green-600/30 transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-4 h-4" /> Biliyorum
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setQuizState("unknown"); }}
                className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl py-2 text-sm font-bold hover:bg-red-600/30 transition-colors flex items-center justify-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Bilmiyorum
              </button>
            </div>
          ) : (
            <div className={`rounded-xl py-2 text-sm font-bold text-center ${quizState === "known" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
              {quizState === "known" ? "✅ Harika!" : "📚 Bir dahaki sefere!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SozlukPage() {
  const [search, setSearch] = useState("");
  const [aktifKategori, setAktifKategori] = useState<string>("tümü");
  const [quizScores, setQuizScores] = useState({ known: 0, unknown: 0 });

  const filtered = useMemo(() => {
    return sozlukData.filter((entry) => {
      const matchesSearch =
        search === "" ||
        entry.kibrisca.toLowerCase().includes(search.toLowerCase()) ||
        entry.anlam.toLowerCase().includes(search.toLowerCase());
      const matchesKategori =
        aktifKategori === "tümü" || entry.kategori === aktifKategori;
      return matchesSearch && matchesKategori;
    });
  }, [search, aktifKategori]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero: Günün Kelimesi */}
      <div className="bg-white dark:bg-ugavole-surface border-2 border-ugavole-yellow/50 rounded-3xl p-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-ugavole-yellow/10 text-ugavole-yellow text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          Günün Kelimesi
        </div>
        <div className="text-6xl mb-4">{GUNUN_KELIMESI.emoji}</div>
        <h1 className="text-ugavole-yellow font-black text-5xl mb-3">{GUNUN_KELIMESI.kibrisca}</h1>
        <p className="text-gray-900 dark:text-gray-100 text-xl mb-2">{GUNUN_KELIMESI.anlam}</p>
        <p className="text-gray-500 dark:text-gray-400 text-base italic">&quot;{GUNUN_KELIMESI.cumle}&quot;</p>
      </div>

      {/* Başlık */}
      <div className="mb-6">
        <h2 className="text-gray-900 dark:text-white font-black text-3xl mb-1">🗣️ Kıbrıslıca Sözlük</h2>
        <p className="text-gray-500">Kuzey Kıbrıs ağzını öğren, eğlen, paylaş</p>
      </div>

      {/* Arama + Filtre */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kelime veya anlam ara..."
            className="w-full bg-ugavole-surface border border-ugavole-border focus:border-ugavole-yellow rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-ugavole-surface border border-ugavole-border text-gray-400 rounded-xl text-sm hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Temizle
          </button>
        )}
      </div>

      {/* Kategori filtreleri */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {["tümü", ...kategoriler].map((kat) => (
          <button
            key={kat}
            onClick={() => setAktifKategori(kat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all capitalize ${
              aktifKategori === kat
                ? "bg-ugavole-yellow text-black"
                : "bg-ugavole-surface text-gray-400 hover:bg-ugavole-surface-2 border border-ugavole-border"
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Sonuç sayısı */}
      <p className="text-gray-500 text-sm mb-4">{filtered.length} kelime bulundu</p>

      {/* Kart grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <FlipCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>Bu arama için kelime bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
