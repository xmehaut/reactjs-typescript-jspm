/* */ 
(function(process) {
  var isArrayLike = require('./isArrayLike'),
      isObject = require('../lang/isObject'),
      isString = require('../lang/isString'),
      support = require('../support'),
      values = require('../object/values');
  function toIterable(value) {
    if (value == null) {
      return [];
    }
    if (!isArrayLike(value)) {
      return values(value);
    }
    if (support.unindexedChars && isString(value)) {
      return value.split('');
    }
    return isObject(value) ? value : Object(value);
  }
  module.exports = toIterable;
})(require('process'));
