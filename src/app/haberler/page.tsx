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
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Haberler",
  description: "Kuzey Kıbrıs'tan güncel haberler. Gündem, siyaset, ekonomi, spor ve daha fazlası.",
};

export default async function HaberlerPage() {
  const topArticles = await fetchAllNews().then((a) => a.slice(0, 10)).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BreakingTicker />

      <div className="mb-6">
        <h1 className="text-[#1A1A1A] font-black text-3xl">Son Haberler</h1>
        <p className="text-gray-500 text-sm mt-1">Kuzey ve Güney Kıbrıs&apos;tan dakika dakika gelişmeler</p>
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
            <div className="bg-white rounded-2xl border border-[#E8E8E0] overflow-hidden shadow-sm">
              <div className="bg-[#1A1A1A] text-white px-4 py-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-ugavole-yellow" />
                <h2 className="font-black text-sm uppercase tracking-wider">En Çok Okunanlar</h2>
              </div>
              <div className="p-2 divide-y divide-[#E8E8E0]">
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
