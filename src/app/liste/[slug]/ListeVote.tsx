"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThumbsUp } from "lucide-react";

export default function ListeVote({ maddeId, oylar }: { maddeId: string; oylar: number }) {
  const [count, setCount] = useState(oylar);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("liste_voted");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    setVoted(ids.includes(maddeId));
  }, [maddeId]);

  const handleVote = async () => {
    if (voted) return;
    const sb = createClient();
    await sb.from("liste_maddeler").update({ oylar: count + 1 }).eq("id", maddeId);
    setCount((c) => c + 1);
    setVoted(true);
    const stored = localStorage.getItem("liste_voted");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem("liste_voted", JSON.stringify([...ids, maddeId]));
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted}
      className={`flex items-center gap-1.5 mt-3 text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
        voted
          ? "bg-ugavole-yellow/20 text-ugavole-yellow cursor-default"
          : "bg-ugavole-surface-2 border border-ugavole-border text-ugavole-body hover:bg-ugavole-yellow hover:text-black hover:border-ugavole-yellow"
      }`}
    >
      <ThumbsUp className="w-3.5 h-3.5" />
      {voted ? "Oylandı!" : "Bu madde en iyi!"} · {count}
    </button>
  );
}
