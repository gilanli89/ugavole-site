import "server-only";

import { cache } from "react";
import { getStaffSession } from "@/lib/auth/dal";
import type { Kategori, SozlukEntry } from "@/lib/sozluk-data";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type DictionaryModerationStatus = "pending" | "in_review";

export type DictionaryModerationItemDTO = {
  id: string;
  word: string;
  aliases: string[];
  definition: string;
  example: string;
  category: Kategori;
  status: DictionaryModerationStatus;
  contentVersion: number;
  createdAt: string;
};

export type PublishedDictionaryModerationItemDTO = Omit<
  DictionaryModerationItemDTO,
  "status"
> & {
  status: "published";
  publishedAt: string;
};

export type DictionaryModerationAction =
  | "review"
  | "approve"
  | "reject"
  | "unpublish";

type PublishedDictionaryRow = {
  id: string;
  word: string;
  aliases: string[] | null;
  definition: string;
  example: string | null;
  category: Kategori;
};

type DictionaryQueueRow = PublishedDictionaryRow & {
  status: DictionaryModerationStatus;
  content_version: number;
  created_at: string;
};

type PublishedDictionaryModerationRow = PublishedDictionaryRow & {
  status: "published";
  content_version: number;
  created_at: string;
  published_at: string;
};

const CATEGORY_EMOJI: Record<Kategori, string> = {
  günlük: "💬",
  argo: "🗯️",
  deyim: "🗣️",
  "anlam farkı": "🔀",
  ünlem: "❗",
  yemek: "🍽️",
  kültür: "🏺",
  sevgi: "💛",
  doğa: "🌿",
  alet: "🛠️",
  araç: "🚗",
  mekan: "📍",
};

const loadPublishedDictionaryEntries = cache(async (): Promise<SozlukEntry[]> => {
  if (!hasSupabaseConfig()) return [];

  const supabase = createPublicClient();
  const pageSize = 500;
  const rows: PublishedDictionaryRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("published_dictionary_entries")
      .select("id, word, aliases, definition, example, category")
      .order("normalized_key", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error("Published dictionary entries could not be loaded");
    const page = (data ?? []) as PublishedDictionaryRow[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows.map((row) => ({
    id: `dictionary-${row.id}`,
    kibrisca: row.word,
    aliases: row.aliases ?? [],
    anlam: row.definition,
    cumle: row.example ?? "",
    kategori: row.category,
    emoji: CATEGORY_EMOJI[row.category] ?? "💬",
    zorluk: "orta",
    source: "community",
  }));
});

export async function listPublishedDictionaryEntries(): Promise<SozlukEntry[]> {
  try {
    return await loadPublishedDictionaryEntries();
  } catch {
    // Bundled entries keep /sozluk available while the optional database layer
    // is being migrated or temporarily unavailable.
    return [];
  }
}

export async function listDictionaryModerationQueue(): Promise<
  DictionaryModerationItemDTO[]
> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dictionary_entries")
    .select(
      "id, word, aliases, definition, example, category, status, content_version, created_at"
    )
    .in("status", ["pending", "in_review"])
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw new Error("Dictionary moderation queue could not be loaded");

  return ((data ?? []) as DictionaryQueueRow[]).map((row) => ({
    id: row.id,
    word: row.word,
    aliases: row.aliases ?? [],
    definition: row.definition,
    example: row.example ?? "",
    category: row.category,
    status: row.status,
    contentVersion: row.content_version,
    createdAt: row.created_at,
  }));
}

export async function listPublishedDictionaryModerationEntries(): Promise<
  PublishedDictionaryModerationItemDTO[]
> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dictionary_entries")
    .select(
      "id, word, aliases, definition, example, category, status, content_version, created_at, published_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(100);

  if (error) throw new Error("Published dictionary entries could not be loaded");

  return ((data ?? []) as PublishedDictionaryModerationRow[]).map((row) => ({
    id: row.id,
    word: row.word,
    aliases: row.aliases ?? [],
    definition: row.definition,
    example: row.example ?? "",
    category: row.category,
    status: "published",
    contentVersion: row.content_version,
    createdAt: row.created_at,
    publishedAt: row.published_at,
  }));
}

export async function moderateDictionaryEntry(
  id: string,
  expectedVersion: number,
  action: DictionaryModerationAction,
  note?: string
): Promise<void> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.rpc("moderate_dictionary_entry", {
    p_entry_id: id,
    p_expected_content_version: expectedVersion,
    p_action: action === "approve" ? "publish" : action,
    p_note: note?.trim() || null,
  });

  if (!error) return;

  const knownErrors = [
    "dictionary_entry_not_found",
    "dictionary_content_version_conflict",
    "invalid_dictionary_transition",
    "duplicate_published_dictionary_key",
    "dictionary_unpublish_note_required",
  ] as const;
  const known = knownErrors.find((code) => error.message.includes(code));
  if (known) throw new Error(known);
  if (error.message.includes("staff_aal2_required")) throw new Error("Unauthorized");
  throw new Error("Dictionary moderation transition failed");
}
