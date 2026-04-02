import type { Metadata } from "next";
import { Cloud, TrendingUp, Pill, Star, Droplets, Wind } from "lucide-react";
import { fetchExchangeRates } from "@/lib/api/exchange";
import { fetchWeather, KKTC_CITIES } from "@/lib/api/weather";
import { scrapePharmacies } from "@/lib/api/pharmacy";
import type { WeatherData } from "@/lib/api/weather";
import type { RatePair } from "@/lib/api/exchange";
import type { Pharmacy } from "@/lib/api/pharmacy";
import GuncelEczane from "./GuncelEczane";

export const metadata: Metadata = {
  title: "Güncel | KKTC Hava Durumu, Döviz Kurları, Nöbetçi Eczane",
  description:
    "Kuzey Kıbrıs güncel bilgileri tek sayfada: KKTC hava durumu (Lefkoşa, Girne, Gazimağusa), döviz kurları, bugün nöbetçi eczaneler ve burç yorumları.",
  keywords: [
    "KKTC hava durumu", "Kuzey Kıbrıs hava durumu", "Lefkoşa hava durumu bugün",
    "Girne hava durumu", "Gazimağusa hava durumu", "KKTC döviz kurları",
    "Kuzey Kıbrıs döviz", "KKTC nöbetçi eczane", "bugün nöbetçi eczane Lefkoşa",
    "Kuzey Kıbrıs güncel", "KKTC günlük bilgiler",
  ],
  alternates: { canonical: "https://ugavole.com/guncel" },
  openGraph: {
    title: "Güncel | KKTC Hava Durumu, Döviz, Nöbetçi Eczane",
    description: "KKTC hava durumu, döviz kurları ve nöbetçi eczaneler tek sayfada.",
    url: "https://ugavole.com/guncel",
    siteName: "ugavole",
    locale: "tr_TR",
    type: "website",
  },
};

const WEATHER_EMOJI: Record<string, string> = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};
function getEmoji(icon: string) { return WEATHER_EMOJI[icon.slice(0, 2)] ?? "🌤️"; }

const FLAG: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", AUD: "🇦🇺",
  CHF: "🇨🇭", SAR: "🇸🇦", JPY: "🇯🇵", CAD: "🇨🇦",
};

const BURCLAR = [
  { ad: "Koç",     emoji: "♈", tarih: "21 Mar–19 Nis" },
  { ad: "Boğa",    emoji: "♉", tarih: "20 Nis–20 May" },
  { ad: "İkizler", emoji: "♊", tarih: "21 May–20 Haz" },
  { ad: "Yengeç",  emoji: "♋", tarih: "21 Haz–22 Tem" },
  { ad: "Aslan",   emoji: "♌", tarih: "23 Tem–22 Ağu" },
  { ad: "Başak",   emoji: "♍", tarih: "23 Ağu–22 Eyl" },
  { ad: "Terazi",  emoji: "♎", tarih: "23 Eyl–22 Eki" },
  { ad: "Akrep",   emoji: "♏", tarih: "23 Eki–21 Kas" },
  { ad: "Yay",     emoji: "♐", tarih: "22 Kas–21 Ara" },
  { ad: "Oğlak",   emoji: "♑", tarih: "22 Ara–19 Oca" },
  { ad: "Kova",    emoji: "♒", tarih: "20 Oca–18 Şub" },
  { ad: "Balık",   emoji: "♓", tarih: "19 Şub–20 Mar" },
];

// JSON-LD schema
function buildSchema() {
  const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Bugün KKTC'de hava nasıl?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${today} için Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele hava durumu tahminlerini ugavole Güncel sayfasında bulabilirsiniz.`,
        },
      },
      {
        "@type": "Question",
        "name": "Bugün KKTC'de nöbetçi eczaneler hangileri?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "KKTC'deki bugünkü nöbetçi eczanelerin listesi, adres ve telefon bilgileriyle ugavole Güncel sayfasında yer almaktadır. Lefkoşa, Girne, Gazimağusa ve diğer şehirlere göre filtreleyebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        "name": "KKTC döviz kurları ne kadar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "KKTC güncel döviz kurları (USD, EUR, GBP ve diğerleri) Türk Lirası karşısında Sun Döviz kaynaklı alış/satış fiyatlarıyla ugavole Güncel sayfasında anlık olarak gösterilmektedir.",
        },
      },
    ],
  };
}

export default async function GuncelPage() {
  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Paralel fetch
  const [weatherResults, rates, pharmacies] = await Promise.all([
    Promise.allSettled(KKTC_CITIES.map((c) => fetchWeather(c.id))),
    fetchExchangeRates().catch((): RatePair[] => []),
    scrapePharmacies().catch((): Pharmacy[] => []),
  ]);

  const weathers: WeatherData[] = weatherResults
    .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === "fulfilled")
    .map((r) => r.value);

  const updatedAt = rates[0]?.updated_at
    ? new Date(rates[0].updated_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }} />

      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ugavole-text">Güncel</h1>
        <p className="text-ugavole-muted mt-1 text-sm">{today} — Kuzey Kıbrıs anlık bilgiler</p>
      </div>

      {/* Sticky section nav */}
      <nav className="sticky top-14 z-40 bg-ugavole-bg/90 backdrop-blur border-b border-ugavole-border -mx-4 px-4 mb-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2.5">
          {[
            { href: "#hava",     icon: Cloud,      label: "Hava Durumu"  },
            { href: "#doviz",    icon: TrendingUp,  label: "Döviz"        },
            { href: "#eczaneler",icon: Pill,        label: "Eczaneler"    },
            { href: "#burclar",  icon: Star,        label: "Burçlar"      },
          ].map(({ href, icon: Icon, label }) => (
            <a key={href} href={href}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-ugavole-muted hover:text-ugavole-text hover:bg-ugavole-surface transition-all border border-ugavole-border">
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ───── HAVA DURUMU ───── */}
      <section id="hava" className="mb-14 scroll-mt-28">
        <div className="flex items-center gap-2 mb-5">
          <Cloud className="w-5 h-5 text-sky-500" />
          <h2 className="text-xl font-black text-ugavole-text">Hava Durumu</h2>
          <span className="text-xs text-ugavole-muted ml-1">5 günlük tahmin — Kuzey Kıbrıs</span>
        </div>

        {weathers.length === 0 ? (
          <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-8 text-center text-ugavole-muted text-sm">
            Hava durumu bilgisi şu an alınamıyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {weathers.map((w) => (
              <div key={w.city}
                className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-base">{w.city}</h3>
                  <span className="text-3xl">{getEmoji(w.icon)}</span>
                </div>
                <div className="mb-3">
                  <span className="text-4xl font-black">{w.temp}°</span>
                  <p className="text-xs opacity-80 mt-0.5 capitalize">{w.description}</p>
                  <div className="flex gap-3 mt-1.5 text-xs opacity-70">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{w.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{w.wind_speed} km/s</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-0.5 border-t border-white/20 pt-2.5">
                  {w.forecast.slice(0, 5).map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs opacity-60">{i === 0 ? "Bug." : day.date.slice(5).replace("-", "/")}</p>
                      <p className="text-base my-0.5">{getEmoji(day.icon)}</p>
                      <p className="text-xs font-bold">{day.temp_max}°</p>
                      <p className="text-xs opacity-50">{day.temp_min}°</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-ugavole-muted mt-3">
          Kaynak: Open-Meteo / OpenWeatherMap — <strong>Lefkoşa, Gazimağusa, Girne, Güzelyurt, İskele</strong> hava durumu tahminleri
        </p>
      </section>

      {/* ───── DÖVİZ ───── */}
      <section id="doviz" className="mb-14 scroll-mt-28">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-black text-ugavole-text">Döviz Kurları</h2>
          </div>
          {updatedAt && (
            <span className="text-xs text-ugavole-muted bg-ugavole-surface border border-ugavole-border px-3 py-1 rounded-full">
              Güncellendi {updatedAt}
            </span>
          )}
        </div>

        {rates.length === 0 ? (
          <div className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-8 text-center text-ugavole-muted text-sm">
            Döviz bilgisi şu an alınamıyor.
          </div>
        ) : (
          <>
            {/* Mobile: kartlar */}
            <div className="grid grid-cols-2 sm:hidden gap-3">
              {rates.map((pair) => (
                <div key={pair.code} className="bg-ugavole-surface border border-ugavole-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{FLAG[pair.code] ?? "💱"}</span>
                    <div>
                      <p className="font-black text-ugavole-text text-sm">{pair.code}</p>
                      <p className="text-xs text-ugavole-muted leading-tight">{pair.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="text-ugavole-muted">Alış</p>
                      <p className="font-bold text-ugavole-text">{pair.buy.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-ugavole-muted">Satış</p>
                      <p className="font-black text-ugavole-text">{pair.sell.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet+: tablo */}
            <div className="hidden sm:block bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-4 px-5 py-3 bg-ugavole-surface-2 border-b border-ugavole-border text-xs font-bold text-ugavole-muted uppercase tracking-wide">
                <div className="col-span-2">Para Birimi</div>
                <div className="text-right">Alış (₺)</div>
                <div className="text-right">Satış (₺)</div>
              </div>
              <div className="divide-y divide-ugavole-border">
                {rates.map((pair) => (
                  <div key={pair.code} className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-ugavole-surface-2 transition-colors">
                    <div className="col-span-2 flex items-center gap-3">
                      <span className="text-2xl">{FLAG[pair.code] ?? "💱"}</span>
                      <div>
                        <p className="font-black text-ugavole-text">{pair.code}</p>
                        <p className="text-xs text-ugavole-muted">{pair.name}</p>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-ugavole-muted">{pair.buy.toFixed(4)}</div>
                    <div className="text-right font-black text-ugavole-text">{pair.sell.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <p className="text-xs text-ugavole-muted mt-3">
          Kaynak: sundoviz.com — <strong>KKTC döviz kurları</strong> Türk Lirası (TRY) karşısında alış/satış. Bilgilendirme amaçlıdır.
        </p>
      </section>

      {/* ───── ECZANELER ───── */}
      <section id="eczaneler" className="mb-14 scroll-mt-28">
        <div className="flex items-center gap-2 mb-2">
          <Pill className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-black text-ugavole-text">Nöbetçi Eczaneler</h2>
        </div>
        <p className="text-sm text-ugavole-muted mb-5">
          <strong>Bugün {today}</strong> için KKTC nöbetçi eczaneler — Lefkoşa, Girne, Gazimağusa ve tüm şehirler
        </p>

        {pharmacies.length === 0 ? (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-sm text-amber-800 dark:text-amber-400">
            Nöbetçi eczane bilgisi şu an alınamıyor. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : (
          <GuncelEczane pharmacies={pharmacies} />
        )}
        <p className="text-xs text-ugavole-muted mt-3">
          Kaynak: kteb.org — Acil durumlarda önce arayarak nöbet durumunu teyit ediniz.
        </p>
      </section>

      {/* ───── BURÇLAR ───── */}
      <section id="burclar" className="scroll-mt-28">
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-black text-ugavole-text">Burçlar</h2>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold px-2 py-0.5 rounded-full">Yakında</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {BURCLAR.map((b) => (
            <div key={b.ad}
              className="bg-ugavole-surface border border-ugavole-border rounded-xl p-3 text-center hover:border-ugavole-yellow transition-colors cursor-default">
              <div className="text-3xl mb-1.5">{b.emoji}</div>
              <p className="font-black text-ugavole-text text-xs">{b.ad}</p>
              <p className="text-ugavole-muted text-xs mt-0.5 leading-tight">{b.tarih}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ugavole-muted mt-4">Günlük burç yorumları çok yakında ugavole&apos;de.</p>
      </section>
    </div>
  );
}
