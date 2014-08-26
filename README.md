# fxos-reloadcss

Live-reload CSS in a FirefoxOS simulator, without reloading the app

## Install

```
$ npm install fxos-reloadcss
```

## Usage

```javascript
var reloadcssB2G = require('fxos-reloadcss');

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
