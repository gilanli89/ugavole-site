import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchAllNews } from "@/lib/api/news";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { ArrowRight, Trophy, Newspaper } from "lucide-react";
import type { Article } from "@/lib/api/news";

export const metadata: Metadata = buildMetadata({
  title: "Spor",
  description: "KKTC spor haberleri, KTFF Süper Lig puan tablosu, Kıbrıs Türk futbolu ve diğer sporlar.",
  path: "/spor",
});

const KTFF_TAKIM = [
  { sira: 1,  takim: "Mağusa T. Gücü",   o: 26, g: 18, b: 5,  m: 3,  puan: 59 },
  { sira: 2,  takim: "Çetinkaya Türk SK", o: 26, g: 17, b: 4,  m: 5,  puan: 55 },
  { sira: 3,  takim: "Dumlupınar",        o: 26, g: 14, b: 6,  m: 6,  puan: 48 },
  { sira: 4,  takim: "Küçük Kaymaklı",    o: 26, g: 13, b: 7,  m: 6,  puan: 46 },
  { sira: 5,  takim: "Gençlik Gücü",      o: 26, g: 12, b: 5,  m: 9,  puan: 41 },
  { sira: 6,  takim: "Girne Halk Evi",    o: 26, g: 10, b: 8,  m: 8,  puan: 38 },
  { sira: 7,  takim: "Ozanköy",           o: 26, g: 10, b: 7,  m: 9,  puan: 37 },
  { sira: 8,  takim: "L. Kaymaklı",       o: 26, g: 9,  b: 7,  m: 10, puan: 34 },
  { sira: 9,  takim: "Lapta SK",          o: 26, g: 8,  b: 6,  m: 12, puan: 30 },
  { sira: 10, takim: "Aloa FK",           o: 26, g: 7,  b: 5,  m: 14, puan: 26 },
  { sira: 11, takim: "Cihangir",          o: 26, g: 6,  b: 5,  m: 15, puan: 23 },
  { sira: 12, takim: "Akdoğan",           o: 26, g: 5,  b: 6,  m: 15, puan: 21 },
  { sira: 13, takim: "Binatlı",           o: 26, g: 4,  b: 5,  m: 17, puan: 17 },
  { sira: 14, takim: "Baf Ülkü Yurdu",   o: 26, g: 3,  b: 4,  m: 19, puan: 13 },
];

function articleSlug(a: Article) {
  return a.source_url.replace(/\/$/, "").split("/").pop()!;
}

export default async function SporPage() {
  const allArticles = await fetchAllNews().catch(() => []);
  const sporHaberleri = allArticles
    .filter((a) => a.category.toLowerCase() === "spor")
    .slice(0, 6);

  const schema = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: "Spor", url: "https://ugavole.com/spor" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ugavole-text">Spor</h1>
        <p className="text-ugavole-muted mt-1">KKTC spor haberleri ve KTFF Süper Lig puan tablosu</p>
      </div>

      {/* KTFF Puan Tablosu — her zaman tam genişlikte */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="w-5 h-5 text-ugavole-yellow" />
          <h2 className="font-black text-ugavole-text text-lg uppercase tracking-wide">KTFF Süper Lig 2024–25</h2>
        </div>

        <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden">
          <div className="bg-[#1A1A1A] px-5 py-3 flex items-center justify-between">
            <p className="text-white font-black text-sm">Puan Tablosu</p>
            <p className="text-gray-400 text-xs">2024–25 Sezonu</p>
          </div>

          {/* Başlıklar */}
          <div className="grid grid-cols-[32px_1fr_40px_40px_40px_40px_44px] px-4 py-2.5 bg-ugavole-surface-2 border-b border-ugavole-border text-xs font-bold text-ugavole-muted uppercase tracking-wide">
            <span>#</span>
            <span>Takım</span>
            <span className="text-center">O</span>
            <span className="text-center">G</span>
            <span className="text-center">B</span>
            <span className="text-center">M</span>
            <span className="text-center">P</span>
          </div>

          <div className="divide-y divide-ugavole-border">
            {KTFF_TAKIM.map((row) => {
              const isTop3    = row.sira <= 3;
              const isBottom2 = row.sira >= 13;
              return (
                <div
                  key={row.sira}
                  className={`grid grid-cols-[32px_1fr_40px_40px_40px_40px_44px] px-4 py-3 text-sm items-center ${
                    isTop3 ? "bg-emerald-950/20" : isBottom2 ? "bg-red-950/20" : ""
                  }`}
                >
                  <span className={`text-xs font-black ${isTop3 ? "text-emerald-400" : isBottom2 ? "text-red-400" : "text-ugavole-muted"}`}>
                    {row.sira}
                  </span>
                  <span className="font-bold text-ugavole-text text-sm">{row.takim}</span>
                  <span className="text-center text-xs text-ugavole-muted">{row.o}</span>
                  <span className="text-center text-xs text-ugavole-muted">{row.g}</span>
                  <span className="text-center text-xs text-ugavole-muted">{row.b}</span>
                  <span className="text-center text-xs text-ugavole-muted">{row.m}</span>
                  <span className="text-center text-sm font-black text-ugavole-text">{row.puan}</span>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-ugavole-border flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-ugavole-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Avrupa
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ugavole-muted">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Düşme hattı
            </span>
            <span className="text-xs text-ugavole-muted ml-auto">Kaynak: ktff.org</span>
          </div>
        </div>
      </section>

      {/* Spor Haberleri */}
      {sporHaberleri.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Newspaper className="w-5 h-5 text-ugavole-yellow" />
            <h2 className="font-black text-ugavole-text text-lg uppercase tracking-wide">Spor Haberleri</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sporHaberleri.map((article) => {
              const slug = articleSlug(article);
              return (
                <Link
                  key={article.id}
                  href={`/haber/${slug}`}
                  className="group bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden hover:border-ugavole-yellow hover:shadow-lg transition-all"
                >
                  {article.cover_image && (
                    <div className="relative h-40 overflow-hidden">
                      <Image src={article.cover_image} alt={article.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-black text-ugavole-text text-sm leading-snug line-clamp-3 group-hover:text-ugavole-yellow-dark transition-colors mb-2">
                      {article.title}
                    </h3>
                    <span className="text-ugavole-yellow-dark text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Devamını oku <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
