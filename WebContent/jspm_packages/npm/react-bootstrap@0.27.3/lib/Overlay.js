/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var _extends = require('babel-runtime/helpers/extends')['default'];
var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
exports.__esModule = true;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactOverlaysLibOverlay = require('react-overlays/lib/Overlay');
var _reactOverlaysLibOverlay2 = _interopRequireDefault(_reactOverlaysLibOverlay);
var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');
var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);
var _Fade = require('./Fade');
var _Fade2 = _interopRequireDefault(_Fade);
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var Overlay = (function(_React$Component) {
  _inherits(Overlay, _React$Component);
  function Overlay() {
    _classCallCheck(this, Overlay);
    _React$Component.apply(this, arguments);
  }
  Overlay.prototype.render = function render() {
    var _props = this.props;
    var child = _props.children;
    var transition = _props.animation;
    var props = _objectWithoutProperties(_props, ['children', 'animation']);
    if (transition === true) {
      transition = _Fade2['default'];
    }
    if (!transition) {
      child = _react.cloneElement(child, {className: _classnames2['default']('in', child.props.className)});
    }
    return _react2['default'].createElement(_reactOverlaysLibOverlay2['default'], _extends({}, props, {transition: transition}), child);
  };
  return Overlay;
})(_react2['default'].Component);
Overlay.propTypes = _extends({}, _reactOverlaysLibOverlay2['default'].propTypes, {
  show: _react2['default'].PropTypes.bool,
  rootClose: _react2['default'].PropTypes.bool,
  onHide: _react2['default'].PropTypes.func,
  animation: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _reactPropTypesLibElementType2['default']]),
  onEnter: _react2['default'].PropTypes.func,
  onEntering: _react2['default'].PropTypes.func,
  onEntered: _react2['default'].PropTypes.func,
  onExit: _react2['default'].PropTypes.func,
  onExiting: _react2['default'].PropTypes.func,
  onExited: _react2['default'].PropTypes.func
});
Overlay.defaultProps = {
  animation: _Fade2['default'],
  rootClose: false,
  show: false
};
exports['default'] = Overlay;
module.exports = exports['default'];
