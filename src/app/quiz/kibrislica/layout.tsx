import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ne Kadar Kıbrıslısın?",
  description: "15 soruluk Kıbrıslıca kelime testi. Şivenizi ölçün!",
  path: "/quiz/kibrislica",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
