/* */ 
var fs = require('fs');
var path = require('path');
var common = require('./common');
function _mv(options, sources, dest) {
  options = common.parseOptions(options, {'f': 'force'});
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
  sources = common.expand(sources);
  var exists = fs.existsSync(dest),
      stats = exists && fs.statSync(dest);
  if ((!exists || !stats.isDirectory()) && sources.length > 1)
    common.error('dest is not a directory (too many sources)');
  if (exists && stats.isFile() && !options.force)
    common.error('dest file already exists: ' + dest);
  sources.forEach(function(src) {
    if (!fs.existsSync(src)) {
      common.error('no such file or directory: ' + src, true);
      return;
    }
    var thisDest = dest;
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory())
      thisDest = path.normalize(dest + '/' + path.basename(src));
    if (fs.existsSync(thisDest) && !options.force) {
      common.error('dest file already exists: ' + thisDest, true);
      return;
    }
    if (path.resolve(src) === path.dirname(path.resolve(thisDest))) {
      common.error('cannot move to self: ' + src, true);
      return;
    }
    fs.renameSync(src, thisDest);
  });
}
module.exports = _mv;
