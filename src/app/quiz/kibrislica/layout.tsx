import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kıbrıslıca Quiz: Ne Kadar Kıbrıslısın? | ugavole",
  description: "15 soruluk Kıbrıslıca kelime testiyle Kıbrıs Türkçesi bilginizi ölçün. Şive, deyim ve gündelik ifadeleri ne kadar biliyorsunuz?",
  path: "/quiz/kibrislica",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
