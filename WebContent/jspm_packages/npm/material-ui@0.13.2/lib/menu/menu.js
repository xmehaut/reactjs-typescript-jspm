/* */ 
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
var CssEvent = require('../utils/css-event');
var KeyLine = require('../utils/key-line');
var KeyCode = require('../utils/key-code');
var StylePropable = require('../mixins/style-propable');
var Transitions = require('../styles/transitions');
var ClickAwayable = require('../mixins/click-awayable');
var Paper = require('../paper');
var MenuItem = require('./menu-item');
var LinkMenuItem = require('./link-menu-item');
var SubheaderMenuItem = require('./subheader-menu-item');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');
var NestedMenuItem = React.createClass({
  displayName: 'NestedMenuItem',
  mixins: [ClickAwayable, StylePropable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    index: React.PropTypes.number.isRequired,
    text: React.PropTypes.string,
    menuItems: React.PropTypes.array.isRequired,
    zDepth: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    active: React.PropTypes.bool,
    onItemTap: React.PropTypes.func,
    menuItemStyle: React.PropTypes.object,
    style: React.PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {disabled: false};
  },
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function getChildContext() {
    return {muiTheme: this.state.muiTheme};
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      open: false,
      activeIndex: 0
    };
  },
  componentClickAway: function componentClickAway() {
    this._closeNestedMenu();
  },
  componentDidMount: function componentDidMount() {
    this._positionNestedMenu();
    ReactDOM.findDOMNode(this).focus();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._positionNestedMenu();
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        userSelect: 'none',
        cursor: 'pointer',
        lineHeight: this.getTheme().height + 'px',
        color: this.state.muiTheme.rawTheme.palette.textColor
      },
      icon: {
        float: 'left',
        lineHeight: this.getTheme().height + 'px',
        marginRight: this.getSpacing().desktopGutter
      },
      toggle: {
        marginTop: (this.getTheme().height - this.state.muiTheme.radioButton.size) / 2,
        float: 'right',
        width: 42
      },
      rootWhenHovered: {backgroundColor: this.getTheme().hoverColor},
      rootWhenSelected: {color: this.getTheme().selectedTextColor},
      rootWhenDisabled: {
        cursor: 'default',
        color: this.state.muiTheme.rawTheme.palette.disabledColor
      }
    };
    return styles;
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.menuItem;
  },
  render: function render() {
    var styles = this.getStyles();
    styles = this.prepareStyles(styles.root, this.props.active && !this.props.disabled && styles.rootWhenHovered, {position: 'relative'}, this.props.style);
    var iconCustomArrowDropRight = {
      marginRight: this.getSpacing().desktopGutterMini * -1,
      color: this.state.muiTheme.dropDownMenu.accentColor
    };
    var _props = this.props;
    var index = _props.index;
    var menuItemStyle = _props.menuItemStyle;
    var other = _objectWithoutProperties(_props, ['index', 'menuItemStyle']);
    return React.createElement('div', {
      ref: 'root',
      style: styles,
      onMouseEnter: this._openNestedMenu,
      onMouseLeave: this._closeNestedMenu,
      onMouseOver: this._handleMouseOver,
      onMouseOut: this._handleMouseOut
    }, React.createElement(MenuItem, {
      index: index,
      style: menuItemStyle,
      disabled: this.props.disabled,
      iconRightStyle: iconCustomArrowDropRight,
      iconRightClassName: 'muidocs-icon-custom-arrow-drop-right',
      onTouchTap: this._onParentItemTap
    }, this.props.text), React.createElement(Menu, _extends({}, other, {
      ref: 'nestedMenu',
      menuItems: this.props.menuItems,
      menuItemStyle: menuItemStyle,
      onItemTap: this._onMenuItemTap,
      hideable: true,
      visible: this.state.open,
      onRequestClose: this._closeNestedMenu,
      zDepth: this.props.zDepth + 1
    })));
  },
  toggleNestedMenu: function toggleNestedMenu() {
    if (!this.props.disabled)
      this.setState({open: !this.state.open});
  },
  isOpen: function isOpen() {
    return this.state.open;
  },
  _positionNestedMenu: function _positionNestedMenu() {
    var el = ReactDOM.findDOMNode(this);
    var nestedMenu = ReactDOM.findDOMNode(this.refs.nestedMenu);
    nestedMenu.style.left = el.offsetWidth + 'px';
  },
  _openNestedMenu: function _openNestedMenu() {
    if (!this.props.disabled)
      this.setState({open: true});
  },
  _closeNestedMenu: function _closeNestedMenu() {
    this.setState({open: false});
    ReactDOM.findDOMNode(this).focus();
  },
  _onParentItemTap: function _onParentItemTap() {
    this.toggleNestedMenu();
  },
  _onMenuItemTap: function _onMenuItemTap(e, index, menuItem) {
    if (this.props.onItemTap)
      this.props.onItemTap(e, index, menuItem);
    this._closeNestedMenu();
  },
  _handleMouseOver: function _handleMouseOver(e) {
    if (!this.props.disabled && this.props.onMouseOver)
      this.props.onMouseOver(e, this.props.index);
  },
  _handleMouseOut: function _handleMouseOut(e) {
    if (!this.props.disabled && this.props.onMouseOut)
      this.props.onMouseOut(e, this.props.index);
  }
});
var Menu = React.createClass({
  displayName: 'Menu',
  mixins: [StylePropable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    autoWidth: React.PropTypes.bool,
    onItemTap: React.PropTypes.func,
    onToggle: React.PropTypes.func,
    onRequestClose: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired,
    selectedIndex: React.PropTypes.number,
    style: React.PropTypes.object,
    hideable: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    zDepth: React.PropTypes.number,
    menuItemStyle: React.PropTypes.object,
    menuItemStyleSubheader: React.PropTypes.object,
    menuItemStyleLink: React.PropTypes.object,
    menuItemClassName: React.PropTypes.string,
    menuItemClassNameSubheader: React.PropTypes.string,
    menuItemClassNameLink: React.PropTypes.string
  },
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function getChildContext() {
    return {muiTheme: this.state.muiTheme};
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      nestedMenuShown: false,
      activeIndex: 0
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      autoWidth: true,
      hideable: false,
      visible: true,
      zDepth: 1,
      onRequestClose: function onRequestClose() {}
    };
  },
  componentDidMount: function componentDidMount() {
    var el = ReactDOM.findDOMNode(this);
    this._setKeyWidth(el);
    this._renderVisibility();
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible || this.props.menuItems.length !== prevProps.menuItems.length) {
      this._renderVisibility();
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
    this._setKeyWidth(ReactDOM.findDOMNode(this));
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.menu;
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        backgroundColor: this.getTheme().containerBackgroundColor,
        paddingTop: this.getSpacing().desktopGutterMini,
        paddingBottom: this.getSpacing().desktopGutterMini,
        transition: Transitions.easeOut(null, 'height'),
        outline: 'none !important'
      },
      subheader: {
        paddingLeft: this.state.muiTheme.menuSubheader.padding,
        paddingRight: this.state.muiTheme.menuSubheader.padding
      },
      hideable: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        zIndex: 1
      },
      item: {height: 34}
    };
    return styles;
  },
  render: function render() {
    var styles = this.getStyles();
    return React.createElement(Paper, {
      ref: 'paperContainer',
      tabIndex: '0',
      onKeyDown: this._onKeyDown,
      zDepth: this.props.zDepth,
      style: this.mergeStyles(styles.root, this.props.hideable && styles.hideable, this.props.style)
    }, this._getChildren());
  },
  _getChildren: function _getChildren() {
    var menuItem = undefined,
        itemComponent = undefined,
        isDisabled = undefined;
    var styles = this.getStyles();
    this._children = [];
    this._nestedChildren = [];
    for (var i = 0; i < this.props.menuItems.length; i++) {
      menuItem = this.props.menuItems[i];
      isDisabled = menuItem.disabled === undefined ? false : menuItem.disabled;
      var _menuItem = menuItem;
      var icon = _menuItem.icon;
      var data = _menuItem.data;
      var attribute = _menuItem.attribute;
      var number = _menuItem.number;
      var toggle = _menuItem.toggle;
      var onTouchTap = _menuItem.onTouchTap;
      var other = _objectWithoutProperties(_menuItem, ['icon', 'data', 'attribute', 'number', 'toggle', 'onTouchTap']);
      switch (menuItem.type) {
        case MenuItem.Types.LINK:
          itemComponent = React.createElement(LinkMenuItem, {
            key: i,
            index: i,
            active: this.state.activeIndex === i,
            text: menuItem.text,
            disabled: isDisabled,
            className: this.props.menuItemClassNameLink,
            style: this.props.menuItemStyleLink,
            payload: menuItem.payload,
            target: menuItem.target
          });
          break;
        case MenuItem.Types.SUBHEADER:
          itemComponent = React.createElement(SubheaderMenuItem, {
            key: i,
            index: i,
            className: this.props.menuItemClassNameSubheader,
            style: this.mergeStyles(styles.subheader, this.props.menuItemStyleSubheader),
            firstChild: i === 0,
            text: menuItem.text
          });
          break;
        case MenuItem.Types.NESTED:
          var _props2 = this.props,
              ref = _props2.ref,
              key = _props2.key,
              index = _props2.index,
              zDepth = _props2.zDepth,
              other = _objectWithoutProperties(_props2, ['ref', 'key', 'index', 'zDepth']);
          itemComponent = React.createElement(NestedMenuItem, _extends({}, other, {
            ref: i,
            key: i,
            index: i,
            nested: true,
            active: this.state.activeIndex === i,
            text: menuItem.text,
            disabled: isDisabled,
            menuItems: menuItem.items,
            menuItemStyle: this.props.menuItemStyle,
            zDepth: this.props.zDepth,
            onMouseEnter: this._onItemActivated,
            onMouseLeave: this._onItemDeactivated,
            onItemTap: this._onNestedItemTap
          }));
          this._nestedChildren.push(i);
          break;
        default:
          itemComponent = React.createElement(MenuItem, _extends({}, other, {
            selected: this.props.selectedIndex === i,
            key: i,
            index: i,
            active: this.state.activeIndex === i,
            icon: menuItem.icon,
            data: menuItem.data,
            className: this.props.menuItemClassName,
            style: this.props.menuItemStyle,
            attribute: menuItem.attribute,
            number: menuItem.number,
            toggle: menuItem.toggle,
            onToggle: this.props.onToggle,
            disabled: isDisabled,
            onTouchTap: this._onItemTap,
            onMouseEnter: this._onItemActivated,
            onMouseLeave: this._onItemDeactivated
          }), menuItem.text);
      }
      this._children.push(itemComponent);
    }
    return this._children;
  },
  _setKeyWidth: function _setKeyWidth(el) {
    var menuWidth = '100%';
    if (this.props.autoWidth) {
      el.style.width = 'auto';
      menuWidth = KeyLine.getIncrementalDim(el.offsetWidth) + 'px';
    }
    el.style.width = menuWidth;
  },
  _renderVisibility: function _renderVisibility() {
    if (this.props.hideable) {
      if (this.props.visible)
        this._expandHideableMenu();
      else
        this._collapseHideableMenu();
    }
  },
  _expandHideableMenu: function _expandHideableMenu() {
    var _this = this;
    var el = ReactDOM.findDOMNode(this);
    var container = ReactDOM.findDOMNode(this.refs.paperContainer);
    var padding = this.getSpacing().desktopGutterMini;
    var height = this._getHiddenMenuHeight(el, padding);
    if (!el.style.transition) {
      el.style.transition = Transitions.easeOut();
    }
    this._nextAnimationFrame(function() {
      container.style.overflow = 'hidden';
      el.style.paddingTop = padding + 'px';
      el.style.paddingBottom = padding + 'px';
      el.style.height = height + 'px';
      el.style.opacity = 1;
      CssEvent.onTransitionEnd(el, function() {
        if (_this.props.visible)
          container.style.overflow = 'visible';
        el.style.transition = null;
        el.focus();
      });
    });
  },
  _getHiddenMenuHeight: function _getHiddenMenuHeight(el, padding) {
    var height = padding * 2;
    el.style.visibility = 'hidden';
    el.style.height = 'auto';
    height += el.offsetHeight;
    el.style.height = '0px';
    el.style.visibility = 'visible';
    return height;
  },
  _collapseHideableMenu: function _collapseHideableMenu() {
    var el = ReactDOM.findDOMNode(this);
    var container = ReactDOM.findDOMNode(this.refs.paperContainer);
    var originalOpacity = el.style.opacity;
    if (!el.style.transition && originalOpacity !== '') {
      el.style.transition = Transitions.easeOut();
    }
    this._nextAnimationFrame(function() {
      container.style.overflow = 'hidden';
      el.style.opacity = 0;
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
      var end = function end() {
        el.style.transition = null;
      };
      if (originalOpacity === '')
        end();
      else
        CssEvent.onTransitionEnd(el, end);
    });
  },
  _nextAnimationFrame: function _nextAnimationFrame(func) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(func);
    }
    return setTimeout(func, 16);
  },
  _onNestedItemTap: function _onNestedItemTap(e, index, menuItem) {
    if (this.props.onItemTap)
      this.props.onItemTap(e, index, menuItem);
  },
  _onItemTap: function _onItemTap(e, index) {
    if (this.props.onItemTap)
      this.props.onItemTap(e, index, this.props.menuItems[index]);
  },
  _onItemToggle: function _onItemToggle(e, index, toggled) {
    if (this.props.onItemToggle)
      this.props.onItemToggle(e, index, this.props.menuItems[index], toggled);
  },
  _onItemActivated: function _onItemActivated(e, index) {
    this.setState({activeIndex: index});
  },
  _onItemDeactivated: function _onItemDeactivated(e, index) {
    if (this.state.activeKey === index)
      this.setState({activeIndex: 0});
  },
  _onKeyDown: function _onKeyDown(e) {
    if (!(this.state.open || this.props.visible))
      return;
    var nested = this._children[this.state.activeIndex];
    if (nested && nested.props.nested && this.refs[this.state.activeIndex].isOpen())
      return;
    switch (e.which) {
      case KeyCode.UP:
        this._activatePreviousItem();
        break;
      case KeyCode.DOWN:
        this._activateNextItem();
        break;
      case KeyCode.RIGHT:
        this._tryToggleNested(this.state.activeIndex);
        break;
      case KeyCode.LEFT:
        this._close();
        break;
      case KeyCode.ESC:
        this._close();
        break;
      case KeyCode.TAB:
        this._close();
        return;
      case KeyCode.ENTER:
      case KeyCode.SPACE:
        e.stopPropagation();
        this._triggerSelection(e);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  },
  _activatePreviousItem: function _activatePreviousItem() {
    var active = this.state.activeIndex || 0;
    active = Math.max(active - 1, 0);
    this.setState({activeIndex: active});
  },
  _activateNextItem: function _activateNextItem() {
    var active = this.state.activeIndex || 0;
    active = Math.min(active + 1, this._children.length - 1);
    this.setState({activeIndex: active});
  },
  _triggerSelection: function _triggerSelection(e) {
    var index = this.state.activeIndex || 0;
    this._onItemTap(e, index);
  },
  _close: function _close() {
    this.props.onRequestClose();
  },
  _tryToggleNested: function _tryToggleNested(index) {
    var item = this.refs[index];
    if (item && item.toggleNestedMenu)
      item.toggleNestedMenu();
  }
});
module.exports = Menu;
