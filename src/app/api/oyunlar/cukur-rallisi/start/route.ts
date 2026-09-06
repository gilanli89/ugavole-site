import { randomInt, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestFingerprint } from "@/lib/abuse/request-fingerprint";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";
import {
  parseNickname,
  GAME_VERSION,
} from "@/components/games/cukur-rallisi/replay";
import { isVehicleId } from "@/components/games/cukur-rallisi/vehicles";
import {
  garageCookie,
  GARAGE_COOKIE,
} from "@/components/games/cukur-rallisi/garage-cookie";
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return noStoreJson({ error: "Geçersiz istek." }, { status: 403 });
  let body: { nickname?: unknown; vehicle?: unknown; version?: unknown };
  try {
    body = (await readJsonBody(request, 512)) as typeof body;
  } catch {
    return noStoreJson({ error: "Geçersiz istek." }, { status: 400 });
  }
  const nickname = parseNickname(body?.nickname);
  if (!nickname)
    return noStoreJson(
      { error: "2–20 karakterlik bir takma ad yaz." },
      { status: 400 },
    );
  const legacy = body.version === undefined || body.version === 2;
  if (
    !legacy &&
    (!(body.version === 3 || body.version === GAME_VERSION) ||
      !isVehicleId(body.vehicle) ||
      (body.version === 3 && body.vehicle === "simsek"))
  )
    return noStoreJson(
      { error: "Oyunu güncelleyip tekrar dene." },
      { status: 400 },
    );
  try {
    const seed = randomInt(0, 4294967296),
      garageId = garageCookie(request) || randomUUID();
    const params = {
      p_nickname: nickname,
      p_seed: seed,
      p_fingerprint: requestFingerprint(request).ipHash,
    };
    const { data, error } = legacy
      ? await createAdminClient().rpc("begin_cukur_rallisi", params)
      : await createAdminClient().rpc(
          body.version === 3
            ? "begin_cukur_rallisi_v3"
            : "begin_cukur_rallisi_v4",
          {
            ...params,
            p_vehicle: body.vehicle,
            p_garage_id: garageId,
          },
        );
    if (error?.message.includes("game_rate_limit"))
      return noStoreJson(
        { error: "Çok sık tur başlattın. Biraz sonra tekrar dene." },
        { status: 429 },
      );
    if (error?.message.includes("vehicle_locked"))
      return noStoreJson(
        { error: "Bu araç için biraz daha puan kazanmalısın." },
        { status: 403 },
      );
    if (error || !data) throw new Error("run_unavailable");
    const response = noStoreJson({
      id: data,
      seed,
      version: legacy ? 2 : body.version,
    });
    if (!legacy)
      response.headers.append(
        "Set-Cookie",
        `${GARAGE_COOKIE}=${garageId}; Path=/api/oyunlar/cukur-rallisi; Max-Age=31536000; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" || new URL(request.url).protocol === "https:" ? "; Secure" : ""}`,
      );
    return response;
  } catch {
    return noStoreJson(
      { error: "Skor tablosuna bağlanılamadı." },
      { status: 503 },
    );
  }
}
