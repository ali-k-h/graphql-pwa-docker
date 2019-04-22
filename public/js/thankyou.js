const unfinished = window.localStorage.getItem('has-unfinished-form');
const main = document.querySelector('.thankyou-message');
if (unfinished === 'yes' && (!navigator.onLine)) {
  main.innerHTML = '<p>We have saved your information but due to network issues we were not about to receive you request.</p><p>Please check your network status.</p>';
} else {
  main.innerHTML = '<p>Your submission has be received. You will be contacted shortly.</p>';
}
if (unfinished === 'yes' && navigator.onLine) {
  const button = document.querySelector('.thankyou button');
  button.style.display = 'block';
  main.innerHTML = '<p>There was an issue submitting your information but worry not, we kept it. Click Finish to send it off!</p>';
}

window.addEventListener('online', function() {
  const unfinished = window.localStorage.getItem('has-unfinished-form');
  let button = document.querySelector('.thankyou button');
  if (unfinished === 'yes') {
    button.style.display = 'block';
  }
  button.disabled = false;

});
window.addEventListener('offline', function() {
  const button = document.querySelector('.thankyou button');

  if (button) {
    button.disabled = true;
  }
});

navigator.serviceWorker.ready.then(function(e) {
  console.log('Loaded Form');

});
