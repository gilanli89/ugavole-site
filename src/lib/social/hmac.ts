import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const CRON_MAX_SKEW_SECONDS = 300;

export function createCronSignature(secret: string, timestamp: number, rawBody: string): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
}

export function cronNonceHash(signature: string): string {
  return createHash("sha256").update(signature, "utf8").digest("hex");
}

export type CronSignatureVerification =
  | { ok: true; timestamp: number; nonceHash: string; expiresAt: string }
  | { ok: false; reason: "timestamp_invalid" | "timestamp_stale" | "signature_invalid" };

export function verifyCronSignature(input: {
  secret: string;
  rawBody: string;
  timestampHeader: string | null;
  signatureHeader: string | null;
  nowSeconds?: number;
}): CronSignatureVerification {
  if (!input.timestampHeader || !/^\d{10}$/.test(input.timestampHeader)) {
    return { ok: false, reason: "timestamp_invalid" };
  }

  const timestamp = Number(input.timestampHeader);
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now - timestamp) > CRON_MAX_SKEW_SECONDS) {
    return { ok: false, reason: "timestamp_stale" };
  }

  const provided = input.signatureHeader?.replace(/^v1=/, "").toLowerCase() ?? "";
  if (!/^[a-f0-9]{64}$/.test(provided)) {
    return { ok: false, reason: "signature_invalid" };
  }

  const expected = createCronSignature(input.secret, timestamp, input.rawBody);
  const expectedBytes = Buffer.from(expected, "hex");
  const providedBytes = Buffer.from(provided, "hex");
  if (expectedBytes.length !== providedBytes.length || !timingSafeEqual(expectedBytes, providedBytes)) {
    return { ok: false, reason: "signature_invalid" };
  }

  return {
    ok: true,
    timestamp,
    nonceHash: cronNonceHash(provided),
    expiresAt: new Date((timestamp + CRON_MAX_SKEW_SECONDS) * 1000).toISOString(),
  };
}
