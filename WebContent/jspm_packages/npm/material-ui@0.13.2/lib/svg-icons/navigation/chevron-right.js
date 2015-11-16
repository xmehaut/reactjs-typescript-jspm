/* */ 
'use strict';
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');
var NavigationChevronRight = React.createClass({
  displayName: 'NavigationChevronRight',
  mixins: [PureRenderMixin],
  render: function render() {
    return React.createElement(SvgIcon, this.props, React.createElement('path', {d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'}));
  }
});
module.exports = NavigationChevronRight;
