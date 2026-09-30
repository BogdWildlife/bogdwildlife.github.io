/* МонголШувуу — service worker (PWA, интернетгүй ажиллагаа)
   shell: сайтын код — эхлээд сүлжээнээс шинэ хувилбар, интернетгүй/удаан бол кэш
   media: шувууны зураг, дуу — эхлээд кэш; "Интернетгүй ашиглах" товч бүгдийг нь урьдчилан татна
   ext:   фонт, TensorFlow/MobileNet загвар — эхлээд кэш
   tiles: хиймэл дагуулын зураг — үзсэн хэсэг л кэшлэгдэнэ (дээд тал нь 1500) */
const V = "v2";
const SHELL = "shell-" + V, MEDIA = "media-v1", EXT = "ext-v1", TILES = "tiles-v1";
const CORE = [
  "./", "index.html", "manifest.webmanifest", "css/style.css", "vendor/leaflet.css", "vendor/leaflet.js",
  "js/i18n.js", "js/i18n_fr.js", "js/data.js", "js/aimags.js", "js/birds.js", "js/birds2.js", "js/birds_en.js", "js/birds_fr.js",
  "js/birds2_en.js", "js/birds2_fr.js", "js/ranges.js", "js/ranges2.js", "js/data_en.js", "js/data_fr.js", "js/app.js",
  "icons/icon-192.png", "icons/icon-512.png"
];
const EXT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net", "tfhub.dev", "www.kaggle.com", "storage.googleapis.com"];
const TILE_HOSTS = ["server.arcgisonline.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  const keep = [SHELL, MEDIA, EXT, TILES];
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !keep.includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function trimTiles() {
  const c = await caches.open(TILES), ks = await c.keys();
  for (let i = 0; i < ks.length - 1500; i++) await c.delete(ks[i]);
}
async function cacheFirst(req, name) {
  const c = await caches.open(name), hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") c.put(req, res.clone()).then(() => name === TILES && trimTiles()).catch(() => {});
  return res;
}
// Сайтын код: эхлээд сүлжээ (HTTP кэшийг алгасаж шинэ хувилбарыг шалгана), 4 секундэд хариу ирэхгүй эсвэл интернетгүй бол кэш
async function networkFirst(req, name) {
  const c = await caches.open(name);
  const net = fetch(req, { cache: "no-cache" }).then(res => { if (res.ok) c.put(req, res.clone()).catch(() => {}); return res; });
  const slow = new Promise(r => setTimeout(r, 4000)).then(() => c.match(req, { ignoreSearch: true }));
  try {
    const res = await Promise.race([net, slow.then(hit => hit || net)]);
    if (res) return res;
  } catch (e) {}
  return (await c.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? c.match("index.html") : Response.error());
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (/\/(images|audio)\//.test(url.pathname)) return e.respondWith(cacheFirst(req, MEDIA));
    if (req.mode === "navigate") return e.respondWith(networkFirst(new Request("index.html"), SHELL));
    return e.respondWith(networkFirst(req, SHELL));
  }
  if (TILE_HOSTS.includes(url.hostname)) return e.respondWith(cacheFirst(req, TILES));
  if (EXT_HOSTS.includes(url.hostname)) return e.respondWith(cacheFirst(req, EXT));
});
