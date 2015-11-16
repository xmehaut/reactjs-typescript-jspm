/* */ 
'use strict';
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
var React = require('react');
var StylePropable = require('../mixins/style-propable');
var WindowListenable = require('../mixins/window-listenable');
var KeyCode = require('../utils/key-code');
var Clock = require('./clock');
var Dialog = require('../dialog');
var FlatButton = require('../flat-button');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');
var TimePickerDialog = React.createClass({
  displayName: 'TimePickerDialog',
  mixins: [StylePropable, WindowListenable],
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    autoOk: React.PropTypes.bool,
    initialTime: React.PropTypes.object,
    onAccept: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func
  },
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function getChildContext() {
    return {muiTheme: this.state.muiTheme};
  },
  getInitialState: function getInitialState() {
    return {
      open: false,
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },
  windowListeners: {keyup: '_handleWindowKeyUp'},
  getTheme: function getTheme() {
    return this.state.muiTheme.timePicker;
  },
  render: function render() {
    var _props = this.props;
    var initialTime = _props.initialTime;
    var onAccept = _props.onAccept;
    var format = _props.format;
    var autoOk = _props.autoOk;
    var other = _objectWithoutProperties(_props, ['initialTime', 'onAccept', 'format', 'autoOk']);
    var styles = {
      root: {
        fontSize: 14,
        color: this.getTheme().clockColor
      },
      dialogContent: {width: 280},
      body: {padding: 0}
    };
    var actions = [React.createElement(FlatButton, {
      key: 0,
      label: 'Cancel',
      secondary: true,
      onTouchTap: this._handleCancelTouchTap
    }), React.createElement(FlatButton, {
      key: 1,
      label: 'OK',
      secondary: true,
      onTouchTap: this._handleOKTouchTap
    })];
    var onClockChangeMinutes = autoOk === true ? this._handleOKTouchTap : undefined;
    return React.createElement(Dialog, _extends({}, other, {
      ref: 'dialogWindow',
      style: this.mergeAndPrefix(styles.root),
      bodyStyle: this.mergeAndPrefix(styles.body),
      actions: actions,
      contentStyle: styles.dialogContent,
      onDismiss: this._handleDialogDismiss,
      onShow: this._handleDialogShow,
      repositionOnUpdate: false,
      open: this.state.open,
      onRequestClose: this.dismiss
    }), React.createElement(Clock, {
      ref: 'clock',
      format: format,
      initialTime: initialTime,
      onChangeMinutes: onClockChangeMinutes
    }));
  },
  show: function show() {
    this.setState({open: true});
  },
  dismiss: function dismiss() {
    this.setState({open: false});
  },
  _handleCancelTouchTap: function _handleCancelTouchTap() {
    this.dismiss();
  },
  _handleOKTouchTap: function _handleOKTouchTap() {
    this.dismiss();
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.clock.getSelectedTime());
    }
  },
  _handleDialogShow: function _handleDialogShow() {
    if (this.props.onShow) {
      this.props.onShow();
    }
  },
  _handleDialogDismiss: function _handleDialogDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  },
  _handleWindowKeyUp: function _handleWindowKeyUp(event) {
    if (this.refs.dialogWindow.isOpen()) {
      switch (event.keyCode) {
        case KeyCode.ENTER:
          this._handleOKTouchTap();
          break;
      }
    }
  }
});
module.exports = TimePickerDialog;
