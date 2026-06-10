/* =================================================================
   VTCAF — Service Worker (sw.js)
   Cache simple des fichiers essentiels pour un chargement rapide et
   un fonctionnement hors-ligne basique.
   -----------------------------------------------------------------
   ⚠️ À CHAQUE MISE À JOUR du site, incrémentez CACHE_VERSION
      (ex : v1 → v2) pour forcer le rafraîchissement chez les visiteurs.
   ================================================================= */

const CACHE_VERSION = "vtcaf-v1";

// Fichiers mis en cache à l'installation
const ESSENTIAL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/images/logo-vtcaf.png",
  "./assets/images/hero-vtcaf.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/favicon.png"
];

// Installation : pré-cache (on ignore les fichiers éventuellement manquants)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(ESSENTIAL.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Activation : on supprime les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stratégie de récupération :
// - Navigation/HTML : réseau d'abord, repli cache (contenu toujours frais si en ligne)
// - Autres ressources : cache d'abord, repli réseau (rapidité)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // On ne met en cache que les ressources de notre origine (pas YouTube, fonts, etc.)
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  if (!sameOrigin) return; // laisse le navigateur gérer les ressources externes

  event.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => cached)
    )
  );
});
