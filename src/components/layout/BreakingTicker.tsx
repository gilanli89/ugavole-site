"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/api/news";

export default function BreakingTicker() {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/haberler?sayfa=1")
      .then((r) => r.json())
      .then((d) => {
        const titles = (d.articles as Article[])
          .slice(0, 8)
          .map((a) => a.title);
        setHeadlines(titles);
      })
      .catch(() => {});
  }, []);

  if (!headlines.length) return null;

  const items = [...headlines, ...headlines];

  return (
    <div className="bg-ugavole-yellow text-black overflow-hidden flex items-center h-9">
      <span className="flex-shrink-0 bg-[#D4A017] px-4 h-full flex items-center text-xs font-black uppercase tracking-widest text-black">
        SON DAKİKA
      </span>
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex gap-12 whitespace-nowrap animate-ticker"
          style={{ animation: "ticker 40s linear infinite" }}
        >
          {items.map((h, i) => (
            <span key={i} className="text-sm font-medium">
              {h}
              <span className="ml-12 text-black/40">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
