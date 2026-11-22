// Naikkan nombor ini bila kau tukar fail supaya cache lama dibuang
const V='kedai-v3',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const EXT=['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  // Data Firestore terus ke internet, jangan cache
  if(u.origin!==location.origin&&!EXT.includes(u.hostname))return;
  // Network dulu (dapat versi terbaru), cache kalau tiada internet
  e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))));
});
