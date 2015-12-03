/* */ 
var baseAt = require('../internal/baseAt'),
    baseFlatten = require('../internal/baseFlatten'),
    isArrayLike = require('../internal/isArrayLike'),
    restParam = require('../function/restParam'),
    toIterable = require('../internal/toIterable');
var at = restParam(function(collection, props) {
  if (isArrayLike(collection)) {
    collection = toIterable(collection);
  }
  return baseAt(collection, baseFlatten(props));
});
module.exports = at;
