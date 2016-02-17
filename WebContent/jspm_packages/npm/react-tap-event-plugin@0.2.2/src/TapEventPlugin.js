/* */ 
"use strict";
var EventConstants = require('react/lib/EventConstants');
var EventPluginUtils = require('react/lib/EventPluginUtils');
var EventPropagators = require('react/lib/EventPropagators');
var SyntheticUIEvent = require('react/lib/SyntheticUIEvent');
var TouchEventUtils = require('./TouchEventUtils');
var ViewportMetrics = require('react/lib/ViewportMetrics');
var keyOf = require('fbjs/lib/keyOf');
var topLevelTypes = EventConstants.topLevelTypes;
var isStartish = EventPluginUtils.isStartish;
var isEndish = EventPluginUtils.isEndish;
var isTouch = function(topLevelType) {
  var touchTypes = [topLevelTypes.topTouchCancel, topLevelTypes.topTouchEnd, topLevelTypes.topTouchStart, topLevelTypes.topTouchMove];
  return touchTypes.indexOf(topLevelType) >= 0;
};
var tapMoveThreshold = 10;
var ignoreMouseThreshold = 750;
var startCoords = {
  x: null,
  y: null
};
var lastTouchEvent = null;
var Axis = {
  x: {
    page: 'pageX',
    client: 'clientX',
    envScroll: 'currentPageScrollLeft'
  },
  y: {
    page: 'pageY',
    client: 'clientY',
    envScroll: 'currentPageScrollTop'
  }
};
function getAxisCoordOfEvent(axis, nativeEvent) {
  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
  if (singleTouch) {
    return singleTouch[axis.page];
  }
  return axis.page in nativeEvent ? nativeEvent[axis.page] : nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
}
function getDistance(coords, nativeEvent) {
  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
  return Math.pow(Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2), 0.5);
}
var touchEvents = [topLevelTypes.topTouchStart, topLevelTypes.topTouchCancel, topLevelTypes.topTouchEnd, topLevelTypes.topTouchMove];
var dependencies = [topLevelTypes.topMouseDown, topLevelTypes.topMouseMove, topLevelTypes.topMouseUp].concat(touchEvents);
var eventTypes = {touchTap: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchTap: null}),
      captured: keyOf({onTouchTapCapture: null})
    },
    dependencies: dependencies
  }};
var now = (function() {
  if (Date.now) {
    return Date.now;
  } else {
    return function() {
      return +new Date;
    };
  }
})();
function createTapEventPlugin(shouldRejectClick) {
  return {
    tapMoveThreshold: tapMoveThreshold,
    ignoreMouseThreshold: ignoreMouseThreshold,
    eventTypes: eventTypes,
    extractEvents: function(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
      if (isTouch(topLevelType)) {
        lastTouchEvent = now();
      } else {
        if (shouldRejectClick(lastTouchEvent, now())) {
          return null;
        }
      }
      if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
        return null;
      }
      var event = null;
      var distance = getDistance(startCoords, nativeEvent);
      if (isEndish(topLevelType) && distance < tapMoveThreshold) {
        event = SyntheticUIEvent.getPooled(eventTypes.touchTap, topLevelTargetID, nativeEvent, nativeEventTarget);
      }
      if (isStartish(topLevelType)) {
        startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
        startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
      } else if (isEndish(topLevelType)) {
        startCoords.x = 0;
        startCoords.y = 0;
      }
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }
  };
}
module.exports = createTapEventPlugin;
