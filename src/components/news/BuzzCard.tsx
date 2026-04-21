"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Flame, Zap, TrendingUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { Article } from "@/lib/api/news";

type Props = {
  article: Article;
  variant?: "hero" | "card" | "list" | "mini";
  rank?: number;
};

function pseudoCount(seed: string, max: number): number {
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return (Math.abs(hash) % max) + Math.floor(max * 0.1);
}

function articleHref(article: Article) {
  if (article.source_name === "ugavole") {
    const parts = article.source_url.replace(/\/$/, "").split("/");
    return { href: `/haber/${parts[parts.length - 1]}`, external: false };
  }
  return { href: article.source_url, external: true };
}

const CATEGORY_COLORS: Record<string, string> = {
  Gündem: "bg-orange-500",
  Siyaset: "bg-blue-600",
  Ekonomi: "bg-green-600",
  Spor: "bg-purple-600",
  "Kültür": "bg-pink-600",
  Teknoloji: "bg-cyan-600",
  Genel: "bg-gray-500",
  Eğlence: "bg-yellow-500",
  Diğer: "bg-gray-400",
};

function Badge({ article }: { article: Article }) {
  const age = Date.now() - new Date(article.published_at).getTime();
  const hours = age / 3_600_000;
  if (hours < 2) return (
    <span className="flex items-center gap-1 bg-ugavole-yellow text-black text-xs font-black px-2 py-0.5 rounded-full">
      <Zap className="w-3 h-3" /> YENİ
    </span>
  );
  if (hours < 12) return (
    <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
      <Flame className="w-3 h-3" /> SICAK
    </span>
  );
  const views = pseudoCount(article.id, 5000);
  if (views > 3000) return (
    <span className="flex items-center gap-1 bg-purple-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
      <TrendingUp className="w-3 h-3" /> TREND
    </span>
  );
  return null;
}

export default function BuzzCard({ article, variant = "card", rank }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(pseudoCount(article.id, 800));
  const comments = pseudoCount(article.id + "c", 200);
  const { href, external } = articleHref(article);
  const catColor = CATEGORY_COLORS[article.category] ?? "bg-gray-500";

  const linkProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    setLikeCount((n) => n + (liked ? -1 : 1));
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
            priority
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
            <Badge article={article} />
          </div>
          <Link {...linkProps}>
            <h2 className="text-white font-black text-2xl md:text-3xl leading-tight hover:text-ugavole-yellow transition-colors line-clamp-3 mb-3">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <span>{article.source_name}</span>
              <span>·</span>
              <span>{formatRelativeTime(article.published_at)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-bold transition-all ${liked ? "text-ugavole-yellow scale-110" : "text-white/70 hover:text-ugavole-yellow"}`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-ugavole-yellow" : ""}`} />
                {likeCount.toLocaleString("tr")}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <MessageCircle className="w-5 h-5" />
                {comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST ─────────────────────────────────────
  if (variant === "list") {
    return (
      <Link {...linkProps} className="flex gap-4 group p-3 hover:bg-ugavole-surface-2 rounded-2xl transition-colors">
        <div className="flex-shrink-0 w-12 h-12 bg-ugavole-yellow text-black rounded-xl flex items-center justify-center font-black text-xl">
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
            <h3 className="font-bold text-ugavole-text text-sm leading-snug group-hover:text-ugavole-yellow-dark transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(article.published_at)}</p>
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
          <h3 className="text-xs font-bold text-ugavole-text group-hover:text-ugavole-yellow-dark line-clamp-3 leading-snug transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(article.published_at)}</p>
        </div>
      </Link>
    );
  }

  // ── CARD (default) ────────────────────────────
  return (
    <div className="bg-ugavole-surface rounded-2xl overflow-hidden border border-ugavole-border hover:shadow-lg transition-all duration-300 group flex flex-col">
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
          <Badge article={article} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link {...linkProps} className="flex-1">
          <h3 className="font-black text-ugavole-text text-base leading-snug group-hover:text-ugavole-yellow-dark transition-colors line-clamp-3 mb-2">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-ugavole-border mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="font-medium">{article.source_name}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-bold transition-all ${liked ? "text-ugavole-yellow-dark scale-110" : "text-gray-400 hover:text-ugavole-yellow-dark"}`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-ugavole-yellow" : ""}`} />
              {likeCount.toLocaleString("tr")}
            </button>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MessageCircle className="w-4 h-4" />
              {comments}
            </span>
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
