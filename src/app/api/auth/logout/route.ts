import { createClient } from "@/lib/supabase/server";
import { isSameOrigin, noStoreJson } from "@/lib/http/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return noStoreJson({ error: "Oturum kapatılamadı" }, { status: 500 });
    }
  } catch {
    return noStoreJson({ error: "Oturum hizmetine ulaşılamadı" }, { status: 503 });
  }

  return noStoreJson({ success: true });
}
