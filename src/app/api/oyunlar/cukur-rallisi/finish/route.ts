import { createAdminClient } from '@/lib/supabase/admin';
import { isSameOrigin, noStoreJson, readJsonBody } from '@/lib/http/security';
import { GAME_VERSION, replayRun, totalScore, validateReplay } from '@/components/games/cukur-rallisi/replay';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: 'Geçersiz istek.' }, { status: 403 });
  let payload: unknown;
  try { payload = await readJsonBody(request, 90_000); }
  catch { return noStoreJson({ error: 'Tur verisi geçersiz.' }, { status: 400 }); }
  const runId = (payload as { runId?: unknown } | null)?.runId;
  const replay = validateReplay(payload);
  if (!replay || typeof runId !== 'string' || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(runId)) {
    return noStoreJson({ error: 'Tur verisi geçersiz.' }, { status: 400 });
  }
  try {
    const admin = createAdminClient();
    const { data: run, error } = await admin.from('cukur_rallisi_runs')
      .select('id,seed,version,started_at,score').eq('id', runId).maybeSingle();
    if (error) throw error;
    if (!run || run.version !== GAME_VERSION) return noStoreJson({ error: 'Tur bulunamadı.' }, { status: 404 });
    if (run.score !== null) return noStoreJson({ saved: true, score: run.score });
    const age = (Date.now() - Date.parse(run.started_at)) / 1000;
    if (age > 7200 || replay.frames / 60 > age + 3) return noStoreJson({ error: 'Tur süresi doğrulanamadı.' }, { status: 400 });
    const state = replayRun(Number(run.seed), replay.frames, replay.inputs);
    if (!state) return noStoreJson({ error: 'Tur tamamlanmamış. Skor kaydedilemedi.' }, { status: 400 });
    const score = totalScore(state);
    const { data: saved, error: saveError } = await admin.from('cukur_rallisi_runs').update({
      score, distance: Number(state.distance.toFixed(2)), won: state.status === 'won',
      frames: replay.frames, finished_at: new Date().toISOString(),
    }).eq('id', runId).is('score', null).select('score').maybeSingle();
    if (saveError) throw saveError;
    if (!saved) {
      const { data: existing, error: readError } = await admin.from('cukur_rallisi_runs').select('score').eq('id', runId).single();
      if (readError) throw readError;
      return noStoreJson({ saved: true, score: existing.score });
    }
    return noStoreJson({ saved: true, score });
  } catch { return noStoreJson({ error: 'Skor kaydedilemedi. Tekrar deneyebilirsin.' }, { status: 503 }); }
}
