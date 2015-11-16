/* */ 
(function(process) {
  var keys = require('lodash.keys');
  function toObject(value) {
    return isObject(value) ? value : Object(value);
  }
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }
  function pairs(object) {
    object = toObject(object);
    var index = -1,
        props = keys(object),
        length = props.length,
        result = Array(length);
    while (++index < length) {
      var key = props[index];
      result[index] = [key, object[key]];
    }
    return result;
  }
  module.exports = pairs;
})(require('process'));
