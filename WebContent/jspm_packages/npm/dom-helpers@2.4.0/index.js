/* */ 
'use strict';
var babelHelpers = require('./util/babelHelpers');
var style = require('./style/index'),
    events = require('./events/index'),
    query = require('./query/index'),
    activeElement = require('./activeElement'),
    ownerDocument = require('./ownerDocument'),
    ownerWindow = require('./ownerWindow');
module.exports = babelHelpers._extends({}, style, events, query, {
  activeElement: activeElement,
  ownerDocument: ownerDocument,
  ownerWindow: ownerWindow,
  requestAnimationFrame: require('./util/requestAnimationFrame')
});
