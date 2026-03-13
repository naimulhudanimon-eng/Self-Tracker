const CACHE_NAME = "selftracker-v1";

self.addEventListener("install", event => {

self.skipWaiting();

event.waitUntil(

caches.open(CACHE_NAME).then(cache => {
return cache.addAll([
"./",
"./index.html"
]);
})

);

});

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {
return Promise.all(
keys.map(key => {
if(key !== CACHE_NAME){
return caches.delete(key);
}
})
);
})

);

self.clients.claim();

});

self.addEventListener("fetch", event => {

event.respondWith(

fetch(event.request)

.then(res => {

const clone = res.clone();

caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, clone);
});

return res;

})

.catch(() => caches.match(event.request))

);

});
