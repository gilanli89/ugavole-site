export type RatePair = {
  code: string;
  name: string;
  buy: number;
  sell: number;
  updated_at: string;
};

type SunDovizItem = {
  id: number;
  dovizcins: string;
  dovizAd: string;
  alisKur: number;
  satisKur: number;
  sonDegisiklik: string;
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "Amerikan Doları",
  EUR: "Euro",
  GBP: "İngiliz Sterlini",
  AUD: "Avustralya Doları",
  CHF: "İsviçre Frangı",
  SAR: "Suudi Riyali",
  JPY: "Japon Yeni",
  CAD: "Kanada Doları",
};

// Sun Döviz — online.sundoviz.com iframe API'si
const SUNDOVIZ_API = "https://online.sundoviz.com/services/api.php";

export async function fetchExchangeRates(): Promise<RatePair[]> {
  const res = await fetch(SUNDOVIZ_API, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ugavole-bot/1.0)",
      Referer: "https://online.sundoviz.com/services/index.php",
    },
    next: { revalidate: 3600 }, // saatte bir yenile
  });

  if (!res.ok) throw new Error(`Sun Döviz API hatası: ${res.status}`);

  const data: SunDovizItem[] = await res.json();

  return data.map((item) => ({
    code: item.dovizcins,
    name: CURRENCY_NAMES[item.dovizcins] ?? item.dovizAd
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" "),
    buy: item.alisKur,
    sell: item.satisKur,
    updated_at: item.sonDegisiklik,
  }));
}
