/* */ 
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bowser = require('bowser');

var _bowser2 = _interopRequireDefault(_bowser);

var vendorPrefixes = {
  'Webkit': ['chrome', 'safari', 'ios', 'android', 'phantom', 'opera', 'webos', 'blackberry', 'bada', 'tizen'],
  'Moz': ['firefox', 'seamonkey', 'sailfish'],
  'ms': ['msie', 'msedge']
};

var browsers = {
  'chrome': [['chrome'], ['phantom'], ['webos'], ['blackberry'], ['bada'], ['tizenn']],
  'safari': [['safari']],
  'firefox': [['firefox'], ['seamonkey'], ['sailfish']],
  'ie': [['msie'], ['msedge']],
  'opera': [['opera']],
  'ios_saf': [['ios', 'mobile'], ['ios', 'tablet']],
  'ie_mob': [['windowsphone', 'mobile', 'msie'], ['windowsphone', 'tablet', 'msie'], ['windowsphone', 'mobile', 'msedge'], ['windowsphone', 'tablet', 'msedge']],
  'op_mini': [['opera', 'mobile'], ['opera', 'tablet']],
  'and_chr': [['android', 'chrome', 'mobile'], ['android', 'chrome', 'tablet']],
  'and_uc': [['android', 'mobile'], ['android', 'mobile']],
  'android': [['android', 'mobile'], ['android', 'mobile']]
};

/**
 * Uses bowser to get default browser information such as version and name
 * Evaluates bowser info and adds vendorPrefix information
 * @param {string} userAgent - userAgent that gets evaluated
 */

exports['default'] = function (userAgent) {
  var info = _bowser2['default']._detect(userAgent);

  Object.keys(vendorPrefixes).forEach(function (prefix) {
    vendorPrefixes[prefix].forEach(function (browser) {
      if (info[browser]) {
        info.prefix = {
          inline: prefix,
          CSS: '-' + prefix.toLowerCase() + '-'
        };
      }
    });
  });

  var name = '';
  Object.keys(browsers).forEach(function (browser) {
    browsers[browser].forEach(function (condition) {
      var match = 0;
      condition.forEach(function (single) {
        if (info[single]) {
          match += 1;
        }
      });
      if (condition.length === match) {
        name = browser;
      }
    });
  });

  info.browser = name;
  return info;
};

module.exports = exports['default'];