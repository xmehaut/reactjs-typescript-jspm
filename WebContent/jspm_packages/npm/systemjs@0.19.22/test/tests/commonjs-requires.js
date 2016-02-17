/* */ 
exports.d1 = require('./commonjs-d');
exports.d2 = (require('./commonjs-d'));
var regex = /  \/* /;
exports.d3 = "require('not a dep')";
exports.d4 = "text/* require('still not a dep') text";
exports.d5 = 'text \'quote\' require("yet still not a dep")';
var regexWithString = /asdfasdf " /;
exports.d6 = require('./commonjs-d2');
var regexClose = /asdf " */;
exports.d7 = 'export';
var p = false && require('" + "test" + "');
" = require(", "),\n        ";
