export const UGC_CATEGORIES = [
  "Bizden Şeyler",
  "Kıbrıs Ağzı",
  "Yeme-İçme",
  "Gez-Keşfet",
  "Ada Hayatı",
  "Nostalji",
  "Öğrenci & Gençlik",
  "Doğa & Hayvanlar",
  "Etkinlikler",
  "Quiz & Oylama",
  "İhbar & Duyuru",
] as const;

export const UGC_TYPES = ["story", "list", "poll", "quiz", "tip"] as const;

export type UgcType = (typeof UGC_TYPES)[number];

export type UgcInput = {
  type: UgcType;
  title: string;
  excerpt: string;
  content: string;
  category: (typeof UGC_CATEGORIES)[number];
  location: string;
  authorName: string;
  authorEmail: string;
  sourceUrl: string;
  rightsConfirmed: true;
  privacyConfirmed: true;
  website: string;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; url: string; alt: string; credit?: string };

type ParseResult =
  | { ok: true; value: UgcInput }
  | { ok: false; error: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseSourceUrl(value: string): string | null {
  if (!value) return "";
  if (value.length > 1000) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.username = "";
    url.password = "";
    return url.toString();
  } catch {
    return null;
  }
}

export function parseUgcInput(input: unknown): ParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Geçersiz form" };
  }

  const raw = input as Record<string, unknown>;
  const type = text(raw.type) as UgcType;
  const title = text(raw.title);
  const excerpt = text(raw.excerpt);
  const content = text(raw.content);
  const category = text(raw.category) as UgcInput["category"];
  const location = text(raw.location);
  const authorName = text(raw.author_name);
  const authorEmail = text(raw.author_email).toLowerCase();
  const sourceUrl = parseSourceUrl(text(raw.source_url));
  const website = text(raw.website);

  if (website) return { ok: false, error: "Geçersiz form" };
  if (!UGC_TYPES.includes(type)) return { ok: false, error: "İçerik biçimi geçersiz" };
  if (!UGC_CATEGORIES.includes(category)) return { ok: false, error: "Kategori geçersiz" };
  if (title.length < 8 || title.length > 180) {
    return { ok: false, error: "Başlık 8-180 karakter olmalı" };
  }
  if (excerpt.length > 360) return { ok: false, error: "Özet çok uzun" };
  if (content.length < 80 || content.length > 20_000) {
    return { ok: false, error: "İçerik 80-20.000 karakter olmalı" };
  }
  if (location.length > 120) return { ok: false, error: "Konum çok uzun" };
  if (authorName.length < 2 || authorName.length > 100) {
    return { ok: false, error: "Ad 2-100 karakter olmalı" };
  }
  if (!isEmail(authorEmail)) return { ok: false, error: "E-posta geçersiz" };
  if (sourceUrl === null) return { ok: false, error: "Kaynak bağlantısı geçersiz" };
  if (raw.rights_confirmed !== true) {
    return { ok: false, error: "Yayın ve telif beyanı zorunlu" };
  }
  if (raw.privacy_confirmed !== true) {
    return { ok: false, error: "Gizlilik onayı zorunlu" };
  }

  return {
    ok: true,
    value: {
      type,
      title,
      excerpt,
      content,
      category,
      location,
      authorName,
      authorEmail,
      sourceUrl,
      rightsConfirmed: true,
      privacyConfirmed: true,
      website,
    },
  };
}

export function toContentBlocks(value: string): ContentBlock[] {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 100)
    .map((part) => ({ type: "paragraph" as const, text: part }));
}

export function createContentSlug(title: string, suffix: string): string {
  const normalized = title
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[’']/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${normalized || "katki"}-${suffix.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
}
