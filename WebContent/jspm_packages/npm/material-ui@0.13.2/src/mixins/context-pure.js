/* */ 
const shallowEqual = require('../utils/shallow-equal');
function relevantContextKeysEqual(classObject, currentContext, nextContext) {
  if (classObject.getRelevantContextKeys) {
    const currentContextKeys = classObject.getRelevantContextKeys(currentContext);
    const nextContextKeys = classObject.getRelevantContextKeys(nextContext);
    if (!shallowEqual(currentContextKeys, nextContextKeys)) {
      return false;
    }
  }
  if (classObject.getChildrenClasses) {
    const childrenArray = classObject.getChildrenClasses();
    for (let i = 0; i < childrenArray.length; i++) {
      if (!relevantContextKeysEqual(childrenArray[i], currentContext, nextContext)) {
        return false;
      }
    }
  }
  return true;
}
module.exports = {shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)) {
      return true;
    }
    if (!this.context.muiTheme && !nextContext.muiTheme) {
      return false;
    }
    if (this.context.muiTheme && nextContext.muiTheme) {
      return !this.context.muiTheme.static && !relevantContextKeysEqual(this.constructor, this.context.muiTheme, nextContext.muiTheme);
    }
    return true;
  }};
