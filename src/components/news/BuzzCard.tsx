"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Check, Share2 } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/lib/api/news";

type Props = {
  article: Article;
  variant?: "hero" | "card" | "list" | "mini";
  rank?: number;
};

function articleHref(article: Article) {
  if (article.source_name === "ugavole") {
    const parts = article.source_url.replace(/\/$/, "").split("/");
    const slug = article.slug ?? parts[parts.length - 1];
    return { href: `/haber/${slug}`, external: false };
  }
  return { href: article.source_url, external: true };
}

async function copyToClipboard(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // Fall through to the legacy clipboard path when permission is denied.
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) throw new Error("Bağlantı panoya kopyalanamadı");
}

const CATEGORY_COLORS: Record<string, string> = {
  Gündem: "bg-orange-500",
  Siyaset: "bg-blue-600",
  Ekonomi: "bg-green-600",
  Dünya: "bg-red-600",
  Spor: "bg-purple-600",
  "Kültür": "bg-pink-600",
  Teknoloji: "bg-cyan-600",
  "Bilim & Uzay": "bg-indigo-600",
  Sağlık: "bg-emerald-600",
  "Yeme-İçme": "bg-amber-600",
  Magazin: "bg-fuchsia-600",
  Genel: "bg-gray-500",
  Eğlence: "bg-yellow-500",
  Diğer: "bg-gray-400",
};

const subscribeToHydration = () => () => undefined;

function RelativeTime({ value }: { value: string }) {
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  return (
    <time dateTime={value} title={formatDate(value)}>
      {isHydrated ? formatRelativeTime(value) : formatDate(value)}
    </time>
  );
}

export default function BuzzCard({ article, variant = "card", rank }: Props) {
  const [copied, setCopied] = useState(false);
  const { href, external } = articleHref(article);
  const catColor = CATEGORY_COLORS[article.category] ?? "bg-gray-500";

  const linkProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  const markCopied = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  };

  const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const shareUrl = new URL(href, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: shareUrl,
        });
        return;
      }

      await copyToClipboard(shareUrl);
      markCopied();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        await copyToClipboard(shareUrl);
        markCopied();
      } catch {
        // The browser denied both available share mechanisms.
      }
    }
  };

  // ── HERO ──────────────────────────────────────
  if (variant === "hero") {
    return (
      <div className="relative rounded-3xl overflow-hidden group h-[420px] md:h-[500px] bg-gray-100">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            loading="eager"
            fetchPriority="high"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`${catColor} text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide`}>
              {article.category}
            </span>
          </div>
          <Link {...linkProps}>
            <h2 className="mb-3 line-clamp-3 font-editorial text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-white transition-colors hover:text-ugavole-yellow md:text-4xl">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <span>{article.source_name}</span>
              <span>·</span>
              <RelativeTime value={article.published_at} />
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-ugavole-yellow transition-colors"
              aria-label={copied ? "Bağlantı kopyalandı" : "Haberi paylaş"}
              title={copied ? "Bağlantı kopyalandı" : "Haberi paylaş"}
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? "Kopyalandı" : "Paylaş"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST ─────────────────────────────────────
  if (variant === "list") {
    return (
      <Link {...linkProps} className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-ugavole-surface-2">
        <div className="flex h-10 w-9 flex-shrink-0 items-center justify-center font-editorial text-3xl font-bold text-ugavole-yellow-dark">
          {rank}
        </div>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {article.cover_image && (
            <div className="relative w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden">
              <Image src={article.cover_image} alt={article.title} fill className="object-cover" loading="lazy" sizes="80px" />
            </div>
          )}
          <div className="min-w-0">
            <p className={`text-xs font-black uppercase tracking-wide mb-1 ${catColor.replace("bg-", "text-")}`}>
              {article.category}
            </p>
            <h3 className="line-clamp-2 font-editorial text-base font-bold leading-[1.12] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">
              {article.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1"><RelativeTime value={article.published_at} /></p>
          </div>
        </div>
      </Link>
    );
  }

  // ── MINI ────────────────────────────────────
  if (variant === "mini") {
    return (
      <Link {...linkProps} className="flex gap-3 group hover:bg-ugavole-surface-2 p-2 rounded-xl transition-colors">
        {article.cover_image && (
          <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 72, height: 56 }}>
            <Image src={article.cover_image} alt={article.title} fill className="object-cover" loading="lazy" sizes="72px" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-3 font-editorial text-sm font-bold leading-[1.15] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1"><RelativeTime value={article.published_at} /></p>
        </div>
      </Link>
    );
  }

  // ── CARD (default) ────────────────────────────
  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-ugavole-border bg-ugavole-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(32,29,21,0.09)]">
      <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 ${catColor} opacity-20`} />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`${catColor} text-white text-xs font-black px-2.5 py-1 rounded-full uppercase`}>
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link {...linkProps} className="flex-1">
          <h3 className="mb-2 line-clamp-3 font-editorial text-2xl font-bold leading-[1.08] tracking-[-0.02em] text-ugavole-text transition-colors group-hover:text-ugavole-yellow-dark">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mb-3 line-clamp-2 text-sm font-medium leading-relaxed text-ugavole-muted">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-ugavole-border mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-ugavole-muted">
            <span className="font-medium">{article.source_name}</span>
            <span>·</span>
            <RelativeTime value={article.published_at} />
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-ugavole-muted transition-colors hover:text-ugavole-yellow-dark"
            aria-label={copied ? "Bağlantı kopyalandı" : "Haberi paylaş"}
            title={copied ? "Bağlantı kopyalandı" : "Haberi paylaş"}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied && <span>Kopyalandı</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
