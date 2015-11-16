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
var ReactDOM = require('react-dom');
var ContextPure = require('../mixins/context-pure');
var StylePropable = require('../mixins/style-propable');
var WindowListenable = require('../mixins/window-listenable');
var CssEvent = require('../utils/css-event');
var KeyCode = require('../utils/key-code');
var Calendar = require('./calendar');
var Dialog = require('../dialog');
var FlatButton = require('../flat-button');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');
var DateTime = require('../utils/date-time');
var DatePickerDialog = React.createClass({
  displayName: 'DatePickerDialog',
  mixins: [StylePropable, WindowListenable, ContextPure],
  statics: {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      return {buttonColor: muiTheme.datePicker.calendarTextColor};
    },
    getChildrenClasses: function getChildrenClasses() {
      return [Calendar, Dialog];
    }
  },
  contextTypes: {muiTheme: React.PropTypes.object},
  propTypes: {
    DateTimeFormat: React.PropTypes.func,
    locale: React.PropTypes.string,
    wordings: React.PropTypes.object,
    disableYearSelection: React.PropTypes.bool,
    initialDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object,
    onAccept: React.PropTypes.func,
    onClickAway: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    onShow: React.PropTypes.func,
    style: React.PropTypes.object,
    shouldDisableDate: React.PropTypes.func,
    showYearSelector: React.PropTypes.bool
  },
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function getChildContext() {
    return {muiTheme: this.state.muiTheme};
  },
  getDefaultProps: function getDefaultProps() {
    return {
      DateTimeFormat: DateTime.DateTimeFormat,
      locale: 'en-US',
      wordings: {
        ok: 'OK',
        cancel: 'Cancel'
      }
    };
  },
  windowListeners: {keyup: '_handleWindowKeyUp'},
  getInitialState: function getInitialState() {
    return {
      open: false,
      isCalendarActive: false,
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },
  render: function render() {
    var _props = this.props;
    var DateTimeFormat = _props.DateTimeFormat;
    var locale = _props.locale;
    var wordings = _props.wordings;
    var initialDate = _props.initialDate;
    var onAccept = _props.onAccept;
    var style = _props.style;
    var other = _objectWithoutProperties(_props, ['DateTimeFormat', 'locale', 'wordings', 'initialDate', 'onAccept', 'style']);
    var _constructor$getRelevantContextKeys = this.constructor.getRelevantContextKeys(this.state.muiTheme);
    var calendarTextColor = _constructor$getRelevantContextKeys.calendarTextColor;
    var styles = {
      root: {
        fontSize: 14,
        color: calendarTextColor
      },
      dialogContent: {width: this.props.mode === 'landscape' ? 480 : 320},
      dialogBodyContent: {padding: 0},
      actions: {marginRight: 8}
    };
    var actions = [React.createElement(FlatButton, {
      key: 0,
      label: wordings.cancel,
      secondary: true,
      style: styles.actions,
      onTouchTap: this._handleCancelTouchTap
    })];
    if (!this.props.autoOk) {
      actions.push(React.createElement(FlatButton, {
        key: 1,
        label: wordings.ok,
        secondary: true,
        disabled: this.refs.calendar !== undefined && this.refs.calendar.isSelectedDateDisabled(),
        style: styles.actions,
        onTouchTap: this._handleOKTouchTap
      }));
    }
    return React.createElement(Dialog, _extends({}, other, {
      ref: 'dialog',
      style: styles.root,
      contentStyle: styles.dialogContent,
      bodyStyle: styles.dialogBodyContent,
      actions: actions,
      onDismiss: this._handleDialogDismiss,
      onShow: this._handleDialogShow,
      onClickAway: this._handleDialogClickAway,
      repositionOnUpdate: false,
      open: this.state.open,
      onRequestClose: this.dismiss
    }), React.createElement(Calendar, {
      DateTimeFormat: DateTimeFormat,
      locale: locale,
      ref: 'calendar',
      onDayTouchTap: this._onDayTouchTap,
      initialDate: this.props.initialDate,
      isActive: this.state.isCalendarActive,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      shouldDisableDate: this.props.shouldDisableDate,
      showYearSelector: this.props.showYearSelector,
      mode: this.props.mode
    }));
  },
  show: function show() {
    this.setState({open: true});
  },
  dismiss: function dismiss() {
    this.setState({open: false});
  },
  _onDayTouchTap: function _onDayTouchTap() {
    if (this.props.autoOk) {
      setTimeout(this._handleOKTouchTap, 300);
    }
  },
  _handleCancelTouchTap: function _handleCancelTouchTap() {
    this.dismiss();
  },
  _handleOKTouchTap: function _handleOKTouchTap() {
    if (this.props.onAccept && !this.refs.calendar.isSelectedDateDisabled()) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }
    this.dismiss();
  },
  _handleDialogShow: function _handleDialogShow() {
    this.setState({isCalendarActive: true});
    if (this.props.onShow)
      this.props.onShow();
  },
  _handleDialogDismiss: function _handleDialogDismiss() {
    var _this = this;
    CssEvent.onTransitionEnd(ReactDOM.findDOMNode(this.refs.dialog), function() {
      _this.setState({isCalendarActive: false});
    });
    if (this.props.onDismiss)
      this.props.onDismiss();
  },
  _handleDialogClickAway: function _handleDialogClickAway() {
    var _this2 = this;
    CssEvent.onTransitionEnd(ReactDOM.findDOMNode(this.refs.dialog), function() {
      _this2.setState({isCalendarActive: false});
    });
    if (this.props.onClickAway)
      this.props.onClickAway();
  },
  _handleWindowKeyUp: function _handleWindowKeyUp(e) {
    if (this.state.isCalendarActive) {
      switch (e.keyCode) {
        case KeyCode.ENTER:
          this._handleOKTouchTap();
          break;
      }
    }
  }
});
module.exports = DatePickerDialog;
