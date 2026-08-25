import { createAdminClient } from "@/lib/supabase/admin";
import { noStoreJson } from "@/lib/http/security";
import { verifyCronSignature } from "@/lib/social/hmac";
import { consumeCronNonce } from "@/lib/social/outbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function readBoundedText(request: Request, maxBytes: number): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let value = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) throw new Error("body_too_large");
      value += decoder.decode(chunk.value, { stream: true });
    }
    return value + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  const secret = process.env.RETENTION_CRON_SECRET;
  if (!secret || secret.length < 32) {
    return noStoreJson({ ok: false, error: "maintenance_cron_not_configured" }, { status: 503 });
  }

  let rawBody: string;
  try {
    rawBody = await readBoundedText(request, 512);
  } catch (error) {
    const status = error instanceof Error && error.message === "body_too_large" ? 413 : 400;
    return noStoreJson({ ok: false, error: "invalid_request_body" }, { status });
  }

  const verification = verifyCronSignature({
    secret,
    rawBody,
    timestampHeader: request.headers.get("x-ugavole-timestamp"),
    signatureHeader: request.headers.get("x-ugavole-signature"),
  });
  if (!verification.ok) {
    return noStoreJson({ ok: false, error: verification.reason }, { status: 401 });
  }

  let retentionDays = 2;
  try {
    const parsed = rawBody ? JSON.parse(rawBody) as unknown : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return noStoreJson({ ok: false, error: "invalid_payload" }, { status: 400 });
    }
    const payload = parsed as Record<string, unknown>;
    const candidate = payload.rateLimitRetentionDays;
    if (candidate !== undefined) {
      if (!Number.isInteger(candidate) || (candidate as number) < 1 || (candidate as number) > 30) {
        return noStoreJson({ ok: false, error: "invalid_retention_days" }, { status: 400 });
      }
      retentionDays = candidate as number;
    }
  } catch {
    return noStoreJson({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  try {
    const fresh = await consumeCronNonce(verification.nonceHash, verification.expiresAt);
    if (!fresh) {
      return noStoreJson({ ok: false, error: "cron_replay_rejected" }, { status: 409 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("cleanup_ugc_retention", {
      p_rate_limit_retention_days: retentionDays,
    });
    if (error) throw error;
    return noStoreJson({ ok: true, summary: data });
  } catch {
    return noStoreJson({ ok: false, error: "maintenance_failed" }, { status: 500 });
  }
}
