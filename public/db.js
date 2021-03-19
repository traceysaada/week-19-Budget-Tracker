if("serviceWorker" in navigator){
    window.addEventListener('load', function(){
            navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(function(reg){
                console.log("Service Worker Registered")
            })
    })
}

const indexedDB = window.indexedDB;
let db;
// this file is all about setting up indexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  //in this file we will have an event listener on window itself waiting for it to come online...
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.online) {
    checkDatabase();
  }
};
request.onerror = function (event) {
  console.log("whoops!" + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(record);
}
function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json)
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}
// when the application comes online - we need to check the database, get each entry in the db...
window.addEventListener("online", checkDatabase);
