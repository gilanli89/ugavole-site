import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import { fetchExchangeRates } from "@/lib/api/exchange";
import type { RatePair } from "@/lib/api/exchange";

export const metadata: Metadata = {
  title: "Döviz Kurları",
  description: "KKTC güncel döviz kurları — Sun Döviz kaynaklı USD, EUR, GBP ve daha fazlası.",
};

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

export default async function DovizPage() {
  let pairs: RatePair[] = [];
  let error = false;

  try {
    pairs = await fetchExchangeRates();
  } catch {
    error = true;
  }

  const updatedAt = pairs[0]?.updated_at
    ? new Date(pairs[0].updated_at).toLocaleString("tr-TR", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Döviz Kurları</h1>
          <p className="text-sm text-gray-500 mt-1">
            Türk Lirası (TRY) karşısında KKTC güncel kurları
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {updatedAt && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
              <RefreshCw className="w-3 h-3" />
              <span>{updatedAt}</span>
            </div>
          )}
          <span className="text-xs text-gray-400">Kaynak: sundoviz.com</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center text-sm">
          Döviz kurları şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Para Birimi</div>
            <div className="text-right">Alış (₺)</div>
            <div className="text-right">Satış (₺)</div>
          </div>

          <div className="divide-y divide-gray-100">
            {pairs.map((pair) => (
              <div
                key={pair.code}
                className="grid grid-cols-4 gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <span className="text-2xl">{FLAG[pair.code] ?? "💱"}</span>
                  <div>
                    <p className="font-bold text-gray-900">{pair.code}</p>
                    <p className="text-xs text-gray-500">{pair.name}</p>
                  </div>
                </div>
                <div className="text-right font-semibold text-gray-700">
                  {pair.buy.toFixed(4)}
                </div>
                <div className="text-right font-bold text-gray-900">
                  {pair.sell.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        Kurlar bilgilendirme amaçlıdır. Kesin işlem için yetkili döviz bürosuyla iletişime geçin.
      </p>
    </div>
  );
}
