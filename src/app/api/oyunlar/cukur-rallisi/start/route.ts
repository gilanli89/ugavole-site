import { randomInt } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { requestFingerprint } from '@/lib/abuse/request-fingerprint';
import { isSameOrigin, noStoreJson, readJsonBody } from '@/lib/http/security';
import { parseNickname } from '@/components/games/cukur-rallisi/replay';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: 'Geçersiz istek.' }, { status: 403 });
  let nickname: string | null;
  try {
    const body = await readJsonBody(request, 512) as { nickname?: unknown };
    nickname = parseNickname(body?.nickname);
  } catch { return noStoreJson({ error: 'Geçersiz isim.' }, { status: 400 }); }
  if (!nickname) return noStoreJson({ error: '2–20 karakterlik bir takma ad yaz.' }, { status: 400 });
  try {
    const seed = randomInt(0, 4294967296);
    const { data, error } = await createAdminClient().rpc('begin_cukur_rallisi', {
      p_nickname: nickname, p_seed: seed, p_fingerprint: requestFingerprint(request).ipHash,
    });
    if (error?.message.includes('game_rate_limit')) return noStoreJson({ error: 'Çok sık tur başlattın. Biraz sonra tekrar dene.' }, { status: 429 });
    if (error || !data) throw new Error('run_unavailable');
    return noStoreJson({ id: data, seed });
  } catch { return noStoreJson({ error: 'Skor tablosuna bağlanılamadı.' }, { status: 503 }); }
}
