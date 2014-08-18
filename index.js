var Q = require('q');
var startB2G = require('moz-start-b2g');
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

  return startB2G(opts)
    .then(function(client) {

      var manifest = getManifest(opts.manifestURL);
      var webapps = getWebapps(client);
      var apps = webapps.then(getInstalledApps);

      return Q.all([manifest, apps])
        .spread(findApp)
        .then(function(app) {

          return webapps.then(getApp(app.manifestURL))
            .then(getStyleSheets)
            .then(function(styles) {
              var promises = styles.map(updateStyleSheet(opts.manifestURL));
              return Q.all(promises);
            });

        });
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

function getApp (manifestURL) {
  return function(webapps) {
    return Q.ninvoke(webapps, 'getApp', manifestURL);
  };
}

function getWebapps(client) {
  return Q.ninvoke(client, 'getWebapps');
}

function getInstalledApps(webapps) {
  return Q.ninvoke(webapps, 'getInstalledApps');
}

function getManifest(manifestURL) {
  return Q.nfcall(fs.readFile, manifestURL, 'utf8')
    .then(function(file) {
      return JSON.parse(file);
    });
}

function findApp(manifest, apps) {
  for (var i=0; i < apps.length; i++) {
    var app = apps[i];
    if (app.name == manifest.name) {
      return app;
    }
  }
  throw new Error("App not found");
}

if (require.main === module) {
  (function() {

    reloadcssB2G('/Users/mozilla/Desktop/nicola/manifest.webapp', function(err, client){
      console.log("Connected and disconnected");
    });

  })();
}

/*

 webappsActor = self.root['webappsActor']
        res = self.client.send({
            'to': webappsActor,
            'type': 'getAppActor',
            'manifestURL': self.selected_app['manifestURL']
        })

        styleSheetsActor = res['actor']['styleSheetsActor']
        res = self.client.send({
            'to': styleSheetsActor,
            'type': 'getStyleSheets'
        })

        # TODO upload all css always? this should be a setting
        for styleSheet in res['styleSheets']:
            base_path = self.selected_app['local_path']
            manifest_path = self.selected_app['origin']
            css_path = styleSheet['href']
            css_file = base_path + css_path.replace(manifest_path, '')
            f = open(css_file, 'r')

            self.client.send({
                'to': styleSheet['actor'],
                'type': 'update',
                'text': f.read(),
                'transition': True
            })

*/