# fxos-reloadcss

Live-reload CSS in a FirefoxOS simulator, without reloading the app.

This is part of [node-fxos](https://github.com/nicola/node-fxos)' project.

## Install

```
$ npm install fxos-reloadcss

# command line tool
$ npm install -g fxos-reloadcss
```

## Usage

### Command line

```bash
Usage: node fxos-reloadcss [manifestURL] [options]

manifestURL     App manifest.webapp to reloadcss

Options:
   -p, --port   Port of FirefoxOS
   --version    Print version and exit
```

### Node library

Start a FirefoxOS simulator and connect to it through [firefox-client](https://github.com/harthur/firefox-client) by returning `client`.


#### Callback

```javascript
// client from firefox-client or fxos-connect or fxos-start
var reloadcss = require('fxos-reloadcss');
/* ... */
reloadcss({
  manifestURL: 'manifest.webapp',
  client: client
}, function(err, changes){
  console.log("css changes:", changes);
})
```

#### Promise

```javascript
/* ... */
reloadcss({
    manifestURL: 'manifest.webapp',
    client: client
  })
  .then(function(appId) {})
  .fail(function(err) {})
```

#### Command

This handles connection and disconnection wrapping a callback in between

```javascript
var reloadcss = require('fxos-reloadcss/command');
reloadcss({
  port:8002,
  manifestURL: 'manifest.webapp'
}, function(err, result, next){
  // result = {
  //   client: FirefoxClient,
  //   result: changes
  // }
  next(err);
})
```
