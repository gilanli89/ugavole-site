import "server-only";

import { randomUUID } from "node:crypto";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteverifyResult = {
  success?: boolean;
  hostname?: string;
  action?: string;
};

export async function verifyTurnstile(input: {
  token: string;
  remoteIp?: string;
  action?: string;
}): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME?.trim().toLowerCase();
  const expectedAction = input.action?.trim() || "ugc_submit";
  if (!secret || secret.length < 20 || !expectedHostname) return false;
  if (!input.token || input.token.length > 2048) return false;
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(expectedAction)) return false;

  const payload = new URLSearchParams({
    secret,
    response: input.token,
    idempotency_key: randomUUID(),
  });
  if (input.remoteIp) payload.set("remoteip", input.remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return false;

    const result = (await response.json()) as SiteverifyResult;
    return (
      result.success === true &&
      result.hostname?.toLowerCase() === expectedHostname &&
      result.action === expectedAction
    );
  } catch {
    return false;
  }
}
