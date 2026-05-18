/* Service Worker - Warceh Subang Pharmacy */
var CACHE = 'warceh-cache-v2';
var ASSETS = [
  '/index.html', '/produk.html', '/favorit.html', '/keranjang.html',
  '/artikel.html', '/tentang.html', '/kontak.html', '/success.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return Promise.allSettled(ASSETS.map(function(a) { return c.add(a).catch(function(){}); }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r&&r.status===200&&r.type==='basic'){
        var rc=r.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,rc)});
      }
      return r;
    }).catch(function(){return caches.match(e.request)})
  );
});

self.addEventListener('push', function(e) {
  var data={title:'Promo Warceh Subang!',body:'Ada penawaran spesial untuk Anda hari ini!',icon:'https://res.cloudinary.com/dihriqgow/image/upload/v1778899338/1778898381_uovhf8.png',url:'https://warcehsubang.xyz/produk.html'};
  try{if(e.data)data=Object.assign(data,e.data.json())}catch(err){}
  e.waitUntil(
    self.registration.showNotification(data.title,{
      body:data.body,
      icon:data.icon,
      badge:'https://res.cloudinary.com/dihriqgow/image/upload/v1778899338/1778898381_uovhf8.png',
      data:{url:data.url||'https://warcehsubang.xyz/produk.html'},
      tag:'warceh-promo',
      renotify:true,
      actions:[{action:'buy',title:'🛒 Lihat Produk'},{action:'close',title:'Nanti'}],
      vibrate:[200,100,200]
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if(e.action==='close')return;
  var url=e.notification.data&&e.notification.data.url?e.notification.data.url:'https://warcehsubang.xyz/produk.html';
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cls){
      for(var i=0;i<cls.length;i++){if(cls[i].url===url&&'focus'in cls[i])return cls[i].focus()}
      if(clients.openWindow)return clients.openWindow(url);
    })
  );
});

self.addEventListener('message', function(e) {
  if(!e.data)return;
  if(e.data.type==='SHOW_PROMO_NOTIF'){
    var p=e.data.product;
    var price=p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    self.registration.showNotification('🌟 '+p.name+' - Promo Hari Ini!',{
      body:p.desc+'\n💰 Harga: Rp '+price,
      icon:p.image,
      badge:'https://res.cloudinary.com/dihriqgow/image/upload/v1778899338/1778898381_uovhf8.png',
      data:{url:'https://warcehsubang.xyz/produk.html'},
      tag:'warceh-promo-'+Date.now(),
      renotify:true,
      actions:[{action:'buy',title:'🛒 Beli Sekarang'},{action:'close',title:'Nanti Saja'}],
      vibrate:[200,100,200,100,200]
    });
  }
  if(e.data.type==='PING'){
    e.source.postMessage({type:'PONG',version:CACHE});
  }
});
