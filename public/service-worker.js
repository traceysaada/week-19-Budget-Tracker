//create variables that name the cache
var CACHE = "my-budget-cache";
var DATA_CACHE_NAME = "budget-data-cache";

//create an array to store the urls i want to save in cache

var applicationUrls = [
  "/",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
     return cache.addAll(applicationUrls);
    })
  );
});


self.addEventListener("fetch", function (event) {
  //implement functionality which will enable all requests coming in on /api routes  (think.... if statements)
  //attempt to put into cache if its an api request
  if (event.request.url.includes("/api/")) {
        event.respondWith(
          caches.open(DATA_CACHE_NAME).then((cache) => {
            return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }

              return response;
            })
            .catch(() => {
              return cache.match(event.request)
            });
          }).catch((err) => console.log(err))
         );
        return;
  }


event.respondWith(
  fetch(event.request).catch(function(){
    return caches.match(event.request).then(function(response){
      return response
    })
  })
 );
});
