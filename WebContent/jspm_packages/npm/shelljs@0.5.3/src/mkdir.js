/* */ 
var common = require('./common');
var fs = require('fs');
var path = require('path');
function mkdirSyncRecursive(dir) {
  var baseDir = path.dirname(dir);
  if (fs.existsSync(baseDir)) {
    fs.mkdirSync(dir, parseInt('0777', 8));
    return;
  }
  mkdirSyncRecursive(baseDir);
  fs.mkdirSync(dir, parseInt('0777', 8));
}
function _mkdir(options, dirs) {
  options = common.parseOptions(options, {'p': 'fullpath'});
  if (!dirs)
    common.error('no paths given');
  if (typeof dirs === 'string')
    dirs = [].slice.call(arguments, 1);
  dirs.forEach(function(dir) {
    if (fs.existsSync(dir)) {
      if (!options.fullpath)
        common.error('path already exists: ' + dir, true);
      return;
    }
    var baseDir = path.dirname(dir);
    if (!fs.existsSync(baseDir) && !options.fullpath) {
      common.error('no such file or directory: ' + baseDir, true);
      return;
    }
    if (options.fullpath)
      mkdirSyncRecursive(dir);
    else
      fs.mkdirSync(dir, parseInt('0777', 8));
  });
}
module.exports = _mkdir;
