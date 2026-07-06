/* Service worker do Checklist EPMURAS
 * - Páginas: network-first com fallback ao cache (uso offline no curral)
 * - Assets imutáveis (/_next/static, ícones): cache-first
 * - API nunca é interceptada
 */
const VERSION = "v1";
const STATIC_CACHE = `epmuras-static-${VERSION}`;
const PAGE_CACHE = `epmuras-pages-${VERSION}`;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("epmuras-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(PAGE_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match("/")) || Response.error();
        }
      })()
    );
    return;
  }

  const isImmutable =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/apple-touch-icon.png";

  if (isImmutable) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      })()
    );
  }
});
