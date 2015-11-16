/* */ 
var path = require('path');
var fs = require('fs');
var common = require('./common');
var _cd = require('./cd');
var _pwd = require('./pwd');
function _ls(options, paths) {
  options = common.parseOptions(options, {
    'R': 'recursive',
    'A': 'all',
    'a': 'all_deprecated'
  });
  if (options.all_deprecated) {
    common.log('ls: Option -a is deprecated. Use -A instead');
    options.all = true;
  }
  if (!paths)
    paths = ['.'];
  else if (typeof paths === 'object')
    paths = paths;
  else if (typeof paths === 'string')
    paths = [].slice.call(arguments, 1);
  var list = [];
  function pushFile(file, query) {
    if (path.basename(file)[0] === '.') {
      if (!options.all && !(path.basename(query)[0] === '.' && path.basename(query).length > 1))
        return false;
    }
    if (common.platform === 'win')
      file = file.replace(/\\/g, '/');
    list.push(file);
    return true;
  }
  paths.forEach(function(p) {
    if (fs.existsSync(p)) {
      var stats = fs.statSync(p);
      if (stats.isFile()) {
        pushFile(p, p);
        return;
      }
      if (stats.isDirectory()) {
        fs.readdirSync(p).forEach(function(file) {
          if (!pushFile(file, p))
            return;
          if (options.recursive) {
            var oldDir = _pwd();
            _cd('', p);
            if (fs.statSync(file).isDirectory())
              list = list.concat(_ls('-R' + (options.all ? 'A' : ''), file + '/*'));
            _cd('', oldDir);
          }
        });
        return;
      }
    }
    var basename = path.basename(p);
    var dirname = path.dirname(p);
    if (basename.search(/\*/) > -1 && fs.existsSync(dirname) && fs.statSync(dirname).isDirectory) {
      var regexp = basename.replace(/(\^|\$|\(|\)|<|>|\[|\]|\{|\}|\.|\+|\?)/g, '\\$1');
      regexp = '^' + regexp.replace(/\*/g, '.*') + '$';
      fs.readdirSync(dirname).forEach(function(file) {
        if (file.match(new RegExp(regexp))) {
          if (!pushFile(path.normalize(dirname + '/' + file), basename))
            return;
          if (options.recursive) {
            var pp = dirname + '/' + file;
            if (fs.lstatSync(pp).isDirectory())
              list = list.concat(_ls('-R' + (options.all ? 'A' : ''), pp + '/*'));
          }
        }
      });
      return;
    }
    common.error('no such file or directory: ' + p, true);
  });
  return list;
}
module.exports = _ls;
