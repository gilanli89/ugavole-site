import { useCallback, useEffect, useRef, useState } from 'react';
import { Trophy, X, RefreshCw, Flag } from 'lucide-react';

type Entry = { nickname: string; score: number; distance: number; won: boolean };

export default function Leaderboard({ onClose, player }: { onClose: () => void; player: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      const response = await fetch('/api/oyunlar/cukur-rallisi/leaderboard', { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.entries)) throw new Error('unavailable');
      setEntries(data.entries);
    } catch { setError('Skor tablosuna ulaşılamadı. Tekrar deneyebilirsin.'); }
  }, []);
  useEffect(() => {
    dialog.current?.showModal();
    const tick = window.setTimeout(() => { void load(); }, 0);
    return () => clearTimeout(tick);
  }, [load]);
  return (
    <dialog ref={dialog} className="scores-dialog" aria-labelledby="scores-title" onCancel={onClose} onClose={onClose}>
      <div className="scores-heading"><span className="trophy-mark"><Trophy size={25}/></span><div><small>ÇUKUR RALLİSİ</small><h2 id="scores-title">En iyi sürücüler</h2></div><button className="close-scores" aria-label="Skor tablosunu kapat" onClick={onClose}><X size={22}/></button></div>
      <p className="scores-intro">Adanın en iyi 10 skoru. Her takma adın en iyi turu burada.</p>
      {error ? <div className="scores-empty" role="status"><p>{error}</p><button className="text-button" onClick={() => void load()}><RefreshCw size={16}/> Yeniden dene</button></div>
        : entries === null ? <p className="scores-empty" role="status">Skorlar yükleniyor…</p>
        : entries.length === 0 ? <div className="scores-empty"><Trophy size={36}/><h3>İlk sırada sen ol.</h3><p>Bir tur tamamla, adını tabloya yazdır.</p></div>
        : <ol className="score-list">{entries.map((entry, index) => <li key={entry.nickname} data-player={entry.nickname.toLocaleLowerCase('tr') === player.toLocaleLowerCase('tr')}><span className={`rank rank-${index + 1}`}>{index === 0 ? <Trophy size={17}/> : index + 1}</span><div className="rank-name"><strong>{entry.nickname}</strong><small>{Number(entry.distance).toFixed(1)} km {entry.won && <><Flag size={10}/> Lefkoşa</>}</small></div><b>{entry.score.toLocaleString('tr-TR')}<small>PUAN</small></b></li>)}</ol>}
      <button className="start-button" onClick={onClose}>YOLA DÖN <Flag size={18}/></button>
    </dialog>
  );
}
