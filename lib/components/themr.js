'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.themeable = themeable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object.<string, TReactCSSThemrTheme>} TReactCSSThemrTheme
 */

/**
 * @typedef {{}} TReactCSSThemrOptions
 * @property {String|Boolean} [composeTheme=COMPOSE_DEEPLY]
 * @property {Boolean} [withRef=false]
 */

var COMPOSE_DEEPLY = 'deeply';
var COMPOSE_SOFTLY = 'softly';
var DONT_COMPOSE = false;

var DEFAULT_OPTIONS = {
  composeTheme: COMPOSE_DEEPLY,
  withRef: false
};

var THEMR_CONFIG = typeof Symbol !== 'undefined' ? Symbol('THEMR_CONFIG') : '__REACT_CSS_THEMR_CONFIG__';

/**
 * Themr decorator
 * @param {String|Number|Symbol} componentName - Component name
 * @param {TReactCSSThemrTheme} [localTheme] - Base theme
 * @param {{}} [options] - Themr options
 * @returns {function(ThemedComponent:Function):Function} - ThemedComponent
 */

exports.default = function (componentName, localTheme) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (ThemedComponent) {
    var _class, _temp;

    var _DEFAULT_OPTIONS$opti = _extends({}, DEFAULT_OPTIONS, options),
        optionComposeTheme = _DEFAULT_OPTIONS$opti.composeTheme,
        optionWithRef = _DEFAULT_OPTIONS$opti.withRef;

    validateComposeOption(optionComposeTheme);

    var config = ThemedComponent[THEMR_CONFIG];
    if (config && config.componentName === componentName) {
      config.localTheme = themeable(config.localTheme, localTheme);
      return ThemedComponent;
    }

    config = {
      componentName: componentName,
      localTheme: localTheme
    };

    /**
     * @property {{wrappedInstance: *}} refs
     */
    var Themed = (_temp = _class = function (_Component) {
      _inherits(Themed, _Component);

      function Themed(props) {
        var _ref;

        _classCallCheck(this, Themed);

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Themed.__proto__ || Object.getPrototypeOf(Themed)).call.apply(_ref, [this, props].concat(args)));

        _this.theme_ = _this.calcTheme(props);
        return _this;
      }

      _createClass(Themed, [{
        key: 'getWrappedInstance',
        value: function getWrappedInstance() {
          (0, _invariant2.default)(optionWithRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the third argument of the themr() call.');

          return this.refs.wrappedInstance;
        }
      }, {
        key: 'getNamespacedTheme',
        value: function getNamespacedTheme(props) {
          var themeNamespace = props.themeNamespace,
              theme = props.theme;

          if (!themeNamespace) return theme;
          if (themeNamespace && !theme) throw new Error('Invalid themeNamespace use in react-css-themr. ' + 'themeNamespace prop should be used only with theme prop.');

          return Object.keys(theme).filter(function (key) {
            return key.startsWith(themeNamespace);
          }).reduce(function (result, key) {
            return _extends({}, result, _defineProperty({}, removeNamespace(key, themeNamespace), theme[key]));
          }, {});
        }
      }, {
        key: 'getThemeNotComposed',
        value: function getThemeNotComposed(props) {
          if (props.theme) return this.getNamespacedTheme(props);
          if (config.localTheme) return config.localTheme;
          return this.getContextTheme();
        }
      }, {
        key: 'getContextTheme',
        value: function getContextTheme() {
          return this.context.themr ? this.context.themr.theme[config.componentName] : {};
        }
      }, {
        key: 'getTheme',
        value: function getTheme(props) {
          return props.composeTheme === COMPOSE_SOFTLY ? _extends({}, this.getContextTheme(), config.localTheme, this.getNamespacedTheme(props)) : themeable(themeable(this.getContextTheme(), config.localTheme), this.getNamespacedTheme(props));
        }
      }, {
        key: 'calcTheme',
        value: function calcTheme(props) {
          var composeTheme = props.composeTheme;

          return composeTheme ? this.getTheme(props) : this.getThemeNotComposed(props);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (nextProps.composeTheme !== this.props.composeTheme || nextProps.theme !== this.props.theme || nextProps.themeNamespace !== this.props.themeNamespace) {
            this.theme_ = this.calcTheme(nextProps);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var renderedElement = void 0;
          //exclude themr-only props
          //noinspection JSUnusedLocalSymbols

          var _props = this.props,
              composeTheme = _props.composeTheme,
              themeNamespace = _props.themeNamespace,
              props = _objectWithoutProperties(_props, ['composeTheme', 'themeNamespace']); //eslint-disable-line no-unused-vars

          if (optionWithRef) {
            renderedElement = _react2.default.createElement(ThemedComponent, _extends({}, props, {
              ref: 'wrappedInstance',
              theme: this.theme_
            }));
          } else {
            renderedElement = _react2.default.createElement(ThemedComponent, _extends({}, props, {
              theme: this.theme_
            }));
          }

          return renderedElement;
        }
      }]);

      return Themed;
    }(_react.Component), _class.displayName = 'Themed' + ThemedComponent.name, _class.contextTypes = {
      themr: _react.PropTypes.object
    }, _class.propTypes = _extends({}, ThemedComponent.propTypes, {
      composeTheme: _react.PropTypes.oneOf([COMPOSE_DEEPLY, COMPOSE_SOFTLY, DONT_COMPOSE]),
      theme: _react.PropTypes.object,
      themeNamespace: _react.PropTypes.string
    }), _class.defaultProps = _extends({}, ThemedComponent.defaultProps, {
      composeTheme: optionComposeTheme
    }), _temp);


    Themed[THEMR_CONFIG] = config;

    return Themed;
  };
};

/**
 * Merges two themes by concatenating values with the same keys
 * @param {TReactCSSThemrTheme} [original] - Original theme object
 * @param {TReactCSSThemrTheme} [mixin] - Mixing theme object
 * @returns {TReactCSSThemrTheme} - Merged resulting theme
 */


function themeable() {
  var original = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixin = arguments[1];

  //don't merge if no mixin is passed
  if (!mixin) return original;

  //merge themes by concatenating values with the same keys
  return Object.keys(mixin).reduce(

  //merging reducer
  function (result, key) {
    var originalValue = original[key];
    var mixinValue = mixin[key];

    var newValue = void 0;

    //check if values are nested objects
    if ((typeof originalValue === 'undefined' ? 'undefined' : _typeof(originalValue)) === 'object' && (typeof mixinValue === 'undefined' ? 'undefined' : _typeof(mixinValue)) === 'object') {
      //go recursive
      newValue = themeable(originalValue, mixinValue);
    } else {
      //either concat or take mixin value
      newValue = originalValue ? originalValue + ' ' + mixinValue : mixinValue;
    }

    return _extends({}, result, _defineProperty({}, key, newValue));
  },

  //use original theme as an acc
  original);
}

/**
 * Validates compose option
 * @param {String|Boolean} composeTheme - Compose them option
 * @throws
 * @returns {undefined}
 */
function validateComposeOption(composeTheme) {
  if ([COMPOSE_DEEPLY, COMPOSE_SOFTLY, DONT_COMPOSE].indexOf(composeTheme) === -1) {
    throw new Error('Invalid composeTheme option for react-css-themr. Valid composition options are ' + COMPOSE_DEEPLY + ', ' + COMPOSE_SOFTLY + ' and ' + DONT_COMPOSE + '. The given option was ' + composeTheme);
  }
}

/**
 * Removes namespace from key
 * @param {String} key - Key
 * @param {String} themeNamespace - Theme namespace
 * @returns {String} - Key
 */
function removeNamespace(key, themeNamespace) {
  var capitalized = key.substr(themeNamespace.length);
  return capitalized.slice(0, 1).toLowerCase() + capitalized.slice(1);
}