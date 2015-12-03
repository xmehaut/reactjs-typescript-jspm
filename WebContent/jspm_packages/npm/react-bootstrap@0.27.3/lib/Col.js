/* */ 
'use strict';
var _extends = require('babel-runtime/helpers/extends')['default'];
var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
exports.__esModule = true;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var _styleMaps = require('./styleMaps');
var _styleMaps2 = _interopRequireDefault(_styleMaps);
var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');
var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);
var Col = _react2['default'].createClass({
  displayName: 'Col',
  propTypes: {
    xs: _react2['default'].PropTypes.number,
    sm: _react2['default'].PropTypes.number,
    md: _react2['default'].PropTypes.number,
    lg: _react2['default'].PropTypes.number,
    xsOffset: _react2['default'].PropTypes.number,
    smOffset: _react2['default'].PropTypes.number,
    mdOffset: _react2['default'].PropTypes.number,
    lgOffset: _react2['default'].PropTypes.number,
    xsPush: _react2['default'].PropTypes.number,
    smPush: _react2['default'].PropTypes.number,
    mdPush: _react2['default'].PropTypes.number,
    lgPush: _react2['default'].PropTypes.number,
    xsPull: _react2['default'].PropTypes.number,
    smPull: _react2['default'].PropTypes.number,
    mdPull: _react2['default'].PropTypes.number,
    lgPull: _react2['default'].PropTypes.number,
    componentClass: _reactPropTypesLibElementType2['default']
  },
  getDefaultProps: function getDefaultProps() {
    return {componentClass: 'div'};
  },
  render: function render() {
    var _this = this;
    var ComponentClass = this.props.componentClass;
    var classes = {};
    _Object$keys(_styleMaps2['default'].SIZES).forEach(function(key) {
      var size = _styleMaps2['default'].SIZES[key];
      var prop = size;
      var classPart = size + '-';
      if (_this.props[prop]) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }
      prop = size + 'Offset';
      classPart = size + '-offset-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }
      prop = size + 'Push';
      classPart = size + '-push-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }
      prop = size + 'Pull';
      classPart = size + '-pull-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }
    }, this);
    return _react2['default'].createElement(ComponentClass, _extends({}, this.props, {className: _classnames2['default'](this.props.className, classes)}), this.props.children);
  }
});
exports['default'] = Col;
module.exports = exports['default'];
