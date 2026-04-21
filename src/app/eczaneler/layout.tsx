import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nöbetçi Eczaneler",
  description: "KKTC'de bugün nöbetçi eczaneler. Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele için anlık nöbetçi eczane listesi.",
  alternates: { canonical: "https://ugavole.com/eczaneler" },
  openGraph: {
    title: "Nöbetçi Eczaneler · ugavole",
    description: "KKTC'de bugün nöbetçi eczaneler. Lefkoşa, Girne, Gazimağusa ve daha fazlası.",
    url: "https://ugavole.com/eczaneler",
  },
};

export default function EczanelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
