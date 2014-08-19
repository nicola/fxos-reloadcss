# moz-reloadcss-b2g

Live-reload CSS in a FirefoxOS simulator, without reloading the app

## Install

```
$ npm install moz-reloadcss-b2g
```

## Usage

```javascript
var reloadcssB2G = require('moz-reloadcss-b2g');

reloadcssB2G('manifest.webapp', function(err, result) {
  console.log('done!');
});

reloadcssB2G('manifest.webapp').then(nextPromise);

reloadcssB2G({
  manifestURL: 'manifest.webapp',
  port:8004
}, function(err, result) {
  console.log('done!');
});

```
