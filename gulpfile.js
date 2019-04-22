const gulp = require('gulp');
const fs = require('fs');
const swPrecache = require('sw-precache');
const serviceWorker = async () => {
  return swPrecache.write('public/service-worker.js', {
    staticFileGlobs: [
      'public/',
      'public/favicon.ico',
      'public/index.html',
      'public/form.html',
      'public/thankyou.html',
      'public/finish-submission.html',
      'public/js/app.js',
      'public/js/main.js',
      'public/js/form.js',
      'public/js/thankyou.js',
      'public/js/finish-submission.js',
      'public/js/form-worker.js',
      'public/styles/bootstrap.css',
      'public/styles/inline.css',
      'public/images/clear.png',
      'public/service-worker.js',
      'public/manifest.json',
      'public/public.jwk',
    ],
    importScripts: [
      'https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js',
    ],
    stripPrefix: 'public'
  });
};
gulp.task('service-worker', serviceWorker);
gulp.task('default', async (done) => {
  await serviceWorker();
  fs.appendFileSync('public/service-worker.js', '\nworkbox.precaching.precacheAndRoute([]);\n' +
    '\n' +
    'workbox.routing.registerRoute(\n' +
    '  /api/,\n' +
    '  workbox.strategies.networkFirst({\n' +
    '    cacheName: \'api-cache\',\n' +
    '    plugins: [\n' +
    '      new workbox.cacheableResponse.Plugin({\n' +
    '        statuses: [0, 200],\n' +
    '      })\n' +
    '    ]\n' +
    '  })\n' +
    ');\n' +
    '\n' +
    'workbox.routing.registerRoute(\n' +
    '  /images/,\n' +
    '  workbox.strategies.staleWhileRevalidate({\n' +
    '    cacheName: \'image-cache\',\n' +
    '    plugins: [\n' +
    '      new workbox.cacheableResponse.Plugin({\n' +
    '        statuses: [0, 200],\n' +
    '      })\n' +
    '    ]\n' +
    '  })\n' +
    ');');
  done();
});
