"use client";

import { useState, useEffect, useCallback } from "react";
import { Sun, Sunrise, Camera, MapPin, Upload, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ShareButtons from "@/components/ShareButtons";
import Image from "next/image";

const PHOTO_GALLERY_READY = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ── Şehir Koordinatları ─────────────────────────────────────────
const SEHIRLER = [
  { id: "lefkosa",    label: "Lefkoşa" },
  { id: "girne",      label: "Girne" },
  { id: "gazimagusa", label: "Gazimağusa" },
  { id: "guzelyurt",  label: "Güzelyurt" },
  { id: "iskele",     label: "İskele" },
];

const EN_IYI_NOKTALAR = [
  { emoji: "🌅", yer: "Girne Limanı",         desc: "Tarihi kale silueti eşliğinde",   maps: "https://www.google.com/maps/search/Girne+Limanı+KKTC" },
  { emoji: "🌄", yer: "Karpaz Altınkum",       desc: "Kimsenin görmediği cennet",       maps: "https://www.google.com/maps/search/Altınkum+Karpaz" },
  { emoji: "🏔️", yer: "Beşparmak Dağları",     desc: "Tüm adayı görürsün",              maps: "https://www.google.com/maps/search/Beşparmak+Dağları+KKTC" },
  { emoji: "⚓", yer: "Gazimağusa Surları",    desc: "Ortaçağ surları kızıl ışıkta",   maps: "https://www.google.com/maps/search/Gazimağusa+Surları" },
  { emoji: "🍊", yer: "Güzelyurt Körfezi",     desc: "Portakal bahçeleri altın rengi", maps: "https://www.google.com/maps/search/Güzelyurt+Körfezi" },
];

// ── Zaman Yardımcıları ──────────────────────────────────────────
function pad2(n: number) { return String(n).padStart(2, "0"); }

// ISO string → "HH:MM" (Europe/Nicosia)
function isoToHHMM(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Nicosia",
  });
}

// Kalan saniyeden HH:MM:SS veya MM:SS string
function secsToDisplay(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${pad2(h)}:${pad2(m)}:${pad2(s)}`
    : `${pad2(m)}:${pad2(s)}`;
}

// ── Güneş Yayı SVG ─────────────────────────────────────────────
function SunArc({ pct, beforeSunrise }: { pct: number; beforeSunrise: boolean }) {
  const c = Math.max(0, Math.min(1, pct));
  const sunX = 100 - 90 * Math.cos(c * Math.PI);
  const sunY = 90  - 78 * Math.sin(c * Math.PI);
  return (
    <svg viewBox="0 0 200 105" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <line x1="5" y1="90" x2="195" y2="90" stroke="currentColor" strokeWidth="1" className="text-ugavole-border" />
      <path d="M 10,90 Q 100,12 190,90" stroke="#F5C518" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.3" />
      {!beforeSunrise && c > 0 && (
        <path d="M 10,90 Q 100,12 190,90" stroke="#F5C518" strokeWidth="2" fill="none" strokeDasharray={`${c * 290} 290`} />
      )}
      {!beforeSunrise && (
        <>
          <circle cx={sunX} cy={sunY} r="10" fill="#F5C518" opacity="0.25" />
          <circle cx={sunX} cy={sunY} r="7"  fill="#F5C518" />
        </>
      )}
      <text x="10"  y="102" fontSize="7" fill="#888" textAnchor="middle">Doğuş</text>
      <text x="190" y="102" fontSize="7" fill="#888" textAnchor="middle">Batış</text>
    </svg>
  );
}

// ── Tipler ──────────────────────────────────────────────────────
type SunData = {
  sunriseISO:    string;
  sunsetISO:     string;
  goldenHourISO: string;
  sunriseDate:   Date;
  sunsetDate:    Date;
  goldenDate:    Date;
} | null;

type Photo = {
  id: string;
  gorsel_url: string;
  konum: string | null;
  yukleyen_ad: string | null;
  aciklama: string | null;
  oylar: number;
  olusturulma: string;
};

// ── Ana Bileşen ─────────────────────────────────────────────────
export default function GunBatimiClient() {
  const [activeCity, setActiveCity] = useState(SEHIRLER[0]);
  const [sunData, setSunData]       = useState<SunData>(null);
  const [loadingSun, setLoadingSun] = useState(true);
  const [now, setNow]               = useState(new Date());

  const [photos, setPhotos]       = useState<Photo[]>([]);
  const [photoSort, setPhotoSort] = useState<"oylar" | "yeni">("oylar");

  // Her saniye güncelle
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Güneş verisi — sunrise-sunset.org
  const fetchSun = useCallback(async (cityId: string) => {
    setLoadingSun(true);
    setSunData(null);
    try {
      const res = await fetch(`/api/gunes?sehir=${encodeURIComponent(cityId)}`);
      if (!res.ok) throw new Error("sun_data_unavailable");
      const data = await res.json();
      if (data.sunriseISO && data.sunsetISO && data.goldenHourISO) {
        const sunriseDate = new Date(data.sunriseISO);
        const sunsetDate = new Date(data.sunsetISO);
        const goldenAlt = new Date(data.goldenHourISO);
        setSunData({
          sunriseISO: data.sunriseISO,
          sunsetISO: data.sunsetISO,
          goldenHourISO: data.goldenHourISO,
          sunriseDate,
          sunsetDate,
          goldenDate:    goldenAlt,
        });
      }
    } catch {
      setSunData(null);
    } finally {
      setLoadingSun(false);
    }
  }, []);

  useEffect(() => {
    fetchSun(activeCity.id);
  }, [activeCity, fetchSun]);

  // Fotoğrafları çek
  useEffect(() => {
    if (!PHOTO_GALLERY_READY) {
      setPhotos([]);
      return;
    }
    let cancelled = false;
    const sb  = createClient();
    const col = photoSort === "oylar" ? "oylar" : "olusturulma";
    sb.from("gunbatimi_fotolar")
      .select("id, gorsel_url, konum, yukleyen_ad, aciklama, oylar, olusturulma")
      .eq("aktif", true)
      .order(col, { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!cancelled && data) setPhotos(data as Photo[]);
      });
    return () => {
      cancelled = true;
    };
  }, [photoSort]);

  // ── Hesaplamalar ──────────────────────────────────────────────
  const sunriseDate = sunData?.sunriseDate ?? null;
  const sunsetDate  = sunData?.sunsetDate  ?? null;

  const beforeSunrise = sunriseDate ? now < sunriseDate : false;
  const afterSunset   = sunsetDate  ? now > sunsetDate  : false;

  const dayMs   = sunriseDate && sunsetDate ? sunsetDate.getTime() - sunriseDate.getTime() : 1;
  const elapsedMs = sunriseDate ? now.getTime() - sunriseDate.getTime() : 0;
  const sunPct  = dayMs > 0 ? elapsedMs / dayMs : 0;

  // Geri sayım (saniye bazlı)
  const countdownSecs = sunsetDate ? Math.floor((sunsetDate.getTime() - now.getTime()) / 1000) : null;
  const countdown = (() => {
    if (!sunData || countdownSecs === null) return null;
    if (afterSunset)       return { display: "Gün batımı geçti 🌙", sub: "Yarın tekrar bak",   urgent: false };
    if (countdownSecs <= 0) return { display: "Şu an gün batımı! 🌅", sub: "Harika bir an!",    urgent: true  };
    const urgent = countdownSecs <= 30 * 60;
    return { display: secsToDisplay(countdownSecs), sub: urgent ? "Hızlan! 🏃" : "Gün batımına kalan", urgent };
  })();

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <Sun className="w-3.5 h-3.5" /> Bugünün Gün Batımı
        </div>
        <h1 className="font-black text-ugavole-text text-3xl md:text-4xl mb-2">KKTC Gün Batımı Saati</h1>
        <p className="text-ugavole-muted">Kuzey Kıbrıs&apos;ta bugün güneş ne zaman batıyor?</p>
      </div>

      {/* ── Şehir Sekmeleri ──────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide justify-center">
        {SEHIRLER.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveCity(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCity.id === s.id
                ? "bg-ugavole-yellow text-black"
                : "bg-ugavole-surface border border-ugavole-border text-ugavole-body hover:bg-ugavole-surface-2"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Güneş Verileri ─────────────────────────── */}
      <div className="bg-ugavole-surface border-2 border-ugavole-yellow/30 rounded-3xl p-6 md:p-8 mb-8">
        {loadingSun ? (
          <div className="text-center py-8 text-ugavole-muted">
            <div className="text-3xl mb-2 animate-spin inline-block">☀️</div>
            <p className="text-sm">Yükleniyor...</p>
          </div>
        ) : sunData ? (
          <>
            {/* Büyük gün batımı saati */}
            <div className="text-center mb-6">
              <p className="text-ugavole-muted text-xs font-bold uppercase tracking-wider mb-1">
                {activeCity.label} Gün Batımı
              </p>
              <div className="text-ugavole-yellow font-black" style={{ fontSize: "clamp(3rem,12vw,5rem)" }}>
                {isoToHHMM(sunData.sunsetISO)}
              </div>

              {countdown && (
                <div className={`mt-3 ${countdown.urgent ? "text-orange-400 animate-pulse" : "text-ugavole-body"}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-ugavole-muted mb-1">{countdown.sub}</p>
                  {!afterSunset && countdownSecs !== null && countdownSecs > 0 && (
                    <p className="font-black text-2xl tabular-nums">{countdown.display}</p>
                  )}
                  {(afterSunset || countdownSecs === 0) && (
                    <p className="font-black text-lg">{countdown.display}</p>
                  )}
                </div>
              )}
            </div>

            {/* Yay animasyonu */}
            <SunArc pct={sunPct} beforeSunrise={beforeSunrise} />

            {/* Detay grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Sunrise className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-xs text-ugavole-muted mb-0.5">Güneş Doğuşu</p>
                <p className="font-black text-ugavole-text">{isoToHHMM(sunData.sunriseISO)}</p>
              </div>
              <div className="text-center">
                <Sun className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-ugavole-muted mb-0.5">Altın Saat</p>
                <p className="font-black text-ugavole-text">{isoToHHMM(sunData.goldenHourISO)}</p>
              </div>
              <div className="text-center">
                <div className="text-lg mx-auto mb-1 text-center">🌅</div>
                <p className="text-xs text-ugavole-muted mb-0.5">Gün Batımı</p>
                <p className="font-black text-ugavole-text">{isoToHHMM(sunData.sunsetISO)}</p>
              </div>
            </div>

            {/* Paylaş */}
            <div className="mt-6 pt-6 border-t border-ugavole-border">
              <p className="text-center text-xs text-ugavole-muted font-bold uppercase tracking-wider mb-3">Paylaş</p>
              <ShareButtons
                text={`KKTC ${activeCity.label}'da bugün gün batımı ${isoToHHMM(sunData.sunsetISO)}'de! 🌅 #KKTC #Kıbrıs`}
                url="https://ugavole.com/gun-batimi"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-ugavole-muted text-sm">Veriler yüklenemedi.</div>
        )}
      </div>

      {/* ── Fotoğraf Galerisi ─────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-ugavole-text text-xl">
            <Camera className="inline w-5 h-5 text-ugavole-yellow mr-2 -mt-0.5" />
            Topluluk Fotoğrafları
          </h2>
          <button
            onClick={() => setPhotoSort((s) => s === "oylar" ? "yeni" : "oylar")}
            className="flex items-center gap-1.5 text-xs font-bold text-ugavole-muted hover:text-ugavole-text transition-colors border border-ugavole-border rounded-full px-3 py-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {photoSort === "oylar" ? "En çok oy" : "En yeni"}
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16 bg-ugavole-surface border border-ugavole-border rounded-2xl text-ugavole-muted">
            <div className="text-4xl mb-3">🌅</div>
            <p className="font-bold mb-1">Henüz onaylı fotoğraf yok</p>
            <p className="text-sm">Onaylanan topluluk fotoğrafları burada gösterilecek.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {photos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden group">
                <div className="relative">
                  <Image
                    src={`/api/media/sunset/${photo.id}`}
                    alt={photo.konum ?? "Gün batımı"}
                    width={400}
                    height={300}
                    className="w-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {(photo.konum || photo.olusturulma) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      {photo.konum && <p className="text-white text-xs font-bold">{photo.konum}</p>}
                      <p className="text-white/60 text-xs">{new Date(photo.olusturulma).toLocaleDateString("tr-TR")}</p>
                    </div>
                  )}
                </div>
                {photo.aciklama && (
                  <p className="text-ugavole-body text-xs p-3 pb-1">{photo.aciklama}</p>
                )}
                <div className="flex items-center justify-between p-3 pt-2">
                  <span
                    className="flex items-center gap-1.5 rounded-full bg-ugavole-surface-2 px-3 py-1.5 text-xs font-bold text-ugavole-muted"
                    title="Güvenli oylama akışı hazırlandığında yeniden açılacak"
                  >
                    🌅 {photo.oylar} oy
                  </span>
                  {photo.yukleyen_ad && (
                    <span className="text-xs text-ugavole-muted">{photo.yukleyen_ad}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Fotoğraf Yükleme ──────────────────────── */}
      <div className="bg-ugavole-surface border border-ugavole-border rounded-3xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-ugavole-yellow" />
          <h2 className="font-black text-ugavole-text text-lg">Senin Gün Batımın</h2>
        </div>
        <p className="text-sm leading-relaxed text-ugavole-muted">
          Fotoğrafları güvenli biçimde tarayıp editör onayına gönderecek yükleme akışı hazırlanıyor. Bu aşamada dosya veya kişisel bilgi toplamıyoruz.
        </p>
        <button
          type="button"
          disabled
          className="mt-5 rounded-full bg-ugavole-surface-2 px-6 py-2.5 text-sm font-black text-ugavole-muted opacity-70"
        >
          Güvenli fotoğraf gönderimi yakında
        </button>
      </div>

      {/* ── En İyi Noktalar ───────────────────────── */}
      <div className="mb-10">
        <h2 className="font-black text-ugavole-text text-xl mb-4">
          <MapPin className="inline w-5 h-5 text-ugavole-yellow mr-2 -mt-0.5" />
          KKTC&apos;nin En Güzel Gün Batımı Noktaları
        </h2>
        <div className="space-y-3">
          {EN_IYI_NOKTALAR.map((n, i) => (
            <a
              key={i}
              href={n.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-ugavole-surface border border-ugavole-border hover:border-ugavole-yellow rounded-2xl p-4 transition-all group"
            >
              <span className="text-2xl flex-shrink-0 w-10 text-center">{n.emoji}</span>
              <div className="flex-1">
                <span className="text-xs font-black text-ugavole-yellow mr-2">#{i + 1}</span>
                <span className="font-bold text-ugavole-text group-hover:text-ugavole-yellow transition-colors">{n.yer}</span>
                <p className="text-xs text-ugavole-muted mt-0.5">{n.desc}</p>
              </div>
              <span className="text-xs text-ugavole-muted group-hover:text-ugavole-yellow transition-colors flex-shrink-0">Haritada Gör →</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── SEO Metni ─────────────────────────────── */}
      <div className="bg-ugavole-surface-2 rounded-2xl p-6 text-ugavole-body text-sm leading-relaxed">
        <h2 className="font-black text-ugavole-text mb-3 text-base">Kuzey Kıbrıs Gün Batımı Hakkında</h2>
        <p className="mb-3">
          Kuzey Kıbrıs gün batımı saati mevsime göre değişir. Yaz aylarında KKTC&apos;de gün batımı 19:30 ile 20:15 arasında gerçekleşirken, kış aylarında bu saat 17:00&apos;e kadar erkene çekilebilir. Kıbrıs günbatımı saatini etkileyen en önemli faktör, adanın Doğu Akdeniz&apos;deki konumudur.
        </p>
        <p className="mb-3">
          Girne gün batımı, Kıbrıs&apos;ın en fotoğraflanan manzaraları arasında yer alır. Tarihi Girne Kalesi&apos;nin silueti, kızıl güneş ışığıyla birleşince unutulmaz kareler ortaya çıkar. Gazimağusa surları üzerinden izlenen günbatımı ise ortaçağ atmosferiyle eşsiz bir deneyim sunar.
        </p>
        <p className="mb-3">
          KKTC gün batımı fotoğrafçılığı için en uygun dönem Nisan-Ekim arası aylardır. Altın saat genellikle gün batımından 45-60 dakika önce başlar; bu süre profesyonel fotoğrafçılar için kritik öneme sahiptir. Karpaz Altınkum, Beşparmak Dağları ve Güzelyurt Körfezi, kuzey Kıbrıs gün batımı için en popüler noktalar arasındadır.
        </p>
        <p>
          Kıbrıs günbatımı saatini takip etmek için sayfamızı günlük ziyaret edebilirsiniz. Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele için ayrı ayrı gün batımı saatlerini anlık olarak öğrenebilirsiniz. Güneş doğuşu ve gün batımı saatleri her gün otomatik olarak güncellenmektedir.
        </p>
      </div>

    </div>
  );
}
