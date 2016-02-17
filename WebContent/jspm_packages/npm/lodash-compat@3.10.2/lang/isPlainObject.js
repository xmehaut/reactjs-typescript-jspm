/* */ 
var baseForIn = require('../internal/baseForIn'),
    isArguments = require('./isArguments'),
    isHostObject = require('../internal/isHostObject'),
    isObjectLike = require('../internal/isObjectLike'),
    support = require('../support');
var objectTag = '[object Object]';
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var objToString = objectProto.toString;
function isPlainObject(value) {
  var Ctor;
  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isHostObject(value) && !isArguments(value)) || (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  var result;
  if (support.ownLast) {
    baseForIn(value, function(subValue, key, object) {
      result = hasOwnProperty.call(object, key);
      return false;
    });
    return result !== false;
  }
  baseForIn(value, function(subValue, key) {
    result = key;
  });
  return result === undefined || hasOwnProperty.call(value, result);
}
module.exports = isPlainObject;
