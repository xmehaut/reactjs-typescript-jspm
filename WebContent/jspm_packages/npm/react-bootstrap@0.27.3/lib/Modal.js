/* */ 
(function(process) {
  'use strict';
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];
  var _Object$isFrozen = require('babel-runtime/core-js/object/is-frozen')['default'];
  var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
  var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
  exports.__esModule = true;
  var _classnames = require('classnames');
  var _classnames2 = _interopRequireDefault(_classnames);
  var _react = require('react');
  var _react2 = _interopRequireDefault(_react);
  var _reactDom = require('react-dom');
  var _reactDom2 = _interopRequireDefault(_reactDom);
  var _utilsDomUtils = require('./utils/domUtils');
  var _utilsDomUtils2 = _interopRequireDefault(_utilsDomUtils);
  var _domHelpersUtilScrollbarSize = require('dom-helpers/util/scrollbarSize');
  var _domHelpersUtilScrollbarSize2 = _interopRequireDefault(_domHelpersUtilScrollbarSize);
  var _utilsEventListener = require('./utils/EventListener');
  var _utilsEventListener2 = _interopRequireDefault(_utilsEventListener);
  var _utilsCreateChainedFunction = require('./utils/createChainedFunction');
  var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);
  var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');
  var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);
  var _domHelpersUtilInDOM = require('dom-helpers/util/inDOM');
  var _domHelpersUtilInDOM2 = _interopRequireDefault(_domHelpersUtilInDOM);
  var _domHelpersQueryContains = require('dom-helpers/query/contains');
  var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);
  var _domHelpersActiveElement = require('dom-helpers/activeElement');
  var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);
  var _reactOverlaysLibPortal = require('react-overlays/lib/Portal');
  var _reactOverlaysLibPortal2 = _interopRequireDefault(_reactOverlaysLibPortal);
  var _Fade = require('./Fade');
  var _Fade2 = _interopRequireDefault(_Fade);
  var _ModalDialog = require('./ModalDialog');
  var _ModalDialog2 = _interopRequireDefault(_ModalDialog);
  var _ModalBody = require('./ModalBody');
  var _ModalBody2 = _interopRequireDefault(_ModalBody);
  var _ModalHeader = require('./ModalHeader');
  var _ModalHeader2 = _interopRequireDefault(_ModalHeader);
  var _ModalTitle = require('./ModalTitle');
  var _ModalTitle2 = _interopRequireDefault(_ModalTitle);
  var _ModalFooter = require('./ModalFooter');
  var _ModalFooter2 = _interopRequireDefault(_ModalFooter);
  function containerClientHeight(container, context) {
    var doc = _utilsDomUtils2['default'].ownerDocument(context);
    return container === doc.body || container === doc.documentElement ? doc.documentElement.clientHeight : container.clientHeight;
  }
  function getContainer(context) {
    return context.props.container && _reactDom2['default'].findDOMNode(context.props.container) || _utilsDomUtils2['default'].ownerDocument(context).body;
  }
  var currentFocusListener = undefined;
  function onFocus(context, handler) {
    var doc = _utilsDomUtils2['default'].ownerDocument(context);
    var useFocusin = !doc.addEventListener;
    var remove = undefined;
    if (currentFocusListener) {
      currentFocusListener.remove();
    }
    if (useFocusin) {
      document.attachEvent('onfocusin', handler);
      remove = function() {
        return document.detachEvent('onfocusin', handler);
      };
    } else {
      document.addEventListener('focus', handler, true);
      remove = function() {
        return document.removeEventListener('focus', handler, true);
      };
    }
    currentFocusListener = {remove: remove};
    return currentFocusListener;
  }
  var Modal = _react2['default'].createClass({
    displayName: 'Modal',
    propTypes: _extends({}, _reactOverlaysLibPortal2['default'].propTypes, _ModalDialog2['default'].propTypes, {
      backdrop: _react2['default'].PropTypes.oneOf(['static', true, false]),
      keyboard: _react2['default'].PropTypes.bool,
      animation: _react2['default'].PropTypes.bool,
      dialogComponent: _reactPropTypesLibElementType2['default'],
      autoFocus: _react2['default'].PropTypes.bool,
      enforceFocus: _react2['default'].PropTypes.bool,
      bsStyle: _react2['default'].PropTypes.string,
      show: _react2['default'].PropTypes.bool
    }),
    getDefaultProps: function getDefaultProps() {
      return {
        bsClass: 'modal',
        dialogComponent: _ModalDialog2['default'],
        show: false,
        animation: true,
        backdrop: true,
        keyboard: true,
        autoFocus: true,
        enforceFocus: true
      };
    },
    getInitialState: function getInitialState() {
      return {exited: !this.props.show};
    },
    render: function render() {
      var _props = this.props;
      var children = _props.children;
      var animation = _props.animation;
      var backdrop = _props.backdrop;
      var props = _objectWithoutProperties(_props, ['children', 'animation', 'backdrop']);
      var onExit = props.onExit;
      var onExiting = props.onExiting;
      var onEnter = props.onEnter;
      var onEntering = props.onEntering;
      var onEntered = props.onEntered;
      var show = !!props.show;
      var Dialog = props.dialogComponent;
      var mountModal = show || animation && !this.state.exited;
      if (!mountModal) {
        return null;
      }
      var modal = _react2['default'].createElement(Dialog, _extends({}, props, {
        ref: this._setDialogRef,
        className: _classnames2['default'](this.props.className, {'in': show && !animation}),
        onClick: backdrop === true ? this.handleBackdropClick : null
      }), this.renderContent());
      if (animation) {
        modal = _react2['default'].createElement(_Fade2['default'], {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: Modal.TRANSITION_DURATION,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        }, modal);
      }
      if (backdrop) {
        modal = this.renderBackdrop(modal);
      }
      return _react2['default'].createElement(_reactOverlaysLibPortal2['default'], {container: props.container}, modal);
    },
    renderContent: function renderContent() {
      var _this = this;
      return _react2['default'].Children.map(this.props.children, function(child) {
        if (child && child.type && child.type.__isModalHeader) {
          return _react.cloneElement(child, {onHide: _utilsCreateChainedFunction2['default'](_this.props.onHide, child.props.onHide)});
        }
        return child;
      });
    },
    renderBackdrop: function renderBackdrop(modal) {
      var _props2 = this.props;
      var animation = _props2.animation;
      var bsClass = _props2.bsClass;
      var duration = Modal.BACKDROP_TRANSITION_DURATION;
      var onClick = this.props.backdrop === true ? this.handleBackdropClick : null;
      var backdrop = _react2['default'].createElement('div', {
        ref: 'backdrop',
        className: _classnames2['default'](bsClass + '-backdrop', {'in': this.props.show && !animation}),
        onClick: onClick
      });
      return _react2['default'].createElement('div', {ref: 'modal'}, animation ? _react2['default'].createElement(_Fade2['default'], {
        transitionAppear: true,
        'in': this.props.show,
        timeout: duration
      }, backdrop) : backdrop, modal);
    },
    _setDialogRef: function _setDialogRef(ref) {
      if (_Object$isFrozen(this.refs) && !_Object$keys(this.refs).length) {
        this.refs = {};
      }
      this.refs.dialog = ref;
      if (!this.props.backdrop) {
        this.refs.modal = ref;
      }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (nextProps.show) {
        this.setState({exited: false});
      } else if (!nextProps.animation) {
        this.setState({exited: true});
      }
    },
    componentWillUpdate: function componentWillUpdate(nextProps) {
      if (nextProps.show) {
        this.checkForFocus();
      }
    },
    componentDidMount: function componentDidMount() {
      if (this.props.show) {
        this.onShow();
      }
    },
    componentDidUpdate: function componentDidUpdate(prevProps) {
      var animation = this.props.animation;
      if (prevProps.show && !this.props.show && !animation) {
        this.onHide();
      } else if (!prevProps.show && this.props.show) {
        this.onShow();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.props.show) {
        this.onHide();
      }
    },
    onShow: function onShow() {
      var _this2 = this;
      var doc = _utilsDomUtils2['default'].ownerDocument(this);
      var win = _utilsDomUtils2['default'].ownerWindow(this);
      this._onDocumentKeyupListener = _utilsEventListener2['default'].listen(doc, 'keyup', this.handleDocumentKeyUp);
      this._onWindowResizeListener = _utilsEventListener2['default'].listen(win, 'resize', this.handleWindowResize);
      if (this.props.enforceFocus) {
        this._onFocusinListener = onFocus(this, this.enforceFocus);
      }
      var container = getContainer(this);
      container.className += container.className.length ? ' modal-open' : 'modal-open';
      this._containerIsOverflowing = container.scrollHeight > containerClientHeight(container, this);
      this._originalPadding = container.style.paddingRight;
      if (this._containerIsOverflowing) {
        container.style.paddingRight = parseInt(this._originalPadding || 0, 10) + _domHelpersUtilScrollbarSize2['default']() + 'px';
      }
      this.setState(this._getStyles(), function() {
        return _this2.focusModalContent();
      });
    },
    onHide: function onHide() {
      this._onDocumentKeyupListener.remove();
      this._onWindowResizeListener.remove();
      if (this._onFocusinListener) {
        this._onFocusinListener.remove();
      }
      var container = getContainer(this);
      container.style.paddingRight = this._originalPadding;
      container.className = container.className.replace(/ ?modal-open/, '');
      this.restoreLastFocus();
    },
    handleHidden: function handleHidden() {
      this.setState({exited: true});
      this.onHide();
      if (this.props.onExited) {
        var _props3;
        (_props3 = this.props).onExited.apply(_props3, arguments);
      }
    },
    handleBackdropClick: function handleBackdropClick(e) {
      if (e.target !== e.currentTarget) {
        return;
      }
      this.props.onHide();
    },
    handleDocumentKeyUp: function handleDocumentKeyUp(e) {
      if (this.props.keyboard && e.keyCode === 27) {
        this.props.onHide();
      }
    },
    handleWindowResize: function handleWindowResize() {
      this.setState(this._getStyles());
    },
    checkForFocus: function checkForFocus() {
      if (_domHelpersUtilInDOM2['default']) {
        this.lastFocus = _domHelpersActiveElement2['default'](document);
      }
    },
    focusModalContent: function focusModalContent() {
      var modalContent = _reactDom2['default'].findDOMNode(this.refs.dialog);
      var current = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
      var focusInModal = current && _domHelpersQueryContains2['default'](modalContent, current);
      if (modalContent && this.props.autoFocus && !focusInModal) {
        this.lastFocus = current;
        modalContent.focus();
      }
    },
    restoreLastFocus: function restoreLastFocus() {
      if (this.lastFocus && this.lastFocus.focus) {
        this.lastFocus.focus();
        this.lastFocus = null;
      }
    },
    enforceFocus: function enforceFocus() {
      if (!this.isMounted()) {
        return;
      }
      var active = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
      var modal = _reactDom2['default'].findDOMNode(this.refs.dialog);
      if (modal && modal !== active && !_domHelpersQueryContains2['default'](modal, active)) {
        modal.focus();
      }
    },
    _getStyles: function _getStyles() {
      if (!_domHelpersUtilInDOM2['default']) {
        return {};
      }
      var node = _reactDom2['default'].findDOMNode(this.refs.modal);
      var scrollHt = node.scrollHeight;
      var container = getContainer(this);
      var containerIsOverflowing = this._containerIsOverflowing;
      var modalIsOverflowing = scrollHt > containerClientHeight(container, this);
      return {dialogStyles: {
          paddingRight: containerIsOverflowing && !modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0,
          paddingLeft: !containerIsOverflowing && modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0
        }};
    }
  });
  Modal.Body = _ModalBody2['default'];
  Modal.Header = _ModalHeader2['default'];
  Modal.Title = _ModalTitle2['default'];
  Modal.Footer = _ModalFooter2['default'];
  Modal.Dialog = _ModalDialog2['default'];
  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;
  exports['default'] = Modal;
  module.exports = exports['default'];
})(require('process'));
