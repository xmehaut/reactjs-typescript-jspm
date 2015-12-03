/* */ 
(function(process) {
  var isObject = require('../lang/isObject'),
      isString = require('../lang/isString'),
      support = require('../support');
  function toObject(value) {
    if (support.unindexedChars && isString(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);
      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return isObject(value) ? value : Object(value);
  }
  module.exports = toObject;
})(require('process'));
