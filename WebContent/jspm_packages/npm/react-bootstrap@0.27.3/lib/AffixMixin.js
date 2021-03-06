/* */ 
'use strict';
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
exports.__esModule = true;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _utilsDomUtils = require('./utils/domUtils');
var _utilsDomUtils2 = _interopRequireDefault(_utilsDomUtils);
var _domHelpersQueryOffset = require('dom-helpers/query/offset');
var _domHelpersQueryOffset2 = _interopRequireDefault(_domHelpersQueryOffset);
var _utilsEventListener = require('./utils/EventListener');
var _utilsEventListener2 = _interopRequireDefault(_utilsEventListener);
var AffixMixin = {
  propTypes: {
    offset: _react2['default'].PropTypes.number,
    offsetTop: _react2['default'].PropTypes.number,
    offsetBottom: _react2['default'].PropTypes.number
  },
  getInitialState: function getInitialState() {
    return {affixClass: 'affix-top'};
  },
  getPinnedOffset: function getPinnedOffset(DOMNode) {
    if (this.pinnedOffset) {
      return this.pinnedOffset;
    }
    DOMNode.className = DOMNode.className.replace(/affix-top|affix-bottom|affix/, '');
    DOMNode.className += DOMNode.className.length ? ' affix' : 'affix';
    this.pinnedOffset = _domHelpersQueryOffset2['default'](DOMNode).top - window.pageYOffset;
    return this.pinnedOffset;
  },
  checkPosition: function checkPosition() {
    var DOMNode = undefined,
        scrollHeight = undefined,
        scrollTop = undefined,
        position = undefined,
        offsetTop = undefined,
        offsetBottom = undefined,
        affix = undefined,
        affixType = undefined,
        affixPositionTop = undefined;
    if (!this.isMounted()) {
      return;
    }
    DOMNode = _reactDom2['default'].findDOMNode(this);
    scrollHeight = _utilsDomUtils2['default'].getDocumentHeight();
    scrollTop = window.pageYOffset;
    position = _domHelpersQueryOffset2['default'](DOMNode);
    if (this.affixed === 'top') {
      position.top += scrollTop;
    }
    offsetTop = this.props.offsetTop != null ? this.props.offsetTop : this.props.offset;
    offsetBottom = this.props.offsetBottom != null ? this.props.offsetBottom : this.props.offset;
    if (offsetTop == null && offsetBottom == null) {
      return;
    }
    if (offsetTop == null) {
      offsetTop = 0;
    }
    if (offsetBottom == null) {
      offsetBottom = 0;
    }
    if (this.unpin != null && scrollTop + this.unpin <= position.top) {
      affix = false;
    } else if (offsetBottom != null && position.top + DOMNode.offsetHeight >= scrollHeight - offsetBottom) {
      affix = 'bottom';
    } else if (offsetTop != null && scrollTop <= offsetTop) {
      affix = 'top';
    } else {
      affix = false;
    }
    if (this.affixed === affix) {
      return;
    }
    if (this.unpin != null) {
      DOMNode.style.top = '';
    }
    affixType = 'affix' + (affix ? '-' + affix : '');
    this.affixed = affix;
    this.unpin = affix === 'bottom' ? this.getPinnedOffset(DOMNode) : null;
    if (affix === 'bottom') {
      DOMNode.className = DOMNode.className.replace(/affix-top|affix-bottom|affix/, 'affix-bottom');
      affixPositionTop = scrollHeight - offsetBottom - DOMNode.offsetHeight - _domHelpersQueryOffset2['default'](DOMNode).top;
    }
    this.setState({
      affixClass: affixType,
      affixPositionTop: affixPositionTop
    });
  },
  checkPositionWithEventLoop: function checkPositionWithEventLoop() {
    setTimeout(this.checkPosition, 0);
  },
  componentDidMount: function componentDidMount() {
    this._onWindowScrollListener = _utilsEventListener2['default'].listen(window, 'scroll', this.checkPosition);
    this._onDocumentClickListener = _utilsEventListener2['default'].listen(_utilsDomUtils2['default'].ownerDocument(this), 'click', this.checkPositionWithEventLoop);
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._onWindowScrollListener) {
      this._onWindowScrollListener.remove();
    }
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.affixClass === this.state.affixClass) {
      this.checkPositionWithEventLoop();
    }
  }
};
exports['default'] = AffixMixin;
module.exports = exports['default'];
