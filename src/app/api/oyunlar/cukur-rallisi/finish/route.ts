import { createAdminClient } from "@/lib/supabase/admin";
import { isSameOrigin, noStoreJson, readJsonBody } from "@/lib/http/security";
import {
  replayRun,
  totalScore,
  validateReplay,
} from "@/components/games/cukur-rallisi/replay";
import * as legacy from "@/components/games/cukur-rallisi/legacy-replay";
import {
  garageCookie,
  isUuid,
} from "@/components/games/cukur-rallisi/garage-cookie";
import { vehicleById } from "@/components/games/cukur-rallisi/vehicles";
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return noStoreJson({ error: "Geçersiz istek." }, { status: 403 });
  let payload: unknown;
  try {
    payload = await readJsonBody(request, 90_000);
  } catch {
    return noStoreJson({ error: "Tur verisi geçersiz." }, { status: 400 });
  }
  const runId = (payload as { runId?: unknown } | null)?.runId;
  if (!isUuid(runId) || !validateReplay(payload))
    return noStoreJson({ error: "Tur verisi geçersiz." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: run, error } = await admin
      .from("cukur_rallisi_runs")
      .select("id,seed,version,started_at,score,garage_id,vehicle_id")
      .eq("id", runId)
      .maybeSingle();
    if (error) throw error;
    if (!run || ![2, 3].includes(run.version))
      return noStoreJson({ error: "Tur bulunamadı." }, { status: 404 });
    if (run.version === 3 && garageCookie(request) !== run.garage_id)
      return noStoreJson(
        { error: "Bu tur başka bir garaja ait." },
        { status: 403 },
      );
    if (run.score !== null) {
      const { data: garage } = run.garage_id
        ? await admin
            .from("cukur_rallisi_garages")
            .select("points")
            .eq("id", run.garage_id)
            .maybeSingle()
        : { data: null };
      return noStoreJson({
        saved: true,
        score: run.score,
        points: Number(garage?.points ?? 0),
      });
    }
    const age = (Date.now() - Date.parse(run.started_at)) / 1000;
    const replay =
      run.version === 2
        ? legacy.validateReplay(payload)
        : validateReplay(payload);
    if (!replay || age > 7200 || replay.frames / 60 > age + 3)
      return noStoreJson(
        { error: "Tur süresi doğrulanamadı." },
        { status: 400 },
      );
    const state =
      run.version === 2
        ? legacy.replayRun(
            Number(run.seed),
            replay.frames,
            replay.inputs as legacy.ReplayInput[],
          )
        : replayRun(
            Number(run.seed),
            replay.frames,
            replay.inputs,
            vehicleById(run.vehicle_id).id,
          );
    if (!state)
      return noStoreJson(
        { error: "Tur tamamlanmamış. Skor kaydedilemedi." },
        { status: 400 },
      );
    const score =
      run.version === 2
        ? legacy.totalScore(state as Parameters<typeof legacy.totalScore>[0])
        : totalScore(state as Parameters<typeof totalScore>[0]);
    if (run.version === 3) {
      const { data, error: finishError } = await admin.rpc(
        "finish_cukur_rallisi_v3",
        {
          p_run_id: runId,
          p_garage_id: run.garage_id,
          p_score: score,
          p_distance: Number(state.distance.toFixed(2)),
          p_won: state.status === "won",
          p_frames: replay.frames,
        },
      );
      if (finishError) throw finishError;
      return noStoreJson(data);
    }
    const { error: saveError } = await admin
      .from("cukur_rallisi_runs")
      .update({
        score,
        distance: Number(state.distance.toFixed(2)),
        won: state.status === "won",
        frames: replay.frames,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId)
      .is("score", null);
    if (saveError) throw saveError;
    return noStoreJson({ saved: true, score });
  } catch {
    return noStoreJson(
      { error: "Skor kaydedilemedi. Tekrar deneyebilirsin." },
      { status: 503 },
    );
  }
}
