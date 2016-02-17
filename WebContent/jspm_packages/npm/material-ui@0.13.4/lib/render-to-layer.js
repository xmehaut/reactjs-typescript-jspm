/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _utilsEvents = require('./utils/events');
var _utilsEvents2 = _interopRequireDefault(_utilsEvents);
var _utilsDom = require('./utils/dom');
var _utilsDom2 = _interopRequireDefault(_utilsDom);
var _lodashDebounce = require('lodash.debounce');
var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);
var RenderToLayer = _react2['default'].createClass({
  displayName: 'RenderToLayer',
  componentDidMount: function componentDidMount() {
    this._renderLayer();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._renderLayer();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unbindClickAway();
    if (this._layer) {
      this._unrenderLayer();
    }
  },
  _checkClickAway: function _checkClickAway(e) {
    if (!this.canClickAway) {
      return;
    }
    var el = this._layer;
    if (e.target !== el && e.target === window || document.documentElement.contains(e.target) && !_utilsDom2['default'].isDescendant(el, e.target)) {
      if (this.props.componentClickAway) {
        this.props.componentClickAway(e);
      }
    }
  },
  _preventClickAway: function _preventClickAway(e) {
    if (e.detail === this) {
      return;
    }
    this.canClickAway = false;
  },
  _allowClickAway: function _allowClickAway() {
    this.canClickAway = true;
  },
  getLayer: function getLayer() {
    return this._layer;
  },
  render: function render() {
    return null;
  },
  _renderLayer: function _renderLayer() {
    if (this.props.open) {
      if (!this._layer) {
        this._layer = document.createElement('div');
        document.body.appendChild(this._layer);
      }
      this._bindClickAway();
      if (this.reactUnmount) {
        this.reactUnmount.cancel();
      }
    } else if (this._layer) {
      this._unbindClickAway();
      this._unrenderLayer();
    } else {
      return;
    }
    var layerElement = this.props.render();
    if (layerElement === null) {
      this.layerElement = _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, _react2['default'].createElement('noscript', null), this._layer);
    } else {
      this.layerElement = _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, layerElement, this._layer);
    }
  },
  _unrenderLayer: function _unrenderLayer() {
    var _this = this;
    if (!this.reactUnmount)
      this.reactUnmount = (0, _lodashDebounce2['default'])(function() {
        if (_this._layer) {
          if (_this.layerWillUnmount) {
            _this.layerWillUnmount(_this._layer);
          }
          _reactDom2['default'].unmountComponentAtNode(_this._layer);
          document.body.removeChild(_this._layer);
          _this._layer = null;
        }
      }, 1000);
    this.reactUnmount();
  },
  _bindClickAway: function _bindClickAway() {
    if (typeof this.canClickAway === "undefined") {
      this.canClickAway = true;
    }
    _utilsEvents2['default'].on(window, 'focus', this._checkClickAway);
    _utilsEvents2['default'].on(document, 'mousedown', this._checkClickAway);
    _utilsEvents2['default'].on(document, 'touchend', this._checkClickAway);
    _utilsEvents2['default'].on(document, 'popOverOnShow', this._preventClickAway);
    _utilsEvents2['default'].on(document, 'popOverOnHide', this._allowClickAway);
  },
  _unbindClickAway: function _unbindClickAway() {
    _utilsEvents2['default'].off(window, 'focus', this._checkClickAway);
    _utilsEvents2['default'].off(document, 'mousedown', this._checkClickAway);
    _utilsEvents2['default'].off(document, 'touchend', this._checkClickAway);
    _utilsEvents2['default'].off(document, 'popOverOnShow', this._preventClickAway);
    _utilsEvents2['default'].off(document, 'popOverOnHide', this._allowClickAway);
  }
});
exports['default'] = RenderToLayer;
module.exports = exports['default'];
