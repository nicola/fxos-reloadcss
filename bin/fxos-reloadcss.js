#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Q = require('q');
var reloadCss = require('../index');

var opts = require("nomnom")
  .option('manifestURL', {
    position: 0,
    help: "App manifest.webapp to deploy",
    list: false
  })
  .option('port', {
    abbr: 'p',
    flag: true,
    help: 'Port of FirefoxOS'
  })
  .option('version', {
    flag: true,
    help: 'Print version and exit',
    callback: function() {
      fs.readFile(path.resolve(__dirname, '../package.json'), 'utf-8', function(err, file) {
        console.log(JSON.parse(file).version);
      });
    }
  })
  .parse();

if (!opts.manifestURL) {
  opts.manifestURL = path.resolve('./manifest.webapp');
}

reloadCss(opts)
  .then(function(app) {
    console.log("Css reloaded:", app);
  })
  .catch(function(err) {
    console.log("Error", err);
    return;
  });