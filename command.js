var ReloadCSS = require('./index');
var Connect = require('fxos-connect');
var __ = require('underscore');

module.exports = ReloadCSSCommand;

function ReloadCSSCommand(opts, beforeCallback, afterCallback) {

  opts = opts || {};
  if (!beforeCallback) {
    beforeCallback = function (err, result, next) { next(); };
  }

  opts.connect = true;
  Connect(opts, function(err, sim) {
    opts.client = sim.client;
    ReloadCSS(opts, function(err, stylesheets) {
      beforeCallback(err, {value:stylesheets, client:opts.client}, function(err) {
        sim.client.disconnect();
        if (afterCallback) afterCallback(err, stylesheets);
      });
    });
  });
}