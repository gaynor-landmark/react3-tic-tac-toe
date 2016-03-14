/* */ 
(function(process) {
  'use strict';
  var invariant = require('./invariant');
  function isEmpty(obj) {
    !!(obj && obj[Symbol.iterator] && obj.size !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'isEmpty does not support Map or Set') : invariant(false) : undefined;
    if (Array.isArray(obj)) {
      return obj.length === 0;
    } else if (typeof obj === 'object') {
      for (var i in obj) {
        return false;
      }
      return true;
    } else {
      return !obj;
    }
  }
  module.exports = isEmpty;
})(require('process'));
