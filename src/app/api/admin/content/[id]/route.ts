import { revalidatePath } from "next/cache";
import { moderateContent, publishModeratedContent } from "@/lib/data/moderation";
import type { SocialPlatform } from "@/lib/social/types";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return noStoreJson({ error: "İçerik kimliği geçersiz" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 8_000);
  } catch {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 400 });
  }

  const action = typeof (body as { action?: unknown }).action === "string"
    ? (body as { action: string }).action
    : "";
  const note = typeof (body as { note?: unknown }).note === "string"
    ? (body as { note: string }).note.trim().slice(0, 1000)
    : "";
  const contentVersion = (body as { contentVersion?: unknown }).contentVersion;

  if (action !== "review" && action !== "approve" && action !== "reject" && action !== "publish") {
    return noStoreJson({ error: "İşlem geçersiz" }, { status: 400 });
  }
  if (action === "reject" && note.length < 3) {
    return noStoreJson({ error: "Ret nedeni zorunlu" }, { status: 400 });
  }
  if (!Number.isInteger(contentVersion) || (contentVersion as number) < 1) {
    return noStoreJson({ error: "İçerik sürümü geçersiz" }, { status: 400 });
  }

  try {
    if (action === "publish") {
      const raw = body as Record<string, unknown>;
      const adEligible = raw.adEligible;
      const socialReady = raw.socialReady;
      const platforms = raw.platforms;

      if (typeof adEligible !== "boolean" || typeof socialReady !== "boolean") {
        return noStoreJson({ error: "Reklam ve sosyal kararları açıkça seçilmeli" }, { status: 400 });
      }
      if (socialReady && !adEligible) {
        return noStoreJson({ error: "Otomatik paylaşım için reklam uygunluğu onayı gerekli" }, { status: 400 });
      }

      const selectedPlatforms = platforms === undefined
        ? undefined
        : Array.isArray(platforms) && platforms.length <= 3 && platforms.every(
            (platform) => platform === "facebook" || platform === "instagram" || platform === "x"
          )
          ? [...new Set(platforms)] as SocialPlatform[]
          : null;
      if (selectedPlatforms === null) {
        return noStoreJson({ error: "Sosyal hedef geçersiz" }, { status: 400 });
      }

      await publishModeratedContent({
        contentId: id,
        contentVersion: contentVersion as number,
        adEligible,
        socialReady,
        platforms: selectedPlatforms,
      });
      revalidatePath("/");
      revalidatePath("/haber/[slug]", "page");
      revalidatePath("/sitemap.xml");
    } else {
      await moderateContent(id, contentVersion as number, action, note);
    }
    revalidatePath("/admin");
    return noStoreJson({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return noStoreJson({ error: "Yetkisiz" }, { status: 401 });
    }
    return noStoreJson({ error: "İşlem uygulanamadı; içerik durumu değişmiş olabilir" }, { status: 409 });
  }
}
