const formWorker = new Worker('js/form-worker.js');

// onkeyup could be used instead of onchange if you wanted to update the answer every time
// an entered value is changed, and you don't want to have to unfocus the field to update its .value

formWorker.onmessage = async function(e) {
  const {message, data} = e.data;
  console.log('Main (formWorker.onmessage): Message received from worker',
    e.data);
  if (!navigator.onLine) {
    alert('Saving this for you. Will post when you are online again.');
  } else {
    console.log('data?', data);
  }
};

function encrypt(e) {
  const {type, key, data, callback} = e;

  const IDBOpenDBRequest = indexedDB.open('solar-keys', 1);
  let db;
  const messageFactory = ({
    addKey({data}) {
      const objectStore = db.transaction('keys', 'readwrite')
        .objectStore('keys');
      objectStore.add(data, 'formKey');
      callback('Key Added');
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
            callback(new Uint8Array(encrypted));
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
    const objectStore = db.createObjectStore('keys', {autoIncrement: true});
    console.log('Successfully upgraded db');
  };

  IDBOpenDBRequest.onsuccess = function(event) {
    db = event.target.result;
    messageFactory[type]({key, data});

  };
}

const form = document.querySelector('#form');

if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const callback = function(data) {
      formWorker.postMessage({type: 'save', data});
    };
    console.log('Worker?', formWorker);
    const formItems = form.querySelectorAll('select,input');
    const user = {};
    formItems.forEach((item) => {
      user[item.name] = item.value;
    });
    if (navigator.onLine) {
      try {
        const query = `mutation AddUser($user: UserInput) {
                          addUser(user: $user) {
                            id
                          }
                        }`;
        await fetch('/api', {
          method: 'POST',
          body: JSON.stringify({
            query,
            variables: {
              user,
            },
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        window.localStorage.clear();
      } catch (e) {
        encrypt({type: 'encrypt', data: user, callback});
        window.localStorage.setItem('has-unfinished-form', 'yes');
      }
    } else {
      console.log('Encrypt Form?');
      encrypt({type: 'encrypt', data: user, callback});
      window.localStorage.setItem('has-unfinished-form', 'yes');
    }

    document.location.href = '/thankyou.html';

    return false;
  });

}

navigator.serviceWorker.ready.then(function(e) {
  console.log('Loaded Form');

});
