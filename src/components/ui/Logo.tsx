import Link from "next/link";

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
    <Link href="/" className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        width={d}
        height={d}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ugavole logo"
      >
        {/* Sarı daire zemin */}
        <circle cx="60" cy="60" r="58" fill="#F5C518" />

        {/* Sol kulak */}
        <ellipse cx="38" cy="28" rx="10" ry="22" fill="#9B8B7A" transform="rotate(-12 38 28)" />
        <ellipse cx="38" cy="28" rx="6"  ry="15" fill="#C4A99A" transform="rotate(-12 38 28)" />

        {/* Sağ kulak */}
        <ellipse cx="82" cy="28" rx="10" ry="22" fill="#9B8B7A" transform="rotate(12 82 28)" />
        <ellipse cx="82" cy="28" rx="6"  ry="15" fill="#C4A99A" transform="rotate(12 82 28)" />

        {/* Yüz */}
        <ellipse cx="60" cy="68" rx="34" ry="30" fill="#B8A898" />

        {/* Burun bölgesi */}
        <ellipse cx="60" cy="82" rx="20" ry="14" fill="#C8B8A8" />

        {/* Burun delikleri */}
        <circle cx="54" cy="84" r="3.5" fill="#7A6860" />
        <circle cx="66" cy="84" r="3.5" fill="#7A6860" />

        {/* Sol göz beyazı — border ekli */}
        <ellipse cx="46" cy="62" rx="8" ry="9" fill="white" stroke="#9B8B7A" strokeWidth="1" />
        {/* Sol göz iris */}
        <circle cx="47" cy="63" r="5.5" fill="#1A1A1A" />
        {/* Sol göz parlaklık */}
        <circle cx="49" cy="61" r="2" fill="white" />

        {/* Sağ göz beyazı — border ekli */}
        <ellipse cx="74" cy="62" rx="8" ry="9" fill="white" stroke="#9B8B7A" strokeWidth="1" />
        {/* Sağ göz iris */}
        <circle cx="73" cy="63" r="5.5" fill="#1A1A1A" />
        {/* Sağ göz parlaklık */}
        <circle cx="75" cy="61" r="2" fill="white" />

        {/* Gülümseme */}
        <path d="M50 90 Q60 96 70 90" stroke="#7A6860" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>

      {showText && (
        <span className={`font-black tracking-tight ${textSizes[size]}`}>
          <span className="text-gray-900 dark:text-white">uga</span>
          <span className="text-[#D4A017] dark:text-[#F5C518]">vole</span>
        </span>
      )}
    </Link>
  );
}
