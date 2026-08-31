import { revalidatePath } from "next/cache";
import { moderateDictionaryEntry } from "@/lib/data/dictionary";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return noStoreJson({ error: "Kelime kimliği geçersiz" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await readJsonBody(request, 4_000);
  } catch (error) {
    if (error instanceof Error && error.message === "body_too_large") {
      return noStoreJson({ error: "İstek çok büyük" }, { status: 413 });
    }
    return noStoreJson({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 400 });
  }
  const raw = payload as Record<string, unknown>;
  const action = typeof raw.action === "string" ? raw.action : "";
  if (
    action !== "review" &&
    action !== "approve" &&
    action !== "reject" &&
    action !== "unpublish"
  ) {
    return noStoreJson({ error: "İşlem geçersiz" }, { status: 400 });
  }

  if (raw.note !== undefined && typeof raw.note !== "string") {
    return noStoreJson({ error: "Moderasyon notu geçersiz" }, { status: 400 });
  }
  const note = typeof raw.note === "string" ? raw.note.trim() : "";
  if (note.length > 1_000) {
    return noStoreJson({ error: "Moderasyon notu çok uzun" }, { status: 400 });
  }
  if ((action === "reject" || action === "unpublish") && note.length < 3) {
    return noStoreJson(
      {
        error:
          action === "unpublish"
            ? "Yayından kaldırma nedeni zorunlu"
            : "Ret nedeni zorunlu",
      },
      { status: 400 }
    );
  }

  if (!Number.isInteger(raw.contentVersion) || (raw.contentVersion as number) < 1) {
    return noStoreJson({ error: "Kelime sürümü geçersiz" }, { status: 400 });
  }

  try {
    await moderateDictionaryEntry(
      id,
      raw.contentVersion as number,
      action,
      note
    );

    if (action === "approve" || action === "unpublish") {
      revalidatePath("/sozluk");
    }
    revalidatePath("/admin");
    return noStoreJson({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return noStoreJson({ error: "Yetkisiz" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "dictionary_entry_not_found") {
      return noStoreJson({ error: "Kelime önerisi bulunamadı" }, { status: 404 });
    }
    if (error instanceof Error && error.message === "duplicate_published_dictionary_key") {
      return noStoreJson(
        { error: "Bu kelime zaten yayında; öneriyi reddedin veya mevcut kaydı düzenleyin" },
        { status: 409 }
      );
    }
    return noStoreJson(
      { error: "İşlem uygulanamadı; kelime durumu değişmiş olabilir" },
      { status: 409 }
    );
  }
}
