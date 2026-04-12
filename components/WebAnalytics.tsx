"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-8V03G4N6D4";
const YM_ID_STR =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "108502761";
const YM_ID = Number(YM_ID_STR);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

function AnalyticsPageViewsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ymSkipFirst = useRef(true);

  useEffect(() => {
    const qs = searchParams?.toString();
    const pagePath = pathname + (qs ? `?${qs}` : "");

    if (typeof window.gtag === "function" && GA_ID) {
      window.gtag("config", GA_ID, { page_path: pagePath });
    }

    if (typeof window.ym === "function" && Number.isFinite(YM_ID)) {
      if (ymSkipFirst.current) {
        ymSkipFirst.current = false;
      } else {
        window.ym(YM_ID, "hit", pagePath);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsPageViews() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageViewsInner />
    </Suspense>
  );
}

export function AnalyticsScripts() {
  if (!GA_ID && !Number.isFinite(YM_ID)) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-base" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
            `}
          </Script>
        </>
      ) : null}

      {Number.isFinite(YM_ID) ? (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}", "ym");
ym(${YM_ID}, "init", { ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true });
            `}
          </Script>
          <noscript>
            <div>
              {/* Счётчик Метрики без JS — требуется обычный img */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                style={{ position: "absolute", left: -9999 }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}
    </>
  );
}
