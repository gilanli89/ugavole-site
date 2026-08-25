import { NextResponse } from "next/server";
import { getCronSecret, isSocialWorkerEnabled } from "@/lib/social/config";
import { verifyCronSignature } from "@/lib/social/hmac";
import { consumeCronNonce } from "@/lib/social/outbox";
import { runSocialWorker } from "@/lib/social/worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function readBoundedBody(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(body);
}

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isSocialWorkerEnabled()) {
    return response({ ok: false, error: "social_worker_disabled" }, 503);
  }

  const secret = getCronSecret();
  if (!secret) return response({ ok: false, error: "cron_not_configured" }, 503);

  let rawBody: string | null;
  try {
    rawBody = await readBoundedBody(request, 1_024);
  } catch {
    return response({ ok: false, error: "invalid_request_encoding" }, 400);
  }
  if (rawBody === null) {
    return response({ ok: false, error: "request_too_large" }, 413);
  }

  const verification = verifyCronSignature({
    secret,
    rawBody,
    timestampHeader: request.headers.get("x-ugavole-timestamp"),
    signatureHeader: request.headers.get("x-ugavole-signature"),
  });
  if (!verification.ok) return response({ ok: false, error: verification.reason }, 401);

  let payload: unknown;
  try {
    payload = rawBody ? (JSON.parse(rawBody) as unknown) : {};
  } catch {
    return response({ ok: false, error: "invalid_json" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return response({ ok: false, error: "invalid_payload" }, 400);
  }
  const batchValue = (payload as Record<string, unknown>).batchSize ?? 1;
  if (
    typeof batchValue !== "number" ||
    !Number.isInteger(batchValue) ||
    batchValue < 1 ||
    batchValue > 1
  ) {
    return response({ ok: false, error: "invalid_batch_size" }, 400);
  }

  try {
    const fresh = await consumeCronNonce(verification.nonceHash, verification.expiresAt);
    if (!fresh) return response({ ok: false, error: "cron_replay_rejected" }, 409);
    const summary = await runSocialWorker(batchValue);
    return response({ ok: true, summary }, 200);
  } catch {
    return response({ ok: false, error: "social_worker_failed" }, 500);
  }
}
