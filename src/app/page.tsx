import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import { fetchWordPressPosts } from "@/lib/api/wordpress";
import { siteNavigationSchema } from "@/lib/seo";
import AdBanner from "@/components/AdBanner";
import type { Article } from "@/lib/api/news";

// ── Kategori renk/ikon eşlemesi ──────────────────────────────────
const CAT_META: Record<string, { color: string; bg: string; emoji: string }> = {
  Gezi:     { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", emoji: "🗺️" },
  Kültür:   { color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-100 dark:bg-blue-900/30",       emoji: "🏛️" },
  Eğlence:  { color: "text-orange-600 dark:text-orange-400",   bg: "bg-orange-100 dark:bg-orange-900/30",   emoji: "😄" },
  Yemek:    { color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-100 dark:bg-amber-900/30",     emoji: "🍽️" },
  Yaşam:    { color: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-100 dark:bg-purple-900/30",   emoji: "🏡" },
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
    <Link href={`/haber/${slug}`} className="group relative rounded-3xl overflow-hidden block h-72 md:h-96 bg-ugavole-surface-2">
      {article.cover_image && (
        <Image
          src={article.cover_image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
          placeholder="blur"
          blurDataURL={BLUR_URL}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full mb-3 ${meta.bg} ${meta.color}`}>
          {meta.emoji} {article.category}
        </span>
        <h2 className="text-white font-black text-xl md:text-2xl leading-tight group-hover:text-ugavole-yellow transition-colors line-clamp-3">
          {article.title}
        </h2>
      </div>
    </Link>
  );
}

// ── Normal Makale Kartı ──────────────────────────────────────────
function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const slug = articleSlug(article);
  const meta = catMeta(article.category);
  return (
    <Link
      href={`/haber/${slug}`}
      className="group bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden flex flex-col hover:border-ugavole-yellow hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-44 bg-ugavole-surface-2 overflow-hidden flex-shrink-0">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
            {meta.emoji}
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${meta.bg} ${meta.color}`}>
          {meta.emoji} {article.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-ugavole-text text-sm leading-snug group-hover:text-ugavole-yellow-dark transition-colors line-clamp-3 mb-2 flex-1">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-ugavole-muted text-xs leading-relaxed line-clamp-2 mb-3">
            {article.excerpt.slice(0, 120)}
          </p>
        )}
        <span className="text-ugavole-yellow-dark text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          Devamını oku <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

// ── Ana Sayfa ────────────────────────────────────────────────────
export default async function HomePage() {
  const articles = await fetchWordPressPosts().catch(() => [] as Article[]);

  // Tarihe göre sırala (en yeni önce), yayımlananları filtrele
  const sorted = articles
    .filter((a) => a.source_name === "ugavole" && a.title && a.title.length > 3)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const [hero, ...rest] = sorted;

  let cardIdx = 0;

  // Kategoriye göre grupla
  const byCategory = rest.reduce<Record<string, Article[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  const categoryOrder = ["Gezi", "Kültür", "Eğlence", "Yemek", "Yaşam", "Genel"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Hero Badge ──────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-ugavole-yellow/20 text-ugavole-yellow-dark text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5" />
          Kıbrıs&apos;ın Sosyal İçerik Platformu
        </div>
      </div>

      {/* ── Öne Çıkan Haber ─────────────────────────── */}
      {hero && (
        <div className="mb-10">
          <HeroCard article={hero} />
        </div>
      )}

      {/* ── Kategorili Grid ─────────────────────────── */}
      {categoryOrder.map((cat) => {
        const items = byCategory[cat];
        if (!items || items.length === 0) return null;
        const meta = catMeta(cat);
        return (
          <section key={cat} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{meta.emoji}</span>
              <h2 className="font-black text-ugavole-text text-lg">{cat}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                {items.length} yazı
              </span>
              <div className="flex-1 h-px bg-ugavole-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((article) => {
                const isPriority = cardIdx < 3;
                cardIdx++;
                return <ArticleCard key={article.id} article={article} priority={isPriority} />;
              })}
            </div>
          </section>
        );
      })}

      {/* Hiç içerik yoksa fallback */}
      {sorted.length === 0 && (
        <div className="text-center py-20 text-ugavole-muted">
          <p className="text-4xl mb-3">📰</p>
          <p>İçerikler yükleniyor...</p>
        </div>
      )}

      {/* Reklam — hero altı */}
      <AdBanner className="mb-8 rounded-xl" />

      {/* JSON-LD: Site Navigation */}
      {siteNavigationSchema().map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* ── Ana Navigasyon Grid ──────────────────────── */}
      <nav aria-label="Ana bölümler" className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-ugavole-yellow" />
          <h2 className="font-black text-ugavole-text text-sm uppercase tracking-wider">Tüm Bölümler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              className="group flex items-center gap-3 bg-ugavole-surface hover:bg-ugavole-surface-2 border border-ugavole-border hover:border-ugavole-yellow rounded-xl p-3 transition-all"
            >
              <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">{item.emoji}</span>
              <div className="min-w-0">
                <p className="font-black text-ugavole-text text-sm leading-tight group-hover:text-ugavole-yellow-dark transition-colors">{item.label}</p>
                <p className="text-ugavole-muted text-xs leading-snug mt-0.5 hidden sm:block">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
