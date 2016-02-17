/* */ 
'use strict';
var shallowEqual = require('../utils/shallow-equal');
function relevantContextKeysEqual(classObject, currentContext, nextContext) {
  if (classObject.getRelevantContextKeys) {
    var currentContextKeys = classObject.getRelevantContextKeys(currentContext);
    var nextContextKeys = classObject.getRelevantContextKeys(nextContext);
    if (!shallowEqual(currentContextKeys, nextContextKeys)) {
      return false;
    }
  }
  if (classObject.getChildrenClasses) {
    var childrenArray = classObject.getChildrenClasses();
    for (var i = 0; i < childrenArray.length; i++) {
      if (!relevantContextKeysEqual(childrenArray[i], currentContext, nextContext)) {
        return false;
      }
    }
  }
  return true;
}
module.exports = {shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)) {
      return true;
    }
    if (!this.context.muiTheme && !nextContext.muiTheme) {
      return false;
    }
    if (this.context.muiTheme && nextContext.muiTheme) {
      return !this.context.muiTheme['static'] && !relevantContextKeysEqual(this.constructor, this.context.muiTheme, nextContext.muiTheme);
    }
    return true;
  }};
