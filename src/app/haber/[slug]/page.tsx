import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchWordPressPosts } from "@/lib/api/wordpress";
import { buildMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { cleanWordPressContent, readingTime, categorySlug } from "@/lib/content";
import { ArrowLeft, Clock, ExternalLink, Tag } from "lucide-react";
import type { Article } from "@/lib/api/news";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";

type Props = { params: Promise<{ slug: string }> };

const CAT_BADGE: Record<string, string> = {
  Gezi:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Kültür:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Eğlence: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Yemek:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Yaşam:   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

async function getPost(slug: string): Promise<Article | undefined> {
  const posts = await fetchWordPressPosts();
  return posts.find(
    (p) =>
      p.source_url.endsWith(`/${slug}/`) ||
      p.source_url.endsWith(`/${slug}`) ||
      p.id === `wp-post-${slug}` ||
      p.id === `wp-page-${slug}`
  );
}

async function getRelated(post: Article): Promise<Article[]> {
  const posts = await fetchWordPressPosts();
  return posts
    .filter((p) => p.category === post.category && p.id !== post.id && p.title.length > 3)
    .slice(0, 3);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Haber bulunamadı" };

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/haber/${slug}`,
    ogImage: post.cover_image,
    type: "article",
    publishedAt: post.published_at,
    author: post.author,
  });
}

export async function generateStaticParams() {
  try {
    const posts = await fetchWordPressPosts();
    return posts.map((post) => {
      const urlParts = post.source_url.replace(/\/$/, "").split("/");
      return { slug: urlParts[urlParts.length - 1] };
    });
  } catch {
    return [];
  }
}

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [related] = await Promise.all([getRelated(post)]);

  const cleanedContent = post.content ? cleanWordPressContent(post.content) : "";
  const rTime = cleanedContent ? readingTime(cleanedContent) : null;
  const catSlug = categorySlug(post.category);
  const badgeCls = CAT_BADGE[post.category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  const articleUrl = `https://ugavole.com/haber/${slug}`;

  const schema = [
    articleSchema({
      title: post.title,
      description: post.excerpt,
      url: articleUrl,
      image: post.cover_image,
      publishedAt: post.published_at,
      author: post.author,
    }),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "https://ugavole.com" },
      { name: post.category, url: `https://ugavole.com/kategori/${catSlug}` },
      { name: post.title, url: articleUrl },
    ]),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Geri */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-ugavole-muted hover:text-ugavole-text mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Ana Sayfaya Dön
      </Link>

      <article>
        {/* Kategori + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Link
            href={`/kategori/${catSlug}`}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-colors ${badgeCls}`}
          >
            <Tag className="w-3 h-3" />
            {post.category}
          </Link>
          <div className="flex items-center gap-1 text-xs text-ugavole-muted">
            <Clock className="w-3 h-3" />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
          {rTime && (
            <span className="text-xs text-ugavole-muted">{rTime}</span>
          )}
        </div>

        {/* Başlık */}
        <h1 className="text-3xl md:text-4xl font-black text-ugavole-text leading-tight mb-6">
          {post.title}
        </h1>

        {/* Özet */}
        {post.excerpt && (
          <p className="text-lg text-ugavole-body leading-relaxed mb-6 max-w-2xl">
            {post.excerpt}
          </p>
        )}

        {/* Kapak görseli */}
        {post.cover_image && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-ugavole-surface-2">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* İçerik */}
        {cleanedContent ? (
          <div
            className="
              prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:text-black dark:prose-headings:text-white
              prose-headings:leading-tight prose-headings:mt-10 prose-headings:mb-4
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-black dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
              prose-strong:text-black dark:prose-strong:text-white
              prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-lg
              prose-a:text-[#D4A017] dark:prose-a:text-[#F5C518] prose-a:no-underline hover:prose-a:underline
              prose-ul:text-black dark:prose-ul:text-gray-300
              prose-ol:text-black dark:prose-ol:text-gray-300
              prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-ugavole-yellow prose-blockquote:not-italic
              prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400
            "
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        ) : (
          <p className="text-lg text-ugavole-body leading-relaxed">{post.excerpt}</p>
        )}

        {/* Reklam — içerik sonu */}
        <AdBanner className="mt-10 rounded-xl" />

        {/* Paylaş */}
        <div className="mt-8 pt-6 border-t border-ugavole-border">
          <p className="text-sm font-bold text-ugavole-muted uppercase tracking-wider mb-4">Bu yazıyı paylaş</p>
          <ShareButtons
            text={`${post.title} — ugavole #KKTC`}
            url={articleUrl}
          />
        </div>

        {/* Orijinal kaynak */}
        {post.source_name !== "ugavole" && (
          <div className="mt-4 pt-4 border-t border-ugavole-border">
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ugavole-muted hover:text-ugavole-yellow-dark transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Orijinal kaynağa git
            </a>
          </div>
        )}
      </article>

      {/* İlgili yazılar */}
      {related.length > 0 && (
        <aside className="mt-14">
          <h2 className="font-black text-ugavole-text text-lg mb-5">Bunları da oku</h2>
          <div className="space-y-4">
            {related.map((r) => {
              const rSlug = r.source_url.replace(/\/$/, "").split("/").pop()!;
              return (
                <Link
                  key={r.id}
                  href={`/haber/${rSlug}`}
                  className="flex gap-4 group p-3 rounded-2xl hover:bg-ugavole-surface-2 transition-colors"
                >
                  {r.cover_image && (
                    <div className="relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden">
                      <Image src={r.cover_image} alt={r.title} fill className="object-cover" loading="lazy" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-ugavole-text text-sm leading-snug group-hover:text-ugavole-yellow-dark transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-ugavole-muted mt-1">{formatDate(r.published_at)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
