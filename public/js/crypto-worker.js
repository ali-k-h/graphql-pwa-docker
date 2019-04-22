self.onmessage = function(e) {
  const { type, data } = e.data;

  const IDBOpenDBRequest = indexedDB.open('solar-keys', 1);
  let db;

  const messageFactory = ({
    addKey({data}) {
      const objectStore = db.transaction('keys', 'readwrite')
        .objectStore('keys');
      objectStore.add(data, 'formKey');
      self.postMessage({ message: 'Key Added', data: null });
    },
    encrypt({data}) {
      const objectStore = db.transaction('keys').objectStore('keys');
      const item = objectStore.get('formKey');
      item.onsuccess = function(ev) {
        const str = btoa(JSON.stringify(data));
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        const key = ev.target.result;
        window.crypto.subtle.encrypt(
          {
            name: 'RSA-OAEP',
            //label: Uint8Array([...]) //optional
          },
          key, //from generateKey or importKey above
          buf, //ArrayBuffer of data you want to encrypt
        )
          .then(function(encrypted) {
            console.log('Encrypted');
            //returns an ArrayBuffer containing the encrypted data
            self.postMessage({ message: 'Retrieved Data', data: new Uint8Array(encrypted)});
          })
          .catch(function(err) {
            console.error(err);
          });
      };
      item.onerror = function(ev) {
        console.log('Failed to get key', ev);
      };
    },
  });

  IDBOpenDBRequest.onupgradeneeded = function(event) {
    console.log('Upgrading?');
    db = event.target.result;
    const objectStore = db.createObjectStore("keys", { autoIncrement: true });
    console.log('Successfully upgraded db');
  };

  IDBOpenDBRequest.onsuccess = function(event) {
    db = event.target.result;
    messageFactory[type]({ data });

  };

};

