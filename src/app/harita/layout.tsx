import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kıbrıs Anlık Harita",
  description: "KKTC'de anlık olaylar, kazalar, trafik ve haberler interaktif haritada. Kuzey Kıbrıs'ı canlı takip et.",
  alternates: { canonical: "https://ugavole.com/harita" },
  openGraph: {
    title: "Kıbrıs Anlık Harita · ugavole",
    description: "KKTC'de anlık olaylar, kazalar, trafik ve haberler interaktif haritada.",
    url: "https://ugavole.com/harita",
  },
};

export default function HaritaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
