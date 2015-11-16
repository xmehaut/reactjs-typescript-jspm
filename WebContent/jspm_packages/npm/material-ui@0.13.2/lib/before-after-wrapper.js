/* */ 
'use strict';
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
var StylePropable = require('./mixins/style-propable');
var AutoPrefix = require('./styles/auto-prefix');
var DefaultRawTheme = require('./styles/raw-themes/light-raw-theme');
var ThemeManager = require('./styles/theme-manager');
var BeforeAfterWrapper = React.createClass({
  displayName: 'BeforeAfterWrapper',
  mixins: [StylePropable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    beforeStyle: React.PropTypes.object,
    afterStyle: React.PropTypes.object,
    beforeElementType: React.PropTypes.string,
    afterElementType: React.PropTypes.string,
    elementType: React.PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      beforeElementType: 'div',
      afterElementType: 'div',
      elementType: 'div'
    };
  },
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function getChildContext() {
    return {muiTheme: this.state.muiTheme};
  },
  getInitialState: function getInitialState() {
    return {muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)};
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },
  render: function render() {
    var _props = this.props;
    var beforeStyle = _props.beforeStyle;
    var afterStyle = _props.afterStyle;
    var beforeElementType = _props.beforeElementType;
    var afterElementType = _props.afterElementType;
    var elementType = _props.elementType;
    var other = _objectWithoutProperties(_props, ['beforeStyle', 'afterStyle', 'beforeElementType', 'afterElementType', 'elementType']);
    var beforeElement = undefined,
        afterElement = undefined;
    beforeStyle = AutoPrefix.all({boxSizing: 'border-box'});
    afterStyle = AutoPrefix.all({boxSizing: 'border-box'});
    if (this.props.beforeStyle)
      beforeElement = React.createElement(this.props.beforeElementType, {
        style: this.prepareStyles(beforeStyle, this.props.beforeStyle),
        key: "::before"
      });
    if (this.props.afterStyle)
      afterElement = React.createElement(this.props.afterElementType, {
        style: this.prepareStyles(afterStyle, this.props.afterStyle),
        key: "::after"
      });
    var children = [beforeElement, this.props.children, afterElement];
    var props = other;
    props.style = this.prepareStyles(this.props.style);
    return React.createElement(this.props.elementType, props, children);
  }
});
module.exports = BeforeAfterWrapper;
