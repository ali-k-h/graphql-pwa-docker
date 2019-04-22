self.onmessage = function(e) {
  const { type, data } = e.data;

  const IDBOpenDBRequest = indexedDB.open('solar-form', 1);
  let db;

  const messageFactory = ({
    save({ data }) {
      const objectStore = db.transaction('form', 'readwrite').objectStore('form');
      console.log('Saving', e);
      objectStore.put(data, 'user');
      self.postMessage({ message: 'Form Data Added', data: null });
    },
    get() {
      const objectStore = db.transaction('form').objectStore('form');
      const item = objectStore.get('user');
      item.onsuccess = function(event) {
        console.log(event);
        self.postMessage({ message: 'Retrieved Data', data: event.target.result});
      };
    }
  });

  IDBOpenDBRequest.onupgradeneeded = function(event) {
    console.log('Upgrading?');
    db = event.target.result;
    const objectStore = db.createObjectStore("form", { autoIncrement: true });
    console.log('Successfully upgraded db');
  };

  IDBOpenDBRequest.onsuccess = function(event) {
    db = event.target.result;
    messageFactory[type]({ data });

  };

};

