/* */ 
'use strict';
var React = require('react');
var StylePropable = require('../mixins/style-propable');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');
var Toolbar = React.createClass({
  displayName: 'Toolbar',
  mixins: [StylePropable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    noGutter: React.PropTypes.bool
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
  getTheme: function getTheme() {
    return this.state.muiTheme.toolbar;
  },
  getStyles: function getStyles() {
    return this.mergeStyles({
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      backgroundColor: this.getTheme().backgroundColor,
      height: this.getTheme().height,
      width: '100%',
      padding: this.props.noGutter ? 0 : '0px ' + this.state.muiTheme.rawTheme.spacing.desktopGutter + 'px'
    }, this.props.style);
  },
  render: function render() {
    return React.createElement('div', {
      className: this.props.className,
      style: this.prepareStyles(this.getStyles())
    }, this.props.children);
  }
});
module.exports = Toolbar;
