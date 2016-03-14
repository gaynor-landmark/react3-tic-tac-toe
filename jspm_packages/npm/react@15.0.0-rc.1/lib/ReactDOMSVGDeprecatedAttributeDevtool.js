/* */ 
(function(process) {
  'use strict';
  var DOMProperty = require('./DOMProperty');
  var warning = require('fbjs/lib/warning');
  if (process.env.NODE_ENV !== 'production') {
    var reactProps = {
      children: true,
      dangerouslySetInnerHTML: true,
      key: true,
      ref: true
    };
    var warnedSVGAttributes = {};
    var warnDeprecatedSVGAttribute = function(name) {
      if (reactProps.hasOwnProperty(name) && reactProps[name]) {
        return;
      }
      if (!DOMProperty.properties.hasOwnProperty(name)) {
        return;
      }
      var _DOMProperty$properti = DOMProperty.properties[name];
      var attributeName = _DOMProperty$properti.attributeName;
      var attributeNamespace = _DOMProperty$properti.attributeNamespace;
      if (attributeNamespace || name === attributeName) {
        return;
      }
      if (warnedSVGAttributes.hasOwnProperty(name) && warnedSVGAttributes[name]) {
        return;
      }
      warnedSVGAttributes[name] = true;
      process.env.NODE_ENV !== 'production' ? warning(false, 'SVG property %s is deprecated. Use the original attribute name ' + '%s for SVG tags instead.', name, attributeName) : void 0;
    };
  }
  var ReactDOMSVGDeprecatedAttributeDevtool = {
    onCreateMarkupForSVGAttribute: function(name, value) {
      warnDeprecatedSVGAttribute(name);
    },
    onSetValueForSVGAttribute: function(node, name, value) {
      warnDeprecatedSVGAttribute(name);
    }
  };
  module.exports = ReactDOMSVGDeprecatedAttributeDevtool;
})(require('process'));
