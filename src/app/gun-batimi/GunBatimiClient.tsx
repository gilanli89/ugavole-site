"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Sun, Sunrise, Camera, MapPin, Upload, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ShareButtons from "@/components/ShareButtons";
import Image from "next/image";

// ── Şehir Koordinatları ─────────────────────────────────────────
const SEHIRLER = [
  { id: "lefkosa",    label: "Lefkoşa",    lat: 35.1856, lng: 33.3823 },
  { id: "girne",      label: "Girne",      lat: 35.3317, lng: 33.3192 },
  { id: "gazimagusa", label: "Gazimağusa", lat: 35.1264, lng: 33.9419 },
  { id: "guzelyurt",  label: "Güzelyurt",  lat: 35.2031, lng: 32.9961 },
  { id: "iskele",     label: "İskele",     lat: 35.2867, lng: 33.8833 },
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

  const [photos, setPhotos]         = useState<Photo[]>([]);
  const [photoSort, setPhotoSort]   = useState<"oylar" | "yeni">("oylar");
  const [voted, setVoted]           = useState<Set<string>>(new Set());

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [form, setForm]             = useState({ konum: "", yukleyen_ad: "", aciklama: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Her saniye güncelle
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Daha önce oy verilen ID'leri yükle
  useEffect(() => {
    const stored = localStorage.getItem("gb_voted");
    if (stored) setVoted(new Set(JSON.parse(stored)));
  }, []);

  // Güneş verisi — sunrise-sunset.org
  const fetchSun = useCallback(async (lat: number, lng: number) => {
    setLoadingSun(true);
    setSunData(null);
    try {
      const res  = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&tzid=Asia/Nicosia`
      );
      const data = await res.json();
      if (data.status === "OK") {
        const sunriseDate   = new Date(data.results.sunrise);
        const sunsetDate    = new Date(data.results.sunset);
        // civil_twilight_end = golden hour proxy
        const goldenDate    = new Date(data.results.civil_twilight_end);
        // golden hour ≈ 45 dk önce sunset (civil_twilight_end sunset'ten sonra gelir, kullanmayalım)
        // Altın saat için sunset - 45 dk kullan
        const goldenAlt     = new Date(sunsetDate.getTime() - 45 * 60 * 1000);
        setSunData({
          sunriseISO:    data.results.sunrise,
          sunsetISO:     data.results.sunset,
          goldenHourISO: goldenAlt.toISOString(),
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
    fetchSun(activeCity.lat, activeCity.lng);
  }, [activeCity, fetchSun]);

  // Fotoğrafları çek
  useEffect(() => {
    const sb  = createClient();
    const col = photoSort === "oylar" ? "oylar" : "olusturulma";
    sb.from("gunbatimi_fotolar")
      .select("*")
      .eq("aktif", true)
      .order(col, { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data) setPhotos(data as Photo[]); });
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

  // ── Oy Ver ────────────────────────────────────────────────────
  const oyVer = async (id: string, current: number) => {
    if (voted.has(id)) return;
    const sb = createClient();
    await sb.from("gunbatimi_fotolar").update({ oylar: current + 1 }).eq("id", id);
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, oylar: p.oylar + 1 } : p));
    const next = new Set([...voted, id]);
    setVoted(next);
    localStorage.setItem("gb_voted", JSON.stringify([...next]));
  };

  // ── Fotoğraf Yükle (Supabase Storage) ────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setSubmitStatus("loading");
    try {
      const sb  = createClient();
      const ext = uploadFile.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await sb.storage
        .from("sunset-photos")
        .upload(path, uploadFile, { cacheControl: "3600", upsert: false });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = sb.storage.from("sunset-photos").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { error: dbErr } = await sb.from("gunbatimi_fotolar").insert({
        gorsel_url:   publicUrl,
        konum:        form.konum       || null,
        yukleyen_ad:  form.yukleyen_ad || null,
        aciklama:     form.aciklama    || null,
        aktif:        false,
      });
      if (dbErr) throw dbErr;

      setSubmitStatus("ok");
      setUploadFile(null);
      setForm({ konum: "", yukleyen_ad: "", aciklama: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch {
      setSubmitStatus("err");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

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
            <p className="font-bold mb-1">Henüz fotoğraf yok</p>
            <p className="text-sm">İlk fotoğrafı sen paylaş!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {photos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid bg-ugavole-surface border border-ugavole-border rounded-2xl overflow-hidden group">
                <div className="relative">
                  <Image
                    src={photo.gorsel_url}
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
                  <button
                    onClick={() => oyVer(photo.id, photo.oylar)}
                    disabled={voted.has(photo.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
                      voted.has(photo.id)
                        ? "bg-ugavole-yellow/20 text-ugavole-yellow cursor-default"
                        : "bg-ugavole-surface-2 text-ugavole-body hover:bg-ugavole-yellow hover:text-black"
                    }`}
                  >
                    🌅 {photo.oylar}
                  </button>
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
        <p className="text-ugavole-muted text-sm mb-5">
          Kıbrıs&apos;ta çektiğin gün batımı fotoğrafını paylaş. Admin onayından sonra galeriye eklenir.
        </p>

        <form onSubmit={handleUpload} className="space-y-3">
          {/* Dosya seçici */}
          <label className="block w-full cursor-pointer">
            <div className={`w-full bg-ugavole-surface-2 border-2 border-dashed rounded-xl px-4 py-6 text-center transition-colors ${
              uploadFile ? "border-ugavole-yellow" : "border-ugavole-border hover:border-ugavole-yellow/50"
            }`}>
              {uploadFile ? (
                <p className="text-ugavole-text text-sm font-bold">{uploadFile.name}</p>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-ugavole-muted mx-auto mb-2" />
                  <p className="text-ugavole-muted text-sm">Fotoğraf seç (JPG, PNG, WEBP — max 10 MB)</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.konum}
              onChange={(e) => setForm((f) => ({ ...f, konum: e.target.value }))}
              placeholder="Konum (örn: Girne Limanı)"
              className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-ugavole-text text-sm outline-none transition-colors"
            />
            <input
              type="text"
              value={form.yukleyen_ad}
              onChange={(e) => setForm((f) => ({ ...f, yukleyen_ad: e.target.value }))}
              placeholder="Adın (opsiyonel)"
              className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-ugavole-text text-sm outline-none transition-colors"
            />
          </div>
          <textarea
            value={form.aciklama}
            onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value.slice(0, 150) }))}
            placeholder="Kısa açıklama (opsiyonel, max 150 karakter)"
            rows={2}
            className="w-full bg-ugavole-surface-2 border border-ugavole-border focus:border-ugavole-yellow rounded-xl px-4 py-2.5 text-ugavole-text text-sm outline-none transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={submitStatus === "loading" || !uploadFile}
            className="bg-ugavole-yellow text-black px-6 py-2.5 rounded-full font-black text-sm hover:bg-ugavole-yellow-dark transition-colors disabled:opacity-50"
          >
            {submitStatus === "loading" ? "Yükleniyor..." : "Fotoğrafı Paylaş 🌅"}
          </button>
          {submitStatus === "ok"  && <p className="text-green-400 text-sm font-bold">✅ Gönderildi! Admin onayından sonra yayınlanacak.</p>}
          {submitStatus === "err" && <p className="text-red-400 text-sm font-bold">❌ Hata oluştu. Tekrar dene.</p>}
        </form>
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
