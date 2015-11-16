/* */ 
(function(process) {
  var common = require('./common');
  var fs = require('fs');
  function rmdirSyncRecursive(dir, force) {
    var files;
    files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var file = dir + "/" + files[i],
          currFile = fs.lstatSync(file);
      if (currFile.isDirectory()) {
        rmdirSyncRecursive(file, force);
      } else if (currFile.isSymbolicLink()) {
        if (force || isWriteable(file)) {
          try {
            common.unlinkSync(file);
          } catch (e) {
            common.error('could not remove file (code ' + e.code + '): ' + file, true);
          }
        }
      } else if (force || isWriteable(file)) {
        try {
          common.unlinkSync(file);
        } catch (e) {
          common.error('could not remove file (code ' + e.code + '): ' + file, true);
        }
      }
    }
    var result;
    try {
      var start = Date.now();
      while (true) {
        try {
          result = fs.rmdirSync(dir);
          if (fs.existsSync(dir))
            throw {code: "EAGAIN"};
          break;
        } catch (er) {
          if (process.platform === "win32" && (er.code === "ENOTEMPTY" || er.code === "EBUSY" || er.code === "EPERM" || er.code === "EAGAIN")) {
            if (Date.now() - start > 1000)
              throw er;
          } else if (er.code === "ENOENT") {
            break;
          } else {
            throw er;
          }
        }
      }
    } catch (e) {
      common.error('could not remove directory (code ' + e.code + '): ' + dir, true);
    }
    return result;
  }
  function isWriteable(file) {
    var writePermission = true;
    try {
      var __fd = fs.openSync(file, 'a');
      fs.closeSync(__fd);
    } catch (e) {
      writePermission = false;
    }
    return writePermission;
  }
  function _rm(options, files) {
    options = common.parseOptions(options, {
      'f': 'force',
      'r': 'recursive',
      'R': 'recursive'
    });
    if (!files)
      common.error('no paths given');
    if (typeof files === 'string')
      files = [].slice.call(arguments, 1);
    files = common.expand(files);
    files.forEach(function(file) {
      if (!fs.existsSync(file)) {
        if (!options.force)
          common.error('no such file or directory: ' + file, true);
        return;
      }
      var stats = fs.lstatSync(file);
      if (stats.isFile() || stats.isSymbolicLink()) {
        if (options.force) {
          common.unlinkSync(file);
          return;
        }
        if (isWriteable(file))
          common.unlinkSync(file);
        else
          common.error('permission denied: ' + file, true);
        return;
      }
      if (stats.isDirectory() && !options.recursive) {
        common.error('path is a directory', true);
        return;
      }
      if (stats.isDirectory() && options.recursive) {
        rmdirSyncRecursive(file, options.force);
      }
    });
  }
  module.exports = _rm;
})(require('process'));
