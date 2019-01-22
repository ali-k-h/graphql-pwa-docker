async function registerServiceWorker(){
  if(navigator && 'serviceWorker' in navigator){
    await navigator.serviceWorker.register('./service-worker.js');
    console.log('Service worker is registered!')
  }
}

fetch('/graphql?hello', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({query: "{ allProducts { product_name } }"}),
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data))
  .catch(error => console.log('ERROR',error));

registerServiceWorker().then(() => {

});

