"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "auto";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function TurnstileWidget({
  siteKey,
  action = "ugc_submit",
  resetKey,
  onTokenChange,
}: {
  siteKey: string;
  action?: string;
  resetKey: number;
  onTokenChange: (token: string) => void;
}) {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const callbackRef = useRef(onTokenChange);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    callbackRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    const api = window.turnstile;
    const container = containerRef.current;
    if (!scriptReady || !api || !container || widgetIdRef.current) return;

    widgetIdRef.current = api.render(container, {
      sitekey: siteKey,
      action,
      theme: "auto",
      size: "flexible",
      callback: (token) => callbackRef.current(token),
      "expired-callback": () => callbackRef.current(""),
      "error-callback": () => callbackRef.current(""),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      callbackRef.current("");
    };
  }, [action, resetKey, scriptReady, siteKey]);

  return (
    <>
      <Script
        id={`turnstile-${reactId.replace(/:/g, "")}`}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px] w-full" aria-label="Bot doğrulaması" />
    </>
  );
}
