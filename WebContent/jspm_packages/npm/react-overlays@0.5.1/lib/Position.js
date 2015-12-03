/* */ 
'use strict';
exports.__esModule = true;
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }});
  if (superClass)
    subClass.__proto__ = superClass;
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _classnames = require('classnames');
var _classnames2 = _interopRequireDefault(_classnames);
var _utilsOwnerDocument = require('./utils/ownerDocument');
var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);
var _utilsGetContainer = require('./utils/getContainer');
var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);
var _utilsOverlayPositionUtils = require('./utils/overlayPositionUtils');
var _reactPropTypesLibMountable = require('react-prop-types/lib/mountable');
var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);
var Position = (function(_React$Component) {
  function Position(props, context) {
    _classCallCheck(this, Position);
    _React$Component.call(this, props, context);
    this.state = {
      positionLeft: null,
      positionTop: null,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    };
    this._needsFlush = false;
    this._lastTarget = null;
  }
  _inherits(Position, _React$Component);
  Position.prototype.componentDidMount = function componentDidMount() {
    this.updatePosition();
  };
  Position.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
    this._needsFlush = true;
  };
  Position.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this._needsFlush) {
      this._needsFlush = false;
      this.updatePosition(prevProps.placement !== this.props.placement);
    }
  };
  Position.prototype.componentWillUnmount = function componentWillUnmount() {
    this._lastTarget = null;
  };
  Position.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var className = _props.className;
    var props = _objectWithoutProperties(_props, ['children', 'className']);
    var _state = this.state;
    var positionLeft = _state.positionLeft;
    var positionTop = _state.positionTop;
    var arrowPosition = _objectWithoutProperties(_state, ['positionLeft', 'positionTop']);
    var child = _react2['default'].Children.only(children);
    return _react.cloneElement(child, _extends({}, props, arrowPosition, {
      positionLeft: positionLeft,
      positionTop: positionTop,
      className: _classnames2['default'](className, child.props.className),
      style: _extends({}, child.props.style, {
        left: positionLeft,
        top: positionTop
      })
    }));
  };
  Position.prototype.getTargetSafe = function getTargetSafe() {
    if (!this.props.target) {
      return null;
    }
    var target = this.props.target(this.props);
    if (!target) {
      return null;
    }
    return target;
  };
  Position.prototype.updatePosition = function updatePosition(placementChanged) {
    var target = this.getTargetSafe();
    if (target === this._lastTarget && !placementChanged) {
      return;
    }
    this._lastTarget = target;
    if (!target) {
      this.setState({
        positionLeft: null,
        positionTop: null,
        arrowOffsetLeft: null,
        arrowOffsetTop: null
      });
      return;
    }
    var overlay = _reactDom2['default'].findDOMNode(this);
    var container = _utilsGetContainer2['default'](this.props.container, _utilsOwnerDocument2['default'](this).body);
    this.setState(_utilsOverlayPositionUtils.calcOverlayPosition(this.props.placement, overlay, target, container, this.props.containerPadding));
  };
  return Position;
})(_react2['default'].Component);
Position.propTypes = {
  target: _react2['default'].PropTypes.func,
  container: _reactPropTypesLibMountable2['default'],
  containerPadding: _react2['default'].PropTypes.number,
  placement: _react2['default'].PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
};
Position.displayName = 'Position';
Position.defaultProps = {
  containerPadding: 0,
  placement: 'right'
};
exports['default'] = Position;
module.exports = exports['default'];
