import { NextResponse } from "next/server";
import { verifyCronSignature } from "@/lib/social/hmac";
import { consumeCronNonce } from "@/lib/social/outbox";
import { ingestEditorialDrafts } from "@/lib/editorial/ingest";

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
  try {
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
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (process.env.UGAVOLE_EDITORIAL_DRAFTS_ENABLED !== "true") {
    return response({ ok: false, error: "editorial_drafts_disabled" }, 503);
  }

  const secret = process.env.EDITORIAL_CRON_SECRET;
  if (!secret || secret.length < 32 || !process.env.GEMINI_API_KEY || !process.env.UGAVOLE_EDITORIAL_MODEL) {
    return response({ ok: false, error: "editorial_drafts_not_configured" }, 503);
  }

  let rawBody: string | null;
  try {
    rawBody = await readBoundedBody(request, 1_024);
  } catch {
    return response({ ok: false, error: "invalid_request_encoding" }, 400);
  }
  if (rawBody === null) return response({ ok: false, error: "request_too_large" }, 413);

  const verification = verifyCronSignature({
    secret,
    rawBody,
    timestampHeader: request.headers.get("x-ugavole-timestamp"),
    signatureHeader: request.headers.get("x-ugavole-signature"),
  });
  if (!verification.ok) return response({ ok: false, error: verification.reason }, 401);

  let maxDrafts = 1;
  try {
    const payload = rawBody ? JSON.parse(rawBody) as unknown : {};
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return response({ ok: false, error: "invalid_payload" }, 400);
    }
    const candidate = (payload as Record<string, unknown>).maxDrafts;
    if (candidate !== undefined) {
      if (!Number.isInteger(candidate) || (candidate as number) < 1 || (candidate as number) > 3) {
        return response({ ok: false, error: "invalid_max_drafts" }, 400);
      }
      maxDrafts = candidate as number;
    }
  } catch {
    return response({ ok: false, error: "invalid_json" }, 400);
  }

  try {
    const fresh = await consumeCronNonce(verification.nonceHash, verification.expiresAt);
    if (!fresh) return response({ ok: false, error: "cron_replay_rejected" }, 409);
    return response({ ok: true, summary: await ingestEditorialDrafts(maxDrafts) }, 200);
  } catch {
    return response({ ok: false, error: "editorial_drafts_failed" }, 500);
  }
}
