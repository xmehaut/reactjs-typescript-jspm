/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _getBrowserInformation = require('./getBrowserInformation');
var _getBrowserInformation2 = _interopRequireDefault(_getBrowserInformation);
var _caniuseData = require('./caniuseData');
var _caniuseData2 = _interopRequireDefault(_caniuseData);
var _Plugins = require('./Plugins');
var _Plugins2 = _interopRequireDefault(_Plugins);
var defaultUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
var Prefixer = (function() {
  function Prefixer() {
    var _this = this;
    var userAgent = arguments.length <= 0 || arguments[0] === undefined ? defaultUserAgent : arguments[0];
    _classCallCheck(this, Prefixer);
    this._userAgent = userAgent;
    this._browserInfo = (0, _getBrowserInformation2['default'])(userAgent);
    this.cssPrefix = this._browserInfo.prefix.CSS;
    this.jsPrefix = this._browserInfo.prefix.inline;
    var data = _caniuseData2['default'][this._browserInfo.browser];
    if (data) {
      this._requiresPrefix = Object.keys(data).filter(function(key) {
        return data[key] >= _this._browserInfo.version;
      }).reduce(function(result, name) {
        result[name] = true;
        return result;
      }, {});
      this._hasPropsRequiringPrefix = Object.keys(this._requiresPrefix).length > 0;
    } else {
      this._hasPropsRequiringPrefix = false;
      console.warn('Your userAgent seems to be not supported by inline-style-prefixer. Feel free to open an issue.');
    }
  }
  _createClass(Prefixer, [{
    key: 'prefix',
    value: function prefix(styles) {
      var _this2 = this;
      if (!this._hasPropsRequiringPrefix) {
        return styles;
      }
      styles = assign({}, styles);
      Object.keys(styles).forEach(function(property) {
        var value = styles[property];
        if (value instanceof Object) {
          styles[property] = _this2.prefix(value);
        } else {
          if (_this2._requiresPrefix[property]) {
            styles[_this2.jsPrefix + caplitalizeString(property)] = value;
            delete styles[property];
          }
          _Plugins2['default'].forEach(function(plugin) {
            assign(styles, plugin(property, value, _this2._browserInfo, styles));
          });
        }
      });
      return styles;
    }
  }]);
  return Prefixer;
})();
exports['default'] = Prefixer;
var caplitalizeString = function caplitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var assign = function assign(base, extend) {
  extend && Object.keys(extend).forEach(function(key) {
    return base[key] = extend[key];
  });
  return extend;
};
module.exports = exports['default'];
