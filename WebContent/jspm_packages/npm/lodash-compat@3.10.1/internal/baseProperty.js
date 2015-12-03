/* */ 
var toObject = require('./toObject');
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : toObject(object)[key];
  };
}
module.exports = baseProperty;
