"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { RatePair } from "@/lib/api/exchange";

const FLAG: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  SAR: "🇸🇦",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
};

export default function ExchangeWidget() {
  const [pairs, setPairs] = useState<RatePair[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/doviz")
      .then((r) => r.json())
      .then((data) => {
        setPairs(data.pairs ?? []);
        setFetchedAt(data.fetched_at);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm uppercase tracking-wider">Döviz Kurları</h2>
          <p className="text-xs opacity-50 mt-0.5">Kaynak: Sun Döviz</p>
        </div>
        <div className="flex items-center gap-2">
          {fetchedAt && (
            <span className="text-xs opacity-60">{formatTime(fetchedAt)}</span>
          )}
          <button
            onClick={load}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <a href="/doviz" className="text-xs opacity-70 hover:opacity-100 underline">
            Tümü →
          </a>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))
        ) : pairs.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500">Kur bilgisi yüklenemedi.</p>
        ) : (
          pairs.slice(0, 5).map((pair) => (
            <div
              key={pair.code}
              className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{FLAG[pair.code] ?? "💱"}</span>
                <div>
                  <span className="font-semibold text-sm">{pair.code}</span>
                  <p className="text-xs text-gray-500">{pair.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    A: <span className="text-gray-700 font-medium">{pair.buy.toFixed(2)}</span>
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {pair.sell.toFixed(2)} ₺
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-right">satış</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
