import { createClient } from "@/lib/supabase/server";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 5_000);
  } catch {
    return noStoreJson({ error: "Geçersiz istek" }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown }).email === "string"
    ? (body as { email: string }).email.trim().toLowerCase()
    : "";
  const password = typeof (body as { password?: unknown }).password === "string"
    ? (body as { password: string }).password
    : "";

  if (!email || email.length > 254 || password.length < 8 || password.length > 200) {
    return noStoreJson({ error: "E-posta veya parola geçersiz" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return noStoreJson({ error: "E-posta veya parola hatalı" }, { status: 401 });
    }

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError) {
      await supabase.auth.signOut();
      return noStoreJson({ error: "İkinci faktör durumu doğrulanamadı" }, { status: 503 });
    }

    return noStoreJson({
      success: true,
      mfaRequired: aal.currentLevel !== "aal2",
    });
  } catch {
    return noStoreJson({ error: "Giriş hizmeti henüz yapılandırılmadı" }, { status: 503 });
  }
}
