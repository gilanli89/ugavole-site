import { createAdminClient } from "@/lib/supabase/admin";
import { noStoreJson } from "@/lib/http/security";
import { garageCookie } from "@/components/games/cukur-rallisi/garage-cookie";
import { unlockedVehicles } from "@/components/games/cukur-rallisi/vehicles";
export async function GET(request: Request) {
  const id = garageCookie(request);
  if (!id) return noStoreJson({ points: 0, unlocked: unlockedVehicles(0) });
  try {
    const { data, error } = await createAdminClient()
      .from("cukur_rallisi_garages")
      .select("points")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    const points = Number(data?.points ?? 0);
    return noStoreJson({ points, unlocked: unlockedVehicles(points) });
  } catch {
    return noStoreJson({ error: "Garajına ulaşılamadı." }, { status: 503 });
  }
}
