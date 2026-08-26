import type { Metadata } from "next";
import BreakingTicker from "@/components/layout/BreakingTicker";
import BuzzFeed from "@/components/news/BuzzFeed";
import AdBanner from "@/components/AdBanner";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import ExchangeWidget from "@/components/widgets/ExchangeWidget";
import PharmacyWidget from "@/components/widgets/PharmacyWidget";
import HeadlinesPanel from "@/components/news/HeadlinesPanel";
import { fetchAllNews } from "@/lib/api/news";
import BuzzCard from "@/components/news/BuzzCard";
import { Sparkles, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Haberler",
  description: "Kıbrıs gündemi ve Ugavole editörlerinin hazırladığı teknoloji, bilim, sağlık, spor, yemek ve magazin içerikleri.",
};

export default async function HaberlerPage() {
  const topArticles = await fetchAllNews().then((a) => a.slice(0, 10)).catch(() => []);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-11">
      <BreakingTicker />

      <div className="mb-8 mt-7 max-w-3xl">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ugavole-yellow-dark"><Sparkles className="h-4 w-4" /> Ada gündemi</p>
        <h1 className="font-editorial text-5xl font-bold leading-none tracking-[-0.035em] text-ugavole-text sm:text-6xl">Son haberler</h1>
        <p className="mt-3 text-sm font-medium text-ugavole-muted sm:text-base">Kıbrıs&apos;tan gündem ve Ugavole editörlerinin hazırladığı teknoloji, bilim, sağlık, spor, yemek ve magazin içerikleri.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Haber akışı */}
        <div className="lg:col-span-2">
          <BuzzFeed />
        </div>

        {/* Sağ: Sidebar */}
        <div className="space-y-5">
          <HeadlinesPanel />
          <AdBanner className="rounded-xl" />
          <WeatherWidget />
          <ExchangeWidget />
          <PharmacyWidget />

          {topArticles.length > 0 && (
            <div className="overflow-hidden rounded-[22px] border border-ugavole-border bg-ugavole-surface shadow-sm">
              <div className="flex items-center gap-2 border-b border-ugavole-border px-5 py-4 text-ugavole-text">
                <Trophy className="w-4 h-4 text-ugavole-yellow" />
                <h2 className="font-editorial text-xl font-bold">Son eklenenler</h2>
              </div>
              <div className="divide-y divide-ugavole-border p-2">
                {topArticles.map((article, i) => (
                  <BuzzCard
                    key={`top-${article.id}-${i}`}
                    article={article}
                    variant="list"
                    rank={i + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
