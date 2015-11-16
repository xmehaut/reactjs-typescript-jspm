const React = require('react');
const ReactDOM = require('react-dom');
const StylePropable = require('./mixins/style-propable');
const Transitions = require('./styles/transitions');
const Colors = require('./styles/colors');
const DefaultRawTheme = require('./styles/raw-themes/light-raw-theme');
const ThemeManager = require('./styles/theme-manager');

const Tooltip = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    className: React.PropTypes.string,
    label: React.PropTypes.node.isRequired,
    show: React.PropTypes.bool,
    touch: React.PropTypes.bool,
    verticalPosition: React.PropTypes.oneOf(['top', 'bottom']),
    horizontalPosition: React.PropTypes.oneOf(['left', 'right', 'center']),
    style: React.PropTypes.object,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentDidMount() {
    this._setRippleSize();
    this._setTooltipPosition();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    this._setTooltipPosition();

    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  componentDidUpdate() {
    this._setRippleSize();
  },

  getInitialState() {
    return {
      offsetWidth: null,
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
    };
  },

  getStyles() {
    let verticalPosition = this.props.verticalPosition;
    let horizontalPosition = this.props.horizontalPosition;
    let touchMarginOffset = this.props.touch ? 10: 0;
    let touchOffsetTop = this.props.touch ? -20 : -10;
    let offset = verticalPosition === 'bottom' ?
      14 + touchMarginOffset : -14 - touchMarginOffset;

    let styles = {
      root: {
        position: 'absolute',
        fontFamily: this.state.muiTheme.rawTheme.fontFamily,
        fontSize: '10px',
        lineHeight: '22px',
        padding: '0 8px',
        color: Colors.white,
        overflow: 'hidden',
        top: -10000,
        borderRadius: 2,
        userSelect: 'none',
        opacity: 0,
        right: horizontalPosition === 'left' ? 12 : null,
        left: horizontalPosition === 'center' ?
          (this.state.offsetWidth - 48) / 2 * -1 : null,
        transition:
          Transitions.easeOut('0ms', 'top', '450ms') + ',' +
          Transitions.easeOut('450ms', 'transform', '0ms') + ',' +
          Transitions.easeOut('450ms', 'opacity', '0ms'),
      },
      label: {
        position: 'relative',
        whiteSpace: 'nowrap',
      },
      ripple: {
        position: 'absolute',
        left: horizontalPosition ==='center' ? '50%' :
          horizontalPosition ==='left' ? '100%' : '0%',
        top: verticalPosition === 'bottom' ? 0 : '100%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        transition:
          Transitions.easeOut('0ms', 'width', '450ms') + ',' +
          Transitions.easeOut('0ms', 'height', '450ms') + ',' +
          Transitions.easeOut('450ms', 'backgroundColor', '0ms'),
      },
      rootWhenShown: {
        top: verticalPosition === 'top' ?
          touchOffsetTop : 36,
        opacity: 0.9,
        transform: 'translate3d(0px, ' + offset + 'px, 0px)',
        transition:
          Transitions.easeOut('0ms', 'top', '0ms') + ',' +
          Transitions.easeOut('450ms', 'transform', '0ms') + ',' +
          Transitions.easeOut('450ms', 'opacity', '0ms'),
      },
      rootWhenTouched: {
        fontSize: '14px',
        lineHeight: '32px',
        padding: '0 16px',
      },
      rippleWhenShown: {
        backgroundColor: Colors.grey700,
        transition:
          Transitions.easeOut('450ms', 'width', '0ms') + ',' +
          Transitions.easeOut('450ms', 'height', '0ms') + ',' +
          Transitions.easeOut('450ms', 'backgroundColor', '0ms'),
      },
    };

    return styles;
  },

  render() {
    let {
      label,
      ...other } = this.props;
    let styles = this.getStyles();
    return (
      <div {...other}
        style={this.prepareStyles(
            styles.root,
            this.props.show && styles.rootWhenShown,
            this.props.touch && styles.rootWhenTouched,
            this.props.style
          )}>
        <div
          ref="ripple"
          style={this.prepareStyles(
            styles.ripple,
            this.props.show && styles.rippleWhenShown)} />
        <span style={this.prepareStyles(styles.label)}>{this.props.label}</span>
      </div>
    );
  },

  _setRippleSize() {
    let ripple = ReactDOM.findDOMNode(this.refs.ripple);
    let tooltip = window.getComputedStyle(ReactDOM.findDOMNode(this));
    let tooltipWidth = parseInt(tooltip.getPropertyValue("width"), 10) /
      (this.props.horizontalPosition === 'center' ? 2 : 1);
    let tooltipHeight = parseInt(tooltip.getPropertyValue("height"), 10);

    let rippleDiameter = Math.ceil((Math.sqrt(Math.pow(tooltipHeight, 2) +
                                    Math.pow(tooltipWidth, 2) ) * 2));
    if (this.props.show) {
      ripple.style.height = rippleDiameter + 'px';
      ripple.style.width = rippleDiameter + 'px';
    }
    else {
      ripple.style.width = '0px';
      ripple.style.height = '0px';
    }
  },

  _setTooltipPosition() {
    let tooltip = ReactDOM.findDOMNode(this);
    this.setState({offsetWidth: tooltip.offsetWidth});
  },

});

module.exports = Tooltip;
