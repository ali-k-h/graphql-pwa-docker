function priceFormatter(number) {
  const schema = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0, });
  return schema.format(parseFloat(number));
}

function processItems(items) {
  return items.map(function(i) {
    return i !== null ? `
      <div class="solar-product card">
        <div class="solar-product-img">
            <img class="card-img-top" src="${i.image}" alt="${i.name}" /> 
        </div>
        <div class="card-body with-description" onclick="if (this.classList.contains('show')) {this.classList.remove('show');} else {this.classList.add('show');}">
          <h5 class="card-title">${i.name}</h5> 
          <p class="card-text">${i.description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Initial Cost: <strong>${priceFormatter(i.initialCost)}</strong></li>
        </ul>
        <div class="card-body card-footer">
            <a href="/form.html" class="btn btn-primary">Apply</a>
        </div>
      </div>` : '';
  });
}

async function showData(data) {
  console.log('data returned:', data);
  document.querySelector('.main').innerHTML = `<div class="solar-products">${processItems(data.data.getProducts).join('')}</div>`;
  document.querySelector('.loader').style.display = 'none';
}

const unfinished = window.localStorage.getItem('has-unfinished-form');
if (unfinished === 'yes' && navigator.onLine) {
  let notification;
  // Let's check whether notification permissions have already been granted
  if ("Notification" in window && Notification.permission === "granted") {
    // If it's okay let's create a notification
    notification = new Notification("You have an unfinished submission!");
  }

  // Otherwise, we need to ask the user for permission
  if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        notification = new Notification("You have an unfinished submission!");
      }
    });
  }

  if (notification) {
    notification.addEventListener('click', function(){
      document.location.href = '/finish-submission.html';
    });
  }
}

navigator.serviceWorker.ready.then(async function(e) {
  try {
    const keyResponse = await fetch('/public.jwk');
    const publicKeyJSON = await keyResponse.json();
    const publicKey = await window.crypto.subtle.importKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      publicKeyJSON,
      {   //these are the algorithm options
        name: "RSA-OAEP",
        hash: {name: "SHA-512"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt"] //"encrypt" or "wrapKey" for public key import or
      //"decrypt" or "unwrapKey" for private key imports
    );
    //returns a publicKey (or privateKey if you are importing a private key)
    if (window.Worker) {
      const cryptoWorker = new Worker('js/crypto-worker.js');
      cryptoWorker.postMessage(
        {type: 'addKey', data: publicKey});
    }
    console.log('Loaded Public Key', publicKey);
  } catch (err) {
    console.error('Failed to get public key', err);
  }

  const limit = 4;
  const query = `{ getProducts(limit:${limit}) { name, description, initialCost, image} }`;
  try {
    const response = await fetch('/api?query=' + encodeURIComponent(query));
    const data = await response.json();
    showData(data);
  } catch(e) {
    console.error('ERROR', e)
  }
});

