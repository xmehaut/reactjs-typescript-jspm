/* */ 
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Events = require('../utils/events');
var Dom = require('../utils/dom');
module.exports = {
  componentDidMount: function componentDidMount() {
    if (!this.manuallyBindClickAway)
      this._bindClickAway();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unbindClickAway();
  },
  _checkClickAway: function _checkClickAway(event) {
    var el = ReactDOM.findDOMNode(this);
    if (event.target !== el && !Dom.isDescendant(el, event.target) && document.documentElement.contains(event.target)) {
      if (this.componentClickAway)
        this.componentClickAway(event);
    }
  },
  _bindClickAway: function _bindClickAway() {
    Events.on(document, 'mouseup', this._checkClickAway);
    Events.on(document, 'touchend', this._checkClickAway);
  },
  _unbindClickAway: function _unbindClickAway() {
    Events.off(document, 'mouseup', this._checkClickAway);
    Events.off(document, 'touchend', this._checkClickAway);
  }
};
