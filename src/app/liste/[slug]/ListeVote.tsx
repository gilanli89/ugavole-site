import { ThumbsUp } from "lucide-react";

export default function ListeVote({ oylar }: { maddeId: string; oylar: number }) {
  return (
    <div
      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ugavole-border bg-ugavole-surface-2 px-3 py-1.5 text-xs font-bold text-ugavole-muted"
      title="Güvenli oylama akışı hazırlandığında yeniden açılacak"
    >
      <ThumbsUp className="h-3.5 w-3.5" />
      {oylar} oy · Oylama yakında
    </div>
  );
}
