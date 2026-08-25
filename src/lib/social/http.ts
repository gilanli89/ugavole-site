import "server-only";

export type ProviderResponse = {
  ok: boolean;
  status: number;
  body: unknown;
  retryAfterSeconds?: number;
};

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Math.max(1, Math.min(Number(value), 21_600));
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(1, Math.min(Math.ceil((date - Date.now()) / 1000), 21_600));
}

export async function requestProviderJson(
  url: string,
  init: RequestInit,
  timeoutMs = 15_000
): Promise<ProviderResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });
    const raw = await response.text();
    let body: unknown = null;
    if (raw) {
      try {
        body = JSON.parse(raw) as unknown;
      } catch {
        body = { message: raw.slice(0, 500) };
      }
    }
    return {
      ok: response.ok,
      status: response.status,
      body,
      retryAfterSeconds: parseRetryAfter(response.headers.get("retry-after")),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function objectValue(value: unknown, key: string): unknown {
  return value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
}

export function providerId(body: unknown): string | null {
  const direct = objectValue(body, "id");
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  const data = objectValue(body, "data");
  const nested = objectValue(data, "id");
  return typeof nested === "string" || typeof nested === "number" ? String(nested) : null;
}

export function providerMessage(body: unknown, secrets: Array<string | null> = []): string {
  const error = objectValue(body, "error");
  const errors = objectValue(body, "errors");
  const firstError = Array.isArray(errors) ? errors[0] : undefined;
  const candidates = [
    objectValue(error, "message"),
    objectValue(error, "error_user_msg"),
    objectValue(firstError, "detail"),
    objectValue(firstError, "title"),
    objectValue(body, "message"),
  ];
  let message = candidates.find((candidate) => typeof candidate === "string") as string | undefined;
  message = message?.slice(0, 700) ?? "Provider request failed";

  for (const secret of secrets) {
    if (secret && secret.length >= 8) message = message.split(secret).join("[redacted]");
  }

  return message
    .replace(/(access[_-]?token|oauth[_-]?token|api[_-]?key|authorization|credential|secret)\s*[:=]\s*[^\s,;]+/gi, "$1=[redacted]")
    .replace(/bearer\s+[a-z0-9._~-]+/gi, "Bearer [redacted]")
    .replace(/([?&](?:access[_-]?token|oauth[_-]?token|api[_-]?key|token|signature|sig|key|auth|authorization|credential|secret|expires|x-amz-signature|x-goog-signature)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/\beyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{10,}(?:\.[a-zA-Z0-9_-]{10,})?\b/g, "[redacted-token]")
    .slice(0, 500);
}

export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export function isExplicitTransientProviderError(body: unknown): boolean {
  const error = objectValue(body, "error");
  const transient = objectValue(error, "is_transient");
  if (transient === true) return true;
  const rawCode = objectValue(error, "code");
  const code = typeof rawCode === "number" ? rawCode : Number(rawCode);
  return Number.isFinite(code) && [1, 2, 4, 17, 32, 341, 613].includes(code);
}
