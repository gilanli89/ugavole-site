"use client";

import Script from "next/script";
import Link from "next/link";
import { createContext, useContext, useSyncExternalStore } from "react";

type Consent = "granted" | "denied" | null;

const EVENT_NAME = "ugavole-consent-change";
const ConsentContext = createContext<Consent>(null);

function readConsent(): Consent {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )ugavole_consent=(granted|denied)(?:;|$)/);
  return (match?.[1] as Consent) ?? null;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}

function saveConsent(value: Exclude<Consent, null>) {
  const previous = readConsent();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ugavole_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  if (previous === "granted" && value === "denied") {
    location.reload();
    return;
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function clearConsent() {
  const hadMarketingConsent = readConsent() === "granted";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ugavole_consent=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  if (hadMarketingConsent) {
    location.reload();
    return;
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function MarketingScripts({ consent }: { consent: Consent }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const adsClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const certifiedCmpReady = process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_READY === "true";

  if (consent !== "granted") return null;

  return (
    <>
      {gtmId && (
        <Script id="ugavole-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {adsClient && certifiedCmpReady && (
        <Script
          id="ugavole-adsense"
          strategy="afterInteractive"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsClient)}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);

  return (
    <ConsentContext.Provider value={consent}>
      {children}
      <MarketingScripts consent={consent} />
      {consent === null && (
        <aside className="fixed inset-x-3 bottom-4 z-[100] mx-auto max-w-4xl rounded-[20px] border border-ugavole-border bg-ugavole-surface/95 p-3.5 shadow-[0_24px_70px_rgba(17,17,14,0.18)] backdrop-blur-xl sm:px-5" aria-label="Çerez tercihi">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ugavole-yellow-dark">Gizlilik tercihin</p>
              <p className="mt-1 text-xs font-medium leading-5 text-ugavole-body sm:text-[13px]">
              Ölçüm ve reklam teknolojileri yalnız izninle yüklenir. Zorunlu çerezler siteyi çalıştırır.
              Ayrıntılar <Link href="/cerez-politikasi" className="font-bold underline underline-offset-2">çerez politikasında</Link>.
              </p>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <button type="button" onClick={() => saveConsent("denied")} className="rounded-xl border border-ugavole-border px-4 py-2.5 text-xs font-extrabold text-ugavole-text transition-colors hover:bg-ugavole-surface-2">
                Reddet
              </button>
              <button type="button" onClick={() => saveConsent("granted")} className="rounded-xl bg-ugavole-text px-4 py-2.5 text-xs font-extrabold text-ugavole-surface transition-transform hover:-translate-y-0.5">
                İzin ver
              </button>
            </div>
          </div>
        </aside>
      )}
    </ConsentContext.Provider>
  );
}

export function useConsent(): Consent {
  return useContext(ConsentContext);
}

export function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={clearConsent}
      className="text-sm text-gray-400 transition-colors hover:text-ugavole-yellow"
    >
      Çerez tercihleri
    </button>
  );
}
