import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublishedArticle, getRelatedArticles, listPublishedArticles } from "@/lib/data/content";
import { buildMetadata, articleSchema, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { cleanLegacyHtmlContent, readingTime, categorySlug } from "@/lib/content";
import { ArrowLeft, Clock, ExternalLink, Sparkles, Tag } from "lucide-react";
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
  return getPublishedArticle(slug);
}

async function getRelated(post: Article): Promise<Article[]> {
  return getRelatedArticles(post, 3);
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
    const posts = await listPublishedArticles();
    return posts.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []));
  } catch {
    return [];
  }
}

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [related] = await Promise.all([getRelated(post)]);

  const cleanedContent = post.content ? cleanLegacyHtmlContent(post.content) : "";
  const blockText = post.content_blocks?.map((block) =>
    block.type === "image" ? "" : block.text
  ).join(" ") ?? "";
  const rTime = blockText || cleanedContent ? readingTime(blockText || cleanedContent) : null;
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
    <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-12">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(s) }} />
      ))}

      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-ugavole-muted transition-colors hover:text-ugavole-text"
      >
        <ArrowLeft className="w-4 h-4" />
        Ana sayfa
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,780px)_300px]">
        <article className="overflow-hidden rounded-[28px] border border-ugavole-border bg-ugavole-surface shadow-[0_20px_70px_rgba(32,29,21,0.07)]">
          <header className="px-5 pb-7 pt-6 sm:px-9 sm:pb-9 sm:pt-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/kategori/${catSlug}`}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] transition-colors ${badgeCls}`}
              >
                <Tag className="h-3 w-3" />
                {post.category}
              </Link>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ugavole-muted">
                <Clock className="h-3.5 w-3.5" />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
              {rTime && <span className="text-xs font-semibold text-ugavole-muted">· {rTime}</span>}
            </div>

            <h1 className="max-w-[720px] font-editorial text-[2.65rem] font-bold leading-[0.98] tracking-[-0.035em] text-ugavole-text sm:text-[3.55rem]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 max-w-[680px] text-base font-medium leading-7 text-ugavole-body sm:text-lg sm:leading-8">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3 border-t border-ugavole-border pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ugavole-yellow font-editorial text-xl font-bold text-black">
                {(post.author || "u").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ugavole-muted">Hazırlayan</p>
                <p className="text-sm font-extrabold text-ugavole-text">{post.author || "ugavole editörleri"}</p>
              </div>
            </div>
          </header>

          {post.cover_image && (
            <div className="relative aspect-[16/9] w-full bg-ugavole-surface-2">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                loading="eager"
                fetchPriority="high"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
                sizes="(max-width: 1024px) 100vw, 780px"
              />
            </div>
          )}

          <div className="px-5 py-8 sm:px-10 sm:py-11">
          {post.content_blocks && post.content_blocks.length > 0 ? (
          <div className="editorial-prose">
            {post.content_blocks.map((block, index) => {
              if (block.type === "heading") {
                return block.level === 3 ? (
                  <h3 key={index}>{block.text}</h3>
                ) : (
                  <h2 key={index}>{block.text}</h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={index}>
                    <p>{block.text}</p>
                    {block.attribution && <cite>{block.attribution}</cite>}
                  </blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <figure key={index}>
                    {/* Approved editors control published image URLs. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.url} alt={block.alt} loading="lazy" />
                    {block.credit && <figcaption>{block.credit}</figcaption>}
                  </figure>
                );
              }
              return <p key={index}>{block.text}</p>;
            })}
          </div>
        ) : cleanedContent ? (
          <div
            className="editorial-prose"
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        ) : (
          <p className="text-lg text-ugavole-body leading-relaxed">{post.excerpt}</p>
        )}

          <AdBanner eligible={post.ad_eligible === true} className="mt-10 rounded-2xl" />

          <div className="mt-10 border-t border-ugavole-border pt-6">
          <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ugavole-muted">Bu yazıyı paylaş</p>
          <ShareButtons
            text={`${post.title} — ugavole #KKTC`}
            url={articleUrl}
          />
          </div>

          {post.original_source_url && (
          <div className="mt-5 border-t border-ugavole-border pt-5">
            <a
              href={post.original_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ugavole-muted hover:text-ugavole-yellow-dark transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Orijinal kaynağa git
            </a>
          </div>
          )}
          </div>
        </article>

        {related.length > 0 && (
        <aside className="rounded-[24px] border border-ugavole-border bg-ugavole-surface p-5 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ugavole-yellow-dark" />
            <h2 className="font-editorial text-2xl font-bold tracking-tight text-ugavole-text">Ada&apos;da sıradaki</h2>
          </div>
          <div className="divide-y divide-ugavole-border">
            {related.map((r) => {
              const rSlug = r.source_url.replace(/\/$/, "").split("/").pop()!;
              return (
                <Link
                  key={r.id}
                  href={`/haber/${rSlug}`}
                  className="group flex gap-3 py-4 first:pt-0 last:pb-0"
                >
                  {r.cover_image && (
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-ugavole-surface-2">
                      <Image src={r.cover_image} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-3 font-editorial text-base font-bold leading-[1.15] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ugavole-muted">{formatDate(r.published_at)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}
