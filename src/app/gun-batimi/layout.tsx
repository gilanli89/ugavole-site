import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "KKTC Gün Batımı Saati 2025 | Kuzey Kıbrıs Günbatımı",
  description: "Kuzey Kıbrıs'ta bugün gün batımı saati, en güzel gün batımı fotoğrafları ve noktaları. Girne, Gazimağusa, Lefkoşa günbatımı saatleri.",
  path: "/gun-batimi",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
