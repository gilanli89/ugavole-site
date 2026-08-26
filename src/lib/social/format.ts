export function composeCaption(caption: string, canonicalUrl: string, maxLength: number): string {
  const normalized = caption.trim().replace(/\s+/g, " ");
  const suffix = `\n\n${canonicalUrl}`;
  const available = Math.max(0, maxLength - Array.from(suffix).length);
  const characters = Array.from(normalized);
  const shortened = characters.length > available
    ? `${characters.slice(0, Math.max(0, available - 1)).join("").trimEnd()}…`
    : normalized;
  return `${shortened}${suffix}`;
}

type PlatformCaptionInput = {
  title: string;
  excerpt?: string | null;
  category?: string | null;
};

const CATEGORY_HASHTAGS: Record<string, string[]> = {
  gezi: ["KıbrısGezi", "AdaRotası"],
  kültür: ["KıbrısKültürü", "AdaHafızası"],
  kultur: ["KıbrısKültürü", "AdaHafızası"],
  yemek: ["KıbrısMutfağı", "AdaLezzetleri"],
  yaşam: ["AdaHayatı", "KuzeyKıbrıs"],
  yasam: ["AdaHayatı", "KuzeyKıbrıs"],
  eğlence: ["KıbrısEğlence", "Ugavole"],
  eglence: ["KıbrısEğlence", "Ugavole"],
};

function singleLine(value: string | null | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

function shorten(value: string, maxCharacters: number): string {
  const characters = Array.from(singleLine(value));
  if (characters.length <= maxCharacters) return characters.join("");
  return `${characters.slice(0, Math.max(0, maxCharacters - 1)).join("").trimEnd()}…`;
}

function hashtagsFor(category: string | null | undefined): string[] {
  const normalized = singleLine(category).toLocaleLowerCase("tr-TR");
  return ["Ugavole", "KuzeyKıbrıs", ...(CATEGORY_HASHTAGS[normalized] ?? [])]
    .filter((tag, index, tags) => tags.indexOf(tag) === index);
}

/**
 * Creates an editorially useful default for every destination. These values are
 * snapshotted into the outbox and can still be overridden by an editor before
 * approval. Adapters append the immutable canonical URL at delivery time.
 */
export function buildPlatformCaptions(
  input: PlatformCaptionInput
): Record<"facebook" | "instagram" | "x", string> {
  const title = singleLine(input.title);
  const excerpt = shorten(singleLine(input.excerpt), 260);
  const tags = hashtagsFor(input.category);

  const facebook = [
    title,
    excerpt,
    "Adanın hikâyesinin devamı Ugavole'de 👇",
  ].filter(Boolean).join("\n\n");

  const instagram = [
    title,
    excerpt,
    "Devamını okumak için Ugavole'ye göz at. Kaydetmeyi ve Kıbrıs'ı seven birine göndermeyi unutma.",
    tags.map((tag) => `#${tag}`).join(" "),
  ].filter(Boolean).join("\n\n");

  const xTags = tags.slice(0, 2).map((tag) => `#${tag}`).join(" ");
  const x = `${shorten(title, 92)}\n\n${xTags}`;

  return { facebook, instagram, x };
}

// X counts links with its transformed URL length. A conservative 250-character
// envelope leaves room for one URL and avoids relying on client-side guesswork.
export function composeXText(caption: string, canonicalUrl: string): string {
  const normalized = caption.trim().replace(/\s+/g, " ");
  const characters = Array.from(normalized);
  const shortened = characters.length > 125
    ? `${characters.slice(0, 124).join("").trimEnd()}…`
    : normalized;
  return `${shortened}\n\n${canonicalUrl}`;
}
