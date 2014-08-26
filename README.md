# fxos-reloadcss

Live-reload CSS in a FirefoxOS simulator, without reloading the app

## Install

```
$ npm install fxos-reloadcss
```

## Usage

```javascript
var reloadcss = require('fxos-reloadcss');

reloadcss('manifest.webapp', function(err, result) {
  console.log('done!');
});

reloadcss('manifest.webapp').then(nextPromise);

reloadcss({
  manifestURL: 'manifest.webapp',
  port:8004
}, function(err, result) {
  console.log('done!');
});

```
