"use client";

import { useEffect, useState, useCallback } from "react";
import { formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/lib/api/news";
import { RefreshCw, ExternalLink, Clock, Globe } from "lucide-react";

type Region = "tumu" | "kuzey" | "guney" | "dunya";

const REGIONS: { label: string; value: Region; flag: string; desc: string }[] = [
  { label: "Tümü",         value: "tumu",  flag: "🌍", desc: "Tüm Kıbrıs" },
  { label: "Kuzey Kıbrıs", value: "kuzey", flag: "🇹🇷", desc: "KKTC — Türkçe" },
  { label: "Güney Kıbrıs", value: "guney", flag: "🇨🇾", desc: "RoC — EN / EL" },
  { label: "Dünya",        value: "dunya", flag: "🌐", desc: "Uluslararası" },
];

const SOURCE_COLORS: Record<string, string> = {
  "Havadis Kıbrıs":  "bg-red-100 text-red-700",
  "Kıbrıs Gazetesi": "bg-orange-100 text-orange-700",
  "Detay Kıbrıs":    "bg-amber-100 text-amber-700",
  "Yeni Düzen":      "bg-yellow-100 text-yellow-800",
  "Cyprus Mail":     "bg-blue-100 text-blue-700",
  "In-Cyprus":       "bg-sky-100 text-sky-700",
  "Politis":         "bg-indigo-100 text-indigo-700",
  "Philenews":       "bg-violet-100 text-violet-700",
  "Reporter CY":     "bg-purple-100 text-purple-700",
};

const LANG_BADGE: Record<string, string> = {
  tr: "TR",
  en: "EN",
  el: "ΕΛ",
};

export default function HeadlinesPanel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [region, setRegion] = useState<Region>("tumu");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const load = useCallback(async (r: Region) => {
    setLoading(true);
    setVisibleCount(10);
    try {
      const param = r === "tumu" ? "" : `?bolge=${r}`;
      const res = await fetch(`/api/haberler/headlines${param}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(region); }, [region, load]);

  // 5 dakikada bir otomatik yenile
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => load(region), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [region, autoRefresh, load]);

  const visibleArticles = articles.slice(0, visibleCount);
  const grouped = visibleArticles.reduce<Record<string, Article[]>>((acc, a) => {
    const key = a.source_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div className="bg-ugavole-surface rounded-2xl border border-ugavole-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-950 text-white px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-400" />
            <h2 className="font-black text-sm uppercase tracking-wider">Kıbrıs Başlıkları</h2>
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-gray-400" />}
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastUpdate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={() => load(region)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Yenile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bölge filtreleri */}
        <div className="flex gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                region === r.value
                  ? "bg-ugavole-yellow text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <span>{r.flag}</span>
              <span>{r.label}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <span>{articles.length} başlık</span>
          </div>
        </div>
      </div>

      {/* İçerik — kaynağa göre gruplu */}
      <div className="max-h-[600px] overflow-y-auto divide-y divide-ugavole-border">
        {loading && articles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
            Haberler çekiliyor...
          </div>
        ) : (
          Object.entries(grouped).map(([source, items]) => (
            <div key={source}>
              {/* Kaynak başlığı */}
              <div className="sticky top-0 bg-ugavole-surface-2 border-b border-ugavole-border px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${SOURCE_COLORS[source] ?? "bg-gray-100 text-gray-600"}`}>
                    {source}
                  </span>
                  {items[0]?.lang && (
                    <span className="text-xs text-gray-400 font-mono">
                      {LANG_BADGE[items[0].lang]}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{items.length} haber</span>
              </div>

              {/* Haberler */}
              <ul>
                {items.map((article, i) => (
                  <li key={`${article.id}-${i}`}>
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-ugavole-surface-2 transition-colors group"
                    >
                      <span className="text-xs text-ugavole-muted font-mono mt-0.5 flex-shrink-0 w-4">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ugavole-body group-hover:text-ugavole-yellow-dark transition-colors leading-snug line-clamp-2">
                          {article.title}
                        </p>
                        <span className="text-xs text-gray-400 mt-0.5 block">
                          {formatRelativeTime(article.published_at)}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-ugavole-muted group-hover:text-ugavole-yellow-dark flex-shrink-0 mt-0.5 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Daha fazla */}
      {visibleCount < articles.length && (
        <button
          onClick={() => setVisibleCount((n) => n + 10)}
          className="w-full py-2.5 text-xs font-bold text-ugavole-yellow hover:bg-ugavole-surface-2 transition-colors border-t border-ugavole-border"
        >
          Daha fazla göster ({articles.length - visibleCount} kaldı)
        </button>
      )}

      {/* Footer */}
      <div className="border-t border-ugavole-border px-4 py-2.5 flex items-center justify-between bg-ugavole-surface-2">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-ugavole-yellow"
          />
          Her 5 dakikada yenile
        </label>
        <span className="text-xs text-gray-400">
          {REGIONS.find((r) => r.value === region)?.desc}
        </span>
      </div>
    </div>
  );
}
