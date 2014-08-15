# moz-reloadcss-b2g

Live-reload CSS in a FirefoxOS simulator, without reloading the app

## Install

```
$ npm install moz-reloadcss-b2g
```

## Usage

```javascript
var reloadcssB2G = require('moz-reloadcss-b2g');

reloadcssB2G('webapp.manifest', function(err, result) {
  console.log('done!');
})

reloadcssB2G({
    manifestURL: 'webapp.manifest',
    port:8004
  }, function(err, result) {
    console.log('done!');
  });

reloadcssB2G('webapp.manifest').then(nextPromise);
```