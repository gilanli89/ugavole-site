"use client";

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
const AD_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT;
const CMP_READY = process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_READY === "true";

type Props = {
  className?: string;
  eligible?: boolean;
};

export default function AdBanner({ className = "", eligible = false }: Props) {
  const pushed = useRef(false);
  // Once the certified Google CMP is enabled it becomes the advertising
  // consent authority. AdSense receives the TCF signal itself; the local
  // analytics preference must not be treated as a substitute for that signal.
  const enabled = eligible && CMP_READY && CLIENT_ID && AD_SLOT;

  useEffect(() => {
    if (!enabled) return;
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
