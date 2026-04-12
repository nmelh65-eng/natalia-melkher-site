const FALLBACK_PRODUCTION = "https://natalia-melkher.vercel.app";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Публичный origin для canonical, Open Graph, sitemap, RSS и JSON-LD.
 *
 * Приоритет:
 * 1. `NEXT_PUBLIC_SITE_URL` — явный канон (Production / стабильный Preview).
 * 2. `https://${VERCEL_URL}` — автоматический URL деплоя на Vercel (Preview/Prod без ручного env).
 * 3. `http://localhost:${PORT}` — локальная разработка.
 * 4. Иначе — запасной продакшен-домен (локальный `next build` без env).
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || "3000";
    return `http://localhost:${port}`;
  }

  return FALLBACK_PRODUCTION;
}
