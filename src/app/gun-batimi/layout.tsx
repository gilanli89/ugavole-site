import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bugün Kıbrıs'ta Gün Batımı Saat Kaçta? | ugavole",
  description: "Kuzey Kıbrıs'ta bugün gün batımı saati: Lefkoşa, Girne, Gazimağusa, Güzelyurt ve İskele için güncel güneş batışı, doğuşu ve altın saat bilgisi.",
  path: "/gun-batimi",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
