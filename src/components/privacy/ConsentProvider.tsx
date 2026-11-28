"use client";

import Script from "next/script";
import Link from "next/link";
import { createContext, useContext, useSyncExternalStore } from "react";

type Consent = "granted" | "denied" | null;

type GoogleFundingChoices = {
  callbackQueue?: Array<Record<string, () => void>>;
  showRevocationMessage?: () => void;
};

declare global {
  interface Window {
    googlefc?: GoogleFundingChoices;
  }
}

const EVENT_NAME = "ugavole-consent-change";
// Google serves the shared tag by its GT ID. Configure only the Ugavole web stream.
const GOOGLE_TAG_ID = "GT-T5MFBKQR";
const GA_MEASUREMENT_ID = "G-X2NG67BW7Y";
const OTHER_GA_DESTINATIONS = ["G-C0DE2ZY5WD", "G-TYKXS76TVB"];
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
  const hadAnalyticsConsent = readConsent() === "granted";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ugavole_consent=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  if (hadAnalyticsConsent) {
    location.reload();
    return;
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

function ConsentScripts({ consent }: { consent: Consent }) {
  const adsClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  const certifiedCmpReady = process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_READY === "true";

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="ugavole-ga4-config" strategy="afterInteractive">
            {`for (const destination of ${JSON.stringify(OTHER_GA_DESTINATIONS)}) {
  window['ga-disable-' + destination] = true;
}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('consent', 'update', { analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
          </Script>
          <Script
            id="ugavole-ga4"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          />
        </>
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
      <ConsentScripts consent={consent} />
      {consent === null && (
        <aside className="fixed inset-x-3 bottom-4 z-[100] mx-auto max-w-4xl rounded-[20px] border border-ugavole-border bg-ugavole-surface/95 p-3.5 shadow-[0_24px_70px_rgba(17,17,14,0.18)] backdrop-blur-xl sm:px-5" aria-label="Çerez tercihi">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ugavole-yellow-dark">Gizlilik tercihin</p>
              <p className="mt-1 text-xs font-medium leading-5 text-ugavole-body sm:text-[13px]">
              Google Analytics, yalnız izninle site kullanımını ölçer. Zorunlu çerezler siteyi çalıştırır.
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
  const certifiedCmpReady = process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_READY === "true";

  function openAdSettings() {
    window.googlefc = window.googlefc ?? {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue ?? [];
    const show = () => window.googlefc?.showRevocationMessage?.();
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: show });
    show();
  }

  const buttonClass = "text-sm text-gray-400 transition-colors hover:text-ugavole-yellow";

  return (
    <div className="flex flex-col items-start gap-2">
      <button type="button" onClick={clearConsent} className={buttonClass}>
        Analitik çerez tercihleri
      </button>
      {certifiedCmpReady && (
        <button type="button" onClick={openAdSettings} className={buttonClass}>
          Reklam çerez tercihleri
        </button>
      )}
    </div>
  );
}
