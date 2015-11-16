/* */ 
var common = require('./common');
var fs = require('fs');
function _sed(options, regex, replacement, file) {
  options = common.parseOptions(options, {'i': 'inplace'});
  if (typeof replacement === 'string' || typeof replacement === 'function')
    replacement = replacement;
  else if (typeof replacement === 'number')
    replacement = replacement.toString();
  else
    common.error('invalid replacement string');
  if (!file)
    common.error('no file given');
  if (!fs.existsSync(file))
    common.error('no such file or directory: ' + file);
  var result = fs.readFileSync(file, 'utf8').replace(regex, replacement);
  if (options.inplace)
    fs.writeFileSync(file, result, 'utf8');
  return common.ShellString(result);
}
module.exports = _sed;
