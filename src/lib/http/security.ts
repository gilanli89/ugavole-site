export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || (fetchSite && fetchSite !== "same-origin")) return false;

  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    const configuredUrl = process.env.APP_ORIGIN;
    const expectedOrigin = configuredUrl
      ? new URL(configuredUrl).origin
      : requestUrl.origin;
    return originUrl.origin === expectedOrigin;
  } catch {
    return false;
  }
}

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<unknown> {
  if (!Number.isInteger(maxBytes) || maxBytes < 1) {
    throw new Error("invalid_body_limit");
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0 || parsedLength > maxBytes) {
      throw new Error("body_too_large");
    }
  }

  if (!request.body) throw new Error("empty_body");

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytesRead = 0;
  let json = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) throw new Error("body_too_large");
      json += decoder.decode(value, { stream: true });
    }
    json += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  if (!json.trim()) throw new Error("empty_body");
  return JSON.parse(json) as unknown;
}

export function noStoreJson(body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}
