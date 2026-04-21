"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";

interface ShareProps {
  text: string;
  url?: string;
  hashtags?: string;
  compact?: boolean;
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButtons({ text, url, hashtags = "KKTC,ugavole", compact = false }: ShareProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => url ?? (typeof window !== "undefined" ? window.location.href : "");

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=600,height=400");

  const share = {
    facebook: () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}&quote=${encodeURIComponent(text)}`),
    twitter: () => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}&hashtags=${hashtags}`),
    whatsapp: () => open(`https://wa.me/?text=${encodeURIComponent(text + " " + getUrl())}`),
    copy: async () => {
      await navigator.clipboard.writeText(text + " " + getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={share.facebook} className="p-2 rounded-full bg-[#1877F2] text-white hover:scale-110 transition-transform" aria-label="Facebook'ta paylaş">
          <IconFacebook />
        </button>
        <button onClick={share.twitter} className="p-2 rounded-full bg-black text-white hover:scale-110 transition-transform" aria-label="X'te paylaş">
          <IconX />
        </button>
        <button onClick={share.whatsapp} className="p-2 rounded-full bg-[#25D366] text-white hover:scale-110 transition-transform" aria-label="WhatsApp'ta paylaş">
          <MessageCircle className="w-4 h-4" />
        </button>
        <button onClick={share.copy} className="p-2 rounded-full bg-ugavole-yellow text-black hover:scale-110 transition-transform" aria-label="Kopyala">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={share.facebook}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] text-white font-bold text-sm hover:scale-105 transition-transform sm:flex-1"
      >
        <IconFacebook />
        <span>Facebook</span>
      </button>
      <button
        onClick={share.twitter}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-bold text-sm hover:scale-105 transition-transform sm:flex-1"
      >
        <IconX />
        <span>Twitter / X</span>
      </button>
      <button
        onClick={share.whatsapp}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm hover:scale-105 transition-transform sm:flex-1"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </button>
      <button
        onClick={share.copy}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ugavole-yellow text-black font-bold text-sm hover:scale-105 transition-transform sm:flex-1"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
      </button>
    </div>
  );
}
