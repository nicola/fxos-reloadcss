var Q = require('q');
var findAppB2G = require('moz-findapp-b2g');
var FirefoxClient = require('firefox-client');
var fs = require('fs');
var REMOTE_PATH = /app:\/\/[^\/]*\/(.*\.css)/;
var path = require('path');

module.exports = reloadcssB2G;

function reloadcssB2G () {
  var args = arguments;
  var opts = {};
  var callback;

  // reloadcssB2G(manifestURL [, client])
  if (typeof args[0] == 'string') {
    opts.manifestURL = args[0];
    if (args[1] instanceof FirefoxClient) {
      opts.client = args[1];
    }
  }
  // reloadcssB2G({manifestURL: manifest_path[, client: firefox_client]})
  else if (typeof args[0] == 'object') {
    opts = args[0];
  }

  // reloadcssB2G(..., callback)
  if (typeof args[args.length-1] == 'function') {
    callback = args[args.length-1];
  }

  return findAppB2G(opts)
    .then(getStyleSheets)
    .then(function(styles) {
      var promises = styles.map(updateStyleSheet(opts.manifestURL));
      return Q.all(promises);
    })
    .then(function(styles) {
      if (callback) callback(null, styles);
      return styles;
    });
}

function updateStyleSheet (localManifest) {
  return function(style) {
    var localPath = path.dirname(localManifest);
    var localStyle = path.join(localPath, getLocalPath(style));

    return Q.nfcall(fs.readFile, localStyle, 'utf8')
      .then(function(file) {
        return Q.ninvoke(style, 'update', file);
      });
  };
}

function getLocalPath(styleActor) {
  var matches = REMOTE_PATH.exec(styleActor.sheet.href);
  return matches[1];
}

function getStyleSheets(actor) {
  var styleSheets = actor.StyleSheets;
  return Q.ninvoke(styleSheets, 'getStyleSheets');
}

if (require.main === module) {
  (function() {

    reloadcssB2G('/Users/mozilla/Desktop/nicola/manifest.webapp', function(err, result){
      console.log("Connected and disconnected", result);
    })
    .done();

  })();
}