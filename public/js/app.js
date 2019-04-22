async function registerServiceWorker() {
  if (navigator && 'serviceWorker' in navigator) {
    return await navigator.serviceWorker.register('./service-worker.js');
  }
}

registerServiceWorker().then((registration) => {

});


if (!navigator.onLine) {
  document.querySelector('.online-mode').innerHTML = 'You\'re Offline!';
}

window.addEventListener('online', function() {
  document.querySelector('.online-mode').innerHTML = '';
});

window.addEventListener('offline', function() {
  document.querySelector('.online-mode').innerHTML = 'You\'re Offline!';
});

const formWorker = new Worker('js/form-worker.js');

// onkeyup could be used instead of onchange if you wanted to update the answer every time
// an entered value is changed, and you don't want to have to unfocus the field to update its .value

formWorker.onmessage = async function(e) {
  const { message, data } = e.data;
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
          user: {
            payload: JSON.stringify(data),
          }
        }
      }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    window.localStorage.clear();
    document.location.href = '/thankyou.html';
  } catch (e) {
    alert('You are not online. Please check your network and try again.');
  }
};

const button = document.querySelector('.unfinished-submit');

if (button) {
  button.addEventListener('click', function(){
    if (!this.disabled) {
      formWorker.postMessage({type: 'get'});
    }
  });
}

