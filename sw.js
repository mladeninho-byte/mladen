const cacheName = 'studio-3cb2ce5c9aee2e8c';
const files = ["./assets/index-B_nCDv8J.js","./assets/index-CnEutTBM.css","./favicon.svg","./index.html","./manifest.webmanifest","./studio-192.png","./studio-512.png"];
const cachePrefix = new URL(self.registration.scope).pathname + ':studio-';
const key = new URL(self.registration.scope).pathname + ':' + cacheName;
const scope = self.registration.scope;
const assets = new Set(files.map(file => new URL(file, scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(key).then(cache => cache.addAll(files.map(file => new Request(new URL(file, scope), { cache: 'reload' })))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(name => name.startsWith(cachePrefix) && name !== key).map(name => caches.delete(name)))));
});
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(scope)) return;
  const url = request.mode === 'navigate' ? new URL('index.html', scope).href : request.url;
  if (!assets.has(url)) return;
  event.respondWith(caches.open(key).then(async cache => (await cache.match(url)) ?? fetch(request)));
});

