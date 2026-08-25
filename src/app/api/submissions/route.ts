import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createContentSlug, parseUgcInput, toContentBlocks } from "@/lib/content/ugc";
import {
  hashIdempotencyKey,
  hashSubmissionPayload,
  requestFingerprint,
  trustedClientIp,
} from "@/lib/abuse/request-fingerprint";
import { verifyTurnstile } from "@/lib/abuse/turnstile";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";

const CONSENT_VERSION = "ugc-v1-2026-08-25";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }
  if (process.env.UGC_SUBMISSIONS_ENABLED !== "true") {
    return noStoreJson(
      { error: "Gönderi sistemi güvenlik kurulumu tamamlanana kadar kapalı." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request, 30_000);
  } catch (error) {
    if (error instanceof Error && error.message === "body_too_large") {
      return noStoreJson({ error: "Gönderi çok büyük" }, { status: 413 });
    }
    return noStoreJson({ error: "Geçersiz form" }, { status: 400 });
  }

  const parsed = parseUgcInput(payload);
  if (!parsed.ok) {
    return noStoreJson({ error: parsed.error }, { status: 400 });
  }

  const idempotencyKey = request.headers.get("x-idempotency-key")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) {
    return noStoreJson({ error: "Gönderi anahtarı geçersiz" }, { status: 400 });
  }

  const turnstileToken = typeof (payload as { turnstile_token?: unknown }).turnstile_token === "string"
    ? (payload as { turnstile_token: string }).turnstile_token.trim()
    : "";
  if (!turnstileToken || turnstileToken.length > 2048) {
    return noStoreJson({ error: "Güvenlik doğrulaması zorunlu" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { ipHash, userAgentHash } = requestFingerprint(request);
    const idempotencyHash = hashIdempotencyKey(idempotencyKey);
    const input = parsed.value;
    const payloadHash = hashSubmissionPayload(JSON.stringify(input));

    const { data: existing, error: lookupError } = await admin
      .from("submission_contacts")
      .select("content_id, payload_hash")
      .eq("idempotency_key_hash", idempotencyHash)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      if (existing.payload_hash !== payloadHash) {
        return noStoreJson(
          { error: "Bu gönderi anahtarı farklı bir içerikte kullanılmış" },
          { status: 409 }
        );
      }
      return noStoreJson(
        { success: true, submissionId: existing.content_id, status: "pending" },
        { status: 202 }
      );
    }

    const turnstileValid = await verifyTurnstile({
      token: turnstileToken,
      remoteIp: trustedClientIp(request),
    });
    if (!turnstileValid) {
      return noStoreJson(
        { error: "Güvenlik doğrulaması geçersiz veya süresi dolmuş" },
        { status: 400 }
      );
    }

    const slug = createContentSlug(input.title, randomUUID());
    const body = { version: 1, blocks: toContentBlocks(input.content) };
    const { data: contentId, error } = await admin.rpc("create_ugc_submission", {
      p_slug: slug,
      p_type: input.type,
      p_title: input.title,
      p_excerpt: input.excerpt,
      p_body: body,
      p_category: input.category,
      p_location: input.location,
      p_source_url: input.sourceUrl,
      p_author_name: input.authorName,
      p_email: input.authorEmail,
      p_ip_hash: ipHash,
      p_user_agent_hash: userAgentHash,
      p_idempotency_key_hash: idempotencyHash,
      p_payload_hash: payloadHash,
      p_consent_version: CONSENT_VERSION,
    });

    if (error?.message.includes("ugc_rate_limit_exceeded")) {
      return noStoreJson(
        { error: "Çok sık gönderi yaptınız. Lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }
    if (error?.message.includes("idempotency_key_payload_mismatch")) {
      return noStoreJson(
        { error: "Bu gönderi anahtarı farklı bir içerikte kullanılmış" },
        { status: 409 }
      );
    }
    if (error || !contentId) throw error ?? new Error("Submission was not stored");

    return noStoreJson(
      { success: true, submissionId: contentId, status: "pending" },
      { status: 202 }
    );
  } catch {
    return noStoreJson(
      { error: "Gönderi sistemi henüz hazır değil. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }
}
