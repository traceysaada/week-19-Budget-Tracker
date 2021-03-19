//create variables that name the cache
var CACHE = "budget-cache";
var DATA_CACHE = "budget-data-cache";

//create an array to store the urls i want to save in cache

var applicationUrls = [
  "/",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      cache.addAll(applicationUrls);
    })
  );
 
});


self.addEventListener("fetch", function (event) {
  //implement functionality which will enable all requests coming in on /api routes  (think.... if statements)
  //attempt to put into cache if its an api request
  if (evt.request.url.includes("/api/")) {
        evt.resondWith (
          caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(evt.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch(err => {
              return caches.match(evt.request)
            });
          }).catch(err => console.log(err))
        );
        return;
  }
  //if unsuccessful then it going to try to match with something in cache that already exsists
  // if its not an api request then we will check the cache to see if we faciliate such a request
  // if the requested url isnt in cache then just return to hompage ('/')

evt.resondWith(
  caches.match(evt.request).then(function(response){
    return response || fetch(evt.request);
  })
 );
});
