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
var StylePropable = require('../mixins/style-propable');
var ListDivider = require('../lists/list-divider');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');
var MenuDivider = React.createClass({
  displayName: 'MenuDivider',
  mixins: [StylePropable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {style: React.PropTypes.object},
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
    var style = _props.style;
    var other = _objectWithoutProperties(_props, ['style']);
    var mergedStyles = this.mergeStyles({
      marginTop: 7,
      marginBottom: 8
    }, style);
    return React.createElement(ListDivider, _extends({}, other, {style: mergedStyles}));
  }
});
module.exports = MenuDivider;
