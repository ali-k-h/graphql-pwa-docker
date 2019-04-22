if (!navigator.onLine) {
  const button = document.querySelector('.unfinished-submit');
  button.classList.add('disabled');
  button.disabled = true;

  const message = document.querySelector('.message');
  message.innerHTML = 'Oh no, you are offline. Please adjust your network settings.';
}

window.addEventListener('online', function(){
  const button = document.querySelector('.unfinished-submit');
  button.classList.remove('disabled');
  button.disabled = false;
  const message = document.querySelector('.message');
  message.innerHTML = '';
});
window.addEventListener('offline', function(){
  const button = document.querySelector('.unfinished-submit');
  button.classList.add('disabled');
  button.disabled = true;
  const message = document.querySelector('.message');
  message.innerHTML = 'Oh no, you are offline. Please adjust your network settings.';
});
navigator.serviceWorker.ready.then(function(e) {
  console.log('Loaded Form');

});
