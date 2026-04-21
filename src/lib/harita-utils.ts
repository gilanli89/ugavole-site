import type { MapEvent } from "@/components/HaritaMap";

export type MapEventType = "elektrik" | "su" | "trafik" | "yol" | "yangin" | "sel" | "uyari";

// Kategori → MapEvent category eşlemesi
const TYPE_TO_CATEGORY: Record<MapEventType, string> = {
  elektrik: "hizmet",
  su: "hizmet",
  trafik: "trafik",
  yol: "hizmet",
  yangin: "yangin",
  sel: "hizmet",
  uyari: "haber",
};

const EVENT_KEYWORDS: Record<MapEventType, string[]> = {
  elektrik: ["elektrik kesintisi", "elektrik kesildi", "enerji kesintisi", "akım kesintisi", "elektrik arızası"],
  su: ["su kesintisi", "su kesildi", "su arızası", "su sorunu"],
  trafik: ["trafik kazası", "zincirleme kaza", "çarpışma", "otomobil kazası", "araç kazası"],
  yol: ["yol çalışması", "yol kapatıldı", "yol kapatma", "köprü", "yol yapım"],
  yangin: ["yangın", "alev aldı", "alev", "itfaiye", "yanıyor"],
  sel: ["sel", "taşkın", "su baskını", "baskın"],
  uyari: ["uyarı", "ikaz", "tehlike", "acil durum"],
};

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Turkish forms
  "lefkoşa":     { lat: 35.1856, lng: 33.3823 },
  "lefkosa":     { lat: 35.1856, lng: 33.3823 },
  "nicosia":     { lat: 35.1856, lng: 33.3823 },
  "girne":       { lat: 35.3414, lng: 33.3166 },
  "kyrenia":     { lat: 35.3414, lng: 33.3166 },
  "gazimağusa":  { lat: 35.1264, lng: 33.9419 },
  "gazimagusa":  { lat: 35.1264, lng: 33.9419 },
  "famagusta":   { lat: 35.1264, lng: 33.9419 },
  "güzelyurt":   { lat: 35.1997, lng: 32.9939 },
  "guzelyurt":   { lat: 35.1997, lng: 32.9939 },
  "morphou":     { lat: 35.1997, lng: 32.9939 },
  "iskele":      { lat: 35.2883, lng: 33.8905 },
  "trikomo":     { lat: 35.2883, lng: 33.8905 },
  // Districts / regions
  "lefke":       { lat: 35.1174, lng: 32.8479 },
  "lapta":       { lat: 35.3406, lng: 33.1677 },
  "değirmenlik": { lat: 35.2197, lng: 33.6319 },
  "akdoğan":     { lat: 35.1744, lng: 33.7319 },
  "büyükkonuk":  { lat: 35.3611, lng: 33.8247 },
  "aloa":        { lat: 35.3167, lng: 33.7333 },
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    .replace(/İ/g, "i").replace(/Ğ/g, "g");
}

export function detectEventType(title: string): MapEventType | null {
  const normalized = normalize(title);
  for (const [type, keywords] of Object.entries(EVENT_KEYWORDS) as [MapEventType, string[]][]) {
    if (keywords.some((kw) => normalized.includes(normalize(kw)))) {
      return type;
    }
  }
  return null;
}

export function detectCity(title: string): { lat: number; lng: number } | null {
  const normalized = normalize(title);
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(normalize(city))) {
      return coords;
    }
  }
  return null;
}

// Varsayılan koordinat — Kıbrıs ortası
const DEFAULT_COORDS = { lat: 35.2333, lng: 33.3500 };

export function rssToMapEvents(rssItems: Array<{
  title: string;
  source_url: string;
  source_name: string;
  published_at: string;
}>): MapEvent[] {
  const events: MapEvent[] = [];
  let id = 1000; // mock olaylarla çakışmaması için yüksek başlat

  for (const item of rssItems) {
    const eventType = detectEventType(item.title);
    if (!eventType) continue;

    const coords = detectCity(item.title) ?? DEFAULT_COORDS;
    const time = new Date(item.published_at).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    events.push({
      id: id++,
      title: item.title,
      category: TYPE_TO_CATEGORY[eventType],
      lat: coords.lat + (Math.random() - 0.5) * 0.02, // hafif spread
      lng: coords.lng + (Math.random() - 0.5) * 0.02,
      time,
      description: `Kaynak: ${item.source_name}`,
      source: item.source_name,
    });
  }

  return events;
}
