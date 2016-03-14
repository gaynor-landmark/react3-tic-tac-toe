/* */ 
(function(process) {
  'use strict';
  var CSSProperty = require('./CSSProperty');
  var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
  var ReactPerf = require('./ReactPerf');
  var camelizeStyleName = require('fbjs/lib/camelizeStyleName');
  var dangerousStyleValue = require('./dangerousStyleValue');
  var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
  var memoizeStringOnly = require('fbjs/lib/memoizeStringOnly');
  var warning = require('fbjs/lib/warning');
  var processStyleName = memoizeStringOnly(function(styleName) {
    return hyphenateStyleName(styleName);
  });
  var hasShorthandPropertyBug = false;
  var styleFloatAccessor = 'cssFloat';
  if (ExecutionEnvironment.canUseDOM) {
    var tempStyle = document.createElement('div').style;
    try {
      tempStyle.font = '';
    } catch (e) {
      hasShorthandPropertyBug = true;
    }
    if (document.documentElement.style.cssFloat === undefined) {
      styleFloatAccessor = 'styleFloat';
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
    var badStyleValueWithSemicolonPattern = /;\s*$/;
    var warnedStyleNames = {};
    var warnedStyleValues = {};
    var warnedForNaNValue = false;
    var warnHyphenatedStyleName = function(name) {
      if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
        return;
      }
      warnedStyleNames[name] = true;
      process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported style property %s. Did you mean %s?', name, camelizeStyleName(name)) : void 0;
    };
    var warnBadVendoredStyleName = function(name) {
      if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
        return;
      }
      warnedStyleNames[name] = true;
      process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?', name, name.charAt(0).toUpperCase() + name.slice(1)) : void 0;
    };
    var warnStyleValueWithSemicolon = function(name, value) {
      if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
        return;
      }
      warnedStyleValues[value] = true;
      process.env.NODE_ENV !== 'production' ? warning(false, 'Style property values shouldn\'t contain a semicolon. ' + 'Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, '')) : void 0;
    };
    var warnStyleValueIsNaN = function(name, value) {
      if (warnedForNaNValue) {
        return;
      }
      warnedForNaNValue = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '`NaN` is an invalid value for the `%s` css style property', name) : void 0;
    };
    var warnValidStyle = function(name, value) {
      if (name.indexOf('-') > -1) {
        warnHyphenatedStyleName(name);
      } else if (badVendoredStyleNamePattern.test(name)) {
        warnBadVendoredStyleName(name);
      } else if (badStyleValueWithSemicolonPattern.test(value)) {
        warnStyleValueWithSemicolon(name, value);
      }
      if (typeof value === 'number' && isNaN(value)) {
        warnStyleValueIsNaN(name, value);
      }
    };
  }
  var CSSPropertyOperations = {
    createMarkupForStyles: function(styles, component) {
      var serialized = '';
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        var styleValue = styles[styleName];
        if (process.env.NODE_ENV !== 'production') {
          warnValidStyle(styleName, styleValue);
        }
        if (styleValue != null) {
          serialized += processStyleName(styleName) + ':';
          serialized += dangerousStyleValue(styleName, styleValue, component) + ';';
        }
      }
      return serialized || null;
    },
    setValueForStyles: function(node, styles, component) {
      var style = node.style;
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        if (process.env.NODE_ENV !== 'production') {
          warnValidStyle(styleName, styles[styleName]);
        }
        var styleValue = dangerousStyleValue(styleName, styles[styleName], component);
        if (styleName === 'float' || styleName === 'cssFloat') {
          styleName = styleFloatAccessor;
        }
        if (styleValue) {
          style[styleName] = styleValue;
        } else {
          var expansion = hasShorthandPropertyBug && CSSProperty.shorthandPropertyExpansions[styleName];
          if (expansion) {
            for (var individualStyleName in expansion) {
              style[individualStyleName] = '';
            }
          } else {
            style[styleName] = '';
          }
        }
      }
    }
  };
  ReactPerf.measureMethods(CSSPropertyOperations, 'CSSPropertyOperations', {setValueForStyles: 'setValueForStyles'});
  module.exports = CSSPropertyOperations;
})(require('process'));
