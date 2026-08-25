import "server-only";

import { createHash } from "node:crypto";
import { getAllowedMediaHosts } from "./config";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type LoadedImage = {
  bytes: Uint8Array;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  finalUrl: string;
  sha256: string;
};

function assertAllowedUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("media_url_invalid");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    url.protocol !== "https:" ||
    (url.port && url.port !== "443") ||
    url.username ||
    url.password ||
    !getAllowedMediaHosts().has(hostname)
  ) {
    throw new Error("media_url_not_allowed");
  }
  if (url.search || url.hash) throw new Error("media_url_query_or_fragment_not_allowed");
  return url;
}

function hasExpectedMagicBytes(bytes: Uint8Array, mimeType: LoadedImage["mimeType"]): boolean {
  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= signature.length && signature.every((value, index) => bytes[index] === value);
  }
  return (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}

async function readLimitedBody(response: Response): Promise<Uint8Array> {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_IMAGE_BYTES) throw new Error("media_too_large");
  if (!response.body) throw new Error("media_body_missing");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_IMAGE_BYTES) {
      await reader.cancel();
      throw new Error("media_too_large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function loadApprovedImage(rawUrl: string): Promise<LoadedImage> {
  let url = assertAllowedUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      const response = await fetch(url, {
        cache: "no-store",
        redirect: "manual",
        signal: controller.signal,
        headers: { Accept: "image/jpeg,image/png,image/webp" },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location || redirects === 3) throw new Error("media_redirect_invalid");
        await response.body?.cancel();
        url = assertAllowedUrl(new URL(location, url).toString());
        continue;
      }
      if (!response.ok) throw new Error(`media_fetch_${response.status}`);

      const mimeType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
      if (!mimeType || !ALLOWED_IMAGE_TYPES.has(mimeType)) throw new Error("media_type_not_allowed");
      const bytes = await readLimitedBody(response);
      if (!hasExpectedMagicBytes(bytes, mimeType as LoadedImage["mimeType"])) {
        throw new Error("media_signature_mismatch");
      }
      return {
        bytes,
        mimeType: mimeType as LoadedImage["mimeType"],
        finalUrl: url.toString(),
        sha256: createHash("sha256").update(bytes).digest("hex"),
      };
    }
    throw new Error("media_redirect_invalid");
  } finally {
    clearTimeout(timeout);
  }
}
