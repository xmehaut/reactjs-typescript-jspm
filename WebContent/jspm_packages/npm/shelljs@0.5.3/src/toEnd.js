/* */ 
var common = require('./common');
var fs = require('fs');
var path = require('path');
function _toEnd(options, file) {
  if (!file)
    common.error('wrong arguments');
  if (!fs.existsSync(path.dirname(file)))
    common.error('no such file or directory: ' + path.dirname(file));
  try {
    fs.appendFileSync(file, this.toString(), 'utf8');
  } catch (e) {
    common.error('could not append to file (code ' + e.code + '): ' + file, true);
  }
}
module.exports = _toEnd;
