/* */ 
'use strict';
var camelize = require('./camelize');
var msPattern = /^-ms-/;
module.exports = function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
};
