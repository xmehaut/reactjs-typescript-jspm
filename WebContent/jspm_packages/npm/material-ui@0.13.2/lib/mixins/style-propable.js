/* */ 
'use strict';
var React = require('react');
var ImmutabilityHelper = require('../utils/immutability-helper');
var Styles = require('../utils/styles');
module.exports = {
  propTypes: {style: React.PropTypes.object},
  mergeStyles: function mergeStyles() {
    return ImmutabilityHelper.merge.apply(this, arguments);
  },
  mergeAndPrefix: function mergeAndPrefix() {
    return Styles.mergeAndPrefix.apply(this, arguments);
  },
  prepareStyles: function prepareStyles() {
    return Styles.prepareStyles.apply(Styles, [this.state && this.state.muiTheme || this.context.muiTheme].concat([].slice.apply(arguments)));
  }
};
