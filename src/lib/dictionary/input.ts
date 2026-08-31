import { kategoriler, sozlukData, type Kategori } from "@/lib/sozluk-data";
import { normalizeSozlukText } from "@/lib/sozluk-search";

export const DICTIONARY_INPUT_LIMITS = {
  wordMin: 2,
  wordMax: 80,
  aliasesMax: 6,
  aliasMin: 2,
  aliasMax: 80,
  definitionMin: 3,
  definitionMax: 600,
  exampleMax: 400,
} as const;

export type DictionarySubmissionInput = {
  word: string;
  normalizedKey: string;
  aliases: string[];
  definition: string;
  example: string;
  category: Kategori;
  rightsConfirmed: true;
  website: "";
};

export type DictionaryInputParseResult =
  | { ok: true; value: DictionarySubmissionInput }
  | { ok: false; error: string };

const UNSAFE_CONTROL_CHARACTERS =
  /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/;

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").replace(/\s+/gu, " ").trim();
  return UNSAFE_CONTROL_CHARACTERS.test(normalized) ? null : normalized;
}

function optionalText(value: unknown): string | null {
  if (value === undefined || value === null) return "";
  return cleanText(value);
}

export function parseDictionaryInput(input: unknown): DictionaryInputParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Geçersiz form" };
  }

  const raw = input as Record<string, unknown>;
  const website = optionalText(raw.website);
  if (website === null || website) {
    return { ok: false, error: "Geçersiz form" };
  }

  const word = cleanText(raw.word);
  if (
    word === null ||
    word.length < DICTIONARY_INPUT_LIMITS.wordMin ||
    word.length > DICTIONARY_INPUT_LIMITS.wordMax
  ) {
    return { ok: false, error: "Kelime 2-80 karakter olmalı" };
  }

  const normalizedKey = normalizeSozlukText(word);
  if (!normalizedKey || normalizedKey.length > DICTIONARY_INPUT_LIMITS.wordMax) {
    return { ok: false, error: "Kelime geçerli harf veya rakam içermeli" };
  }

  if (raw.aliases !== undefined && !Array.isArray(raw.aliases)) {
    return { ok: false, error: "Alternatif yazılışlar geçersiz" };
  }
  const rawAliases = (raw.aliases ?? []) as unknown[];
  if (rawAliases.length > DICTIONARY_INPUT_LIMITS.aliasesMax) {
    return { ok: false, error: "En fazla 6 alternatif yazılış eklenebilir" };
  }

  const aliases: string[] = [];
  const aliasKeys = new Set<string>([normalizedKey]);
  for (const value of rawAliases) {
    const alias = cleanText(value);
    if (
      alias === null ||
      alias.length < DICTIONARY_INPUT_LIMITS.aliasMin ||
      alias.length > DICTIONARY_INPUT_LIMITS.aliasMax
    ) {
      return { ok: false, error: "Her alternatif yazılış 2-80 karakter olmalı" };
    }

    const aliasKey = normalizeSozlukText(alias);
    if (!aliasKey || aliasKey.length > DICTIONARY_INPUT_LIMITS.aliasMax) {
      return { ok: false, error: "Alternatif yazılış geçersiz" };
    }
    if (aliasKeys.has(aliasKey)) continue;
    aliasKeys.add(aliasKey);
    aliases.push(alias);
  }

  const definition = cleanText(raw.definition);
  if (
    definition === null ||
    definition.length < DICTIONARY_INPUT_LIMITS.definitionMin ||
    definition.length > DICTIONARY_INPUT_LIMITS.definitionMax
  ) {
    return { ok: false, error: "Anlam 3-600 karakter olmalı" };
  }

  const example = optionalText(raw.example);
  if (example === null || example.length > DICTIONARY_INPUT_LIMITS.exampleMax) {
    return { ok: false, error: "Örnek kullanım en fazla 400 karakter olabilir" };
  }

  const category = cleanText(raw.category) as Kategori | null;
  if (!category || !kategoriler.includes(category)) {
    return { ok: false, error: "Kategori geçersiz" };
  }

  if (raw.rights_confirmed !== true) {
    return { ok: false, error: "Doğruluk ve yayın izni beyanı zorunlu" };
  }

  return {
    ok: true,
    value: {
      word,
      normalizedKey,
      aliases,
      definition,
      example,
      category,
      rightsConfirmed: true,
      website: "",
    },
  };
}

export function hasBundledDictionaryConflict(
  input: Pick<DictionarySubmissionInput, "normalizedKey" | "aliases">
): boolean {
  const proposedKeys = new Set([
    input.normalizedKey,
    ...input.aliases.map(normalizeSozlukText),
  ]);

  return sozlukData.some((entry) =>
    [entry.kibrisca, ...(entry.aliases ?? [])]
      .map(normalizeSozlukText)
      .some((key) => key && proposedKeys.has(key))
  );
}
