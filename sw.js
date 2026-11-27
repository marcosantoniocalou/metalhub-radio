// Metal Hub Radio: guarda a "casca" do app para abrir rapido (o audio sempre vem ao vivo da radio)
const C = 'mhr-v8';
const SHELL = ['./', 'index.html', 'manifest.json', 'bg.jpg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // radios e servidores externos: direto da rede
  // rede primeiro (pega atualizacoes); sem internet, usa a copia guardada
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
