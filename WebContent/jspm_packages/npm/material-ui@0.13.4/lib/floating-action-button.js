/* */ 
(function(process) {
  'use strict';
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
  var React = require('react');
  var ReactDOM = require('react-dom');
  var StylePropable = require('./mixins/style-propable');
  var Transitions = require('./styles/transitions');
  var ColorManipulator = require('./utils/color-manipulator');
  var EnhancedButton = require('./enhanced-button');
  var FontIcon = require('./font-icon');
  var Paper = require('./paper');
  var Children = require('./utils/children');
  var DefaultRawTheme = require('./styles/raw-themes/light-raw-theme');
  var ThemeManager = require('./styles/theme-manager');
  var getZDepth = function getZDepth(disabled) {
    var zDepth = disabled ? 0 : 2;
    return {
      zDepth: zDepth,
      initialZDepth: zDepth
    };
  };
  var FloatingActionButton = React.createClass({
    displayName: 'FloatingActionButton',
    mixins: [StylePropable],
    contextTypes: {muiTheme: React.PropTypes.object},
    childContextTypes: {muiTheme: React.PropTypes.object},
    getChildContext: function getChildContext() {
      return {muiTheme: this.state.muiTheme};
    },
    propTypes: {
      backgroundColor: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      disabledColor: React.PropTypes.string,
      iconClassName: React.PropTypes.string,
      iconStyle: React.PropTypes.object,
      mini: React.PropTypes.bool,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      onMouseLeave: React.PropTypes.func,
      onTouchEnd: React.PropTypes.func,
      onTouchStart: React.PropTypes.func,
      secondary: React.PropTypes.bool,
      style: React.PropTypes.object,
      onMouseEnter: React.PropTypes.func
    },
    getInitialState: function getInitialState() {
      var zDepth = this.props.disabled ? 0 : 2;
      return {
        hovered: false,
        initialZDepth: zDepth,
        touch: false,
        zDepth: zDepth,
        muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
      };
    },
    componentWillMount: function componentWillMount() {
      this.setState(getZDepth(this.props.disabled));
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps, nextContext) {
      var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
      this.setState({muiTheme: newMuiTheme});
      if (newProps.disabled !== this.props.disabled) {
        this.setState(getZDepth(newProps.disabled));
      }
    },
    componentDidMount: function componentDidMount() {
      if (process.env.NODE_ENV !== 'production') {
        if (this.props.iconClassName && this.props.children) {
          var warning = 'You have set both an iconClassName and a child icon. ' + 'It is recommended you use only one method when adding ' + 'icons to FloatingActionButtons.';
          console.warn(warning);
        }
      }
    },
    _getBackgroundColor: function _getBackgroundColor() {
      return this.props.disabled ? this.props.disabledColor || this.getTheme().disabledColor : this.props.backgroundColor ? this.props.backgroundColor : this.props.secondary ? this.getTheme().secondaryColor : this.getTheme().color;
    },
    getTheme: function getTheme() {
      return this.state.muiTheme.floatingActionButton;
    },
    _getIconColor: function _getIconColor() {
      return this.props.disabled ? this.getTheme().disabledTextColor : this.props.secondary ? this.getTheme().secondaryIconColor : this.getTheme().iconColor;
    },
    getStyles: function getStyles() {
      var themeVariables = this.state.muiTheme.floatingActionButton;
      var styles = {
        root: {
          transition: Transitions.easeOut(),
          display: 'inline-block'
        },
        container: {
          transition: Transitions.easeOut(),
          position: 'relative',
          height: themeVariables.buttonSize,
          width: themeVariables.buttonSize,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: this._getBackgroundColor(),
          borderRadius: '50%',
          textAlign: 'center',
          verticalAlign: 'bottom',
          transform: 'translate3d(0, 0, 0)'
        },
        containerWhenMini: {
          height: themeVariables.miniSize,
          width: themeVariables.miniSize
        },
        overlay: {
          transition: Transitions.easeOut(),
          top: 0
        },
        overlayWhenHovered: {backgroundColor: ColorManipulator.fade(this._getIconColor(), 0.4)},
        icon: {
          height: themeVariables.buttonSize,
          lineHeight: themeVariables.buttonSize + 'px',
          fill: themeVariables.iconColor,
          color: this._getIconColor()
        },
        iconWhenMini: {
          height: themeVariables.miniSize,
          lineHeight: themeVariables.miniSize + 'px'
        }
      };
      return styles;
    },
    render: function render() {
      var _props = this.props;
      var disabled = _props.disabled;
      var mini = _props.mini;
      var secondary = _props.secondary;
      var iconStyle = _props.iconStyle;
      var iconClassName = _props.iconClassName;
      var other = _objectWithoutProperties(_props, ['disabled', 'mini', 'secondary', 'iconStyle', 'iconClassName']);
      var styles = this.getStyles();
      var iconElement = undefined;
      if (iconClassName) {
        iconElement = React.createElement(FontIcon, {
          className: iconClassName,
          style: this.mergeStyles(styles.icon, mini && styles.iconWhenMini, iconStyle)
        });
      }
      var children = Children.extend(this.props.children, {style: this.mergeStyles(styles.icon, mini && styles.iconWhenMini, iconStyle)});
      var buttonEventHandlers = disabled ? null : {
        onMouseDown: this._handleMouseDown,
        onMouseUp: this._handleMouseUp,
        onMouseLeave: this._handleMouseLeave,
        onMouseEnter: this._handleMouseEnter,
        onTouchStart: this._handleTouchStart,
        onTouchEnd: this._handleTouchEnd,
        onKeyboardFocus: this._handleKeyboardFocus
      };
      return React.createElement(Paper, {
        style: this.mergeStyles(styles.root, this.props.style),
        zDepth: this.state.zDepth,
        circle: true
      }, React.createElement(EnhancedButton, _extends({}, other, buttonEventHandlers, {
        ref: 'container',
        disabled: disabled,
        style: this.mergeStyles(styles.container, this.props.mini && styles.containerWhenMini, iconStyle),
        focusRippleColor: styles.icon.color,
        touchRippleColor: styles.icon.color
      }), React.createElement('div', {
        ref: 'overlay',
        style: this.prepareStyles(styles.overlay, this.state.hovered && !this.props.disabled && styles.overlayWhenHovered)
      }, iconElement, children)));
    },
    _handleMouseDown: function _handleMouseDown(e) {
      if (e.button === 0) {
        this.setState({zDepth: this.state.initialZDepth + 1});
      }
      if (this.props.onMouseDown)
        this.props.onMouseDown(e);
    },
    _handleMouseUp: function _handleMouseUp(e) {
      this.setState({zDepth: this.state.initialZDepth});
      if (this.props.onMouseUp)
        this.props.onMouseUp(e);
    },
    _handleMouseLeave: function _handleMouseLeave(e) {
      if (!this.refs.container.isKeyboardFocused())
        this.setState({
          zDepth: this.state.initialZDepth,
          hovered: false
        });
      if (this.props.onMouseLeave)
        this.props.onMouseLeave(e);
    },
    _handleMouseEnter: function _handleMouseEnter(e) {
      if (!this.refs.container.isKeyboardFocused() && !this.state.touch) {
        this.setState({hovered: true});
      }
      if (this.props.onMouseEnter)
        this.props.onMouseEnter(e);
    },
    _handleTouchStart: function _handleTouchStart(e) {
      this.setState({
        touch: true,
        zDepth: this.state.initialZDepth + 1
      });
      if (this.props.onTouchStart)
        this.props.onTouchStart(e);
    },
    _handleTouchEnd: function _handleTouchEnd(e) {
      this.setState({zDepth: this.state.initialZDepth});
      if (this.props.onTouchEnd)
        this.props.onTouchEnd(e);
    },
    _handleKeyboardFocus: function _handleKeyboardFocus(e, keyboardFocused) {
      if (keyboardFocused && !this.props.disabled) {
        this.setState({zDepth: this.state.initialZDepth + 1});
        ReactDOM.findDOMNode(this.refs.overlay).style.backgroundColor = ColorManipulator.fade(this.getStyles().icon.color, 0.4);
      } else if (!this.state.hovered) {
        this.setState({zDepth: this.state.initialZDepth});
        ReactDOM.findDOMNode(this.refs.overlay).style.backgroundColor = 'transparent';
      }
    }
  });
  module.exports = FloatingActionButton;
})(require('process'));
