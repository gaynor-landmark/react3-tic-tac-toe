/* */ 
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelHelperExplodeClass = require("babel-helper-explode-class");

var _babelHelperExplodeClass2 = _interopRequireDefault(_babelHelperExplodeClass);

var buildClassDecorator = _babelTemplate2["default"]("\n  CLASS_REF = DECORATOR(CLASS_REF) || CLASS_REF;\n");

exports["default"] = function (_ref3) {
  var t = _ref3.types;

  function cleanDecorators(decorators) {
    return decorators.reverse().map(function (dec) {
      return dec.expression;
    });
  }

  function transformClass(path, ref, state) {
    var nodes = [];

    state;

    var classDecorators = path.node.decorators;
    if (classDecorators) {
      path.node.decorators = null;
      classDecorators = cleanDecorators(classDecorators);

      for (var _iterator = classDecorators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var decorator = _ref;

        nodes.push(buildClassDecorator({
          CLASS_REF: ref,
          DECORATOR: decorator
        }));
      }
    }

    var map = _Object$create(null);

    for (var _iterator2 = path.get("body.body"), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var method = _ref2;

      var decorators = method.node.decorators;
      if (!decorators) continue;

      var alias = t.toKeyAlias(method.node);
      map[alias] = map[alias] || [];
      map[alias].push(method.node);

      method.remove();
    }

    for (var alias in map) {
      var items = map[alias];

      items;
    }

    return nodes;
  }

  function hasDecorators(path) {
    if (path.isClass()) {
      if (path.node.decorators) return true;

      var _arr = path.node.body.body;
      for (var _i3 = 0; _i3 < _arr.length; _i3++) {
        var method = _arr[_i3];
        if (method.decorators) {
          return true;
        }
      }
    } else if (path.isObjectExpression()) {
      var _arr2 = path.node.properties;

      for (var _i4 = 0; _i4 < _arr2.length; _i4++) {
        var prop = _arr2[_i4];
        if (prop.decorators) {
          return true;
        }
      }
    }

    return false;
  }

  function doError(path) {
    throw path.buildCodeFrameError("Decorators are not supported yet in 6.x pending proposal update.");
  }

  return {
    inherits: require("babel-plugin-syntax-decorators"),

    visitor: {
      ClassExpression: function ClassExpression(path) {
        if (!hasDecorators(path)) return;
        doError(path);

        _babelHelperExplodeClass2["default"](path);

        var ref = path.scope.generateDeclaredUidIdentifier("ref");
        var nodes = [];

        nodes.push(t.assignmentExpression("=", ref, path.node));

        nodes = nodes.concat(transformClass(path, ref, this));

        nodes.push(ref);

        path.replaceWith(t.sequenceExpression(nodes));
      },

      ClassDeclaration: function ClassDeclaration(path) {
        if (!hasDecorators(path)) return;
        doError(path);
        _babelHelperExplodeClass2["default"](path);

        var ref = path.node.id;
        var nodes = [];

        nodes = nodes.concat(transformClass(path, ref, this).map(function (expr) {
          return t.expressionStatement(expr);
        }));
        nodes.push(t.expressionStatement(ref));

        path.insertAfter(nodes);
      },

      ObjectExpression: function ObjectExpression(path) {
        if (!hasDecorators(path)) return;
        doError(path);
      }
    }
  };
};

module.exports = exports["default"];