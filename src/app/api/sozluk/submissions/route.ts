import { createAdminClient } from "@/lib/supabase/admin";
import {
  hasBundledDictionaryConflict,
  parseDictionaryInput,
} from "@/lib/dictionary/input";
import {
  hashIdempotencyKey,
  hashSubmissionPayload,
  requestFingerprint,
  trustedClientIp,
} from "@/lib/abuse/request-fingerprint";
import { verifyTurnstile } from "@/lib/abuse/turnstile";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";

const CONSENT_VERSION = "dictionary-v1-2026-08-31";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }
  if (process.env.DICTIONARY_SUBMISSIONS_ENABLED !== "true") {
    return noStoreJson(
      { error: "Kelime katkısı güvenlik kurulumu tamamlanana kadar kapalı." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request, 8_000);
  } catch (error) {
    if (error instanceof Error && error.message === "body_too_large") {
      return noStoreJson({ error: "Kelime önerisi çok büyük" }, { status: 413 });
    }
    return noStoreJson({ error: "Geçersiz form" }, { status: 400 });
  }

  const parsed = parseDictionaryInput(payload);
  if (!parsed.ok) {
    return noStoreJson({ error: parsed.error }, { status: 400 });
  }
  if (hasBundledDictionaryConflict(parsed.value)) {
    return noStoreJson(
      { error: "Bu kelime veya yazım biçimi zaten sözlükte var." },
      { status: 409 }
    );
  }

  const idempotencyKey = request.headers.get("x-idempotency-key")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) {
    return noStoreJson({ error: "Gönderi anahtarı geçersiz" }, { status: 400 });
  }

  const turnstileToken =
    typeof (payload as { turnstile_token?: unknown }).turnstile_token === "string"
      ? (payload as { turnstile_token: string }).turnstile_token.trim()
      : "";
  if (!turnstileToken || turnstileToken.length > 2_048) {
    return noStoreJson({ error: "Güvenlik doğrulaması zorunlu" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { ipHash, userAgentHash } = requestFingerprint(request);
    const idempotencyHash = hashIdempotencyKey(idempotencyKey);
    const input = parsed.value;
    const payloadHash = hashSubmissionPayload(JSON.stringify(input));

    const { data: existing, error: lookupError } = await admin
      .from("dictionary_submission_meta")
      .select("entry_id, payload_hash")
      .eq("idempotency_key_hash", idempotencyHash)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existing) {
      if (existing.payload_hash !== payloadHash) {
        return noStoreJson(
          { error: "Bu gönderi anahtarı farklı bir kelime için kullanılmış" },
          { status: 409 }
        );
      }
      return noStoreJson(
        { success: true, submissionId: existing.entry_id, status: "pending" },
        { status: 202 }
      );
    }

    const turnstileValid = await verifyTurnstile({
      token: turnstileToken,
      remoteIp: trustedClientIp(request),
      action: "dictionary_submit",
    });
    if (!turnstileValid) {
      return noStoreJson(
        { error: "Güvenlik doğrulaması geçersiz veya süresi dolmuş" },
        { status: 400 }
      );
    }

    const { data: submissionId, error } = await admin.rpc("submit_dictionary_entry", {
      p_word: input.word,
      p_normalized_key: input.normalizedKey,
      p_aliases: input.aliases,
      p_definition: input.definition,
      p_example: input.example || null,
      p_category: input.category,
      p_rights_confirmed: input.rightsConfirmed,
      p_ip_hash: ipHash,
      p_user_agent_hash: userAgentHash,
      p_idempotency_key_hash: idempotencyHash,
      p_payload_hash: payloadHash,
      p_consent_version: CONSENT_VERSION,
    });

    if (error?.message.includes("dictionary_rate_limit_exceeded")) {
      return noStoreJson(
        { error: "Çok sık kelime önerdiniz. Lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }
    if (error?.message.includes("dictionary_idempotency_payload_mismatch")) {
      return noStoreJson(
        { error: "Bu gönderi anahtarı farklı bir kelime için kullanılmış" },
        { status: 409 }
      );
    }
    if (error?.message.includes("dictionary_entry_already_active")) {
      return noStoreJson(
        { error: "Bu kelime için zaten aktif bir öneri veya yayın var." },
        { status: 409 }
      );
    }
    if (error || !submissionId) {
      throw error ?? new Error("Dictionary submission was not stored");
    }

    return noStoreJson(
      { success: true, submissionId, status: "pending" },
      { status: 202 }
    );
  } catch {
    return noStoreJson(
      { error: "Kelime katkısı henüz hazır değil. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }
}
