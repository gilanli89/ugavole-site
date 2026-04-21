"use client";

import { useEffect, useState, useCallback } from "react";
import BuzzCard from "./BuzzCard";
import AdBanner from "@/components/AdBanner";
import type { Article } from "@/lib/api/news";
import { Loader2, TrendingUp, Sparkles, RefreshCw } from "lucide-react";

const TABS = [
  { label: "🔥 Tümü", value: "tumu" },
  { label: "⚡ Gündem", value: "gundem" },
  { label: "💰 Ekonomi", value: "ekonomi" },
  { label: "⚽ Spor", value: "spor" },
  { label: "🎭 Kültür", value: "kultur" },
  { label: "🤣 Eğlence", value: "eglence" },
];

export default function BuzzFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tumu");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (cat: string, pg: number, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/haberler?kategori=${cat}&sayfa=${pg}`);
      const data = await res.json();
      setArticles((prev) => (reset ? data.articles : [...prev, ...data.articles]));
      setTotal(data.total);
      setHasMore(pg * data.perPage < data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(tab, 1, true);
  }, [tab, load]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(tab, next);
  };

  const [hero, ...rest] = articles;
  const trending = rest.slice(0, 4);
  const grid = rest.slice(4);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              tab === t.value
                ? "bg-ugavole-yellow text-black shadow-sm"
                : "bg-ugavole-surface text-ugavole-body hover:bg-ugavole-surface-2 border border-ugavole-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-ugavole-yellow" />
          <span className="text-sm font-medium">Haberler yükleniyor...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Haber bulunamadı.</div>
      ) : (
        <>
          {hero && (
            <div className="mb-6">
              <BuzzCard article={hero} variant="hero" />
            </div>
          )}

          {trending.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-ugavole-yellow-dark" />
                <h2 className="font-black text-sm uppercase tracking-wider text-gray-600">Trend</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {trending.map((a, i) => (
                  <BuzzCard key={`trend-${a.id}-${i}`} article={a} variant="card" />
                ))}
              </div>
            </div>
          )}

          {/* UGC bandı */}
          <div className="my-6 bg-ugavole-text rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-ugavole-yellow" />
                <span className="text-white font-black text-sm uppercase tracking-wider">Haberi sen yaz!</span>
              </div>
              <p className="text-gray-400 text-sm">
                Kıbrıs&apos;ta ne oluyor? Toplulukla paylaş, sesini duyur.
              </p>
            </div>
            <a
              href="/haber-yukle"
              className="flex-shrink-0 bg-ugavole-yellow text-black px-5 py-2.5 rounded-full font-black text-sm hover:bg-ugavole-yellow-dark transition-colors whitespace-nowrap"
            >
              ✍️ Paylaş
            </a>
          </div>

          {/* Reklam — UGC bandı altı */}
          <AdBanner className="mb-6 rounded-xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {grid.map((a, i) => {
              const showAd = i > 0 && i % 6 === 0;
              return (
                <>
                  {showAd && (
                    <div key={`ad-${i}`} className="sm:col-span-2 lg:col-span-3">
                      <AdBanner className="rounded-xl" />
                    </div>
                  )}
                  <BuzzCard key={`grid-${a.id}-${i}`} article={a} variant="card" />
                </>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3.5 bg-ugavole-text text-ugavole-bg rounded-full text-sm font-black hover:bg-ugavole-yellow hover:text-black transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...</>
                ) : (
                  <><RefreshCw className="w-4 h-4" /> Daha fazla ({total - articles.length})</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
