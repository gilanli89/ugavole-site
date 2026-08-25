import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function storagePath(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    const marker = "/storage/v1/object/public/sunset-photos/";
    const offset = url.pathname.indexOf(marker);
    if (offset < 0) return null;
    const encodedPath = url.pathname.slice(offset + marker.length);
    const path = encodedPath
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/");
    if (
      !path ||
      path.length > 500 ||
      path.startsWith("/") ||
      path.split("/").some((part) => !part || part === "." || part === "..") ||
      !/^[A-Za-z0-9._/-]+$/.test(path)
    ) return null;
    return path;
  } catch {
    return null;
  }
}

function validSignature(bytes: Uint8Array, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= signature.length && signature.every((value, index) => bytes[index] === value);
  }
  return (
    mimeType === "image/webp" &&
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}

function errorResponse(status: number): Response {
  return new Response(null, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID.test(id)) return errorResponse(400);

  try {
    const admin = createAdminClient();
    const { data: photo, error: rowError } = await admin
      .from("gunbatimi_fotolar")
      .select("gorsel_url")
      .eq("id", id)
      .eq("aktif", true)
      .maybeSingle();
    if (rowError || !photo?.gorsel_url) return errorResponse(404);

    const path = storagePath(photo.gorsel_url as string);
    if (!path) return errorResponse(404);

    const { data: blob, error: downloadError } = await admin.storage
      .from("sunset-photos")
      .download(path);
    if (downloadError || !blob || blob.size < 1 || blob.size > MAX_IMAGE_BYTES) {
      return errorResponse(404);
    }

    const mimeType = blob.type.split(";", 1)[0].toLowerCase();
    if (!ALLOWED_TYPES.has(mimeType)) return errorResponse(415);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (!validSignature(bytes, mimeType)) return errorResponse(415);

    return new Response(bytes, {
      status: 200,
      headers: {
        // A moderator takedown must stop future delivery immediately.
        "Cache-Control": "private, no-store",
        "Content-Length": String(bytes.byteLength),
        "Content-Type": mimeType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return errorResponse(503);
  }
}
