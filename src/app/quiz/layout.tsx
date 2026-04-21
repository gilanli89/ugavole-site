import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Quiz",
  description: "Ne kadar Kıbrıslısın? Hangi şehirlisin? Eğlenceli Kıbrıs quizleri.",
  path: "/quiz",
});

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
