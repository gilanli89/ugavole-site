"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import type { Article } from "@/lib/api/news";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { label: "Tümü", value: "tumu" },
  { label: "Gündem", value: "gundem" },
  { label: "Siyaset", value: "siyaset" },
  { label: "Ekonomi", value: "ekonomi" },
  { label: "Spor", value: "spor" },
  { label: "Kültür", value: "kultur" },
];

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("tumu");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const load = async (cat: string, pg: number, reset = false) => {
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
  };

  useEffect(() => {
    setPage(1);
    load(category, 1, true);
  }, [category]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(category, next);
  };

  const [featured, ...rest] = articles;

  return (
    <div>
      {/* Kategori sekmeleri */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.value
                ? "bg-red-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <span className="text-sm">Haberler yükleniyor...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Bu kategoride haber bulunamadı.</p>
        </div>
      ) : (
        <>
          {/* Öne çıkan haber */}
          {featured && (
            <div className="mb-6">
              <ArticleCard article={featured} variant="featured" />
            </div>
          )}

          {/* Haber grid'i */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {rest.map((article, i) => (
              <ArticleCard key={`${article.id}-${i}`} article={article} />
            ))}
          </div>

          {/* Daha fazla yükle */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  `Daha fazla haber (${total - articles.length} kaldı)`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
