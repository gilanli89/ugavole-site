import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Hangi Şehirlisin?",
  description: "10 soruluk Kıbrıs şehir testi. Lefkoşa mı, Girne mi, Mağusa mı?",
  path: "/quiz/sehir",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
