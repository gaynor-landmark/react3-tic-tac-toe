/* */ 
"use strict";
var _classCallCheck = require('babel-runtime/helpers/class-call-check')["default"];
var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')["default"];
var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')["default"];
exports.__esModule = true;
var _binding = require('../binding');
var _binding2 = _interopRequireDefault(_binding);
var _babelTypes = require('babel-types');
var t = _interopRequireWildcard(_babelTypes);
var renameVisitor = {
  ReferencedIdentifier: function ReferencedIdentifier(_ref, state) {
    var node = _ref.node;
    if (node.name === state.oldName) {
      node.name = state.newName;
    }
  },
  Scope: function Scope(path, state) {
    if (!path.scope.bindingIdentifierEquals(state.oldName, state.binding.identifier)) {
      path.skip();
    }
  },
  "AssignmentExpression|Declaration": function AssignmentExpressionDeclaration(path, state) {
    var ids = path.getOuterBindingIdentifiers();
    for (var _name in ids) {
      if (_name === state.oldName)
        ids[_name].name = state.newName;
    }
  }
};
var Renamer = (function() {
  function Renamer(binding, oldName, newName) {
    _classCallCheck(this, Renamer);
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }
  Renamer.prototype.maybeConvertFromExportDeclaration = function maybeConvertFromExportDeclaration(parentDeclar) {
    var exportDeclar = parentDeclar.parentPath.isExportDeclaration() && parentDeclar.parentPath;
    if (!exportDeclar)
      return;
    var isDefault = exportDeclar.isExportDefaultDeclaration();
    if (isDefault && (parentDeclar.isFunctionDeclaration() || parentDeclar.isClassDeclaration()) && !parentDeclar.node.id) {
      parentDeclar.node.id = parentDeclar.scope.generateUidIdentifier("default");
    }
    var bindingIdentifiers = parentDeclar.getOuterBindingIdentifiers();
    var specifiers = [];
    for (var _name2 in bindingIdentifiers) {
      var localName = _name2 === this.oldName ? this.newName : _name2;
      var exportedName = isDefault ? "default" : _name2;
      specifiers.push(t.exportSpecifier(t.identifier(localName), t.identifier(exportedName)));
    }
    var aliasDeclar = t.exportNamedDeclaration(null, specifiers);
    if (parentDeclar.isFunctionDeclaration()) {
      aliasDeclar._blockHoist = 3;
    }
    exportDeclar.insertAfter(aliasDeclar);
    exportDeclar.replaceWith(parentDeclar.node);
  };
  Renamer.prototype.maybeConvertFromClassFunctionDeclaration = function maybeConvertFromClassFunctionDeclaration(path) {
    return;
    if (!path.isFunctionDeclaration() && !path.isClassDeclaration())
      return;
    if (this.binding.kind !== "hoisted")
      return;
    path.node.id = t.identifier(this.oldName);
    path.node._blockHoist = 3;
    path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(t.identifier(this.newName), t.toExpression(path.node))]));
  };
  Renamer.prototype.maybeConvertFromClassFunctionExpression = function maybeConvertFromClassFunctionExpression(path) {
    return;
    if (!path.isFunctionExpression() && !path.isClassExpression())
      return;
    if (this.binding.kind !== "local")
      return;
    path.node.id = t.identifier(this.oldName);
    this.binding.scope.parent.push({id: t.identifier(this.newName)});
    path.replaceWith(t.assignmentExpression("=", t.identifier(this.newName), path.node));
  };
  Renamer.prototype.rename = function rename(block) {
    var binding = this.binding;
    var oldName = this.oldName;
    var newName = this.newName;
    var scope = binding.scope;
    var path = binding.path;
    var parentDeclar = path.find(function(path) {
      return path.isDeclaration() || path.isFunctionExpression();
    });
    if (parentDeclar) {
      this.maybeConvertFromExportDeclaration(parentDeclar);
    }
    scope.traverse(block || scope.block, renameVisitor, this);
    if (!block) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    }
    if (binding.type === "hoisted") {}
    if (parentDeclar) {
      this.maybeConvertFromClassFunctionDeclaration(parentDeclar);
      this.maybeConvertFromClassFunctionExpression(parentDeclar);
    }
  };
  return Renamer;
})();
exports["default"] = Renamer;
module.exports = exports["default"];
