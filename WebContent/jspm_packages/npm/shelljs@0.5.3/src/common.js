/* */ 
(function(process) {
  var os = require('os');
  var fs = require('fs');
  var _ls = require('./ls');
  var config = {
    silent: false,
    fatal: false
  };
  exports.config = config;
  var state = {
    error: null,
    currentCmd: 'shell.js',
    tempDir: null
  };
  exports.state = state;
  var platform = os.type().match(/^Win/) ? 'win' : 'unix';
  exports.platform = platform;
  function log() {
    if (!config.silent)
      console.log.apply(this, arguments);
  }
  exports.log = log;
  function error(msg, _continue) {
    if (state.error === null)
      state.error = '';
    state.error += state.currentCmd + ': ' + msg + '\n';
    if (msg.length > 0)
      log(state.error);
    if (config.fatal)
      process.exit(1);
    if (!_continue)
      throw '';
  }
  exports.error = error;
  function ShellString(str) {
    return str;
  }
  exports.ShellString = ShellString;
  function parseOptions(str, map) {
    if (!map)
      error('parseOptions() internal error: no map given');
    var options = {};
    for (var letter in map)
      options[map[letter]] = false;
    if (!str)
      return options;
    if (typeof str !== 'string')
      error('parseOptions() internal error: wrong str');
    var match = str.match(/^\-(.+)/);
    if (!match)
      return options;
    var chars = match[1].split('');
    chars.forEach(function(c) {
      if (c in map)
        options[map[c]] = true;
      else
        error('option not recognized: ' + c);
    });
    return options;
  }
  exports.parseOptions = parseOptions;
  function expand(list) {
    var expanded = [];
    list.forEach(function(listEl) {
      if (listEl.search(/\*[^\/]*\//) > -1 || listEl.search(/\*\*[^\/]*\//) > -1) {
        var match = listEl.match(/^([^*]+\/|)(.*)/);
        var root = match[1];
        var rest = match[2];
        var restRegex = rest.replace(/\*\*/g, ".*").replace(/\*/g, "[^\\/]*");
        restRegex = new RegExp(restRegex);
        _ls('-R', root).filter(function(e) {
          return restRegex.test(e);
        }).forEach(function(file) {
          expanded.push(file);
        });
      } else if (listEl.search(/\*/) > -1) {
        _ls('', listEl).forEach(function(file) {
          expanded.push(file);
        });
      } else {
        expanded.push(listEl);
      }
    });
    return expanded;
  }
  exports.expand = expand;
  function unlinkSync(file) {
    try {
      fs.unlinkSync(file);
    } catch (e) {
      if (e.code === 'EPERM') {
        fs.chmodSync(file, '0666');
        fs.unlinkSync(file);
      } else {
        throw e;
      }
    }
  }
  exports.unlinkSync = unlinkSync;
  function randomFileName() {
    function randomHash(count) {
      if (count === 1)
        return parseInt(16 * Math.random(), 10).toString(16);
      else {
        var hash = '';
        for (var i = 0; i < count; i++)
          hash += randomHash(1);
        return hash;
      }
    }
    return 'shelljs_' + randomHash(20);
  }
  exports.randomFileName = randomFileName;
  function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function(source) {
      for (var key in source)
        target[key] = source[key];
    });
    return target;
  }
  exports.extend = extend;
  function wrap(cmd, fn, options) {
    return function() {
      var retValue = null;
      state.currentCmd = cmd;
      state.error = null;
      try {
        var args = [].slice.call(arguments, 0);
        if (options && options.notUnix) {
          retValue = fn.apply(this, args);
        } else {
          if (args.length === 0 || typeof args[0] !== 'string' || args[0][0] !== '-')
            args.unshift('');
          retValue = fn.apply(this, args);
        }
      } catch (e) {
        if (!state.error) {
          console.log('shell.js: internal error');
          console.log(e.stack || e);
          process.exit(1);
        }
        if (config.fatal)
          throw e;
      }
      state.currentCmd = 'shell.js';
      return retValue;
    };
  }
  exports.wrap = wrap;
})(require('process'));
