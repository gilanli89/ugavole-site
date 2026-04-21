/**
 * WordPress/Elementor içerik temizleme yardımcıları
 */

export function cleanWordPressContent(html: string): string {
  return html
    // Elementor section/column/widget wrapper div'lerini kaldır ama içeriği koru
    .replace(/<div[^>]*class="[^"]*elementor[^"]*"[^>]*>/gi, "")
    .replace(/<div[^>]*data-elementor[^>]*>/gi, "")
    // Geri kalan açılış/kapanış div'leri temizle
    .replace(/<\/?div[^>]*>/gi, "")
    // Escaped karakterleri düzelt
    .replace(/\\</g, "<")
    .replace(/\\>/g, ">")
    .replace(/\\"/g, '"')
    // WordPress class'lı span'leri kaldır (içeriği koru)
    .replace(/<span[^>]*class="[^"]*"[^>]*>/gi, "<span>")
    // wp-block-* class'lı figure'ları temizle (figure'ı koru, class'ı sil)
    .replace(/(<figure[^>]*)class="[^"]*"([^>]*>)/gi, "$1$2")
    // Boş paragrafları kaldır
    .replace(/<p[^>]*>\s*(&nbsp;|\s)*\s*<\/p>/gi, "")
    // Ardışık boş satırları tek yap
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  const url = match[1];
  // Placeholder ve data URI'leri filtrele
  if (
    url.includes("placeholder") ||
    url.includes("data:") ||
    url.startsWith("//")
  )
    return null;
  return url;
}

export function readingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const words = text.trim().split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} dk okuma`;
}

export function categorySlug(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-");
}
