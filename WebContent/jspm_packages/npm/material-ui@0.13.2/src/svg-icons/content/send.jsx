const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SvgIcon = require('../../svg-icon');

const ContentSend = React.createClass({

  mixins: [PureRenderMixin],

  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </SvgIcon>
    );
  }

});

module.exports = ContentSend;
