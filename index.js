var Q = require('q');
var findApp = require('fxos-findapp');
var FirefoxClient = require('firefox-client');
var fs = require('fs');
var REMOTE_PATH = /app:\/\/[^\/]*\/(.*\.css)/;
var path = require('path');

module.exports = reloadcss;

function reloadcss (opts, callback) {
  opts = opts || {};

  return findApp(opts)
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
