/* */ 
'use strict';
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');
var ActionAllOut = React.createClass({
  displayName: 'ActionAllOut',
  mixins: [PureRenderMixin],
  render: function render() {
    return React.createElement(SvgIcon, this.props, React.createElement('path', {
      d: 'M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z',
      fill: '#010101'
    }));
  }
});
module.exports = ActionAllOut;
