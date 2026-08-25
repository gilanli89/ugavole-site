import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";

function hmac(value: string): string {
  const secret = process.env.UGC_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("UGC rate-limit secret is missing or too short");
  }
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function requestFingerprint(request: Request): {
  ipHash: string;
  userAgentHash: string;
} {
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) || "unknown";
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim() ?? "";
  const trustedCloudflareIp =
    process.env.TRUST_CLOUDFLARE_IP_HEADER === "true" && isIP(cloudflareIp)
      ? cloudflareIp
      : "";
  const fallbackSignals = [
    userAgent,
    request.headers.get("accept-language")?.slice(0, 200) ?? "",
    request.headers.get("accept-encoding")?.slice(0, 100) ?? "",
    request.headers.get("sec-ch-ua")?.slice(0, 300) ?? "",
    request.headers.get("sec-ch-ua-platform")?.slice(0, 100) ?? "",
  ].join("|");
  const rateKey = trustedCloudflareIp
    ? `cf-ip:${trustedCloudflareIp}`
    : `browser:${fallbackSignals}`;

  return {
    ipHash: hmac(`rate:${rateKey}`),
    userAgentHash: hmac(`ua:${userAgent}`),
  };
}

export function trustedClientIp(request: Request): string | undefined {
  if (process.env.TRUST_CLOUDFLARE_IP_HEADER !== "true") return undefined;
  const value = request.headers.get("cf-connecting-ip")?.trim() ?? "";
  return isIP(value) ? value : undefined;
}

export function hashIdempotencyKey(value: string): string {
  return hmac(`idempotency:${value}`);
}

export function hashSubmissionPayload(value: string): string {
  return hmac(`payload:${value}`);
}
