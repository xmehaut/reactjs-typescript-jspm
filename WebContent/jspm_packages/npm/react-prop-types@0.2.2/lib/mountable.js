/* */ 
'use strict';
exports.__esModule = true;
var _common = require('./common');
function validate(props, propName, componentName) {
  if (typeof props[propName] !== 'object' || typeof props[propName].render !== 'function' && props[propName].nodeType !== 1) {
    return new Error(_common.errMsg(props, propName, componentName, ', expected a DOM element or an object that has a `render` method'));
  }
}
exports['default'] = _common.createChainableTypeChecker(validate);
module.exports = exports['default'];
