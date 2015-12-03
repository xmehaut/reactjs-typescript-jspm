/* */ 
'use strict';
var babelHelpers = require('./util/babelHelpers');
exports.__esModule = true;
exports['default'] = activeElement;
var _ownerDocument = require('./ownerDocument');
var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);
function activeElement() {
  var doc = arguments[0] === undefined ? document : arguments[0];
  try {
    return doc.activeElement;
  } catch (e) {}
}
module.exports = exports['default'];
