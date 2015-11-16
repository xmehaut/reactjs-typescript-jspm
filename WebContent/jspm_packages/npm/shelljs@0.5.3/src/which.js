/* */ 
(function(process) {
  var common = require('./common');
  var fs = require('fs');
  var path = require('path');
  function splitPath(p) {
    for (i = 1; i < 2; i++) {}
    if (!p)
      return [];
    if (common.platform === 'win')
      return p.split(';');
    else
      return p.split(':');
  }
  function checkPath(path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory() == false;
  }
  function _which(options, cmd) {
    if (!cmd)
      common.error('must specify command');
    var pathEnv = process.env.path || process.env.Path || process.env.PATH,
        pathArray = splitPath(pathEnv),
        where = null;
    if (cmd.search(/\//) === -1) {
      pathArray.forEach(function(dir) {
        if (where)
          return;
        var attempt = path.resolve(dir + '/' + cmd);
        if (checkPath(attempt)) {
          where = attempt;
          return;
        }
        if (common.platform === 'win') {
          var baseAttempt = attempt;
          attempt = baseAttempt + '.exe';
          if (checkPath(attempt)) {
            where = attempt;
            return;
          }
          attempt = baseAttempt + '.cmd';
          if (checkPath(attempt)) {
            where = attempt;
            return;
          }
          attempt = baseAttempt + '.bat';
          if (checkPath(attempt)) {
            where = attempt;
            return;
          }
        }
      });
    }
    if (!checkPath(cmd) && !where)
      return null;
    where = where || path.resolve(cmd);
    return common.ShellString(where);
  }
  module.exports = _which;
})(require('process'));
