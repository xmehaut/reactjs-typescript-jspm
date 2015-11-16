/* */ 
(function(Buffer) {
  var fs = require('fs');
  var path = require('path');
  var common = require('./common');
  var os = require('os');
  function copyFileSync(srcFile, destFile) {
    if (!fs.existsSync(srcFile))
      common.error('copyFileSync: no such file or directory: ' + srcFile);
    var BUF_LENGTH = 64 * 1024,
        buf = new Buffer(BUF_LENGTH),
        bytesRead = BUF_LENGTH,
        pos = 0,
        fdr = null,
        fdw = null;
    try {
      fdr = fs.openSync(srcFile, 'r');
    } catch (e) {
      common.error('copyFileSync: could not read src file (' + srcFile + ')');
    }
    try {
      fdw = fs.openSync(destFile, 'w');
    } catch (e) {
      common.error('copyFileSync: could not write to dest file (code=' + e.code + '):' + destFile);
    }
    while (bytesRead === BUF_LENGTH) {
      bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
      fs.writeSync(fdw, buf, 0, bytesRead);
      pos += bytesRead;
    }
    fs.closeSync(fdr);
    fs.closeSync(fdw);
    fs.chmodSync(destFile, fs.statSync(srcFile).mode);
  }
  function cpdirSyncRecursive(sourceDir, destDir, opts) {
    if (!opts)
      opts = {};
    var checkDir = fs.statSync(sourceDir);
    try {
      fs.mkdirSync(destDir, checkDir.mode);
    } catch (e) {
      if (e.code !== 'EEXIST')
        throw e;
    }
    var files = fs.readdirSync(sourceDir);
    for (var i = 0; i < files.length; i++) {
      var srcFile = sourceDir + "/" + files[i];
      var destFile = destDir + "/" + files[i];
      var srcFileStat = fs.lstatSync(srcFile);
      if (srcFileStat.isDirectory()) {
        cpdirSyncRecursive(srcFile, destFile, opts);
      } else if (srcFileStat.isSymbolicLink()) {
        var symlinkFull = fs.readlinkSync(srcFile);
        fs.symlinkSync(symlinkFull, destFile, os.platform() === "win32" ? "junction" : null);
      } else {
        if (fs.existsSync(destFile) && !opts.force) {
          common.log('skipping existing file: ' + files[i]);
        } else {
          copyFileSync(srcFile, destFile);
        }
      }
    }
  }
  function _cp(options, sources, dest) {
    options = common.parseOptions(options, {
      'f': 'force',
      'R': 'recursive',
      'r': 'recursive'
    });
    if (arguments.length < 3) {
      common.error('missing <source> and/or <dest>');
    } else if (arguments.length > 3) {
      sources = [].slice.call(arguments, 1, arguments.length - 1);
      dest = arguments[arguments.length - 1];
    } else if (typeof sources === 'string') {
      sources = [sources];
    } else if ('length' in sources) {
      sources = sources;
    } else {
      common.error('invalid arguments');
    }
    var exists = fs.existsSync(dest),
        stats = exists && fs.statSync(dest);
    if ((!exists || !stats.isDirectory()) && sources.length > 1)
      common.error('dest is not a directory (too many sources)');
    if (exists && stats.isFile() && !options.force)
      common.error('dest file already exists: ' + dest);
    if (options.recursive) {
      sources.forEach(function(src, i) {
        if (src[src.length - 1] === '/')
          sources[i] += '*';
      });
      try {
        fs.mkdirSync(dest, parseInt('0777', 8));
      } catch (e) {}
    }
    sources = common.expand(sources);
    sources.forEach(function(src) {
      if (!fs.existsSync(src)) {
        common.error('no such file or directory: ' + src, true);
        return;
      }
      if (fs.statSync(src).isDirectory()) {
        if (!options.recursive) {
          common.log(src + ' is a directory (not copied)');
        } else {
          var newDest = path.join(dest, path.basename(src)),
              checkDir = fs.statSync(src);
          try {
            fs.mkdirSync(newDest, checkDir.mode);
          } catch (e) {
            if (e.code !== 'EEXIST') {
              common.error('dest file no such file or directory: ' + newDest, true);
              throw e;
            }
          }
          cpdirSyncRecursive(src, newDest, {force: options.force});
        }
        return;
      }
      var thisDest = dest;
      if (fs.existsSync(dest) && fs.statSync(dest).isDirectory())
        thisDest = path.normalize(dest + '/' + path.basename(src));
      if (fs.existsSync(thisDest) && !options.force) {
        common.error('dest file already exists: ' + thisDest, true);
        return;
      }
      copyFileSync(src, thisDest);
    });
  }
  module.exports = _cp;
})(require('buffer').Buffer);
