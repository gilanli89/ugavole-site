import { Gamepad2 } from "lucide-react";
import CukurRallisi from "@/components/games/cukur-rallisi/CukurRallisi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Oyunlar — Çukur Rallisi",
  description: "Girne’den Lefkoşa’ya üç şeritli bir yol macerası. Çukurları ve bariyerleri atlat, polis kontrolünde yavaşla. Çukur Rallisi’ni ücretsiz oyna.",
  path: "/oyunlar",
});

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-3 py-5 sm:px-6 sm:py-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-5">
        <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-ugavole-text sm:text-2xl">
          <Gamepad2 className="h-6 w-6 text-ugavole-yellow-dark" aria-hidden="true" />
          Oyunlar
        </h1>
        <p className="text-sm text-ugavole-muted">Biraz oyun, biraz memleket meselesi.</p>
      </div>
      <CukurRallisi />
    </div>
  );
}
