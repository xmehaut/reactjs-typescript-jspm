/* */ 
"use strict";
var hyphenate = require('./hyphenate');
var msPattern = /^ms-/;
module.exports = function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
};
