(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(this, function (root) {

  'use strict';

  var echo = {};

  var callback = function () {};

  var offset, poll, delay, useDebounce, unload;

  var isHidden = function (element) {
    return (element.offsetParent === null);
  };
  
  var inView = function (element, view) {
    if (isHidden(element)) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var debounceOrThrottle = function () {
    if(!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function(){
      echo.render();
      poll = null;
    }, delay);
  };

  echo.init = function (opts) {
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };
    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    delay = optionToInt(opts.throttle, 250);
    useDebounce = opts.debounce !== false;
    unload = !!opts.unload;
    callback = opts.callback || callback;
    echo.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', debounceOrThrottle, false);
      root.addEventListener('load', debounceOrThrottle, false);
    } else {
      root.attachEvent('onscroll', debounceOrThrottle);
      root.attachEvent('onload', debounceOrThrottle);
    }
  };

  echo.render = function () {
    var nodes = document.querySelectorAll('img[data-echo], [data-echo-background]');
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (inView(elem, view)) {

        if (unload) {
          elem.setAttribute('data-echo-placeholder', elem.src);
        }

        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + elem.getAttribute('data-echo-background') + ")";
        }
        else {
          elem.src = elem.getAttribute('data-echo');
        }

        if (!unload) {
          elem.removeAttribute('data-echo');
          elem.removeAttribute('data-echo-background');
        }

        callback(elem, 'load');
      }
      else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {

        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + src + ")";
        }
        else {
          elem.src = src;
        }

        elem.removeAttribute('data-echo-placeholder');
        callback(elem, 'unload');
      }
    }
    if (!length) {
      echo.detach();
    }
  };

  echo.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', debounceOrThrottle);
    } else {
      root.detachEvent('onscroll', debounceOrThrottle);
    }
    clearTimeout(poll);
  };

  return echo;

});

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":4}],3:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":6}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
/*
 (c) 2011-2015, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
 https://github.com/mourner/suncalc
*/

(function () { 'use strict';

// shortcuts for easier to read formulas

var PI   = Math.PI,
    sin  = Math.sin,
    cos  = Math.cos,
    tan  = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad  = PI / 180;

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas


// date/time constants and conversions

var dayMs = 1000 * 60 * 60 * 24,
    J1970 = 2440588,
    J2000 = 2451545;

function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
function toDays(date)   { return toJulian(date) - J2000; }


// general calculations for position

var e = rad * 23.4397; // obliquity of the Earth

function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }

function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }

function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }


// general sun calculations

function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }

function eclipticLongitude(M) {

    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
        P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
}

function sunCoords(d) {

    var M = solarMeanAnomaly(d),
        L = eclipticLongitude(M);

    return {
        dec: declination(L, 0),
        ra: rightAscension(L, 0)
    };
}


var SunCalc = {};


// calculates sun position for a given date and latitude/longitude

SunCalc.getPosition = function (date, lat, lng) {

    var lw  = rad * -lng,
        phi = rad * lat,
        d   = toDays(date),

        c  = sunCoords(d),
        H  = siderealTime(d, lw) - c.ra;

    return {
        azimuth: azimuth(H, phi, c.dec),
        altitude: altitude(H, phi, c.dec)
    };
};


// sun times configuration (angle, morning name, evening name)

var times = SunCalc.times = [
    [-0.833, 'sunrise',       'sunset'      ],
    [  -0.3, 'sunriseEnd',    'sunsetStart' ],
    [    -6, 'dawn',          'dusk'        ],
    [   -12, 'nauticalDawn',  'nauticalDusk'],
    [   -18, 'nightEnd',      'night'       ],
    [     6, 'goldenHourEnd', 'goldenHour'  ]
];

// adds a custom time to the times config

SunCalc.addTime = function (angle, riseName, setName) {
    times.push([angle, riseName, setName]);
};


// calculations for sun times

var J0 = 0.0009;

function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }

function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }

function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

// returns set time for the given sun altitude
function getSetJ(h, lw, phi, dec, n, M, L) {

    var w = hourAngle(h, phi, dec),
        a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
}


// calculates sun times for a given date and latitude/longitude

SunCalc.getTimes = function (date, lat, lng) {

    var lw = rad * -lng,
        phi = rad * lat,

        d = toDays(date),
        n = julianCycle(d, lw),
        ds = approxTransit(0, lw, n),

        M = solarMeanAnomaly(ds),
        L = eclipticLongitude(M),
        dec = declination(L, 0),

        Jnoon = solarTransitJ(ds, M, L),

        i, len, time, Jset, Jrise;


    var result = {
        solarNoon: fromJulian(Jnoon),
        nadir: fromJulian(Jnoon - 0.5)
    };

    for (i = 0, len = times.length; i < len; i += 1) {
        time = times[i];

        Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
        Jrise = Jnoon - (Jset - Jnoon);

        result[time[1]] = fromJulian(Jrise);
        result[time[2]] = fromJulian(Jset);
    }

    return result;
};


// moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

function moonCoords(d) { // geocentric ecliptic coordinates of the moon

    var L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
        M = rad * (134.963 + 13.064993 * d), // mean anomaly
        F = rad * (93.272 + 13.229350 * d),  // mean distance

        l  = L + rad * 6.289 * sin(M), // longitude
        b  = rad * 5.128 * sin(F),     // latitude
        dt = 385001 - 20905 * cos(M);  // distance to the moon in km

    return {
        ra: rightAscension(l, b),
        dec: declination(l, b),
        dist: dt
    };
}

SunCalc.getMoonPosition = function (date, lat, lng) {

    var lw  = rad * -lng,
        phi = rad * lat,
        d   = toDays(date),

        c = moonCoords(d),
        H = siderealTime(d, lw) - c.ra,
        h = altitude(H, phi, c.dec);

    // altitude correction for refraction
    h = h + rad * 0.017 / tan(h + rad * 10.26 / (h + rad * 5.10));

    return {
        azimuth: azimuth(H, phi, c.dec),
        altitude: h,
        distance: c.dist
    };
};


// calculations for illumination parameters of the moon,
// based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
// Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.

SunCalc.getMoonIllumination = function (date) {

    var d = toDays(date),
        s = sunCoords(d),
        m = moonCoords(d),

        sdist = 149598000, // distance from Earth to Sun in km

        phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
        inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
        angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
                cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

    return {
        fraction: (1 + cos(inc)) / 2,
        phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
        angle: angle
    };
};


function hoursLater(date, h) {
    return new Date(date.valueOf() + h * dayMs / 24);
}

// calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article

SunCalc.getMoonTimes = function (date, lat, lng, inUTC) {
    var t = new Date(date);
    if (inUTC) t.setUTCHours(0, 0, 0, 0);
    else t.setHours(0, 0, 0, 0);

    var hc = 0.133 * rad,
        h0 = SunCalc.getMoonPosition(t, lat, lng).altitude - hc,
        h1, h2, rise, set, a, b, xe, ye, d, roots, x1, x2, dx;

    // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
    for (var i = 1; i <= 24; i += 2) {
        h1 = SunCalc.getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
        h2 = SunCalc.getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;

        a = (h0 + h2) / 2 - h1;
        b = (h2 - h0) / 2;
        xe = -b / (2 * a);
        ye = (a * xe + b) * xe + h1;
        d = b * b - 4 * a * h1;
        roots = 0;

        if (d >= 0) {
            dx = Math.sqrt(d) / (Math.abs(a) * 2);
            x1 = xe - dx;
            x2 = xe + dx;
            if (Math.abs(x1) <= 1) roots++;
            if (Math.abs(x2) <= 1) roots++;
            if (x1 < -1) x1 = x2;
        }

        if (roots === 1) {
            if (h0 < 0) rise = i + x1;
            else set = i + x1;

        } else if (roots === 2) {
            rise = i + (ye < 0 ? x2 : x1);
            set = i + (ye < 0 ? x1 : x2);
        }

        if (rise && set) break;

        h0 = h2;
    }

    var result = {};

    if (rise) result.rise = hoursLater(t, rise);
    if (set) result.set = hoursLater(t, set);

    if (!rise && !set) result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;

    return result;
};


// export as AMD module / Node module / browser variable
if (typeof define === 'function' && define.amd) define(SunCalc);
else if (typeof module !== 'undefined') module.exports = SunCalc;
else window.SunCalc = SunCalc;

}());

},{}],6:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],7:[function(require,module,exports){
'use strict';

var _Writer = require('./modules/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Translater = require('./modules/Translater');

var _Translater2 = _interopRequireDefault(_Translater);

var _RickRolled = require('./modules/RickRolled');

var _RickRolled2 = _interopRequireDefault(_RickRolled);

var _LazyLoader = require('./modules/LazyLoader');

var _LazyLoader2 = _interopRequireDefault(_LazyLoader);

var _ProjectListener = require('./modules/ProjectListener');

var _ProjectListener2 = _interopRequireDefault(_ProjectListener);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _suncalc = require('suncalc');

var SunCalc = _interopRequireWildcard(_suncalc);

var _NightMode = require('./modules/NightMode');

var _NightMode2 = _interopRequireDefault(_NightMode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
//import CursorFriend from './modules/CursorFriend'


var echo = require('echo-js')(document.body);
var introText = 'hi, my name is pi\xE9rre reimertz.\n\ni am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.\nextremely addicted of building things.\n\n$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ ';

var writer = new _Writer2.default(document.querySelectorAll('.writer'), introText);
var translater = new _Translater2.default(document.querySelector('.tre-d'), 10, 10);
var rr = new _RickRolled2.default(5000, true, document.querySelector('all-my-secret-api-keys'));
var ll = new _LazyLoader2.default({ lines: 5,
  throttle: 500,
  checkOnStart: false,
  fakeSlowness: {
    delayBeforeFetch: function delayBeforeFetch() {
      return Math.random() * 3500 + 1000;
    },
    percentageOfImages: 0.3

  }
});

var cF = new _ProjectListener2.default({ selector: '.projects' });
requestAnimationFrame(function () {
  writer.start();
  translater.start();
  rr.start();
  ll.start();
  cF.start();
});

},{"./modules/LazyLoader":8,"./modules/NightMode":9,"./modules/ProjectListener":10,"./modules/RickRolled":11,"./modules/Translater":12,"./modules/Writer":13,"echo-js":1,"es6-promise":2,"isomorphic-fetch":3,"suncalc":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var LazyLoader = function () {
  function LazyLoader(_ref) {
    var _ref$attribute = _ref.attribute,
        attribute = _ref$attribute === undefined ? 'data-lazy' : _ref$attribute,
        _ref$offset = _ref.offset,
        offset = _ref$offset === undefined ? document.body.getBoundingClientRect().height / 2 : _ref$offset,
        _ref$lines = _ref.lines,
        lines = _ref$lines === undefined ? 3 : _ref$lines,
        _ref$throttle = _ref.throttle,
        throttle = _ref$throttle === undefined ? 350 : _ref$throttle,
        _ref$autoStart = _ref.autoStart,
        autoStart = _ref$autoStart === undefined ? true : _ref$autoStart,
        _ref$checkOnStart = _ref.checkOnStart,
        checkOnStart = _ref$checkOnStart === undefined ? true : _ref$checkOnStart,
        _ref$fakeSlowness = _ref.fakeSlowness,
        fakeSlowness = _ref$fakeSlowness === undefined ? false : _ref$fakeSlowness,
        _ref$placeholderImage = _ref.placeholderImages,
        placeholderImages = _ref$placeholderImage === undefined ? [
    /* wide   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvYAAAQAAQMAAACwNI9dAAAAA1BMVEUb/5DUIh99AAAAdUlEQVR42u3BAQ0AAADCoPdP7ewBFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN4APAAGN6DpwAAAAAElFTkSuQmCC',
    /* tall   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=',
    /* square */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='] : _ref$placeholderImage;

    _classCallCheck(this, LazyLoader);

    this.attribute = attribute;
    this.autoStart = autoStart;
    this.checkOnStart = checkOnStart;
    this.offset = offset;
    this.lines = lines;
    this.throttle = throttle;
    this.fakeSlowness = fakeSlowness;
    this.placeholderImages = placeholderImages;

    this._elements = [].slice.call(document.querySelectorAll('[' + this.attribute + ']'));
    this._queue = [];
    this._listener = false;
    this._throttler = false;

    this.onLoad = this.onLoad.bind(this);

    if (this.autoStart) {
      this.start();
    }
  }

  _createClass(LazyLoader, [{
    key: 'start',
    value: function start() {
      var _this = this;

      if (!!this._listener) return;
      if (this.checkOnStart) this.check();

      this._elements.map(function (element) {
        if (!element.src || element.src === '') {
          element.src = _this.placeholderImages[Math.floor(Math.random() * (_this.placeholderImages.length - 1) + 0.5)];
        }
      });

      this._listener = function (event) {
        _this.check();
      };

      document.addEventListener('scroll', this._listener, false);
    }
  }, {
    key: 'stop',
    value: function stop() {
      document.removeEventListener('scroll', this._listener);
      this._listener = false;
      this._throttler = false;
    }
  }, {
    key: 'check',
    value: function check() {
      var _this2 = this;

      if (this._throttler) return;
      if (this._elements.length === 0) return this.stop();

      this._throttler = requestAnimationFrame(function () {
        return setTimeout(function () {
          _this2._throttler = false;

          _this2._elements = _this2._elements.map(function (element) {
            if (element === false) return false;
            if (element.nodeName !== "IMG") return false;

            if (element.getBoundingClientRect().top - _this2.offset < document.body.scrollTop) {
              _this2.queue(element);
              return false;
            } else {
              return element;
            }
          });

          _this2._elements = _this2._elements.filter(function (element) {
            if (element) return element;
          });
        }, _this2.throttle);
      });
    }
  }, {
    key: 'queue',
    value: function queue(element) {
      this._queue.push(element);

      if (this._queue.length <= this.lines) {
        this.load(element);
      }
    }
  }, {
    key: 'load',
    value: function load(element) {
      var _this3 = this;

      this.setStatus(element, 'loading');

      element.addEventListener('load', this.onLoad, false);

      if (!!this.fakeSlowness && Math.random() <= this.fakeSlowness.percentageOfImages) {
        requestAnimationFrame(function () {
          setTimeout(function () {
            element.src = element.getAttribute(_this3.attribute);
          }, _this3.fakeSlowness.delayBeforeFetch());
        });
      } else {
        element.src = element.getAttribute(this.attribute);
      }
    }
  }, {
    key: 'onLoad',
    value: function onLoad(event) {
      var nextElement = void 0;
      var loadedElement = event.target;

      loadedElement.removeEventListener('load', this.onLoad, false);
      this.setStatus(loadedElement, 'loaded');

      this._queue = this._queue.filter(function (queuedElement) {
        if (queuedElement !== loadedElement) return queuedElement;
      });

      nextElement = this._queue.shift();

      if (!!nextElement) this.load(nextElement);
    }
  }, {
    key: 'setStatus',
    value: function setStatus(element, status) {
      element.setAttribute(this.attribute + '-status', status);
    }
  }]);

  return LazyLoader;
}();

exports.default = LazyLoader;

},{}],9:[function(require,module,exports){
'use strict';

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _suncalc = require('suncalc');

var SunCalc = _interopRequireWildcard(_suncalc);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = document.querySelector('html');
var isNightMode = false;

function toggleNightMode(buttonEl) {
  var buttonReplaceArgs = isNightMode ? ['✓', 'x'] : ['x', '✓'];
  var list = html.getAttribute('class');
  var newList = isNightMode ? list.replace('night-mode-on', '') : list + ' night-mode-on';

  html.setAttribute('class', newList);

  buttonEl.innerHTML = buttonEl.innerHTML.replace(buttonReplaceArgs[0], buttonReplaceArgs[1]);

  isNightMode = !isNightMode;
}

(0, _isomorphicFetch2.default)('https://geo-location.api.reimertz.co').then(function (response) {
  return response.json();
}).then(function (json) {
  var now = +new Date();
  var sunset = +new Date(SunCalc.getTimes(+new Date(), json.lat, json.lon).sunset);

  if (now > sunset) toggleNightMode();
});

document.querySelector('[data-night-mode-toggle]').addEventListener('click', function (e) {
  toggleNightMode(e.target);
});

},{"isomorphic-fetch":3,"suncalc":5}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

var ProjectListener = function () {
  function ProjectListener(_ref) {
    var _ref$selector = _ref.selector,
        selector = _ref$selector === undefined ? 'data-cursor-friend' : _ref$selector;

    _classCallCheck(this, ProjectListener);

    this.selector = selector;
    this.element = document.querySelector(selector);

    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  _createClass(ProjectListener, [{
    key: 'start',
    value: function start() {
      if (isMobile) return;
      this.element.addEventListener('mouseover', this.onEnter, false);
      this.element.addEventListener('mouseout', this.onLeave);
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      if (event.target.nodeName !== 'IMG') return;

      document.body.setAttribute('data-project-is-hovered', 'true');
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      document.body.setAttribute('data-project-is-hovered', 'false');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.element.removeEventListener('mouseenter', this.onEnter);
      this.element.removeEventListener('mouseleave', this.onLeave);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.stop();
    }
  }]);

  return ProjectListener;
}();

exports.default = ProjectListener;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var mdRolled = [[".................. ............................... .......,-~~'''''''~~--,,_\n", ".................. ..................................,-~''-,:::::::::::::::::::''-,\n", ".................. .............................,~''::::::::',::::::: :::::::::::::|',\n", ".................. .............................|::::::,-~'''___''''~~--~''':}\n", ".................. .............................'|:::::|: : : : : : : : : : : : : : :|\n", ".................. .............................|:::::|: : :-~~---: : : -----: |\n", ".................. ............................(_''~-': : : :o: : :|: :o: : : :|\n", ".................. .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN\n", ".................. .................................|,: : : : : :-~~--: : ::/ ----- GIVE YOU UHP\n", ".................. ............................,-''\':\: :'~,,_: : : : : _,-'\n", ".................. ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", ".................. .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", ".................. .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", "................../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", "................,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n", ".............,-'';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;',: : :|__|. . .|;;;;;;;;;,';;|\n", "...........,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;;;;;; \. . |:::|. . .'',;;;;;;;;|;;/\n", "........../;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/\n", "......../;;,-';;;;;;;;;;;;;;;;;;;;;;,';;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|\n", "......./;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;'',: |;|. . . . \;;;;;;;|\n", "....,~'';;;;;;;;;; ;;;;;;;;;;;,-'';;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|\n", ",~'';;;;;;;;;;;;;; ;;;;;;;;,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;| |:|. . . . |\;;;;;;;|"], ["................... ............................... .......,-~~'''''''~~--,,_\n", "................... ..................................,-~''-,:::::::::::::::::::''-,\n", "................... .............................,~''::::::::',::::::: :::::::::::::|',\n", "................... .............................|::::::,-~'''___''''~~--~''':}\n", "................... .............................'|:::::|: : : : : : : : : : : : : : :|\n", "................... .............................|:::::|: : :-~~---: : : -----: |\n", "................... ............................(_''~-': : : :o: : :|: :o: : : :|\n", "................... .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN\n", "................... .................................|,: : : : : :-~~--: : ::/ ----- LET U DWN\n", "................... ............................,-''\':\: :'~,,_: : : : : _,-'\n", "................... ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", "................... .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", "................... .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", ".................../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", ".................,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n", "..............,-'';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;',: : :|__|. . .|;;;;;;;;;,';;|\n", "............,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;;;;;; \. . |:::|. . .'',;;;;;;;;|;;/\n", ".........../;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/\n", "........./;;,-';;;;;;;;;;;;;;;;;;;;;;,';;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|\n", "......../;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;'',: |;|. . . . \;;;;;;;|\n", ".....,~'';;;;;;;;;; ;;;;;;;;;;;,-'';;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|\n", ".,~'';;;;;;;;;;;;;; ;;;;;;;;,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;| |:|. . . . |\;;;;;;;|"], ["............... ............................... .......,-~~'''''''~~--,,_\n", "............... ..................................,-~''-,:::::::::::::::::::''-,\n", "............... .............................,~''::::::::',::::::: :::::::::::::|',\n", "............... .............................|::::::,-~'''___''''~~--~''':}\n", "............... .............................'|:::::|: : : : : : : : : : : : : : :|\n", "............... .............................|:::::|: : :-~~---: : : -----: |\n", "............... ............................(_''~-': : : :o: : :|: :o: : : :|\n", "............... .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN TURN AHROUND\n", "............... .................................|,: : : : : :-~~--: : ::/ ----- AND DESERT U\n", "............... ............................,-''\':\: :'~,,_: : : : : _,-'\n", "............... ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", "............... .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", "............... .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", ".............../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", ".............,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n"]];

var RickRolled = function () {
  function RickRolled(delay, shouldHide, element) {
    _classCallCheck(this, RickRolled);

    if (element) this.el = element;else {
      this.el = document.currentScript.parentNode;
    }

    this.index = 0;
    this.delay = delay || 3000;
    this.interval = false;
    this.shouldHide = shouldHide || false;
  }

  _createClass(RickRolled, [{
    key: "swap",
    value: function swap() {
      this.index = (this.index + 1) % mdRolled.length;

      this.el.innerHTML = '';
      this.el.innerHTML = mdRolled[this.index];

      if (this.printToConsole) console.log(mdRolled[this.index]);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      if (this.interval) return;

      if (this.shouldHide) this.el.style.display = 'none';

      this.timeout = requestAnimationFrame(function () {
        return setTimeout(function () {
          _this.swap();
        }, _this.delay);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.interval) return;
      clearInterval(this.interval);
      this.interval = false;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.stop();
    }
  }]);

  return RickRolled;
}();

exports.default = RickRolled;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

var Translater = function () {
  function Translater(element, xRotation, yRotation) {
    _classCallCheck(this, Translater);

    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.el = element;
    this.frame = false;
    this.processingEvent = false;
    this.moveEvent = isMobile ? 'touchmove' : 'mousemove';

    this.handleScroll = this.handleScroll.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  _createClass(Translater, [{
    key: 'handleScroll',
    value: function handleScroll(scrollY) {
      var scrolledPercentage = scrollY / document.body.getBoundingClientRect().height * this.xRotation,
          x = scrolledPercentage / 2 - this.xRotation,
          y = this.yRotation - scrolledPercentage;

      this.el.style.transform = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
      this.processingEvent = false;
    }
  }, {
    key: 'handleMove',
    value: function handleMove(clientX, clientY) {
      var x = (1 - clientY / window.innerHeight) * -1 * this.xRotation,
          y = clientX / window.innerWidth * this.yRotation;

      this.el.style.transform = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
      this.processingEvent = false;
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(event) {
      var _this = this;

      if (this.processingEvent) return;

      this.processingEvent = true;

      requestAnimationFrame(function () {
        if (isMobile) _this.handleScroll(window.scrollY);else _this.handleMove(event.clientX, event.clientY);
      });
    }
  }, {
    key: 'start',
    value: function start() {
      document.body.addEventListener(this.moveEvent, this.handleEvent);
    }
  }, {
    key: 'stop',
    value: function stop() {
      document.body.removeEventListener(this.moveEvent, this.handleEvent);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.stop();
    }
  }]);

  return Translater;
}();

exports.default = Translater;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var timeoutMap = new Map();
timeoutMap.set('#', 50 / 2); //delete
timeoutMap.set('@', 250 / 2); //pause
timeoutMap.set(',', 350 / 2);
timeoutMap.set('-', 350 / 2);
timeoutMap.set('.', 500 / 2);
timeoutMap.set('?', 750 / 2);

var Writer = function () {
  function Writer(elements, string) {
    _classCallCheck(this, Writer);

    this.el = elements;
    this.s = string;
    this.isWritingLink = false;
  }

  _createClass(Writer, [{
    key: 'updateWriters',
    value: function updateWriters(character) {
      var _this = this;

      [].forEach.call(this.el, function (element) {
        var oldElement = element;
        element = _this.isWritingLink ? element.querySelector('a:last-child') : element;

        if (character === '@') return;else if (character === '#') {
          element.innerHTML = element.innerHTML.slice(0, -1);
          if (oldElement.getAttribute('three-d-text').length > 0) {
            oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text').slice(0, -1));
          }
        } else if (character === '*') {
          element.innerHTML += '<br>';
          oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + '\a');
        } else if (character === '$') {
          if (!_this.isWritingLink) {
            var link = document.createElement("a");

            link.href = _this.s.split('$')[0];
            link.target = '_blank';

            element.appendChild(link);

            _this.isWritingLink = true;
            _this.s = _this.s.substring(_this.s.split('$')[0].length + 1, _this.s.length);
          } else {
            _this.isWritingLink = false;
          }
        } else {
          element.innerHTML += character;
          oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + character);
        }
      });
    }
  }, {
    key: 'writer',
    value: function writer(beQuick) {
      var _this2 = this;

      var text = void 0,
          msDelay = void 0;

      if (this.s.length === 0) return this.isDone();

      text = this.s.substring(0, 1);
      this.s = this.s.substring(1, this.s.length);
      this.updateWriters(text);

      if (beQuick) return this.writer(true);

      msDelay = timeoutMap.get(text) || Math.random() * 150;

      return requestAnimationFrame(function () {
        setTimeout(function () {
          _this2.writer();
        }, msDelay);
      });
    }
  }, {
    key: 'updateLastRead',
    value: function updateLastRead() {
      localStorage.setItem('read-everything-at', Date.now());
    }
  }, {
    key: 'isDone',
    value: function isDone() {
      document.body.classList.add('intro-is-done');
      this.updateLastRead();
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.getLastRead + 5000 < Date.now()) {
        this.updateLastRead();
        this.writer(true);
        this.isDone();
      } else {
        this.writer();
      }
    }
  }, {
    key: 'getLastRead',
    get: function get() {
      return parseInt(localStorage.getItem('read-everything-at'));
    }
  }]);

  return Writer;
}();

exports.default = Writer;

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtZmV0Y2gvZmV0Y2gtbnBtLWJyb3dzZXJpZnkuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3N1bmNhbGMvc3VuY2FsYy5qcyIsIm5vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCJzcmMvc2NyaXB0cy9tYWluLWhvbWUuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL0xhenlMb2FkZXIuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL05pZ2h0TW9kZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUHJvamVjdExpc3RlbmVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9SaWNrUm9sbGVkLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9UcmFuc2xhdGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9Xcml0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzU4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL2FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztB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QUFzQixZQUFNO0FBQ2pDLG1CQUFXLFlBQU07QUFBQyxpQkFBSyxNQUFMO0FBQWMsU0FBaEMsRUFBa0MsT0FBbEM7QUFDRCxPQUZNLENBQVA7QUFJRDs7O3FDQUVnQjtBQUNmLG1CQUFhLE9BQWIsQ0FBcUIsb0JBQXJCLEVBQTJDLEtBQUssR0FBTCxFQUEzQztBQUNEOzs7NkJBTVE7QUFDUCxlQUFTLElBQVQsQ0FBYyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLGVBQTVCO0FBQ0EsV0FBSyxjQUFMO0FBQ0Q7Ozs0QkFFTztBQUNOLFVBQUssS0FBSyxXQUFMLEdBQW1CLElBQXBCLEdBQTRCLEtBQUssR0FBTCxFQUFoQyxFQUE0QztBQUMxQyxhQUFLLGNBQUw7QUFDQSxhQUFLLE1BQUwsQ0FBWSxJQUFaO0FBQ0EsYUFBSyxNQUFMO0FBQ0QsT0FKRCxNQUtLO0FBQ0gsYUFBSyxNQUFMO0FBQ0Q7QUFDRjs7O3dCQWxCaUI7QUFDaEIsYUFBTyxTQUFTLGFBQWEsT0FBYixDQUFxQixvQkFBckIsQ0FBVCxDQUFQO0FBQ0Q7Ozs7OztrQkE1RWtCLE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShyb290KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5lY2hvID0gZmFjdG9yeShyb290KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKHJvb3QpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGVjaG8gPSB7fTtcblxuICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgb2Zmc2V0LCBwb2xsLCBkZWxheSwgdXNlRGVib3VuY2UsIHVubG9hZDtcblxuICB2YXIgaXNIaWRkZW4gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAoZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGwpO1xuICB9O1xuICBcbiAgdmFyIGluVmlldyA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3KSB7XG4gICAgaWYgKGlzSGlkZGVuKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGJveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChib3gucmlnaHQgPj0gdmlldy5sICYmIGJveC5ib3R0b20gPj0gdmlldy50ICYmIGJveC5sZWZ0IDw9IHZpZXcuciAmJiBib3gudG9wIDw9IHZpZXcuYik7XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlT3JUaHJvdHRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdXNlRGVib3VuY2UgJiYgISFwb2xsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgICBwb2xsID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZWNoby5yZW5kZXIoKTtcbiAgICAgIHBvbGwgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICBlY2hvLmluaXQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHZhciBvZmZzZXRBbGwgPSBvcHRzLm9mZnNldCB8fCAwO1xuICAgIHZhciBvZmZzZXRWZXJ0aWNhbCA9IG9wdHMub2Zmc2V0VmVydGljYWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvZmZzZXRIb3Jpem9udGFsID0gb3B0cy5vZmZzZXRIb3Jpem9udGFsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb3B0aW9uVG9JbnQgPSBmdW5jdGlvbiAob3B0LCBmYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KG9wdCB8fCBmYWxsYmFjaywgMTApO1xuICAgIH07XG4gICAgb2Zmc2V0ID0ge1xuICAgICAgdDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRUb3AsIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0Qm90dG9tLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBsOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldExlZnQsIG9mZnNldEhvcml6b250YWwpLFxuICAgICAgcjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRSaWdodCwgb2Zmc2V0SG9yaXpvbnRhbClcbiAgICB9O1xuICAgIGRlbGF5ID0gb3B0aW9uVG9JbnQob3B0cy50aHJvdHRsZSwgMjUwKTtcbiAgICB1c2VEZWJvdW5jZSA9IG9wdHMuZGVib3VuY2UgIT09IGZhbHNlO1xuICAgIHVubG9hZCA9ICEhb3B0cy51bmxvYWQ7XG4gICAgY2FsbGJhY2sgPSBvcHRzLmNhbGxiYWNrIHx8IGNhbGxiYWNrO1xuICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25sb2FkJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtZWNob10sIFtkYXRhLWVjaG8tYmFja2dyb3VuZF0nKTtcbiAgICB2YXIgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAgIHZhciBzcmMsIGVsZW07XG4gICAgdmFyIHZpZXcgPSB7XG4gICAgICBsOiAwIC0gb2Zmc2V0LmwsXG4gICAgICB0OiAwIC0gb2Zmc2V0LnQsXG4gICAgICBiOiAocm9vdC5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSArIG9mZnNldC5iLFxuICAgICAgcjogKHJvb3QuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpICsgb2Zmc2V0LnJcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZW0gPSBub2Rlc1tpXTtcbiAgICAgIGlmIChpblZpZXcoZWxlbSwgdmlldykpIHtcblxuICAgICAgICBpZiAodW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicsIGVsZW0uc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlbGVtLCAnbG9hZCcpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodW5sb2FkICYmICEhKHNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKSkpIHtcblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgc3JjICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBzcmM7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICd1bmxvYWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIGVjaG8uZGV0YWNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8uZGV0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuZGV0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICB9O1xuXG4gIHJldHVybiBlY2hvO1xuXG59KTtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qYWtlYXJjaGliYWxkL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDIuMy4wXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheSA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXk7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPSAwO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkdG9TdHJpbmcgPSB7fS50b1N0cmluZztcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICsgMV0gPSBhcmc7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXAoYXNhcEZuKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcCA9IGFzYXBGbjtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc05vZGUgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gbm9kZVxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpIHtcbiAgICAgIHZhciBuZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gICAgICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgICAgIC8vIHNldEltbWVkaWF0ZSBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIGluc3RlYWRcbiAgICAgIHZhciB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlLm1hdGNoKC9eKD86KFxcZCspXFwuKT8oPzooXFxkKylcXC4pPyhcXCp8XFxkKykkLyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2ZXJzaW9uKSAmJiB2ZXJzaW9uWzFdID09PSAnMCcgJiYgdmVyc2lvblsyXSA9PT0gJzEwJykge1xuICAgICAgICBuZXh0VGljayA9IHNldEltbWVkaWF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbmV4dFRpY2sobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdmVydHhcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dChsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2ViIHdvcmtlclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaDtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCwgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuOyBpKz0yKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpXTtcbiAgICAgICAgdmFyIGFyZyA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpKzFdO1xuXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2g7XG4gICAgLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbiAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzTm9kZSkge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTmV4dFRpY2soKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXR0ZW1wdFZlcnRleCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCgpIHt9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQgPSAxO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCAgPSAyO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzZWxmRnVsbGZpbGxtZW50KCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpIHtcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpIHtcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRoZW4gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKG1heWJlVGhlbmFibGUpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGxmaWxsbWVudCgpKTtcbiAgICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICAgICAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICAgICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cblxuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRDtcblxuICAgICAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHsgcmV0dXJuOyB9XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEO1xuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgbGVuZ3RoID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gICAgICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEXSAgPSBvblJlamVjdGlvbjtcblxuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKSB7XG4gICAgICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgICAgIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgIHZhciBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCkge1xuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICAgICAgcmV0dXJuIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB2YXIgaGFzQ2FsbGJhY2sgPSBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgICAgIHZhbHVlLCBlcnJvciwgc3VjY2VlZGVkLCBmYWlsZWQ7XG5cbiAgICAgIGlmIChoYXNDYWxsYmFjaykge1xuICAgICAgICB2YWx1ZSA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAvLyBub29wXG4gICAgICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpe1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGVudW1lcmF0b3IuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIGVudW1lcmF0b3IucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcblxuICAgICAgaWYgKGVudW1lcmF0b3IuX3ZhbGlkYXRlSW5wdXQoaW5wdXQpKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX2lucHV0ICAgICA9IGlucHV0O1xuICAgICAgICBlbnVtZXJhdG9yLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgIGVudW1lcmF0b3IuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICBlbnVtZXJhdG9yLl9pbml0KCk7XG5cbiAgICAgICAgaWYgKGVudW1lcmF0b3IubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChlbnVtZXJhdG9yLnByb21pc2UsIGVudW1lcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW51bWVyYXRvci5sZW5ndGggPSBlbnVtZXJhdG9yLmxlbmd0aCB8fCAwO1xuICAgICAgICAgIGVudW1lcmF0b3IuX2VudW1lcmF0ZSgpO1xuICAgICAgICAgIGlmIChlbnVtZXJhdG9yLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KGVudW1lcmF0b3IucHJvbWlzZSwgZW51bWVyYXRvci5fdmFsaWRhdGlvbkVycm9yKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5KGlucHV0KTtcbiAgICB9O1xuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG4gICAgfTtcblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgdmFyIGxlbmd0aCAgPSBlbnVtZXJhdG9yLmxlbmd0aDtcbiAgICAgIHZhciBwcm9taXNlID0gZW51bWVyYXRvci5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgPSBlbnVtZXJhdG9yLl9pbnB1dDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBlbnVtZXJhdG9yLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG4gICAgICB2YXIgYyA9IGVudW1lcmF0b3IuX2luc3RhbmNlQ29uc3RydWN0b3I7XG5cbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZShlbnRyeSkpIHtcbiAgICAgICAgaWYgKGVudHJ5LmNvbnN0cnVjdG9yID09PSBjICYmIGVudHJ5Ll9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAgIGVudHJ5Ll9vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnVtZXJhdG9yLl93aWxsU2V0dGxlQXQoYy5yZXNvbHZlKGVudHJ5KSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3JlbWFpbmluZy0tO1xuICAgICAgICBlbnVtZXJhdG9yLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbihzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gZW51bWVyYXRvci5wcm9taXNlO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nLS07XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW51bWVyYXRvci5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVudW1lcmF0b3IuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIGVudW1lcmF0b3IuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVELCBpLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGFsbChlbnRyaWVzKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRkZWZhdWx0KHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGFsbDtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRyYWNlKGVudHJpZXMpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcblxuICAgICAgaWYgKCFsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkoZW50cmllcykpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG5cbiAgICAgIGZ1bmN0aW9uIG9uRnVsZmlsbG1lbnQodmFsdWUpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uUmVqZWN0aW9uKHJlYXNvbikge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUoQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKSwgdW5kZWZpbmVkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZShvYmplY3QpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0KHJlYXNvbikge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlO1xuICAgIC8qKlxuICAgICAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICAgICAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgICAgIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICAgICAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIFRlcm1pbm9sb2d5XG4gICAgICAtLS0tLS0tLS0tLVxuXG4gICAgICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAgICAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAgICAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAgICAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gICAgICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gICAgICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICAgICAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gICAgICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICAgICAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICAgICAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgICAgIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICAgICAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICAgICAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gICAgICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gICAgICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gICAgICBCYXNpYyBVc2FnZTpcbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBgYGBqc1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgLy8gb24gc3VjY2Vzc1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgICAgICAvLyBvbiBmYWlsdXJlXG4gICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgfSk7XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAvLyBvbiBmdWxmaWxsbWVudFxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIG9uIHJlamVjdGlvblxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgVXNhZ2U6XG4gICAgICAtLS0tLS0tLS0tLS0tLS1cblxuICAgICAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICAgICAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gICAgICBgYGBqc1xuICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICAgICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgICAgIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICAgICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgICAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBjbGFzcyBQcm9taXNlXG4gICAgICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQGNvbnN0cnVjdG9yXG4gICAgKi9cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZShyZXNvbHZlcikge1xuICAgICAgdGhpcy5faWQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkY291bnRlcisrO1xuICAgICAgdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICAgICAgaWYgKCFsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24ocmVzb2x2ZXIpKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZSkpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5hbGwgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVqZWN0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyO1xuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRBc2FwID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXA7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX2FzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcDtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgICAgIGNvbnN0cnVjdG9yOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZSxcblxuICAgIC8qKlxuICAgICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIENoYWluaW5nXG4gICAgICAtLS0tLS0tLVxuXG4gICAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICAgIH0pO1xuXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgICB9KTtcbiAgICAgIGBgYFxuICAgICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQXNzaW1pbGF0aW9uXG4gICAgICAtLS0tLS0tLS0tLS1cblxuICAgICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIGF1dGhvciwgYm9va3M7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuXG4gICAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG5cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcblxuICAgICAgfVxuXG4gICAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRBdXRob3IoKS5cbiAgICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCB0aGVuXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQgJiYgIW9uRnVsZmlsbG1lbnQgfHwgc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEICYmICFvblJlamVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgIHZhciByZXN1bHQgPSBwYXJlbnQuX3Jlc3VsdDtcblxuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbc3RhdGUgLSAxXTtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcmVzdWx0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfSxcblxuICAgIC8qKlxuICAgICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHN5bmNocm9ub3VzXG4gICAgICB0cnkge1xuICAgICAgICBmaW5kQXV0aG9yKCk7XG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfVxuXG4gICAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgY2F0Y2hcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkcG9seWZpbGwoKSB7XG4gICAgICB2YXIgbG9jYWw7XG5cbiAgICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICAgIGlmIChQICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSkgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9jYWwuUHJvbWlzZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0O1xuICAgIH1cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbDtcblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlID0ge1xuICAgICAgJ1Byb21pc2UnOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCxcbiAgICAgICdwb2x5ZmlsbCc6IGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdFxuICAgIH07XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbGliJGVzNiRwcm9taXNlJHVtZCQkRVM2UHJvbWlzZTsgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGVbJ2V4cG9ydHMnXSkge1xuICAgICAgbW9kdWxlWydleHBvcnRzJ10gPSBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzWydFUzZQcm9taXNlJ10gPSBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlO1xuICAgIH1cblxuICAgIGxpYiRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdCgpO1xufSkuY2FsbCh0aGlzKTtcblxuIiwiLy8gdGhlIHdoYXR3Zy1mZXRjaCBwb2x5ZmlsbCBpbnN0YWxscyB0aGUgZmV0Y2goKSBmdW5jdGlvblxuLy8gb24gdGhlIGdsb2JhbCBvYmplY3QgKHdpbmRvdyBvciBzZWxmKVxuLy9cbi8vIFJldHVybiB0aGF0IGFzIHRoZSBleHBvcnQgZm9yIHVzZSBpbiBXZWJwYWNrLCBCcm93c2VyaWZ5IGV0Yy5cbnJlcXVpcmUoJ3doYXR3Zy1mZXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBzZWxmLmZldGNoLmJpbmQoc2VsZik7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLypcbiAoYykgMjAxMS0yMDE1LCBWbGFkaW1pciBBZ2Fmb25raW5cbiBTdW5DYWxjIGlzIGEgSmF2YVNjcmlwdCBsaWJyYXJ5IGZvciBjYWxjdWxhdGluZyBzdW4vbW9vbiBwb3NpdGlvbiBhbmQgbGlnaHQgcGhhc2VzLlxuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3VybmVyL3N1bmNhbGNcbiovXG5cbihmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gc2hvcnRjdXRzIGZvciBlYXNpZXIgdG8gcmVhZCBmb3JtdWxhc1xuXG52YXIgUEkgICA9IE1hdGguUEksXG4gICAgc2luICA9IE1hdGguc2luLFxuICAgIGNvcyAgPSBNYXRoLmNvcyxcbiAgICB0YW4gID0gTWF0aC50YW4sXG4gICAgYXNpbiA9IE1hdGguYXNpbixcbiAgICBhdGFuID0gTWF0aC5hdGFuMixcbiAgICBhY29zID0gTWF0aC5hY29zLFxuICAgIHJhZCAgPSBQSSAvIDE4MDtcblxuLy8gc3VuIGNhbGN1bGF0aW9ucyBhcmUgYmFzZWQgb24gaHR0cDovL2FhLnF1YWUubmwvZW4vcmVrZW4vem9ucG9zaXRpZS5odG1sIGZvcm11bGFzXG5cblxuLy8gZGF0ZS90aW1lIGNvbnN0YW50cyBhbmQgY29udmVyc2lvbnNcblxudmFyIGRheU1zID0gMTAwMCAqIDYwICogNjAgKiAyNCxcbiAgICBKMTk3MCA9IDI0NDA1ODgsXG4gICAgSjIwMDAgPSAyNDUxNTQ1O1xuXG5mdW5jdGlvbiB0b0p1bGlhbihkYXRlKSB7IHJldHVybiBkYXRlLnZhbHVlT2YoKSAvIGRheU1zIC0gMC41ICsgSjE5NzA7IH1cbmZ1bmN0aW9uIGZyb21KdWxpYW4oaikgIHsgcmV0dXJuIG5ldyBEYXRlKChqICsgMC41IC0gSjE5NzApICogZGF5TXMpOyB9XG5mdW5jdGlvbiB0b0RheXMoZGF0ZSkgICB7IHJldHVybiB0b0p1bGlhbihkYXRlKSAtIEoyMDAwOyB9XG5cblxuLy8gZ2VuZXJhbCBjYWxjdWxhdGlvbnMgZm9yIHBvc2l0aW9uXG5cbnZhciBlID0gcmFkICogMjMuNDM5NzsgLy8gb2JsaXF1aXR5IG9mIHRoZSBFYXJ0aFxuXG5mdW5jdGlvbiByaWdodEFzY2Vuc2lvbihsLCBiKSB7IHJldHVybiBhdGFuKHNpbihsKSAqIGNvcyhlKSAtIHRhbihiKSAqIHNpbihlKSwgY29zKGwpKTsgfVxuZnVuY3Rpb24gZGVjbGluYXRpb24obCwgYikgICAgeyByZXR1cm4gYXNpbihzaW4oYikgKiBjb3MoZSkgKyBjb3MoYikgKiBzaW4oZSkgKiBzaW4obCkpOyB9XG5cbmZ1bmN0aW9uIGF6aW11dGgoSCwgcGhpLCBkZWMpICB7IHJldHVybiBhdGFuKHNpbihIKSwgY29zKEgpICogc2luKHBoaSkgLSB0YW4oZGVjKSAqIGNvcyhwaGkpKTsgfVxuZnVuY3Rpb24gYWx0aXR1ZGUoSCwgcGhpLCBkZWMpIHsgcmV0dXJuIGFzaW4oc2luKHBoaSkgKiBzaW4oZGVjKSArIGNvcyhwaGkpICogY29zKGRlYykgKiBjb3MoSCkpOyB9XG5cbmZ1bmN0aW9uIHNpZGVyZWFsVGltZShkLCBsdykgeyByZXR1cm4gcmFkICogKDI4MC4xNiArIDM2MC45ODU2MjM1ICogZCkgLSBsdzsgfVxuXG5cbi8vIGdlbmVyYWwgc3VuIGNhbGN1bGF0aW9uc1xuXG5mdW5jdGlvbiBzb2xhck1lYW5Bbm9tYWx5KGQpIHsgcmV0dXJuIHJhZCAqICgzNTcuNTI5MSArIDAuOTg1NjAwMjggKiBkKTsgfVxuXG5mdW5jdGlvbiBlY2xpcHRpY0xvbmdpdHVkZShNKSB7XG5cbiAgICB2YXIgQyA9IHJhZCAqICgxLjkxNDggKiBzaW4oTSkgKyAwLjAyICogc2luKDIgKiBNKSArIDAuMDAwMyAqIHNpbigzICogTSkpLCAvLyBlcXVhdGlvbiBvZiBjZW50ZXJcbiAgICAgICAgUCA9IHJhZCAqIDEwMi45MzcyOyAvLyBwZXJpaGVsaW9uIG9mIHRoZSBFYXJ0aFxuXG4gICAgcmV0dXJuIE0gKyBDICsgUCArIFBJO1xufVxuXG5mdW5jdGlvbiBzdW5Db29yZHMoZCkge1xuXG4gICAgdmFyIE0gPSBzb2xhck1lYW5Bbm9tYWx5KGQpLFxuICAgICAgICBMID0gZWNsaXB0aWNMb25naXR1ZGUoTSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBkZWM6IGRlY2xpbmF0aW9uKEwsIDApLFxuICAgICAgICByYTogcmlnaHRBc2NlbnNpb24oTCwgMClcbiAgICB9O1xufVxuXG5cbnZhciBTdW5DYWxjID0ge307XG5cblxuLy8gY2FsY3VsYXRlcyBzdW4gcG9zaXRpb24gZm9yIGEgZ2l2ZW4gZGF0ZSBhbmQgbGF0aXR1ZGUvbG9uZ2l0dWRlXG5cblN1bkNhbGMuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoZGF0ZSwgbGF0LCBsbmcpIHtcblxuICAgIHZhciBsdyAgPSByYWQgKiAtbG5nLFxuICAgICAgICBwaGkgPSByYWQgKiBsYXQsXG4gICAgICAgIGQgICA9IHRvRGF5cyhkYXRlKSxcblxuICAgICAgICBjICA9IHN1bkNvb3JkcyhkKSxcbiAgICAgICAgSCAgPSBzaWRlcmVhbFRpbWUoZCwgbHcpIC0gYy5yYTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGF6aW11dGg6IGF6aW11dGgoSCwgcGhpLCBjLmRlYyksXG4gICAgICAgIGFsdGl0dWRlOiBhbHRpdHVkZShILCBwaGksIGMuZGVjKVxuICAgIH07XG59O1xuXG5cbi8vIHN1biB0aW1lcyBjb25maWd1cmF0aW9uIChhbmdsZSwgbW9ybmluZyBuYW1lLCBldmVuaW5nIG5hbWUpXG5cbnZhciB0aW1lcyA9IFN1bkNhbGMudGltZXMgPSBbXG4gICAgWy0wLjgzMywgJ3N1bnJpc2UnLCAgICAgICAnc3Vuc2V0JyAgICAgIF0sXG4gICAgWyAgLTAuMywgJ3N1bnJpc2VFbmQnLCAgICAnc3Vuc2V0U3RhcnQnIF0sXG4gICAgWyAgICAtNiwgJ2Rhd24nLCAgICAgICAgICAnZHVzaycgICAgICAgIF0sXG4gICAgWyAgIC0xMiwgJ25hdXRpY2FsRGF3bicsICAnbmF1dGljYWxEdXNrJ10sXG4gICAgWyAgIC0xOCwgJ25pZ2h0RW5kJywgICAgICAnbmlnaHQnICAgICAgIF0sXG4gICAgWyAgICAgNiwgJ2dvbGRlbkhvdXJFbmQnLCAnZ29sZGVuSG91cicgIF1cbl07XG5cbi8vIGFkZHMgYSBjdXN0b20gdGltZSB0byB0aGUgdGltZXMgY29uZmlnXG5cblN1bkNhbGMuYWRkVGltZSA9IGZ1bmN0aW9uIChhbmdsZSwgcmlzZU5hbWUsIHNldE5hbWUpIHtcbiAgICB0aW1lcy5wdXNoKFthbmdsZSwgcmlzZU5hbWUsIHNldE5hbWVdKTtcbn07XG5cblxuLy8gY2FsY3VsYXRpb25zIGZvciBzdW4gdGltZXNcblxudmFyIEowID0gMC4wMDA5O1xuXG5mdW5jdGlvbiBqdWxpYW5DeWNsZShkLCBsdykgeyByZXR1cm4gTWF0aC5yb3VuZChkIC0gSjAgLSBsdyAvICgyICogUEkpKTsgfVxuXG5mdW5jdGlvbiBhcHByb3hUcmFuc2l0KEh0LCBsdywgbikgeyByZXR1cm4gSjAgKyAoSHQgKyBsdykgLyAoMiAqIFBJKSArIG47IH1cbmZ1bmN0aW9uIHNvbGFyVHJhbnNpdEooZHMsIE0sIEwpICB7IHJldHVybiBKMjAwMCArIGRzICsgMC4wMDUzICogc2luKE0pIC0gMC4wMDY5ICogc2luKDIgKiBMKTsgfVxuXG5mdW5jdGlvbiBob3VyQW5nbGUoaCwgcGhpLCBkKSB7IHJldHVybiBhY29zKChzaW4oaCkgLSBzaW4ocGhpKSAqIHNpbihkKSkgLyAoY29zKHBoaSkgKiBjb3MoZCkpKTsgfVxuXG4vLyByZXR1cm5zIHNldCB0aW1lIGZvciB0aGUgZ2l2ZW4gc3VuIGFsdGl0dWRlXG5mdW5jdGlvbiBnZXRTZXRKKGgsIGx3LCBwaGksIGRlYywgbiwgTSwgTCkge1xuXG4gICAgdmFyIHcgPSBob3VyQW5nbGUoaCwgcGhpLCBkZWMpLFxuICAgICAgICBhID0gYXBwcm94VHJhbnNpdCh3LCBsdywgbik7XG4gICAgcmV0dXJuIHNvbGFyVHJhbnNpdEooYSwgTSwgTCk7XG59XG5cblxuLy8gY2FsY3VsYXRlcyBzdW4gdGltZXMgZm9yIGEgZ2l2ZW4gZGF0ZSBhbmQgbGF0aXR1ZGUvbG9uZ2l0dWRlXG5cblN1bkNhbGMuZ2V0VGltZXMgPSBmdW5jdGlvbiAoZGF0ZSwgbGF0LCBsbmcpIHtcblxuICAgIHZhciBsdyA9IHJhZCAqIC1sbmcsXG4gICAgICAgIHBoaSA9IHJhZCAqIGxhdCxcblxuICAgICAgICBkID0gdG9EYXlzKGRhdGUpLFxuICAgICAgICBuID0ganVsaWFuQ3ljbGUoZCwgbHcpLFxuICAgICAgICBkcyA9IGFwcHJveFRyYW5zaXQoMCwgbHcsIG4pLFxuXG4gICAgICAgIE0gPSBzb2xhck1lYW5Bbm9tYWx5KGRzKSxcbiAgICAgICAgTCA9IGVjbGlwdGljTG9uZ2l0dWRlKE0pLFxuICAgICAgICBkZWMgPSBkZWNsaW5hdGlvbihMLCAwKSxcblxuICAgICAgICBKbm9vbiA9IHNvbGFyVHJhbnNpdEooZHMsIE0sIEwpLFxuXG4gICAgICAgIGksIGxlbiwgdGltZSwgSnNldCwgSnJpc2U7XG5cblxuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHNvbGFyTm9vbjogZnJvbUp1bGlhbihKbm9vbiksXG4gICAgICAgIG5hZGlyOiBmcm9tSnVsaWFuKEpub29uIC0gMC41KVxuICAgIH07XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aW1lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICB0aW1lID0gdGltZXNbaV07XG5cbiAgICAgICAgSnNldCA9IGdldFNldEoodGltZVswXSAqIHJhZCwgbHcsIHBoaSwgZGVjLCBuLCBNLCBMKTtcbiAgICAgICAgSnJpc2UgPSBKbm9vbiAtIChKc2V0IC0gSm5vb24pO1xuXG4gICAgICAgIHJlc3VsdFt0aW1lWzFdXSA9IGZyb21KdWxpYW4oSnJpc2UpO1xuICAgICAgICByZXN1bHRbdGltZVsyXV0gPSBmcm9tSnVsaWFuKEpzZXQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8vIG1vb24gY2FsY3VsYXRpb25zLCBiYXNlZCBvbiBodHRwOi8vYWEucXVhZS5ubC9lbi9yZWtlbi9oZW1lbHBvc2l0aWUuaHRtbCBmb3JtdWxhc1xuXG5mdW5jdGlvbiBtb29uQ29vcmRzKGQpIHsgLy8gZ2VvY2VudHJpYyBlY2xpcHRpYyBjb29yZGluYXRlcyBvZiB0aGUgbW9vblxuXG4gICAgdmFyIEwgPSByYWQgKiAoMjE4LjMxNiArIDEzLjE3NjM5NiAqIGQpLCAvLyBlY2xpcHRpYyBsb25naXR1ZGVcbiAgICAgICAgTSA9IHJhZCAqICgxMzQuOTYzICsgMTMuMDY0OTkzICogZCksIC8vIG1lYW4gYW5vbWFseVxuICAgICAgICBGID0gcmFkICogKDkzLjI3MiArIDEzLjIyOTM1MCAqIGQpLCAgLy8gbWVhbiBkaXN0YW5jZVxuXG4gICAgICAgIGwgID0gTCArIHJhZCAqIDYuMjg5ICogc2luKE0pLCAvLyBsb25naXR1ZGVcbiAgICAgICAgYiAgPSByYWQgKiA1LjEyOCAqIHNpbihGKSwgICAgIC8vIGxhdGl0dWRlXG4gICAgICAgIGR0ID0gMzg1MDAxIC0gMjA5MDUgKiBjb3MoTSk7ICAvLyBkaXN0YW5jZSB0byB0aGUgbW9vbiBpbiBrbVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmE6IHJpZ2h0QXNjZW5zaW9uKGwsIGIpLFxuICAgICAgICBkZWM6IGRlY2xpbmF0aW9uKGwsIGIpLFxuICAgICAgICBkaXN0OiBkdFxuICAgIH07XG59XG5cblN1bkNhbGMuZ2V0TW9vblBvc2l0aW9uID0gZnVuY3Rpb24gKGRhdGUsIGxhdCwgbG5nKSB7XG5cbiAgICB2YXIgbHcgID0gcmFkICogLWxuZyxcbiAgICAgICAgcGhpID0gcmFkICogbGF0LFxuICAgICAgICBkICAgPSB0b0RheXMoZGF0ZSksXG5cbiAgICAgICAgYyA9IG1vb25Db29yZHMoZCksXG4gICAgICAgIEggPSBzaWRlcmVhbFRpbWUoZCwgbHcpIC0gYy5yYSxcbiAgICAgICAgaCA9IGFsdGl0dWRlKEgsIHBoaSwgYy5kZWMpO1xuXG4gICAgLy8gYWx0aXR1ZGUgY29ycmVjdGlvbiBmb3IgcmVmcmFjdGlvblxuICAgIGggPSBoICsgcmFkICogMC4wMTcgLyB0YW4oaCArIHJhZCAqIDEwLjI2IC8gKGggKyByYWQgKiA1LjEwKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhemltdXRoOiBhemltdXRoKEgsIHBoaSwgYy5kZWMpLFxuICAgICAgICBhbHRpdHVkZTogaCxcbiAgICAgICAgZGlzdGFuY2U6IGMuZGlzdFxuICAgIH07XG59O1xuXG5cbi8vIGNhbGN1bGF0aW9ucyBmb3IgaWxsdW1pbmF0aW9uIHBhcmFtZXRlcnMgb2YgdGhlIG1vb24sXG4vLyBiYXNlZCBvbiBodHRwOi8vaWRsYXN0cm8uZ3NmYy5uYXNhLmdvdi9mdHAvcHJvL2FzdHJvL21waGFzZS5wcm8gZm9ybXVsYXMgYW5kXG4vLyBDaGFwdGVyIDQ4IG9mIFwiQXN0cm9ub21pY2FsIEFsZ29yaXRobXNcIiAybmQgZWRpdGlvbiBieSBKZWFuIE1lZXVzIChXaWxsbWFubi1CZWxsLCBSaWNobW9uZCkgMTk5OC5cblxuU3VuQ2FsYy5nZXRNb29uSWxsdW1pbmF0aW9uID0gZnVuY3Rpb24gKGRhdGUpIHtcblxuICAgIHZhciBkID0gdG9EYXlzKGRhdGUpLFxuICAgICAgICBzID0gc3VuQ29vcmRzKGQpLFxuICAgICAgICBtID0gbW9vbkNvb3JkcyhkKSxcblxuICAgICAgICBzZGlzdCA9IDE0OTU5ODAwMCwgLy8gZGlzdGFuY2UgZnJvbSBFYXJ0aCB0byBTdW4gaW4ga21cblxuICAgICAgICBwaGkgPSBhY29zKHNpbihzLmRlYykgKiBzaW4obS5kZWMpICsgY29zKHMuZGVjKSAqIGNvcyhtLmRlYykgKiBjb3Mocy5yYSAtIG0ucmEpKSxcbiAgICAgICAgaW5jID0gYXRhbihzZGlzdCAqIHNpbihwaGkpLCBtLmRpc3QgLSBzZGlzdCAqIGNvcyhwaGkpKSxcbiAgICAgICAgYW5nbGUgPSBhdGFuKGNvcyhzLmRlYykgKiBzaW4ocy5yYSAtIG0ucmEpLCBzaW4ocy5kZWMpICogY29zKG0uZGVjKSAtXG4gICAgICAgICAgICAgICAgY29zKHMuZGVjKSAqIHNpbihtLmRlYykgKiBjb3Mocy5yYSAtIG0ucmEpKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGZyYWN0aW9uOiAoMSArIGNvcyhpbmMpKSAvIDIsXG4gICAgICAgIHBoYXNlOiAwLjUgKyAwLjUgKiBpbmMgKiAoYW5nbGUgPCAwID8gLTEgOiAxKSAvIE1hdGguUEksXG4gICAgICAgIGFuZ2xlOiBhbmdsZVxuICAgIH07XG59O1xuXG5cbmZ1bmN0aW9uIGhvdXJzTGF0ZXIoZGF0ZSwgaCkge1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnZhbHVlT2YoKSArIGggKiBkYXlNcyAvIDI0KTtcbn1cblxuLy8gY2FsY3VsYXRpb25zIGZvciBtb29uIHJpc2Uvc2V0IHRpbWVzIGFyZSBiYXNlZCBvbiBodHRwOi8vd3d3LnN0YXJnYXppbmcubmV0L2tlcGxlci9tb29ucmlzZS5odG1sIGFydGljbGVcblxuU3VuQ2FsYy5nZXRNb29uVGltZXMgPSBmdW5jdGlvbiAoZGF0ZSwgbGF0LCBsbmcsIGluVVRDKSB7XG4gICAgdmFyIHQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBpZiAoaW5VVEMpIHQuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZWxzZSB0LnNldEhvdXJzKDAsIDAsIDAsIDApO1xuXG4gICAgdmFyIGhjID0gMC4xMzMgKiByYWQsXG4gICAgICAgIGgwID0gU3VuQ2FsYy5nZXRNb29uUG9zaXRpb24odCwgbGF0LCBsbmcpLmFsdGl0dWRlIC0gaGMsXG4gICAgICAgIGgxLCBoMiwgcmlzZSwgc2V0LCBhLCBiLCB4ZSwgeWUsIGQsIHJvb3RzLCB4MSwgeDIsIGR4O1xuXG4gICAgLy8gZ28gaW4gMi1ob3VyIGNodW5rcywgZWFjaCB0aW1lIHNlZWluZyBpZiBhIDMtcG9pbnQgcXVhZHJhdGljIGN1cnZlIGNyb3NzZXMgemVybyAod2hpY2ggbWVhbnMgcmlzZSBvciBzZXQpXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMjQ7IGkgKz0gMikge1xuICAgICAgICBoMSA9IFN1bkNhbGMuZ2V0TW9vblBvc2l0aW9uKGhvdXJzTGF0ZXIodCwgaSksIGxhdCwgbG5nKS5hbHRpdHVkZSAtIGhjO1xuICAgICAgICBoMiA9IFN1bkNhbGMuZ2V0TW9vblBvc2l0aW9uKGhvdXJzTGF0ZXIodCwgaSArIDEpLCBsYXQsIGxuZykuYWx0aXR1ZGUgLSBoYztcblxuICAgICAgICBhID0gKGgwICsgaDIpIC8gMiAtIGgxO1xuICAgICAgICBiID0gKGgyIC0gaDApIC8gMjtcbiAgICAgICAgeGUgPSAtYiAvICgyICogYSk7XG4gICAgICAgIHllID0gKGEgKiB4ZSArIGIpICogeGUgKyBoMTtcbiAgICAgICAgZCA9IGIgKiBiIC0gNCAqIGEgKiBoMTtcbiAgICAgICAgcm9vdHMgPSAwO1xuXG4gICAgICAgIGlmIChkID49IDApIHtcbiAgICAgICAgICAgIGR4ID0gTWF0aC5zcXJ0KGQpIC8gKE1hdGguYWJzKGEpICogMik7XG4gICAgICAgICAgICB4MSA9IHhlIC0gZHg7XG4gICAgICAgICAgICB4MiA9IHhlICsgZHg7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoeDEpIDw9IDEpIHJvb3RzKys7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoeDIpIDw9IDEpIHJvb3RzKys7XG4gICAgICAgICAgICBpZiAoeDEgPCAtMSkgeDEgPSB4MjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb290cyA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKGgwIDwgMCkgcmlzZSA9IGkgKyB4MTtcbiAgICAgICAgICAgIGVsc2Ugc2V0ID0gaSArIHgxO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocm9vdHMgPT09IDIpIHtcbiAgICAgICAgICAgIHJpc2UgPSBpICsgKHllIDwgMCA/IHgyIDogeDEpO1xuICAgICAgICAgICAgc2V0ID0gaSArICh5ZSA8IDAgPyB4MSA6IHgyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyaXNlICYmIHNldCkgYnJlYWs7XG5cbiAgICAgICAgaDAgPSBoMjtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICBpZiAocmlzZSkgcmVzdWx0LnJpc2UgPSBob3Vyc0xhdGVyKHQsIHJpc2UpO1xuICAgIGlmIChzZXQpIHJlc3VsdC5zZXQgPSBob3Vyc0xhdGVyKHQsIHNldCk7XG5cbiAgICBpZiAoIXJpc2UgJiYgIXNldCkgcmVzdWx0W3llID4gMCA/ICdhbHdheXNVcCcgOiAnYWx3YXlzRG93biddID0gdHJ1ZTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8vIGV4cG9ydCBhcyBBTUQgbW9kdWxlIC8gTm9kZSBtb2R1bGUgLyBicm93c2VyIHZhcmlhYmxlXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoU3VuQ2FsYyk7XG5lbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBTdW5DYWxjO1xuZWxzZSB3aW5kb3cuU3VuQ2FsYyA9IFN1bkNhbGM7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG5cbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgbGlzdCA9IHRoaXMubWFwW25hbWVdXG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICBsaXN0ID0gW11cbiAgICAgIHRoaXMubWFwW25hbWVdID0gbGlzdFxuICAgIH1cbiAgICBsaXN0LnB1c2godmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldXG4gICAgcmV0dXJuIHZhbHVlcyA/IHZhbHVlc1swXSA6IG51bGxcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gfHwgW11cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBbbm9ybWFsaXplVmFsdWUodmFsdWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5tYXApLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdGhpcy5tYXBbbmFtZV0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKVxuICAgICAgfSwgdGhpcylcbiAgICB9LCB0aGlzKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmICghYm9keSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9ICcnXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgLy8gT25seSBzdXBwb3J0IEFycmF5QnVmZmVycyBmb3IgUE9TVCBtZXRob2QuXG4gICAgICAgIC8vIFJlY2VpdmluZyBBcnJheUJ1ZmZlcnMgaGFwcGVucyB2aWEgQmxvYnMsIGluc3RlYWQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIEJvZHlJbml0IHR5cGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSlcbiAgICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QmxvYilcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5Rm9ybURhdGEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keVRleHRdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICByZXR1cm4gcmVqZWN0ZWQgPyByZWplY3RlZCA6IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5VGV4dClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5mb3JtRGF0YSkge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyBIVFRQIG1ldGhvZHMgd2hvc2UgY2FwaXRhbGl6YXRpb24gc2hvdWxkIGJlIG5vcm1hbGl6ZWRcbiAgdmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuICBmdW5jdGlvbiBub3JtYWxpemVNZXRob2QobWV0aG9kKSB7XG4gICAgdmFyIHVwY2FzZWQgPSBtZXRob2QudG9VcHBlckNhc2UoKVxuICAgIHJldHVybiAobWV0aG9kcy5pbmRleE9mKHVwY2FzZWQpID4gLTEpID8gdXBjYXNlZCA6IG1ldGhvZFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxdWVzdChpbnB1dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcbiAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmxcbiAgICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycylcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kXG4gICAgICB0aGlzLm1vZGUgPSBpbnB1dC5tb2RlXG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgICBpbnB1dC5ib2R5VXNlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBpbnB1dFxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBoZWFkZXJzKHhocikge1xuICAgIHZhciBoZWFkID0gbmV3IEhlYWRlcnMoKVxuICAgIHZhciBwYWlycyA9ICh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpLnRyaW0oKS5zcGxpdCgnXFxuJylcbiAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdmFyIHNwbGl0ID0gaGVhZGVyLnRyaW0oKS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gc3BsaXQuc2hpZnQoKS50cmltKClcbiAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWQuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfSlcbiAgICByZXR1cm4gaGVhZFxuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzXG4gICAgdGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMFxuICAgIHRoaXMuc3RhdHVzVGV4dCA9IG9wdGlvbnMuc3RhdHVzVGV4dFxuICAgIHRoaXMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMgPyBvcHRpb25zLmhlYWRlcnMgOiBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0XG4gICAgICBpZiAoUmVxdWVzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihpbnB1dCkgJiYgIWluaXQpIHtcbiAgICAgICAgcmVxdWVzdCA9IGlucHV0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB9XG5cbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICBmdW5jdGlvbiByZXNwb25zZVVSTCgpIHtcbiAgICAgICAgaWYgKCdyZXNwb25zZVVSTCcgaW4geGhyKSB7XG4gICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVVSTFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXZvaWQgc2VjdXJpdHkgd2FybmluZ3Mgb24gZ2V0UmVzcG9uc2VIZWFkZXIgd2hlbiBub3QgYWxsb3dlZCBieSBDT1JTXG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XG4gICAgICAgICAgcmV0dXJuIHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyh4aHIpLFxuICAgICAgICAgIHVybDogcmVzcG9uc2VVUkwoKVxuICAgICAgICB9XG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG4iLCJyZXF1aXJlKCdlczYtcHJvbWlzZScpLnBvbHlmaWxsKClcblxuaW1wb3J0IFdyaXRlciBmcm9tICcuL21vZHVsZXMvV3JpdGVyJ1xuaW1wb3J0IFRyYW5zbGF0ZXIgZnJvbSAnLi9tb2R1bGVzL1RyYW5zbGF0ZXInXG5pbXBvcnQgUmlja1JvbGxlZCBmcm9tICcuL21vZHVsZXMvUmlja1JvbGxlZCdcbmltcG9ydCBMYXp5TG9hZGVyIGZyb20gJy4vbW9kdWxlcy9MYXp5TG9hZGVyJ1xuLy9pbXBvcnQgQ3Vyc29yRnJpZW5kIGZyb20gJy4vbW9kdWxlcy9DdXJzb3JGcmllbmQnXG5pbXBvcnQgUHJvamVjdExpc3RlbmVyIGZyb20gJy4vbW9kdWxlcy9Qcm9qZWN0TGlzdGVuZXInXG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCdcbmltcG9ydCAqIGFzIFN1bkNhbGMgZnJvbSAnc3VuY2FsYydcbmltcG9ydCBOaWdodE1vZGUgZnJvbSAnLi9tb2R1bGVzL05pZ2h0TW9kZSdcblxuY29uc3QgZWNobyA9IHJlcXVpcmUoJ2VjaG8tanMnKShkb2N1bWVudC5ib2R5KVxuY29uc3QgaW50cm9UZXh0ID0gYGhpLCBteSBuYW1lIGlzIHBpw6lycmUgcmVpbWVydHouXG5cbmkgYW0gYSBodW1ibGUgZGV2ZWxvcGVyQEBAIyMjIyMjIyMjbWFnaWNpYW5AQEAjIyMjIyMjI2NvZGVyLCBkZXNpZ25lciwgZmFrZS1pdC10aWwteW91LW1ha2UtaXQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI2VudHJlcHJlbmV1ciBhbmQgZXZlcnlkYXkgaHVzdGxlci5cbmV4dHJlbWVseSBhZGRpY3RlZCBvZiBidWlsZGluZyB0aGluZ3MuXG5cbiRodHRwOi8vZ2l0aHViLmNvbS9yZWltZXJ0eiRnaXRodWIkIHwgJGh0dHA6Ly90d2l0dGVyLmNvbS9yZWltZXJ0eiR0d2l0dGVyJCB8ICRtYWlsdG86cGllcnJlLnJlaW1lcnR6QGdtYWlsLmNvbSRoaXJlIG1lJCBgXG5cblxuY29uc3Qgd3JpdGVyID0gbmV3IFdyaXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud3JpdGVyJyksIGludHJvVGV4dClcbmNvbnN0IHRyYW5zbGF0ZXIgPSBuZXcgVHJhbnNsYXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlLWQnKSwgMTAsIDEwKVxuY29uc3QgcnIgPSBuZXcgUmlja1JvbGxlZCg1MDAwLCB0cnVlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhbGwtbXktc2VjcmV0LWFwaS1rZXlzJykpXG5jb25zdCBsbCA9IG5ldyBMYXp5TG9hZGVyKHsgbGluZXM6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGU6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja09uU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZha2VTbG93bmVzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlCZWZvcmVGZXRjaDogKCkgPT4geyByZXR1cm4gTWF0aC5yYW5kb20oKSAqIDM1MDAgKyAxMDAwfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2VPZkltYWdlczogMC4zXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbmNvbnN0IGNGID0gbmV3IFByb2plY3RMaXN0ZW5lcih7c2VsZWN0b3I6ICcucHJvamVjdHMnfSlcbnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gIHdyaXRlci5zdGFydCgpXG4gIHRyYW5zbGF0ZXIuc3RhcnQoKVxuICByci5zdGFydCgpXG4gIGxsLnN0YXJ0KClcbiAgY0Yuc3RhcnQoKVxufSkiLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhenlMb2FkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBhdHRyaWJ1dGUgPSAnZGF0YS1sYXp5JyxcbiAgICBvZmZzZXQgPSAoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQvMiksXG4gICAgbGluZXMgPSAzLFxuICAgIHRocm90dGxlID0gMzUwLFxuICAgIGF1dG9TdGFydCA9IHRydWUsXG4gICAgY2hlY2tPblN0YXJ0ID0gdHJ1ZSxcbiAgICBmYWtlU2xvd25lc3MgPSBmYWxzZSxcbiAgICBwbGFjZWhvbGRlckltYWdlcyA9IFtcbiAgICAvKiB3aWRlICAgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQXZZQUFBUUFBUU1BQUFDd05JOWRBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFkVWxFUVZSNDJ1M0JBUTBBQUFEQ29QZFA3ZXdCRkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFONEFQQUFHTjZEcHdBQUFBQUVsRlRrU3VRbUNDJyxcbiAgICAvKiB0YWxsICAgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUpZQUFBQ1dBUU1BQUFBR3orT2hBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFHa2xFUVZSNEFlM0JBUUVBQUFRRE1QMVRpd0hmVmdBQXdIb05DN2dBQVNpc3QzMEFBQUFBU1VWT1JLNUNZSUk9JyxcbiAgICAvKiBzcXVhcmUgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVN3QUFBQ1dBUU1BQUFCZWxTZVJBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFIRWxFUVZSNFh1M0FBUWtBQUFEQ01QdW5Oc2RoV3dvQUFBQUFBQndXMmdBQmxPMkwyQUFBQUFCSlJVNUVya0pnZ2c9PSdcbiAgXX0pXG4gIHtcbiAgICB0aGlzLmF0dHJpYnV0ZSA9IGF0dHJpYnV0ZVxuICAgIHRoaXMuYXV0b1N0YXJ0ID0gYXV0b1N0YXJ0XG4gICAgdGhpcy5jaGVja09uU3RhcnQgPSBjaGVja09uU3RhcnRcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxuICAgIHRoaXMubGluZXMgPSBsaW5lc1xuICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZVxuICAgIHRoaXMuZmFrZVNsb3duZXNzID0gZmFrZVNsb3duZXNzXG4gICAgdGhpcy5wbGFjZWhvbGRlckltYWdlcyA9IHBsYWNlaG9sZGVySW1hZ2VzXG5cbiAgICB0aGlzLl9lbGVtZW50cyAgICAgICAgICA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7IHRoaXMuYXR0cmlidXRlIH1dYCkpXG4gICAgdGhpcy5fcXVldWUgICAgICAgICAgICAgPSBbXVxuICAgIHRoaXMuX2xpc3RlbmVyICAgICAgICAgID0gZmFsc2VcbiAgICB0aGlzLl90aHJvdHRsZXIgICAgICAgICA9IGZhbHNlXG5cbiAgICB0aGlzLm9uTG9hZCA9IHRoaXMub25Mb2FkLmJpbmQodGhpcylcblxuICAgIGlmICh0aGlzLmF1dG9TdGFydCkge1xuICAgICAgdGhpcy5zdGFydCgpXG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCEhdGhpcy5fbGlzdGVuZXIpIHJldHVyblxuICAgIGlmICh0aGlzLmNoZWNrT25TdGFydCkgdGhpcy5jaGVjaygpXG5cbiAgICB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICBpZiAoIWVsZW1lbnQuc3JjIHx8IGVsZW1lbnQuc3JjID09PSAnJykge1xuICAgICAgICBlbGVtZW50LnNyYyA9IHRoaXMucGxhY2Vob2xkZXJJbWFnZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKih0aGlzLnBsYWNlaG9sZGVySW1hZ2VzLmxlbmd0aC0xKSArIDAuNSldXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2xpc3RlbmVyID0gZXZlbnQgPT4ge3RoaXMuY2hlY2soKX1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuX2xpc3RlbmVyLCBmYWxzZSlcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fbGlzdGVuZXIpXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBmYWxzZVxuICAgIHRoaXMuX3Rocm90dGxlciA9IGZhbHNlXG4gIH1cblxuICBjaGVjaygpIHtcbiAgICBpZiAodGhpcy5fdGhyb3R0bGVyKSByZXR1cm5cbiAgICBpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5zdG9wKClcblxuICAgIHRoaXMuX3Rocm90dGxlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Rocm90dGxlciA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5fZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSAhPT0gXCJJTUdcIikgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICBpZiAoKGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gdGhpcy5vZmZzZXQpICA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlKGVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX2VsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50KSByZXR1cm4gZWxlbWVudFxuICAgICAgICB9KVxuXG4gICAgICB9LCB0aGlzLnRocm90dGxlKVxuICAgIH0pXG4gIH1cblxuICBxdWV1ZShlbGVtZW50KSB7XG4gICAgdGhpcy5fcXVldWUucHVzaChlbGVtZW50KVxuXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA8PSB0aGlzLmxpbmVzKSB7XG4gICAgICB0aGlzLmxvYWQoZWxlbWVudClcbiAgICB9XG4gIH1cblxuICBsb2FkKGVsZW1lbnQpIHtcbiAgICB0aGlzLnNldFN0YXR1cyhlbGVtZW50LCAnbG9hZGluZycpXG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm9uTG9hZCwgZmFsc2UpXG5cbiAgICBpZiAoISF0aGlzLmZha2VTbG93bmVzcyAmJiAoTWF0aC5yYW5kb20oKSA8PSAodGhpcy5mYWtlU2xvd25lc3MucGVyY2VudGFnZU9mSW1hZ2VzKSkpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpXG4gICAgICAgIH0sIHRoaXMuZmFrZVNsb3duZXNzLmRlbGF5QmVmb3JlRmV0Y2goKSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudC5zcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSlcbiAgICB9XG4gIH1cblxuICBvbkxvYWQoZXZlbnQpIHtcbiAgICBsZXQgbmV4dEVsZW1lbnRcbiAgICBsZXQgbG9hZGVkRWxlbWVudCA9IGV2ZW50LnRhcmdldFxuXG4gICAgbG9hZGVkRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5vbkxvYWQsIGZhbHNlKVxuICAgIHRoaXMuc2V0U3RhdHVzKGxvYWRlZEVsZW1lbnQsICdsb2FkZWQnKVxuXG4gICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIocXVldWVkRWxlbWVudCA9PiB7XG4gICAgICBpZiAocXVldWVkRWxlbWVudCAhPT0gbG9hZGVkRWxlbWVudCkgcmV0dXJuIHF1ZXVlZEVsZW1lbnRcbiAgICB9KVxuXG4gICAgbmV4dEVsZW1lbnQgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpXG5cbiAgICBpZiAoISFuZXh0RWxlbWVudCkgdGhpcy5sb2FkKG5leHRFbGVtZW50KVxuICB9XG5cbiAgc2V0U3RhdHVzKGVsZW1lbnQsIHN0YXR1cykge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlICsgJy1zdGF0dXMnLCBzdGF0dXMpXG4gIH1cbn0iLCJpbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCdcbmltcG9ydCAqIGFzIFN1bkNhbGMgZnJvbSAnc3VuY2FsYydcblxuY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKVxubGV0IGlzTmlnaHRNb2RlID0gZmFsc2VcblxuXG5mdW5jdGlvbiB0b2dnbGVOaWdodE1vZGUoYnV0dG9uRWwpIHtcbiAgY29uc3QgYnV0dG9uUmVwbGFjZUFyZ3MgPSBpc05pZ2h0TW9kZSA/ICBbJ+KckycsICd4J10gOiBbJ3gnLCAn4pyTJ11cbiAgY29uc3QgbGlzdCA9IGh0bWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gIGxldCBuZXdMaXN0ID0gaXNOaWdodE1vZGUgPyBsaXN0LnJlcGxhY2UoJ25pZ2h0LW1vZGUtb24nLCAnJykgOiBgJHtsaXN0fSBuaWdodC1tb2RlLW9uYFxuXG4gIGh0bWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIG5ld0xpc3QpXG5cbiAgYnV0dG9uRWwuaW5uZXJIVE1MID0gYnV0dG9uRWwuaW5uZXJIVE1MLnJlcGxhY2UoYnV0dG9uUmVwbGFjZUFyZ3NbMF0sIGJ1dHRvblJlcGxhY2VBcmdzWzFdKVxuXG4gIGlzTmlnaHRNb2RlID0gIWlzTmlnaHRNb2RlXG59XG5cbmZldGNoKCdodHRwczovL2dlby1sb2NhdGlvbi5hcGkucmVpbWVydHouY28nKVxuICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gIH0pXG4gIC50aGVuKChqc29uKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gK25ldyBEYXRlKClcbiAgICBjb25zdCBzdW5zZXQgPSArbmV3IERhdGUoU3VuQ2FsYy5nZXRUaW1lcygrbmV3IERhdGUoKSwganNvbi5sYXQsIGpzb24ubG9uKS5zdW5zZXQpXG5cbiAgICBpZiAobm93ID4gc3Vuc2V0KSB0b2dnbGVOaWdodE1vZGUoKVxuICB9KVxuXG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5pZ2h0LW1vZGUtdG9nZ2xlXScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgdG9nZ2xlTmlnaHRNb2RlKGUudGFyZ2V0KVxufSlcbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcbmNvbnN0IGlzTW9iaWxlID0gL2lQaG9uZXxpUGFkfGlQb2R8QW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdExpc3RlbmVyIHtcblxuICBjb25zdHJ1Y3Rvcih7c2VsZWN0b3IgPSAnZGF0YS1jdXJzb3ItZnJpZW5kJ30pIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3JcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5vbkVudGVyID0gdGhpcy5vbkVudGVyLmJpbmQodGhpcylcbiAgICB0aGlzLm9uTGVhdmUgPSB0aGlzLm9uTGVhdmUuYmluZCh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKGlzTW9iaWxlKSByZXR1cm5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbkVudGVyLCBmYWxzZSlcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLm9uTGVhdmUpXG4gIH1cblxuICBvbkVudGVyKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSAhPT0gJ0lNRycpIHJldHVyblxuXG4gICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvamVjdC1pcy1ob3ZlcmVkJywgJ3RydWUnKTtcbiAgfVxuXG5cbiAgb25MZWF2ZShldmVudCkge1xuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXByb2plY3QtaXMtaG92ZXJlZCcsICdmYWxzZScpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMub25FbnRlcilcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMub25MZWF2ZSlcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuc3RvcCgpXG4gIH1cbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IG1kUm9sbGVkID0gW1xuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gR0lWRSBZT1UgVUhQXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIsficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBMRVQgVSBEV05cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIi4sficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE4gVFVSTiBBSFJPVU5EXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gQU5EIERFU0VSVCBVXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlja1JvbGxlZCB7XG5cbiAgY29uc3RydWN0b3IgKGRlbGF5LCBzaG91bGRIaWRlLCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQpIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQucGFyZW50Tm9kZVxuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5IHx8IDMwMDBcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2VcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlXG4gIH1cblxuICBzd2FwKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgbWRSb2xsZWQubGVuZ3RoXG5cbiAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XVxuXG4gICAgaWYgKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuaW50ZXJ2YWwpIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICB0aGlzLnRpbWVvdXQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnN3YXAoKVxuICAgICAgfSwgdGhpcy5kZWxheSlcbiAgICB9KVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAoIXRoaXMuaW50ZXJ2YWwpIHJldHVyblxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2VcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuc3RvcCgpXG4gIH1cbn1cbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zbGF0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHhSb3RhdGlvbiwgeVJvdGF0aW9uKSB7XG4gICAgdGhpcy54Um90YXRpb24gPSB4Um90YXRpb25cbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvblxuICAgIHRoaXMuZWwgPSBlbGVtZW50XG4gICAgdGhpcy5mcmFtZSA9IGZhbHNlXG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZVxuICAgIHRoaXMubW92ZUV2ZW50ID0gaXNNb2JpbGUgPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnXG5cbiAgICB0aGlzLmhhbmRsZVNjcm9sbCA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdmUgPSB0aGlzLmhhbmRsZU1vdmUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRXZlbnQgPSB0aGlzLmhhbmRsZUV2ZW50LmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbChzY3JvbGxZKXtcbiAgICBsZXQgc2Nyb2xsZWRQZXJjZW50YWdlID0gKHNjcm9sbFkgLyBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCkgKiB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeCA9IChzY3JvbGxlZFBlcmNlbnRhZ2UvMikgLSB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeSA9IHRoaXMueVJvdGF0aW9uIC0gc2Nyb2xsZWRQZXJjZW50YWdlXG5cbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVYKCR7eH1kZWcpIHJvdGF0ZVkoJHt5fWRlZylgXG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZVxuICB9XG5cbiAgaGFuZGxlTW92ZShjbGllbnRYLCBjbGllbnRZKXtcbiAgICBsZXQgeCA9ICgoMSAtIChjbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSkgKiAtMSkgKiB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeSA9IChjbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogdGhpcy55Um90YXRpb25cblxuICAgIHRoaXMuZWwuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVgoJHt4fWRlZykgcm90YXRlWSgke3l9ZGVnKWBcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IGZhbHNlXG4gIH1cblxuICBoYW5kbGVFdmVudChldmVudCkge1xuICAgIGlmICh0aGlzLnByb2Nlc3NpbmdFdmVudCkgcmV0dXJuXG5cbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IHRydWVcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBpZihpc01vYmlsZSkgdGhpcy5oYW5kbGVTY3JvbGwod2luZG93LnNjcm9sbFkpXG4gICAgICBlbHNlICAgICAgICAgdGhpcy5oYW5kbGVNb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpXG4gICAgfSlcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm1vdmVFdmVudCwgdGhpcy5oYW5kbGVFdmVudClcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMubW92ZUV2ZW50LCB0aGlzLmhhbmRsZUV2ZW50KVxuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKClcbiAgfVxufSIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgdGltZW91dE1hcCA9IG5ldyBNYXAoKVxuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKSAvL2RlbGV0ZVxuICAgICAgdGltZW91dE1hcC5zZXQoJ0AnLCAyNTAvMikgLy9wYXVzZVxuICAgICAgdGltZW91dE1hcC5zZXQoJywnLCAzNTAvMilcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLicsIDUwMC8yKVxuICAgICAgdGltZW91dE1hcC5zZXQoJz8nLCA3NTAvMilcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50c1xuICAgIHRoaXMucyA9IHN0cmluZ1xuICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlXG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudFxuICAgICAgZWxlbWVudCA9ICh0aGlzLmlzV3JpdGluZ0xpbmspID8gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhOmxhc3QtY2hpbGQnKSA6IGVsZW1lbnRcblxuICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ0AnKSByZXR1cm5cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSlcbiAgICAgICAgaWYob2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLmxlbmd0aCA+IDApe1xuICAgICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jykuc2xpY2UoMCwtMSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnKicpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gJzxicj4nXG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJylcbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnJCcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzV3JpdGluZ0xpbmspIHtcbiAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG5cbiAgICAgICAgICBsaW5rLmhyZWYgPSB0aGlzLnMuc3BsaXQoJyQnKVswXVxuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuaydcblxuXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChsaW5rKVxuXG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gdHJ1ZVxuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MICs9IGNoYXJhY3RlclxuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB3cml0ZXIoYmVRdWljaykge1xuICAgIGxldCB0ZXh0LCBtc0RlbGF5XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKClcblxuICAgIHRleHQgPSB0aGlzLnMuc3Vic3RyaW5nKDAsMSlcbiAgICB0aGlzLnMgPSAgdGhpcy5zLnN1YnN0cmluZygxLHRoaXMucy5sZW5ndGgpXG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpXG5cbiAgICBpZiAoYmVRdWljaykgICAgICAgICAgcmV0dXJuIHRoaXMud3JpdGVyKHRydWUpXG5cbiAgICBtc0RlbGF5ID0gdGltZW91dE1hcC5nZXQodGV4dCkgfHwgTWF0aC5yYW5kb20oKSAqIDE1MFxuXG4gICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHt0aGlzLndyaXRlcigpfSwgbXNEZWxheSlcbiAgICB9KVxuXG4gIH1cblxuICB1cGRhdGVMYXN0UmVhZCgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVhZC1ldmVyeXRoaW5nLWF0JywgRGF0ZS5ub3coKSlcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKVxuICB9XG5cbiAgaXNEb25lKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaW50cm8taXMtZG9uZScpXG4gICAgdGhpcy51cGRhdGVMYXN0UmVhZCgpXG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA8IERhdGUubm93KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKVxuICAgICAgdGhpcy53cml0ZXIodHJ1ZSlcbiAgICAgIHRoaXMuaXNEb25lKClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLndyaXRlcigpXG4gICAgfVxuICB9XG59Il19
