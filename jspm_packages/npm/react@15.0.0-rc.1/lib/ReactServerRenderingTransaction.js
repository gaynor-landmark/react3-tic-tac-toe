/* */ 
'use strict';
var PooledClass = require('./PooledClass');
var Transaction = require('./Transaction');
var assign = require('./Object.assign');
var TRANSACTION_WRAPPERS = [];
var noopCallbackQueue = {enqueue: function() {}};
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.useCreateElement = false;
}
var Mixin = {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },
  getReactMountReady: function() {
    return noopCallbackQueue;
  },
  destructor: function() {}
};
assign(ReactServerRenderingTransaction.prototype, Transaction.Mixin, Mixin);
PooledClass.addPoolingTo(ReactServerRenderingTransaction);
module.exports = ReactServerRenderingTransaction;
