/* */ 
(function(process) {
  var fs = require('fs');
  var common = require('./common');
  function _cd(options, dir) {
    if (!dir)
      common.error('directory not specified');
    if (!fs.existsSync(dir))
      common.error('no such file or directory: ' + dir);
    if (!fs.statSync(dir).isDirectory())
      common.error('not a directory: ' + dir);
    process.chdir(dir);
  }
  module.exports = _cd;
})(require('process'));
