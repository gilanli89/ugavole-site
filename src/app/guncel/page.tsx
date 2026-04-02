import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { Cloud, TrendingUp, Pill, Star } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Güncel",
  description: "KKTC güncel bilgiler — hava durumu, döviz kurları, nöbetçi eczaneler ve burçlar.",
  path: "/guncel",
});

const BOLUMLER = [
  {
    href: "/guncel/hava-durumu",
    icon: Cloud,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
    baslik: "Hava Durumu",
    aciklama: "Lefkoşa, Girne, Gazimağusa ve tüm KKTC için 5 günlük tahmin",
    badge: "Anlık",
    badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  },
  {
    href: "/guncel/doviz",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    baslik: "Döviz Kurları",
    aciklama: "KKTC güncel döviz kurları — USD, EUR, GBP ve daha fazlası",
    badge: "Güncellendi",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    href: "/guncel/eczaneler",
    icon: Pill,
    iconColor: "text-green-600",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    baslik: "Nöbetçi Eczaneler",
    aciklama: "Bugün nöbetçi eczaneler — Lefkoşa, Girne, Gazimağusa ve diğer şehirler",
    badge: "Bugün",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    href: "/guncel/burclar",
    icon: Star,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    baslik: "Burçlar",
    aciklama: "Günlük burç yorumları — sevgi, kariyer ve sağlık tahminleri",
    badge: "Günlük",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

export default function GuncelPage() {
  const schema = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: "Güncel", url: "https://ugavole.com/guncel" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ugavole-text">Güncel</h1>
        <p className="text-ugavole-muted mt-1">KKTC&apos;den anlık bilgiler ve günlük içerikler</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {BOLUMLER.map((b) => {
          const Icon = b.icon;
          return (
            <Link
              key={b.href}
              href={b.href}
              className="group bg-ugavole-surface border border-ugavole-border rounded-2xl p-6 hover:border-ugavole-yellow hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${b.iconBg} ${b.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h2 className="font-black text-ugavole-text text-base group-hover:text-ugavole-yellow-dark transition-colors">
                      {b.baslik}
                    </h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.badgeColor}`}>
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-ugavole-muted text-sm leading-relaxed">{b.aciklama}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
