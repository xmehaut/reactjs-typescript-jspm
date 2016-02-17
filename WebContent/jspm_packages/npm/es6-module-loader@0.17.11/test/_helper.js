/* */ 
(function(process) {
  (function(__global) {
    'use strict';
    if (!__global.console) {
      __global.console = {log: __global.dump || function() {}};
    }
    var isWindows = typeof process != 'undefined' && process.platform.match(/^win/);
    var baseURI;
    if (typeof document != 'undefined' && document.getElementsByTagName) {
      baseURI = document.baseURI;
      if (!baseURI) {
        var bases = document.getElementsByTagName('base');
        baseURI = bases[0] && bases[0].href || window.location.href;
      }
      baseURI = baseURI.split('#')[0].split('?')[0];
      baseURI = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
    } else if (typeof process != 'undefined' && process.cwd) {
      baseURI = 'file://' + (isWindows ? '/' : '') + process.cwd() + '/';
      if (isWindows)
        baseURI = baseURI.replace(/\\/g, '/');
    } else if (typeof location != 'undefined') {
      baseURI = __global.location.href;
    } else {
      throw new TypeError('No environment baseURI');
    }
    __global.baseURI = baseURI;
    __global.baseURL = baseURI;
    function describeIf(bool) {
      return (bool ? describe : describe.skip).apply(null, Array.prototype.slice.call(arguments, 1));
    }
    __global.describeIf = describeIf;
  }(typeof window != 'undefined' ? window : global));
})(require('process'));
