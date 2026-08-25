import "server-only";

import { getStaffSession } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { publishApprovedContent } from "@/lib/social/outbox";
import type { SocialPlatform } from "@/lib/social/types";

export type ModerationStatus = "pending" | "in_review" | "approved" | "rejected";

export type ModerationItemDTO = {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  preview: string;
  category: string;
  location: string | null;
  sourceUrl: string | null;
  authorName: string;
  authorEmail: string | null;
  status: ModerationStatus;
  adStatus: "off" | "eligible" | "restricted";
  socialStatus: "off" | "ready" | "paused";
  contentVersion: number;
  createdAt: string;
};

type QueueRow = {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  body: { blocks?: Array<{ type?: string; text?: string }> } | null;
  category: string;
  location: string | null;
  source_url: string | null;
  author_name: string;
  status: ModerationStatus;
  ad_status: "off" | "eligible" | "restricted";
  social_status: "off" | "ready" | "paused";
  content_version: number;
  created_at: string;
};

export async function listModerationQueue(): Promise<ModerationItemDTO[]> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select(
      "id, slug, type, title, excerpt, body, category, location, source_url, author_name, status, ad_status, social_status, content_version, created_at"
    )
    .in("status", ["pending", "in_review", "approved", "rejected"])
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw new Error("Moderation queue could not be loaded");
  const rows = (data ?? []) as QueueRow[];

  const ids = rows.map((row) => row.id);
  const contacts = new Map<string, string>();
  if (ids.length > 0) {
    const { data: contactRows } = await supabase
      .from("submission_contacts")
      .select("content_id, email")
      .in("content_id", ids);
    for (const contact of contactRows ?? []) {
      contacts.set(contact.content_id as string, contact.email as string);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    excerpt: row.excerpt,
    preview: (row.body?.blocks ?? [])
      .flatMap((block) => (typeof block.text === "string" ? [block.text] : []))
      .join("\n\n")
      .slice(0, 2500),
    category: row.category,
    location: row.location,
    sourceUrl: row.source_url,
    authorName: row.author_name,
    authorEmail: contacts.get(row.id) ?? null,
    status: row.status,
    adStatus: row.ad_status,
    socialStatus: row.social_status,
    contentVersion: row.content_version,
    createdAt: row.created_at,
  }));
}

export async function moderateContent(
  contentId: string,
  expectedContentVersion: number,
  action: "review" | "approve" | "reject",
  note?: string
): Promise<void> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.rpc("moderate_content", {
    p_content_id: contentId,
    p_expected_content_version: expectedContentVersion,
    p_action: action,
    p_note: note?.trim() || null,
  });

  if (error) throw new Error("Moderation transition failed");
}

export async function publishModeratedContent(input: {
  contentId: string;
  contentVersion: number;
  adEligible: boolean;
  socialReady: boolean;
  platforms?: SocialPlatform[];
}): Promise<void> {
  const staff = await getStaffSession();
  if (!staff) throw new Error("Unauthorized");

  await publishApprovedContent({
    contentId: input.contentId,
    contentVersion: input.contentVersion,
    actorId: staff.userId,
    adEligible: input.adEligible,
    socialReady: input.socialReady,
    platforms: input.platforms,
  });
}
