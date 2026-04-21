import Link from "next/link";
import Image from "next/image";
import { Clock, ExternalLink, User } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/lib/api/news";

type Props = {
  article: Article;
  variant?: "default" | "featured" | "compact";
};

// ugavole WordPress postları için iç link, diğerleri için dış link
function articleHref(article: Article): { href: string; external: boolean } {
  if (article.source_name === "ugavole") {
    const parts = article.source_url.replace(/\/$/, "").split("/");
    const slug = parts[parts.length - 1];
    return { href: `/haber/${slug}`, external: false };
  }
  return { href: article.source_url, external: true };
}

export default function ArticleCard({ article, variant = "default", priority = false }: Props & { priority?: boolean }) {
  if (variant === "featured") {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 group h-80">
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-50 transition-opacity group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
            {article.category}
          </span>
          {(() => {
            const { href, external } = articleHref(article);
            return external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                <h2 className="text-white font-bold text-xl leading-tight hover:text-red-300 transition-colors line-clamp-3">
                  {article.title}
                </h2>
              </a>
            ) : (
              <Link href={href} className="block">
                <h2 className="text-white font-bold text-xl leading-tight hover:text-red-300 transition-colors line-clamp-3">
                  {article.title}
                </h2>
              </Link>
            );
          })()}
          <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
            <span>{article.source_name}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(article.published_at)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    const { href, external } = articleHref(article);
    const Wrapper = external
      ? ({ children }: { children: React.ReactNode }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="flex gap-3 group hover:bg-gray-50 p-2 rounded-xl transition-colors">{children}</a>
        )
      : ({ children }: { children: React.ReactNode }) => (
          <Link href={href} className="flex gap-3 group hover:bg-gray-50 p-2 rounded-xl transition-colors">{children}</Link>
        );
    return (
      <Wrapper>
        {article.cover_image && (
          <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              loading="lazy"
              sizes="80px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <span>{article.source_name}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {article.cover_image && (
        <div className="relative h-44 bg-gray-100">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {article.category}
          </span>
          {article.is_ugc && (
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <User className="w-3 h-3" />
              Kullanıcı
            </span>
          )}
        </div>
        {(() => {
          const { href, external } = articleHref(article);
          return external ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
              <h3 className="font-bold text-gray-900 leading-snug hover:text-red-700 transition-colors line-clamp-3 mb-2">
                {article.title}
              </h3>
            </a>
          ) : (
            <Link href={href} className="block">
              <h3 className="font-bold text-gray-900 leading-snug hover:text-red-700 transition-colors line-clamp-3 mb-2">
                {article.title}
              </h3>
            </Link>
          );
        })()}
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{article.source_name}</span>
            {articleHref(article).external && <ExternalLink className="w-3 h-3" />}
          </div>
        </div>
      </div>
    </div>
  );
}
