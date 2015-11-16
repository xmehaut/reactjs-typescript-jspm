/* */ 
const React = require('react');
const ImmutabilityHelper = require('../utils/immutability-helper');
const Styles = require('../utils/styles');
module.exports = {
  propTypes: {style: React.PropTypes.object},
  mergeStyles() {
    return ImmutabilityHelper.merge.apply(this, arguments);
  },
  mergeAndPrefix() {
    return Styles.mergeAndPrefix.apply(this, arguments);
  },
  prepareStyles() {
    return Styles.prepareStyles.apply(Styles, [(this.state && this.state.muiTheme) || this.context.muiTheme].concat([].slice.apply(arguments)));
  }
};
