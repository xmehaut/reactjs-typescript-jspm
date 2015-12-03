/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var _extends = require('babel-runtime/helpers/extends')['default'];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
exports.__esModule = true;
var _domHelpersStyle = require('dom-helpers/style');
var _domHelpersStyle2 = _interopRequireDefault(_domHelpersStyle);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactOverlaysLibTransition = require('react-overlays/lib/Transition');
var _reactOverlaysLibTransition2 = _interopRequireDefault(_reactOverlaysLibTransition);
var _reactPropTypesLibDeprecated = require('react-prop-types/lib/deprecated');
var _reactPropTypesLibDeprecated2 = _interopRequireDefault(_reactPropTypesLibDeprecated);
var _utilsCreateChainedFunction = require('./utils/createChainedFunction');
var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);
var capitalize = function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
};
var triggerBrowserReflow = function triggerBrowserReflow(node) {
  return node.offsetHeight;
};
var MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};
function getDimensionValue(dimension, elem) {
  var value = elem['offset' + capitalize(dimension)];
  var margins = MARGINS[dimension];
  return value + parseInt(_domHelpersStyle2['default'](elem, margins[0]), 10) + parseInt(_domHelpersStyle2['default'](elem, margins[1]), 10);
}
var Collapse = (function(_React$Component) {
  _inherits(Collapse, _React$Component);
  function Collapse(props, context) {
    _classCallCheck(this, Collapse);
    _React$Component.call(this, props, context);
    this.onEnterListener = this.handleEnter.bind(this);
    this.onEnteringListener = this.handleEntering.bind(this);
    this.onEnteredListener = this.handleEntered.bind(this);
    this.onExitListener = this.handleExit.bind(this);
    this.onExitingListener = this.handleExiting.bind(this);
  }
  Collapse.prototype.render = function render() {
    var enter = _utilsCreateChainedFunction2['default'](this.onEnterListener, this.props.onEnter);
    var entering = _utilsCreateChainedFunction2['default'](this.onEnteringListener, this.props.onEntering);
    var entered = _utilsCreateChainedFunction2['default'](this.onEnteredListener, this.props.onEntered);
    var exit = _utilsCreateChainedFunction2['default'](this.onExitListener, this.props.onExit);
    var exiting = _utilsCreateChainedFunction2['default'](this.onExitingListener, this.props.onExiting);
    return _react2['default'].createElement(_reactOverlaysLibTransition2['default'], _extends({ref: 'transition'}, this.props, {
      'aria-expanded': this.props.role ? this.props['in'] : null,
      className: this._dimension() === 'width' ? 'width' : '',
      exitedClassName: 'collapse',
      exitingClassName: 'collapsing',
      enteredClassName: 'collapse in',
      enteringClassName: 'collapsing',
      onEnter: enter,
      onEntering: entering,
      onEntered: entered,
      onExit: exit,
      onExiting: exiting,
      onExited: this.props.onExited
    }), this.props.children);
  };
  Collapse.prototype.handleEnter = function handleEnter(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = '0';
  };
  Collapse.prototype.handleEntering = function handleEntering(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
  };
  Collapse.prototype.handleEntered = function handleEntered(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = null;
  };
  Collapse.prototype.handleExit = function handleExit(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = this.props.getDimensionValue(dimension, elem) + 'px';
  };
  Collapse.prototype.handleExiting = function handleExiting(elem) {
    var dimension = this._dimension();
    triggerBrowserReflow(elem);
    elem.style[dimension] = '0';
  };
  Collapse.prototype._dimension = function _dimension() {
    return typeof this.props.dimension === 'function' ? this.props.dimension() : this.props.dimension;
  };
  Collapse.prototype._getTransitionInstance = function _getTransitionInstance() {
    return this.refs.transition;
  };
  Collapse.prototype._getScrollDimensionValue = function _getScrollDimensionValue(elem, dimension) {
    return elem['scroll' + capitalize(dimension)] + 'px';
  };
  return Collapse;
})(_react2['default'].Component);
Collapse.propTypes = {
  'in': _react2['default'].PropTypes.bool,
  unmountOnExit: _react2['default'].PropTypes.bool,
  transitionAppear: _react2['default'].PropTypes.bool,
  timeout: _react2['default'].PropTypes.number,
  duration: _reactPropTypesLibDeprecated2['default'](_react2['default'].PropTypes.number, 'Use `timeout`.'),
  onEnter: _react2['default'].PropTypes.func,
  onEntering: _react2['default'].PropTypes.func,
  onEntered: _react2['default'].PropTypes.func,
  onExit: _react2['default'].PropTypes.func,
  onExiting: _react2['default'].PropTypes.func,
  onExited: _react2['default'].PropTypes.func,
  dimension: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.oneOf(['height', 'width']), _react2['default'].PropTypes.func]),
  getDimensionValue: _react2['default'].PropTypes.func,
  role: _react2['default'].PropTypes.string
};
Collapse.defaultProps = {
  'in': false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false,
  dimension: 'height',
  getDimensionValue: getDimensionValue
};
exports['default'] = Collapse;
module.exports = exports['default'];
