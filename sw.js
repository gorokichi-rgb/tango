// 更新したいときは V の数字を上げる（古いキャッシュが消えて新しいファイルに入れ替わる）
const V='tango-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
// キャッシュを先に返して（オフラインでも動く）、裏で最新版を取り直す
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(c=>{
    const n=fetch(e.request).then(r=>{if(r.ok)caches.open(V).then(x=>x.put(e.request,r.clone()));return r}).catch(()=>c);
    return c||n;
  }));
});
