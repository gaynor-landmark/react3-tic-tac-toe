/* */ 
(function(process) {
  "use strict";
  var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
  var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')["default"];
  exports.__esModule = true;
  var _esutils = require('esutils');
  var _esutils2 = _interopRequireDefault(_esutils);
  var _babelTypes = require('babel-types');
  var t = _interopRequireWildcard(_babelTypes);
  exports["default"] = function(opts) {
    var visitor = {};
    visitor.JSXNamespacedName = function(path) {
      throw path.buildCodeFrameError("Namespace tags are not supported. ReactJSX is not XML.");
    };
    visitor.JSXElement = {exit: function exit(path, file) {
        var callExpr = buildElementCall(path.get("openingElement"), file);
        callExpr.arguments = callExpr.arguments.concat(path.node.children);
        if (callExpr.arguments.length >= 3) {
          callExpr._prettyCall = true;
        }
        path.replaceWith(t.inherits(callExpr, path.node));
      }};
    return visitor;
    function convertJSXIdentifier(node, parent) {
      if (t.isJSXIdentifier(node)) {
        if (node.name === "this" && t.isReferenced(node, parent)) {
          return t.thisExpression();
        } else if (_esutils2["default"].keyword.isIdentifierNameES6(node.name)) {
          node.type = "Identifier";
        } else {
          return t.stringLiteral(node.name);
        }
      } else if (t.isJSXMemberExpression(node)) {
        return t.memberExpression(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
      }
      return node;
    }
    function convertAttributeValue(node) {
      if (t.isJSXExpressionContainer(node)) {
        return node.expression;
      } else {
        return node;
      }
    }
    function convertAttribute(node) {
      var value = convertAttributeValue(node.value || t.booleanLiteral(true));
      if (t.isStringLiteral(value)) {
        value.value = value.value.replace(/\n\s+/g, " ");
      }
      if (t.isValidIdentifier(node.name.name)) {
        node.name.type = "Identifier";
      } else {
        node.name = t.stringLiteral(node.name.name);
      }
      return t.inherits(t.objectProperty(node.name, value), node);
    }
    function buildElementCall(path, file) {
      path.parent.children = t.react.buildChildren(path.parent);
      var tagExpr = convertJSXIdentifier(path.node.name, path.node);
      var args = [];
      var tagName = undefined;
      if (t.isIdentifier(tagExpr)) {
        tagName = tagExpr.name;
      } else if (t.isLiteral(tagExpr)) {
        tagName = tagExpr.value;
      }
      var state = {
        tagExpr: tagExpr,
        tagName: tagName,
        args: args
      };
      if (opts.pre) {
        opts.pre(state, file);
      }
      var attribs = path.node.attributes;
      if (attribs.length) {
        attribs = buildOpeningElementAttributes(attribs, file);
      } else {
        attribs = t.nullLiteral();
      }
      args.push(attribs);
      if (opts.post) {
        opts.post(state, file);
      }
      return state.call || t.callExpression(state.callee, args);
    }
    function buildOpeningElementAttributes(attribs, file) {
      var _props = [];
      var objs = [];
      function pushProps() {
        if (!_props.length)
          return;
        objs.push(t.objectExpression(_props));
        _props = [];
      }
      while (attribs.length) {
        var prop = attribs.shift();
        if (t.isJSXSpreadAttribute(prop)) {
          pushProps();
          objs.push(prop.argument);
        } else {
          _props.push(convertAttribute(prop));
        }
      }
      pushProps();
      if (objs.length === 1) {
        attribs = objs[0];
      } else {
        if (!t.isObjectExpression(objs[0])) {
          objs.unshift(t.objectExpression([]));
        }
        attribs = t.callExpression(file.addHelper("extends"), objs);
      }
      return attribs;
    }
  };
  module.exports = exports["default"];
})(require('process'));
