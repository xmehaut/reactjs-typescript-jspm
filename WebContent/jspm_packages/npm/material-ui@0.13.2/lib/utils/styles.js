/* */ 
(function(process) {
  'use strict';
  var AutoPrefix = require('../styles/auto-prefix');
  var ImmutabilityHelper = require('./immutability-helper');
  var reTranslate = /((^|\s)translate(3d|X)?\()(\-?[\d]+)/;
  var reSkew = /((^|\s)skew(x|y)?\()\s*(\-?[\d]+)(deg|rad|grad)(,\s*(\-?[\d]+)(deg|rad|grad))?/;
  module.exports = {
    mergeAndPrefix: function mergeAndPrefix() {
      var mergedStyles = ImmutabilityHelper.merge.apply(this, arguments);
      return AutoPrefix.all(mergedStyles);
    },
    ensureDirection: function ensureDirection(muiTheme, style) {
      if (process.env.NODE_ENV !== 'production') {
        if (style.didFlip) {
          console.warn(new Error('You\'re calling `ensureDirection` on the same style object twice.'));
        }
        style = ImmutabilityHelper.merge({didFlip: 'true'}, style);
      }
      if (!muiTheme.isRtl)
        return style;
      var flippedAttributes = {
        right: 'left',
        left: 'right',
        marginRight: 'marginLeft',
        marginLeft: 'marginRight',
        paddingRight: 'paddingLeft',
        paddingLeft: 'paddingRight',
        borderRight: 'borderLeft',
        borderLeft: 'borderRight'
      };
      var newStyle = {};
      Object.keys(style).forEach(function(attribute) {
        var value = style[attribute];
        var key = attribute;
        if (flippedAttributes.hasOwnProperty(attribute)) {
          key = flippedAttributes[attribute];
        }
        switch (attribute) {
          case 'float':
          case 'textAlign':
            if (value === 'right') {
              value = 'left';
            } else if (value === 'left') {
              value = 'right';
            }
            break;
          case 'direction':
            if (value === 'ltr') {
              value = 'rtl';
            } else if (value === 'rtl') {
              value = 'ltr';
            }
            break;
          case 'transform':
            var matches = undefined;
            if (matches = value.match(reTranslate)) {
              value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]));
            }
            if (matches = value.match(reSkew)) {
              value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]) + matches[5] + matches[6] ? ',' + -parseFloat(matches[7]) + matches[8] : '');
            }
            break;
          case 'transformOrigin':
            if (value.indexOf('right') > -1) {
              value = value.replace('right', 'left');
            } else if (value.indexOf('left') > -1) {
              value = value.replace('left', 'right');
            }
            break;
        }
        newStyle[key] = value;
      });
      return newStyle;
    },
    prepareStyles: function prepareStyles(muiTheme) {
      for (var _len = arguments.length,
          styles = Array(_len > 1 ? _len - 1 : 0),
          _key = 1; _key < _len; _key++) {
        styles[_key - 1] = arguments[_key];
      }
      styles = styles.length > 1 ? ImmutabilityHelper.merge.apply(this, styles) : styles[0] || {};
      var flipped = this.ensureDirection(muiTheme, styles);
      return AutoPrefix.all(flipped);
    }
  };
})(require('process'));
