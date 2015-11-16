/* */ 
(function(process) {
  var common = require('./common');
  var fs = require('fs');
  var path = require('path');
  var PERMS = (function(base) {
    return {
      OTHER_EXEC: base.EXEC,
      OTHER_WRITE: base.WRITE,
      OTHER_READ: base.READ,
      GROUP_EXEC: base.EXEC << 3,
      GROUP_WRITE: base.WRITE << 3,
      GROUP_READ: base.READ << 3,
      OWNER_EXEC: base.EXEC << 6,
      OWNER_WRITE: base.WRITE << 6,
      OWNER_READ: base.READ << 6,
      STICKY: parseInt('01000', 8),
      SETGID: parseInt('02000', 8),
      SETUID: parseInt('04000', 8),
      TYPE_MASK: parseInt('0770000', 8)
    };
  })({
    EXEC: 1,
    WRITE: 2,
    READ: 4
  });
  function _chmod(options, mode, filePattern) {
    if (!filePattern) {
      if (options.length > 0 && options.charAt(0) === '-') {
        filePattern = mode;
        mode = options;
        options = '';
      } else {
        common.error('You must specify a file.');
      }
    }
    options = common.parseOptions(options, {
      'R': 'recursive',
      'c': 'changes',
      'v': 'verbose'
    });
    if (typeof filePattern === 'string') {
      filePattern = [filePattern];
    }
    var files;
    if (options.recursive) {
      files = [];
      common.expand(filePattern).forEach(function addFile(expandedFile) {
        var stat = fs.lstatSync(expandedFile);
        if (!stat.isSymbolicLink()) {
          files.push(expandedFile);
          if (stat.isDirectory()) {
            fs.readdirSync(expandedFile).forEach(function(child) {
              addFile(expandedFile + '/' + child);
            });
          }
        }
      });
    } else {
      files = common.expand(filePattern);
    }
    files.forEach(function innerChmod(file) {
      file = path.resolve(file);
      if (!fs.existsSync(file)) {
        common.error('File not found: ' + file);
      }
      if (options.recursive && fs.lstatSync(file).isSymbolicLink()) {
        return;
      }
      var perms = fs.statSync(file).mode;
      var type = perms & PERMS.TYPE_MASK;
      var newPerms = perms;
      if (isNaN(parseInt(mode, 8))) {
        mode.split(',').forEach(function(symbolicMode) {
          var pattern = /([ugoa]*)([=\+-])([rwxXst]*)/i;
          var matches = pattern.exec(symbolicMode);
          if (matches) {
            var applyTo = matches[1];
            var operator = matches[2];
            var change = matches[3];
            var changeOwner = applyTo.indexOf('u') != -1 || applyTo === 'a' || applyTo === '';
            var changeGroup = applyTo.indexOf('g') != -1 || applyTo === 'a' || applyTo === '';
            var changeOther = applyTo.indexOf('o') != -1 || applyTo === 'a' || applyTo === '';
            var changeRead = change.indexOf('r') != -1;
            var changeWrite = change.indexOf('w') != -1;
            var changeExec = change.indexOf('x') != -1;
            var changeSticky = change.indexOf('t') != -1;
            var changeSetuid = change.indexOf('s') != -1;
            var mask = 0;
            if (changeOwner) {
              mask |= (changeRead ? PERMS.OWNER_READ : 0) + (changeWrite ? PERMS.OWNER_WRITE : 0) + (changeExec ? PERMS.OWNER_EXEC : 0) + (changeSetuid ? PERMS.SETUID : 0);
            }
            if (changeGroup) {
              mask |= (changeRead ? PERMS.GROUP_READ : 0) + (changeWrite ? PERMS.GROUP_WRITE : 0) + (changeExec ? PERMS.GROUP_EXEC : 0) + (changeSetuid ? PERMS.SETGID : 0);
            }
            if (changeOther) {
              mask |= (changeRead ? PERMS.OTHER_READ : 0) + (changeWrite ? PERMS.OTHER_WRITE : 0) + (changeExec ? PERMS.OTHER_EXEC : 0);
            }
            if (changeSticky) {
              mask |= PERMS.STICKY;
            }
            switch (operator) {
              case '+':
                newPerms |= mask;
                break;
              case '-':
                newPerms &= ~mask;
                break;
              case '=':
                newPerms = type + mask;
                if (fs.statSync(file).isDirectory()) {
                  newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
                }
                break;
            }
            if (options.verbose) {
              log(file + ' -> ' + newPerms.toString(8));
            }
            if (perms != newPerms) {
              if (!options.verbose && options.changes) {
                log(file + ' -> ' + newPerms.toString(8));
              }
              fs.chmodSync(file, newPerms);
            }
          } else {
            common.error('Invalid symbolic mode change: ' + symbolicMode);
          }
        });
      } else {
        newPerms = type + parseInt(mode, 8);
        if (fs.statSync(file).isDirectory()) {
          newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
        }
        fs.chmodSync(file, newPerms);
      }
    });
  }
  module.exports = _chmod;
})(require('process'));
