import Link from "next/link";
import UgavoleMark from "./UgavoleMark";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

export default function Logo({ size = "md", showText = true, className = "" }: Props) {
  const dims = { sm: 32, md: 40, lg: 56 };
  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const d = dims[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 select-none ${className}`} aria-label="Ugavole ana sayfa">
      <UgavoleMark size={d} />

      {showText && (
        <span className={`font-extrabold lowercase leading-none tracking-[-0.055em] text-ugavole-text ${textSizes[size]}`}>
          ugavole
        </span>
      )}
    </Link>
  );
}
