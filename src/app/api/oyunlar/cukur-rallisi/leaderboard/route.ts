import { createAdminClient } from '@/lib/supabase/admin';
import { noStoreJson } from '@/lib/http/security';

export async function GET() {
  try {
    const { data, error } = await createAdminClient().from('cukur_rallisi_leaderboard')
      .select('nickname,score,distance,won').order('score', { ascending: false })
      .order('finished_at', { ascending: true }).limit(10);
    if (error) throw error;
    return noStoreJson({ entries: data });
  } catch { return noStoreJson({ error: 'Skor tablosu yüklenemedi. Tekrar deneyebilirsin.' }, { status: 503 }); }
}
