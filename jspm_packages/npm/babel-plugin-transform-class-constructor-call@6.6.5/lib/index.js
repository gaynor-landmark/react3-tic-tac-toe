/* */ 
"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var buildWrapper = _babelTemplate2["default"]("\n  let CLASS_REF = CLASS;\n  var CALL_REF = CALL;\n  var WRAPPER_REF = function (...args) {\n    if (this instanceof WRAPPER_REF) {\n      return Reflect.construct(CLASS_REF, args);\n    } else {\n      return CALL_REF.apply(this, args);\n    }\n  };\n  WRAPPER_REF.__proto__ = CLASS_REF;\n  WRAPPER_REF;\n");

exports["default"] = function (_ref) {
  var t = _ref.types;

  var ALREADY_VISITED = _Symbol();

  function findConstructorCall(path) {
    var methods = path.get("body.body");

    for (var _i = 0; _i < methods.length; _i++) {
      var method = methods[_i];
      if (method.node.kind === "constructorCall") {
        return method;
      }
    }

    return null;
  }

  function handleClassWithCall(constructorCall, classPath) {
    var _classPath = classPath;
    var node = _classPath.node;

    var ref = node.id || classPath.scope.generateUidIdentifier("class");

    if (classPath.parentPath.isExportDefaultDeclaration()) {
      classPath = classPath.parentPath;
      classPath.insertAfter(t.exportDefaultDeclaration(ref));
    }

    classPath.replaceWithMultiple(buildWrapper({
      CLASS_REF: classPath.scope.generateUidIdentifier(ref.name),
      CALL_REF: classPath.scope.generateUidIdentifier(ref.name + "Call"),
      CALL: t.functionExpression(null, constructorCall.node.params, constructorCall.node.body),
      CLASS: t.toExpression(node),
      WRAPPER_REF: ref
    }));

    constructorCall.remove();
  }

  return {
    inherits: require("babel-plugin-syntax-class-constructor-call"),

    visitor: {
      Class: function Class(path) {
        if (path.node[ALREADY_VISITED]) return;
        path.node[ALREADY_VISITED] = true;

        var constructorCall = findConstructorCall(path);

        if (constructorCall) {
          handleClassWithCall(constructorCall, path);
        } else {
          return;
        }
      }
    }
  };
};

module.exports = exports["default"];