/* */ 
"format cjs";
define(function(require, exports) {
  var obj = require('./all-circular4').obj;
  exports.checkObj = function() {
    return obj.circular;
  };
  exports.setObj = function() {
    obj.circular = 'changed';
  };
  require('./all-circular4').set();
});
