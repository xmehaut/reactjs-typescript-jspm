/* */ 
(function(process) {
  var common = require('./common');
  var os = require('os');
  var fs = require('fs');
  function writeableDir(dir) {
    if (!dir || !fs.existsSync(dir))
      return false;
    if (!fs.statSync(dir).isDirectory())
      return false;
    var testFile = dir + '/' + common.randomFileName();
    try {
      fs.writeFileSync(testFile, ' ');
      common.unlinkSync(testFile);
      return dir;
    } catch (e) {
      return false;
    }
  }
  function _tempDir() {
    var state = common.state;
    if (state.tempDir)
      return state.tempDir;
    state.tempDir = writeableDir(os.tempDir && os.tempDir()) || writeableDir(process.env['TMPDIR']) || writeableDir(process.env['TEMP']) || writeableDir(process.env['TMP']) || writeableDir(process.env['Wimp$ScrapDir']) || writeableDir('C:\\TEMP') || writeableDir('C:\\TMP') || writeableDir('\\TEMP') || writeableDir('\\TMP') || writeableDir('/tmp') || writeableDir('/var/tmp') || writeableDir('/usr/tmp') || writeableDir('.');
    return state.tempDir;
  }
  module.exports = _tempDir;
})(require('process'));
