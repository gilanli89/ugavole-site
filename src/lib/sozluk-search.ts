import type { SozlukEntry } from "@/lib/sozluk-data";

export const TURKISH_ALPHABET = [
  "A", "B", "C", "Ç", "D", "E", "F", "G", "Ğ", "H", "I", "İ", "J", "K", "L",
  "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z",
] as const;

const collator = new Intl.Collator("tr-TR", {
  sensitivity: "base",
  numeric: true,
});

export function normalizeSozlukText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function sozlukEntryKey(entry: Pick<SozlukEntry, "kibrisca">): string {
  return normalizeSozlukText(entry.kibrisca);
}

export function sozlukEntrySlug(entry: Pick<SozlukEntry, "kibrisca">): string {
  return normalizeSozlukText(entry.kibrisca).replace(/\s+/g, "-") || "kelime";
}

export function sozlukInitial(entry: Pick<SozlukEntry, "kibrisca">): string {
  const initial = entry.kibrisca.trim().charAt(0).toLocaleUpperCase("tr-TR");
  return (TURKISH_ALPHABET as readonly string[]).includes(initial) ? initial : "#";
}

export function compareSozlukEntries(a: SozlukEntry, b: SozlukEntry): number {
  return collator.compare(a.kibrisca, b.kibrisca);
}

export function matchesSozlukQuery(entry: SozlukEntry, query: string): boolean {
  const terms = normalizeSozlukText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const searchable = normalizeSozlukText([
    entry.kibrisca,
    ...(entry.aliases ?? []),
    entry.anlam,
    entry.cumle,
    entry.kategori,
  ].join(" "));

  return terms.every((term) => searchable.includes(term));
}

export function rankSozlukEntry(entry: SozlukEntry, query: string): number {
  const normalizedQuery = normalizeSozlukText(query);
  if (!normalizedQuery) return 0;

  const word = normalizeSozlukText(entry.kibrisca);
  const aliases = (entry.aliases ?? []).map(normalizeSozlukText);
  if (word === normalizedQuery || aliases.includes(normalizedQuery)) return 0;
  if (word.startsWith(normalizedQuery) || aliases.some((alias) => alias.startsWith(normalizedQuery))) return 1;
  if (word.includes(normalizedQuery) || aliases.some((alias) => alias.includes(normalizedQuery))) return 2;
  if (normalizeSozlukText(entry.anlam).includes(normalizedQuery)) return 3;
  if (normalizeSozlukText(entry.cumle).includes(normalizedQuery)) return 4;
  return 5;
}

export function mergeSozlukEntries(
  bundled: SozlukEntry[],
  community: SozlukEntry[]
): SozlukEntry[] {
  const seen = new Set<string>();
  return [...bundled, ...community]
    .filter((entry) => {
      const key = sozlukEntryKey(entry);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareSozlukEntries);
}
