/* */ 
let React = require('react');
let ReactDOM = require('react-dom');
let Events = require('../utils/events');
let Dom = require('../utils/dom');
module.exports = {
  componentDidMount() {
    if (!this.manuallyBindClickAway)
      this._bindClickAway();
  },
  componentWillUnmount() {
    this._unbindClickAway();
  },
  _checkClickAway(event) {
    let el = ReactDOM.findDOMNode(this);
    if (event.target !== el && !Dom.isDescendant(el, event.target) && document.documentElement.contains(event.target)) {
      if (this.componentClickAway)
        this.componentClickAway(event);
    }
  },
  _bindClickAway() {
    Events.on(document, 'mouseup', this._checkClickAway);
    Events.on(document, 'touchend', this._checkClickAway);
  },
  _unbindClickAway() {
    Events.off(document, 'mouseup', this._checkClickAway);
    Events.off(document, 'touchend', this._checkClickAway);
  }
};
