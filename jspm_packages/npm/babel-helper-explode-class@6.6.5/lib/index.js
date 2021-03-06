/* */ 
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

exports.__esModule = true;

var _babelHelperBindifyDecorators = require("babel-helper-bindify-decorators");

var _babelHelperBindifyDecorators2 = _interopRequireDefault(_babelHelperBindifyDecorators);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

exports["default"] = function (classPath) {
  classPath.assertClass();

  var memoisedExpressions = [];

  function maybeMemoise(path) {
    if (!path.node || path.isPure()) return;

    var uid = classPath.scope.generateDeclaredUidIdentifier();
    memoisedExpressions.push(t.assignmentExpression("=", uid, path.node));
    path.replaceWith(uid);
  }

  function memoiseDecorators(paths) {
    if (!Array.isArray(paths) || !paths.length) return;

    // ensure correct evaluation order of decorators
    paths = paths.reverse();

    // bind decorators if they're member expressions
    _babelHelperBindifyDecorators2["default"](paths);

    for (var _i = 0; _i < paths.length; _i++) {
      var path = paths[_i];
      maybeMemoise(path);
    }
  }

  maybeMemoise(classPath.get("superClass"));
  memoiseDecorators(classPath.get("decorators"), true);

  var methods = classPath.get("body.body");
  for (var _i2 = 0; _i2 < methods.length; _i2++) {
    var methodPath = methods[_i2];
    if (methodPath.is("computed")) {
      maybeMemoise(methodPath.get("key"));
    }

    if (methodPath.has("decorators")) {
      memoiseDecorators(classPath.get("decorators"));
    }
  }

  if (memoisedExpressions) {
    classPath.insertBefore(memoisedExpressions.map(function (expr) {
      return t.expressionStatement(expr);
    }));
  }
};

module.exports = exports["default"];