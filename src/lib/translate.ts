// Sunucu tarafı çeviri yardımcısı — client'ta çağrılmamalı

const cache = new Map<string, string>();

const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]/;

/** Metnin Türkçe olmadığını tespit et (Yunanca karakterler veya zorunlu dil bayrağı) */
export function needsTranslation(text: string, lang?: string): boolean {
  if (lang && lang !== "tr") return true;
  return GREEK_RE.test(text);
}

/**
 * Google'ın ücretsiz çeviri endpoint'i ile metni Türkçeye çevir.
 * Hata durumunda orijinal metni döndürür (sessiz fail).
 */
export async function translateText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  const cached = cache.get(text);
  if (cached) return cached;

  const url =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return text;

    // Yanıt: [ [ ["çeviri","orijinal",...], ... ], null, "kaynak_dil" ]
    const data = await res.json();
    const segments: string[] = (data[0] ?? []).map(
      (seg: [string]) => seg[0] ?? ""
    );
    const translated = segments.join("").trim();

    if (translated) {
      cache.set(text, translated);
      return translated;
    }
  } catch {
    // timeout veya ağ hatası — orijinali kullan
  }

  return text;
}

/**
 * Birden fazla metni paralel çevir (başlık + özet gibi).
 * Tüm hataları sessizce atla.
 */
export async function translateMany(texts: string[]): Promise<string[]> {
  return Promise.all(texts.map((t) => translateText(t)));
}
