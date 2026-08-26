import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchAllNews } from "@/lib/api/news";
import { breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { ArrowRight, Trophy, Newspaper } from "lucide-react";
import type { Article } from "@/lib/api/news";

export const metadata: Metadata = {
  title: "KKTC Spor Haberleri | Kuzey Kıbrıs Futbolu | ugavole",
  description:
    "Kuzey Kıbrıs spor haberleri, Kıbrıs Türk futbolu ve KTFF gelişmeleri. Güncel puan durumu ve fikstür için resmi KTFF kaynağına yönlendiririz.",
  keywords: [
    "KTFF Süper Lig puan tablosu",
    "KKTC spor haberleri",
    "Kuzey Kıbrıs futbol",
    "Kıbrıs Türk futbolu",
    "KKTC futbol",
    "KTFF puan durumu",
    "Kuzey Kıbrıs spor",
  ],
  alternates: { canonical: "https://ugavole.com/spor" },
  openGraph: {
    title: "KKTC Spor Haberleri | ugavole",
    description:
      "Kuzey Kıbrıs spor haberleri ve Kıbrıs Türk futbolundan gelişmeler.",
    url: "https://ugavole.com/spor",
    siteName: "ugavole",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KKTC Spor Haberleri | ugavole",
    description: "Kuzey Kıbrıs spor haberleri ve Kıbrıs Türk futbolundan gelişmeler.",
  },
};

function articleSlug(a: Article) {
  return a.source_url.replace(/\/$/, "").split("/").pop()!;
}

function buildSchemas() {
  const breadcrumb = breadcrumbSchema([
    { name: "Ana Sayfa", url: "https://ugavole.com" },
    { name: "Spor", url: "https://ugavole.com/spor" },
  ]);

  const sportsOrg = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "KTFF — Kıbrıs Türk Futbol Federasyonu",
    "url": "https://ktff.org",
    "sport": "Soccer",
    "location": {
      "@type": "Place",
      "name": "Kuzey Kıbrıs Türk Cumhuriyeti",
      "addressCountry": "CY",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Güncel KTFF Süper Lig puan tablosunu nereden takip edebilirim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puan durumu ve fikstür sezon içinde değiştiği için güncel bilgiyi Kıbrıs Türk Futbol Federasyonu'nun resmi kanallarından kontrol etmek gerekir. Ugavole doğrulanmış kaynakla canlı veri entegrasyonu tamamlanana kadar statik tablo yayınlamaz.",
        },
      },
      {
        "@type": "Question",
        "name": "KKTC'de futbol ligi nasıl işliyor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kuzey Kıbrıs'ta futbol Kıbrıs Türk Futbol Federasyonu (KTFF) tarafından organize edilmektedir. En üst lig KTFF Süper Lig olup 14 takımdan oluşmaktadır. KTFF, FIFA ve UEFA üyesi olmayıp CONIFA bünyesinde uluslararası turnuvalara katılmaktadır.",
        },
      },
      {
        "@type": "Question",
        "name": "Ugavole'de KKTC spor sayfasında neler var?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ugavole, Kuzey Kıbrıs'taki spor gelişmelerini bir araya getirir. Canlı fikstür ve puan tablosu ancak kaynak ve güncelleme akışı doğrulandıktan sonra eklenir.",
        },
      },
    ],
  };

  return [breadcrumb, sportsOrg, faq];
}

export default async function SporPage() {
  const allArticles = await fetchAllNews().catch(() => []);
  const sporHaberleri = allArticles
    .filter((a) => a.category.toLowerCase() === "spor")
    .slice(0, 6);

  const schemas = buildSchemas();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(s) }} />
      ))}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-ugavole-text">KKTC Spor Haberleri</h1>
        <p className="text-ugavole-muted mt-1">Kuzey Kıbrıs&apos;tan spor gelişmeleri ve Kıbrıs Türk futbolu</p>
      </div>

      {/* Canlı veri kaynağı doğrulanana kadar statik tablo gösterilmez. */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="w-5 h-5 text-ugavole-yellow" />
          <h2 className="font-black text-ugavole-text text-lg uppercase tracking-wide">Puan Durumu ve Fikstür</h2>
        </div>

        <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-6">
          <p className="font-black text-ugavole-text text-lg">Güncel tablo yakında</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ugavole-body">
            Sezon içindeki sıralamayı eski bir tabloyla göstermiyoruz. Canlı veri kaynağı ve güncelleme sıklığı doğrulanana kadar resmi KTFF kanalı güncel puan durumu ve fikstür için en doğru kaynaktır.
          </p>
          <a
            href="https://ktff.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-ugavole-yellow px-4 py-2 text-sm font-black text-black transition-transform hover:scale-[1.02]"
          >
            KTFF&apos;de güncel durumu gör →
          </a>
        </div>
      </section>

      {/* SEO metin bloğu */}
      <section className="mb-10 bg-ugavole-surface border border-ugavole-border rounded-2xl p-6">
        <h2 className="font-black text-ugavole-text text-lg mb-3">Kuzey Kıbrıs Futbolu Hakkında</h2>
        <div className="prose prose-sm max-w-none text-ugavole-body space-y-2">
          <p>
            <strong>KTFF Süper Lig</strong>, Kuzey Kıbrıs Türk Cumhuriyeti&apos;nin en üst düzey profesyonel futbol ligıdır.
            Kıbrıs Türk Futbol Federasyonu (KTFF) tarafından organize edilen lig, 14 takımın mücadele ettiği
            rekabetçi bir yapıya sahiptir.
          </p>
          <p>
            KTFF, FIFA ve UEFA bünyesinde tanınmamakla birlikte CONIFA (Confederation of Independent Football Associations)
            üyesi olarak uluslararası turnuvalara katılmaktadır. <strong>Kuzey Kıbrıs Milli Takımı</strong>,
            CONIFA Dünya Kupası&apos;nda ülkeyi temsil etmektedir.
          </p>
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
