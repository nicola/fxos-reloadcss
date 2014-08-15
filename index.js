var Q = require('q');
var startB2G = require('moz-start-b2g');
var FirefoxClient = require('firefox-client');
var fs = require('fs');

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
      var apps = getWebapps(client);

      Q.all([manifest, apps])
        .spread(findApp)
        .then(function(app) {
          console.log("found app", app)
        })
        .done();
    });
}

function getWebapps(client) {
  return Q.ninvoke(client, 'getWebapps')
    .then(function(webapps) {
      return Q.ninvoke(webapps, 'getInstalledApps');
    });
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
      break;
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