const CACHE_NAME = "chatdollar-v9";

// Small app shell. Pages are fetched network-first, so updates show immediately.
const FILES_TO_CACHE = [
  "/",
  "/chat",
  "/hotels",
  "/css/landing.css",
  "/css/chat.css",
  "/css/hotels.css",
  "/js/landing.js",
  "/js/chat.js",
  "/js/hotels.js",
  "/manifest.json",
  "/assets/chatdollar-logo-160.webp",
  "/assets/chatdollar-favicon-192.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(FILES_TO_CACHE.map((f) => cache.add(f))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDN fonts, icons and avatars use the browser cache

  // Pages: network first, fall back to the cached copy when offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  // Everything else: serve cached copy fast, refresh in the background
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
