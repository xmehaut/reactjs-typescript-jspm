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
var _Portal = require('./Portal');
var _Portal2 = _interopRequireDefault(_Portal);
var _Position = require('./Position');
var _Position2 = _interopRequireDefault(_Position);
var _RootCloseWrapper = require('./RootCloseWrapper');
var _RootCloseWrapper2 = _interopRequireDefault(_RootCloseWrapper);
var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');
var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);
var Overlay = (function(_React$Component) {
  function Overlay(props, context) {
    _classCallCheck(this, Overlay);
    _React$Component.call(this, props, context);
    this.state = {exited: !props.show};
    this.onHiddenListener = this.handleHidden.bind(this);
  }
  _inherits(Overlay, _React$Component);
  Overlay.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({exited: false});
    } else if (!nextProps.transition) {
      this.setState({exited: true});
    }
  };
  Overlay.prototype.render = function render() {
    var _props = this.props;
    var container = _props.container;
    var containerPadding = _props.containerPadding;
    var target = _props.target;
    var placement = _props.placement;
    var rootClose = _props.rootClose;
    var children = _props.children;
    var Transition = _props.transition;
    var props = _objectWithoutProperties(_props, ['container', 'containerPadding', 'target', 'placement', 'rootClose', 'children', 'transition']);
    var mountOverlay = props.show || Transition && !this.state.exited;
    if (!mountOverlay) {
      return null;
    }
    var child = children;
    child = _react2['default'].createElement(_Position2['default'], {
      container: container,
      containerPadding: containerPadding,
      target: target,
      placement: placement
    }, child);
    if (Transition) {
      var onExit = props.onExit;
      var onExiting = props.onExiting;
      var onEnter = props.onEnter;
      var onEntering = props.onEntering;
      var onEntered = props.onEntered;
      child = _react2['default'].createElement(Transition, {
        'in': props.show,
        transitionAppear: true,
        onExit: onExit,
        onExiting: onExiting,
        onExited: this.onHiddenListener,
        onEnter: onEnter,
        onEntering: onEntering,
        onEntered: onEntered
      }, child);
    }
    if (rootClose) {
      child = _react2['default'].createElement(_RootCloseWrapper2['default'], {onRootClose: props.onHide}, child);
    }
    return _react2['default'].createElement(_Portal2['default'], {container: container}, child);
  };
  Overlay.prototype.handleHidden = function handleHidden() {
    this.setState({exited: true});
    if (this.props.onExited) {
      var _props2;
      (_props2 = this.props).onExited.apply(_props2, arguments);
    }
  };
  return Overlay;
})(_react2['default'].Component);
Overlay.propTypes = _extends({}, _Portal2['default'].propTypes, _Position2['default'].propTypes, {
  show: _react2['default'].PropTypes.bool,
  rootClose: _react2['default'].PropTypes.bool,
  onHide: _react2['default'].PropTypes.func,
  transition: _reactPropTypesLibElementType2['default'],
  onEnter: _react2['default'].PropTypes.func,
  onEntering: _react2['default'].PropTypes.func,
  onEntered: _react2['default'].PropTypes.func,
  onExit: _react2['default'].PropTypes.func,
  onExiting: _react2['default'].PropTypes.func,
  onExited: _react2['default'].PropTypes.func
});
exports['default'] = Overlay;
module.exports = exports['default'];
