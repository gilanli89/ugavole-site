import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { listPublishedArticles } from "@/lib/data/content";
import { serializeJsonLd, siteNavigationSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/api/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://ugavole.com" },
};

// ── Kategori renk/ikon eşlemesi ──────────────────────────────────
const CAT_META: Record<string, { color: string; bg: string; emoji: string }> = {
  Gezi:     { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", emoji: "🗺️" },
  Kültür:   { color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-100 dark:bg-blue-900/30",       emoji: "🏛️" },
  Eğlence:  { color: "text-orange-600 dark:text-orange-400",   bg: "bg-orange-100 dark:bg-orange-900/30",   emoji: "😄" },
  Yemek:    { color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-100 dark:bg-amber-900/30",     emoji: "🍽️" },
  Yaşam:    { color: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-100 dark:bg-purple-900/30",   emoji: "🏡" },
  Gündem:   { color: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-100 dark:bg-rose-900/30",       emoji: "📰" },
  Dünya:    { color: "text-red-600 dark:text-red-400",         bg: "bg-red-100 dark:bg-red-900/30",         emoji: "🌍" },
  Ekonomi:  { color: "text-green-600 dark:text-green-400",     bg: "bg-green-100 dark:bg-green-900/30",     emoji: "📈" },
  Teknoloji:{ color: "text-cyan-600 dark:text-cyan-400",       bg: "bg-cyan-100 dark:bg-cyan-900/30",       emoji: "💻" },
  "Bilim & Uzay": { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30", emoji: "🚀" },
  Genel:    { color: "text-gray-600 dark:text-gray-400",       bg: "bg-gray-100 dark:bg-gray-800",          emoji: "📌" },
};

function catMeta(cat: string) {
  return CAT_META[cat] ?? CAT_META["Genel"];
}

function articleSlug(article: Article): string {
  const parts = article.source_url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

const BLUR_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=";

// ── Büyük Öne Çıkan Kart ────────────────────────────────────────
function HeroCard({ article }: { article: Article }) {
  const slug = articleSlug(article);
  const meta = catMeta(article.category);
  return (
    <article className="grid overflow-hidden rounded-[30px] border border-ugavole-border bg-ugavole-surface shadow-[0_22px_70px_rgba(32,29,21,0.08)] lg:grid-cols-[1.18fr_0.82fr]">
      <Link href={`/haber/${slug}`} className="group relative block min-h-[320px] overflow-hidden bg-ugavole-surface-2 sm:min-h-[410px]">
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            blurDataURL={BLUR_URL}
            sizes="(max-width: 1024px) 100vw, 700px"
          />
        )}
        <span className="absolute left-5 top-5 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md">
          Öne çıkan
        </span>
      </Link>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <div className="mb-5 flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${meta.bg} ${meta.color}`}>
            {article.category}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-ugavole-muted">{formatDate(article.published_at)}</span>
        </div>
        <Link href={`/haber/${slug}`} className="group">
          <h2 className="font-editorial text-[2.55rem] font-bold leading-[1.02] tracking-[-0.035em] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark sm:text-[3.25rem]">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="mt-5 line-clamp-4 text-sm font-medium leading-7 text-ugavole-body sm:text-base">
            {article.excerpt}
          </p>
        )}
        <Link href={`/haber/${slug}`} className="mt-7 inline-flex w-fit items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-ugavole-text transition-colors hover:text-ugavole-yellow-dark">
          Hikâyeyi oku <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

// ── Normal Makale Kartı ──────────────────────────────────────────
function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const slug = articleSlug(article);
  const meta = catMeta(article.category);
  return (
    <Link
      href={`/haber/${slug}`}
      className="group flex flex-col overflow-hidden rounded-[22px] border border-ugavole-border bg-ugavole-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(32,29,21,0.09)]"
    >
      <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden bg-ugavole-surface-2">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
            {meta.emoji}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-md">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ugavole-muted">{formatDate(article.published_at)}</p>
        <h3 className="mb-3 line-clamp-3 flex-1 font-editorial text-[1.55rem] font-bold leading-[1.08] tracking-[-0.02em] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-4 line-clamp-3 text-sm font-medium leading-6 text-ugavole-muted">
            {article.excerpt}
          </p>
        )}
        <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-ugavole-text transition-all group-hover:gap-2">
          Devamını oku <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

// ── Ana Sayfa ────────────────────────────────────────────────────
export default async function HomePage() {
  const articles = await listPublishedArticles().catch(() => [] as Article[]);

  // Tarihe göre sırala (en yeni önce), yayımlananları filtrele
  const sorted = articles
    .filter((a) => a.source_name === "ugavole" && a.title && a.title.length > 3)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const [hero, ...rest] = sorted;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-9 sm:px-6 sm:py-12">
      <div className="mb-9 max-w-4xl">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ugavole-yellow-dark">
          <Sparkles className="h-4 w-4" />
          Kıbrıs&apos;tan, Kıbrıslılar için
        </div>
        <h1 className="font-editorial text-[3.25rem] font-bold leading-[0.98] tracking-[-0.04em] text-ugavole-text sm:text-[4.7rem]">
          Adanın merak uyandıran hikâyeleri burada.
        </h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-ugavole-muted sm:text-lg">
          Yerel hayat, kültür, keşif ve eğlence; özenle seçilmiş, kolay okunan ve paylaşmaya değer içeriklerle.
        </p>
      </div>

      {hero && (
        <div className="mb-14">
          <HeroCard article={hero} />
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-ugavole-border pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ugavole-yellow-dark">Yeni yayınlananlar</p>
                <h2 className="mt-1 font-editorial text-4xl font-bold tracking-tight text-ugavole-text">Ada gündeminden seçkiler</h2>
              </div>
              <Link href="/haberler" className="hidden items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-ugavole-muted transition-colors hover:text-ugavole-text sm:flex">
                Tümünü gör <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {rest.map((article, index) => (
                <ArticleCard key={article.id} article={article} priority={index < 2} />
              ))}
            </div>
          </section>

          <aside className="rounded-[24px] border border-ugavole-border bg-ugavole-surface p-5 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ugavole-yellow-dark" />
              <h2 className="font-editorial text-2xl font-bold text-ugavole-text">Editörün seçtikleri</h2>
            </div>
            <div className="divide-y divide-ugavole-border">
              {rest.slice(0, 5).map((article, index) => (
                <Link key={article.id} href={`/haber/${articleSlug(article)}`} className="group grid grid-cols-[34px_1fr] gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="font-editorial text-3xl font-bold leading-none text-ugavole-yellow-dark">{index + 1}</span>
                  <div>
                    <h3 className="line-clamp-3 font-editorial text-[1.08rem] font-bold leading-[1.15] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">{article.title}</h3>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-ugavole-muted">{article.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Hiç içerik yoksa fallback */}
      {sorted.length === 0 && (
        <div className="text-center py-20 text-ugavole-muted">
          <p className="text-4xl mb-3">📰</p>
          <p>İçerikler yükleniyor...</p>
        </div>
      )}

      {/* JSON-LD: Site Navigation */}
      {siteNavigationSchema().map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(s) }} />
      ))}

      <nav aria-label="Ana bölümler" className="mt-16 border-t border-ugavole-border pt-9">
        <div className="mb-5 flex items-center gap-2">
          <Compass className="h-4 w-4 text-ugavole-yellow-dark" />
          <h2 className="font-editorial text-3xl font-bold text-ugavole-text">Kıbrıs&apos;ı keşfet</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/haberler",         label: "Son Haberler",         emoji: "📰", desc: "Güncel KKTC haberleri"     },
            { href: "/quiz",             label: "Quiz",                 emoji: "🎯", desc: "Kıbrıs bilgi yarışması"    },
            { href: "/sozluk",           label: "Kıbrıslıca Sözlük",    emoji: "🗣️", desc: "Kıbrıs Türkçesi sözlüğü"  },
            { href: "/harita",           label: "Anlık Harita",         emoji: "🗺️", desc: "Kıbrıs olayları canlı"     },
            { href: "/gun-batimi",       label: "Gün Batımı",           emoji: "🌅", desc: "En güzel saatler"          },
            { href: "/kategori/spor",    label: "Spor Haberleri",       emoji: "⚽", desc: "KKTC spor gündemleri"      },
            { href: "/kategori/kultur",  label: "Kültür",               emoji: "🏛️", desc: "Kıbrıs kültür içerikleri" },
            { href: "/eczaneler",        label: "Nöbetçi Eczaneler",    emoji: "💊", desc: "Açık eczaneler"            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl border border-ugavole-border bg-ugavole-surface p-4 transition-all hover:-translate-y-0.5 hover:border-ugavole-yellow hover:shadow-lg"
            >
              <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{item.emoji}</span>
              <div className="min-w-0">
                <p className="font-editorial text-base font-bold leading-tight text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">{item.label}</p>
                <p className="mt-1 hidden text-[11px] font-medium leading-snug text-ugavole-muted sm:block">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
