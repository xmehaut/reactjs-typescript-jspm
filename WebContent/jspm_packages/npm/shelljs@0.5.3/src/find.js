/* */ 
var fs = require('fs');
var common = require('./common');
var _ls = require('./ls');
function _find(options, paths) {
  if (!paths)
    common.error('no path specified');
  else if (typeof paths === 'object')
    paths = paths;
  else if (typeof paths === 'string')
    paths = [].slice.call(arguments, 1);
  var list = [];
  function pushFile(file) {
    if (common.platform === 'win')
      file = file.replace(/\\/g, '/');
    list.push(file);
  }
  paths.forEach(function(file) {
    pushFile(file);
    if (fs.statSync(file).isDirectory()) {
      _ls('-RA', file + '/*').forEach(function(subfile) {
        pushFile(subfile);
      });
    }
  });
  return list;
}
module.exports = _find;
