const CACHE = "heritage-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/basketball.html",
  "/about.html",
  "/css/style.css",
  "/css/basketball_style.css",
  "/css/about.css",
  "/js/script.js",
  "/icons/206-2069918_menu-icon-png-menu-icon-white-png.png",
];

//Cache essential assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

//Cache-first for static assets, network-first for images
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Cache all images at runtime
  if (req.destination === "image") {
    e.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).then((fetched) =>
            caches.open(CACHE).then((cache) => {
              cache.put(req, fetched.clone());
              return fetched;
            })
          )
        );
      })
    );
    return;
  }

  // Default cache-first strategy
  e.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req);
    })
  );
});
