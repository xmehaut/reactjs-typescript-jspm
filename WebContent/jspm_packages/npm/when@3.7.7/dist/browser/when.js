/* */ 
"format cjs";
(function(process) {
  !function(e) {
    "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "undefined" != typeof window ? window.when = e() : "undefined" != typeof global ? global.when = e() : "undefined" != typeof self && (self.when = e());
  }(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            throw new Error("Cannot find module '" + o + "'");
          }
          var f = n[o] = {exports: {}};
          t[o][0].call(f.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    })({
      1: [function(require, module, exports) {
        var when = module.exports = require('../when');
        when.callbacks = require('../callbacks');
        when.cancelable = require('../cancelable');
        when.delay = require('../delay');
        when.fn = require('../function');
        when.guard = require('../guard');
        when.keys = require('../keys');
        when.nodefn = when.node = require('../node');
        when.parallel = require('../parallel');
        when.pipeline = require('../pipeline');
        when.poll = require('../poll');
        when.sequence = require('../sequence');
        when.timeout = require('../timeout');
      }, {
        "../callbacks": 2,
        "../cancelable": 3,
        "../delay": 4,
        "../function": 5,
        "../guard": 6,
        "../keys": 7,
        "../node": 26,
        "../parallel": 27,
        "../pipeline": 28,
        "../poll": 29,
        "../sequence": 30,
        "../timeout": 31,
        "../when": 32
      }],
      2: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var Promise = when.Promise;
            var _liftAll = require('./lib/liftAll');
            var slice = Array.prototype.slice;
            var makeApply = require('./lib/apply');
            var _apply = makeApply(Promise, dispatch);
            return {
              lift: lift,
              liftAll: liftAll,
              apply: apply,
              call: call,
              promisify: promisify
            };
            function apply(asyncFunction, extraAsyncArgs) {
              return _apply(asyncFunction, this, extraAsyncArgs || []);
            }
            function dispatch(f, thisArg, args, h) {
              args.push(alwaysUnary(h.resolve, h), alwaysUnary(h.reject, h));
              tryCatchResolve(f, thisArg, args, h);
            }
            function tryCatchResolve(f, thisArg, args, resolver) {
              try {
                f.apply(thisArg, args);
              } catch (e) {
                resolver.reject(e);
              }
            }
            function call(asyncFunction) {
              return _apply(asyncFunction, this, slice.call(arguments, 1));
            }
            function lift(f) {
              var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
              return function() {
                return _apply(f, this, args.concat(slice.call(arguments)));
              };
            }
            function liftAll(src, combine, dst) {
              return _liftAll(lift, combine, dst, src);
            }
            function promisify(asyncFunction, positions) {
              return function() {
                var thisArg = this;
                return Promise.all(arguments).then(function(args) {
                  var p = Promise._defer();
                  var callbackPos,
                      errbackPos;
                  if (typeof positions.callback === 'number') {
                    callbackPos = normalizePosition(args, positions.callback);
                  }
                  if (typeof positions.errback === 'number') {
                    errbackPos = normalizePosition(args, positions.errback);
                  }
                  if (errbackPos < callbackPos) {
                    insertCallback(args, errbackPos, p._handler.reject, p._handler);
                    insertCallback(args, callbackPos, p._handler.resolve, p._handler);
                  } else {
                    insertCallback(args, callbackPos, p._handler.resolve, p._handler);
                    insertCallback(args, errbackPos, p._handler.reject, p._handler);
                  }
                  asyncFunction.apply(thisArg, args);
                  return p;
                });
              };
            }
            function normalizePosition(args, pos) {
              return pos < 0 ? (args.length + pos + 2) : pos;
            }
            function insertCallback(args, pos, callback, thisArg) {
              if (typeof pos === 'number') {
                args.splice(pos, 0, alwaysUnary(callback, thisArg));
              }
            }
            function alwaysUnary(fn, thisArg) {
              return function() {
                if (arguments.length > 1) {
                  fn.call(thisArg, slice.call(arguments));
                } else {
                  fn.apply(thisArg, arguments);
                }
              };
            }
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./lib/apply": 11,
        "./lib/liftAll": 23,
        "./when": 32
      }],
      3: [function(require, module, exports) {
        (function(define) {
          define(function() {
            return function(deferred, canceler) {
              deferred.cancel = function() {
                try {
                  deferred.reject(canceler(deferred));
                } catch (e) {
                  deferred.reject(e);
                }
                return deferred.promise;
              };
              return deferred;
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        });
      }, {}],
      4: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            return function delay(msec, value) {
              return when(value).delay(msec);
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      5: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var attempt = when['try'];
            var _liftAll = require('./lib/liftAll');
            var _apply = require('./lib/apply')(when.Promise);
            var slice = Array.prototype.slice;
            return {
              lift: lift,
              liftAll: liftAll,
              call: attempt,
              apply: apply,
              compose: compose
            };
            function apply(f, args) {
              return _apply(f, this, args == null ? [] : slice.call(args));
            }
            function lift(f) {
              var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
              return function() {
                return _apply(f, this, args.concat(slice.call(arguments)));
              };
            }
            function liftAll(src, combine, dst) {
              return _liftAll(lift, combine, dst, src);
            }
            function compose(f) {
              var funcs = slice.call(arguments, 1);
              return function() {
                var thisArg = this;
                var args = slice.call(arguments);
                var firstPromise = attempt.apply(thisArg, [f].concat(args));
                return when.reduce(funcs, function(arg, func) {
                  return func.call(thisArg, arg);
                }, firstPromise);
              };
            }
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./lib/apply": 11,
        "./lib/liftAll": 23,
        "./when": 32
      }],
      6: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var slice = Array.prototype.slice;
            guard.n = n;
            return guard;
            function guard(condition, f) {
              return function() {
                var args = slice.call(arguments);
                return when(condition()).withThis(this).then(function(exit) {
                  return when(f.apply(this, args))['finally'](exit);
                });
              };
            }
            function n(allowed) {
              var count = 0;
              var waiting = [];
              return function enter() {
                return when.promise(function(resolve) {
                  if (count < allowed) {
                    resolve(exit);
                  } else {
                    waiting.push(resolve);
                  }
                  count += 1;
                });
              };
              function exit() {
                count = Math.max(count - 1, 0);
                if (waiting.length > 0) {
                  waiting.shift()(exit);
                }
              }
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {"./when": 32}],
      7: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var when = require('./when');
            var Promise = when.Promise;
            var toPromise = when.resolve;
            return {
              all: when.lift(all),
              map: map,
              settle: settle
            };
            function all(object) {
              var p = Promise._defer();
              var resolver = Promise._handler(p);
              var results = {};
              var keys = Object.keys(object);
              var pending = keys.length;
              for (var i = 0,
                  k; i < keys.length; ++i) {
                k = keys[i];
                Promise._handler(object[k]).fold(settleKey, k, results, resolver);
              }
              if (pending === 0) {
                resolver.resolve(results);
              }
              return p;
              function settleKey(k, x, resolver) {
                this[k] = x;
                if (--pending === 0) {
                  resolver.resolve(results);
                }
              }
            }
            function map(object, f) {
              return toPromise(object).then(function(object) {
                return all(Object.keys(object).reduce(function(o, k) {
                  o[k] = toPromise(object[k]).fold(mapWithKey, k);
                  return o;
                }, {}));
              });
              function mapWithKey(k, x) {
                return f(x, k);
              }
            }
            function settle(object) {
              var keys = Object.keys(object);
              var results = {};
              if (keys.length === 0) {
                return toPromise(results);
              }
              var p = Promise._defer();
              var resolver = Promise._handler(p);
              var promises = keys.map(function(k) {
                return object[k];
              });
              when.settle(promises).then(function(states) {
                populateResults(keys, states, results, resolver);
              });
              return p;
            }
            function populateResults(keys, states, results, resolver) {
              for (var i = 0; i < keys.length; i++) {
                results[keys[i]] = states[i];
              }
              resolver.resolve(results);
            }
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      8: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var makePromise = require('./makePromise');
            var Scheduler = require('./Scheduler');
            var async = require('./env').asap;
            return makePromise({scheduler: new Scheduler(async)});
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./Scheduler": 9,
        "./env": 21,
        "./makePromise": 24
      }],
      9: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            function Scheduler(async) {
              this._async = async;
              this._running = false;
              this._queue = this;
              this._queueLen = 0;
              this._afterQueue = {};
              this._afterQueueLen = 0;
              var self = this;
              this.drain = function() {
                self._drain();
              };
            }
            Scheduler.prototype.enqueue = function(task) {
              this._queue[this._queueLen++] = task;
              this.run();
            };
            Scheduler.prototype.afterQueue = function(task) {
              this._afterQueue[this._afterQueueLen++] = task;
              this.run();
            };
            Scheduler.prototype.run = function() {
              if (!this._running) {
                this._running = true;
                this._async(this.drain);
              }
            };
            Scheduler.prototype._drain = function() {
              var i = 0;
              for (; i < this._queueLen; ++i) {
                this._queue[i].run();
                this._queue[i] = void 0;
              }
              this._queueLen = 0;
              this._running = false;
              for (i = 0; i < this._afterQueueLen; ++i) {
                this._afterQueue[i].run();
                this._afterQueue[i] = void 0;
              }
              this._afterQueueLen = 0;
            };
            return Scheduler;
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      10: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            function TimeoutError(message) {
              Error.call(this);
              this.message = message;
              this.name = TimeoutError.name;
              if (typeof Error.captureStackTrace === 'function') {
                Error.captureStackTrace(this, TimeoutError);
              }
            }
            TimeoutError.prototype = Object.create(Error.prototype);
            TimeoutError.prototype.constructor = TimeoutError;
            return TimeoutError;
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      11: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            makeApply.tryCatchResolve = tryCatchResolve;
            return makeApply;
            function makeApply(Promise, call) {
              if (arguments.length < 2) {
                call = tryCatchResolve;
              }
              return apply;
              function apply(f, thisArg, args) {
                var p = Promise._defer();
                var l = args.length;
                var params = new Array(l);
                callAndResolve({
                  f: f,
                  thisArg: thisArg,
                  args: args,
                  params: params,
                  i: l - 1,
                  call: call
                }, p._handler);
                return p;
              }
              function callAndResolve(c, h) {
                if (c.i < 0) {
                  return call(c.f, c.thisArg, c.params, h);
                }
                var handler = Promise._handler(c.args[c.i]);
                handler.fold(callAndResolveNext, c, void 0, h);
              }
              function callAndResolveNext(c, x, h) {
                c.params[c.i] = x;
                c.i -= 1;
                callAndResolve(c, h);
              }
            }
            function tryCatchResolve(f, thisArg, args, resolver) {
              try {
                resolver.resolve(f.apply(thisArg, args));
              } catch (e) {
                resolver.reject(e);
              }
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      12: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var state = require('../state');
            var applier = require('../apply');
            return function array(Promise) {
              var applyFold = applier(Promise);
              var toPromise = Promise.resolve;
              var all = Promise.all;
              var ar = Array.prototype.reduce;
              var arr = Array.prototype.reduceRight;
              var slice = Array.prototype.slice;
              Promise.any = any;
              Promise.some = some;
              Promise.settle = settle;
              Promise.map = map;
              Promise.filter = filter;
              Promise.reduce = reduce;
              Promise.reduceRight = reduceRight;
              Promise.prototype.spread = function(onFulfilled) {
                return this.then(all).then(function(array) {
                  return onFulfilled.apply(this, array);
                });
              };
              return Promise;
              function any(promises) {
                var p = Promise._defer();
                var resolver = p._handler;
                var l = promises.length >>> 0;
                var pending = l;
                var errors = [];
                for (var h,
                    x,
                    i = 0; i < l; ++i) {
                  x = promises[i];
                  if (x === void 0 && !(i in promises)) {
                    --pending;
                    continue;
                  }
                  h = Promise._handler(x);
                  if (h.state() > 0) {
                    resolver.become(h);
                    Promise._visitRemaining(promises, i, h);
                    break;
                  } else {
                    h.visit(resolver, handleFulfill, handleReject);
                  }
                }
                if (pending === 0) {
                  resolver.reject(new RangeError('any(): array must not be empty'));
                }
                return p;
                function handleFulfill(x) {
                  errors = null;
                  this.resolve(x);
                }
                function handleReject(e) {
                  if (this.resolved) {
                    return;
                  }
                  errors.push(e);
                  if (--pending === 0) {
                    this.reject(errors);
                  }
                }
              }
              function some(promises, n) {
                var p = Promise._defer();
                var resolver = p._handler;
                var results = [];
                var errors = [];
                var l = promises.length >>> 0;
                var nFulfill = 0;
                var nReject;
                var x,
                    i;
                for (i = 0; i < l; ++i) {
                  x = promises[i];
                  if (x === void 0 && !(i in promises)) {
                    continue;
                  }
                  ++nFulfill;
                }
                n = Math.max(n, 0);
                nReject = (nFulfill - n + 1);
                nFulfill = Math.min(n, nFulfill);
                if (n > nFulfill) {
                  resolver.reject(new RangeError('some(): array must contain at least ' + n + ' item(s), but had ' + nFulfill));
                } else if (nFulfill === 0) {
                  resolver.resolve(results);
                }
                for (i = 0; i < l; ++i) {
                  x = promises[i];
                  if (x === void 0 && !(i in promises)) {
                    continue;
                  }
                  Promise._handler(x).visit(resolver, fulfill, reject, resolver.notify);
                }
                return p;
                function fulfill(x) {
                  if (this.resolved) {
                    return;
                  }
                  results.push(x);
                  if (--nFulfill === 0) {
                    errors = null;
                    this.resolve(results);
                  }
                }
                function reject(e) {
                  if (this.resolved) {
                    return;
                  }
                  errors.push(e);
                  if (--nReject === 0) {
                    results = null;
                    this.reject(errors);
                  }
                }
              }
              function map(promises, f) {
                return Promise._traverse(f, promises);
              }
              function filter(promises, predicate) {
                var a = slice.call(promises);
                return Promise._traverse(predicate, a).then(function(keep) {
                  return filterSync(a, keep);
                });
              }
              function filterSync(promises, keep) {
                var l = keep.length;
                var filtered = new Array(l);
                for (var i = 0,
                    j = 0; i < l; ++i) {
                  if (keep[i]) {
                    filtered[j++] = Promise._handler(promises[i]).value;
                  }
                }
                filtered.length = j;
                return filtered;
              }
              function settle(promises) {
                return all(promises.map(settleOne));
              }
              function settleOne(p) {
                var h = Promise._handler(p);
                if (h.state() === 0) {
                  return toPromise(p).then(state.fulfilled, state.rejected);
                }
                h._unreport();
                return state.inspect(h);
              }
              function reduce(promises, f) {
                return arguments.length > 2 ? ar.call(promises, liftCombine(f), arguments[2]) : ar.call(promises, liftCombine(f));
              }
              function reduceRight(promises, f) {
                return arguments.length > 2 ? arr.call(promises, liftCombine(f), arguments[2]) : arr.call(promises, liftCombine(f));
              }
              function liftCombine(f) {
                return function(z, x, i) {
                  return applyFold(f, void 0, [z, x, i]);
                };
              }
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {
        "../apply": 11,
        "../state": 25
      }],
      13: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function flow(Promise) {
              var resolve = Promise.resolve;
              var reject = Promise.reject;
              var origCatch = Promise.prototype['catch'];
              Promise.prototype.done = function(onResult, onError) {
                this._handler.visit(this._handler.receiver, onResult, onError);
              };
              Promise.prototype['catch'] = Promise.prototype.otherwise = function(onRejected) {
                if (arguments.length < 2) {
                  return origCatch.call(this, onRejected);
                }
                if (typeof onRejected !== 'function') {
                  return this.ensure(rejectInvalidPredicate);
                }
                return origCatch.call(this, createCatchFilter(arguments[1], onRejected));
              };
              function createCatchFilter(handler, predicate) {
                return function(e) {
                  return evaluatePredicate(e, predicate) ? handler.call(this, e) : reject(e);
                };
              }
              Promise.prototype['finally'] = Promise.prototype.ensure = function(handler) {
                if (typeof handler !== 'function') {
                  return this;
                }
                return this.then(function(x) {
                  return runSideEffect(handler, this, identity, x);
                }, function(e) {
                  return runSideEffect(handler, this, reject, e);
                });
              };
              function runSideEffect(handler, thisArg, propagate, value) {
                var result = handler.call(thisArg);
                return maybeThenable(result) ? propagateValue(result, propagate, value) : propagate(value);
              }
              function propagateValue(result, propagate, x) {
                return resolve(result).then(function() {
                  return propagate(x);
                });
              }
              Promise.prototype['else'] = Promise.prototype.orElse = function(defaultValue) {
                return this.then(void 0, function() {
                  return defaultValue;
                });
              };
              Promise.prototype['yield'] = function(value) {
                return this.then(function() {
                  return value;
                });
              };
              Promise.prototype.tap = function(onFulfilledSideEffect) {
                return this.then(onFulfilledSideEffect)['yield'](this);
              };
              return Promise;
            };
            function rejectInvalidPredicate() {
              throw new TypeError('catch predicate must be a function');
            }
            function evaluatePredicate(e, predicate) {
              return isError(predicate) ? e instanceof predicate : predicate(e);
            }
            function isError(predicate) {
              return predicate === Error || (predicate != null && predicate.prototype instanceof Error);
            }
            function maybeThenable(x) {
              return (typeof x === 'object' || typeof x === 'function') && x !== null;
            }
            function identity(x) {
              return x;
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      14: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function fold(Promise) {
              Promise.prototype.fold = function(f, z) {
                var promise = this._beget();
                this._handler.fold(function(z, x, to) {
                  Promise._handler(z).fold(function(x, z, to) {
                    to.resolve(f.call(this, z, x));
                  }, x, this, to);
                }, z, promise._handler.receiver, promise._handler);
                return promise;
              };
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      15: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var inspect = require('../state').inspect;
            return function inspection(Promise) {
              Promise.prototype.inspect = function() {
                return inspect(Promise._handler(this));
              };
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {"../state": 25}],
      16: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function generate(Promise) {
              var resolve = Promise.resolve;
              Promise.iterate = iterate;
              Promise.unfold = unfold;
              return Promise;
              function iterate(f, condition, handler, x) {
                return unfold(function(x) {
                  return [x, f(x)];
                }, condition, handler, x);
              }
              function unfold(unspool, condition, handler, x) {
                return resolve(x).then(function(seed) {
                  return resolve(condition(seed)).then(function(done) {
                    return done ? seed : resolve(unspool(seed)).spread(next);
                  });
                });
                function next(item, newSeed) {
                  return resolve(handler(item)).then(function() {
                    return unfold(unspool, condition, handler, newSeed);
                  });
                }
              }
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      17: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function progress(Promise) {
              Promise.prototype.progress = function(onProgress) {
                return this.then(void 0, void 0, onProgress);
              };
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      18: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var env = require('../env');
            var TimeoutError = require('../TimeoutError');
            function setTimeout(f, ms, x, y) {
              return env.setTimer(function() {
                f(x, y, ms);
              }, ms);
            }
            return function timed(Promise) {
              Promise.prototype.delay = function(ms) {
                var p = this._beget();
                this._handler.fold(handleDelay, ms, void 0, p._handler);
                return p;
              };
              function handleDelay(ms, x, h) {
                setTimeout(resolveDelay, ms, x, h);
              }
              function resolveDelay(x, h) {
                h.resolve(x);
              }
              Promise.prototype.timeout = function(ms, reason) {
                var p = this._beget();
                var h = p._handler;
                var t = setTimeout(onTimeout, ms, reason, p._handler);
                this._handler.visit(h, function onFulfill(x) {
                  env.clearTimer(t);
                  this.resolve(x);
                }, function onReject(x) {
                  env.clearTimer(t);
                  this.reject(x);
                }, h.notify);
                return p;
              };
              function onTimeout(reason, h, ms) {
                var e = typeof reason === 'undefined' ? new TimeoutError('timed out after ' + ms + 'ms') : reason;
                h.reject(e);
              }
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {
        "../TimeoutError": 10,
        "../env": 21
      }],
      19: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var setTimer = require('../env').setTimer;
            var format = require('../format');
            return function unhandledRejection(Promise) {
              var logError = noop;
              var logInfo = noop;
              var localConsole;
              if (typeof console !== 'undefined') {
                localConsole = console;
                logError = typeof localConsole.error !== 'undefined' ? function(e) {
                  localConsole.error(e);
                } : function(e) {
                  localConsole.log(e);
                };
                logInfo = typeof localConsole.info !== 'undefined' ? function(e) {
                  localConsole.info(e);
                } : function(e) {
                  localConsole.log(e);
                };
              }
              Promise.onPotentiallyUnhandledRejection = function(rejection) {
                enqueue(report, rejection);
              };
              Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
                enqueue(unreport, rejection);
              };
              Promise.onFatalRejection = function(rejection) {
                enqueue(throwit, rejection.value);
              };
              var tasks = [];
              var reported = [];
              var running = null;
              function report(r) {
                if (!r.handled) {
                  reported.push(r);
                  logError('Potentially unhandled rejection [' + r.id + '] ' + format.formatError(r.value));
                }
              }
              function unreport(r) {
                var i = reported.indexOf(r);
                if (i >= 0) {
                  reported.splice(i, 1);
                  logInfo('Handled previous rejection [' + r.id + '] ' + format.formatObject(r.value));
                }
              }
              function enqueue(f, x) {
                tasks.push(f, x);
                if (running === null) {
                  running = setTimer(flush, 0);
                }
              }
              function flush() {
                running = null;
                while (tasks.length > 0) {
                  tasks.shift()(tasks.shift());
                }
              }
              return Promise;
            };
            function throwit(e) {
              throw e;
            }
            function noop() {}
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {
        "../env": 21,
        "../format": 22
      }],
      20: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function addWith(Promise) {
              Promise.prototype['with'] = Promise.prototype.withThis = function(receiver) {
                var p = this._beget();
                var child = p._handler;
                child.receiver = receiver;
                this._handler.chain(child, receiver);
                return p;
              };
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      21: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var MutationObs;
            var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;
            var setTimer = function(f, ms) {
              return setTimeout(f, ms);
            };
            var clearTimer = function(t) {
              return clearTimeout(t);
            };
            var asap = function(f) {
              return capturedSetTimeout(f, 0);
            };
            if (isNode()) {
              asap = function(f) {
                return process.nextTick(f);
              };
            } else if (MutationObs = hasMutationObserver()) {
              asap = initMutationObserver(MutationObs);
            } else if (!capturedSetTimeout) {
              var vertxRequire = require;
              var vertx = vertxRequire('vertx');
              setTimer = function(f, ms) {
                return vertx.setTimer(ms, f);
              };
              clearTimer = vertx.cancelTimer;
              asap = vertx.runOnLoop || vertx.runOnContext;
            }
            return {
              setTimer: setTimer,
              clearTimer: clearTimer,
              asap: asap
            };
            function isNode() {
              return typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]';
            }
            function hasMutationObserver() {
              return (typeof MutationObserver === 'function' && MutationObserver) || (typeof WebKitMutationObserver === 'function' && WebKitMutationObserver);
            }
            function initMutationObserver(MutationObserver) {
              var scheduled;
              var node = document.createTextNode('');
              var o = new MutationObserver(run);
              o.observe(node, {characterData: true});
              function run() {
                var f = scheduled;
                scheduled = void 0;
                f();
              }
              var i = 0;
              return function(f) {
                scheduled = f;
                node.data = (i ^= 1);
              };
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        }));
      }, {}],
      22: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return {
              formatError: formatError,
              formatObject: formatObject,
              tryStringify: tryStringify
            };
            function formatError(e) {
              var s = typeof e === 'object' && e !== null && (e.stack || e.message) ? e.stack || e.message : formatObject(e);
              return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
            }
            function formatObject(o) {
              var s = String(o);
              if (s === '[object Object]' && typeof JSON !== 'undefined') {
                s = tryStringify(o, s);
              }
              return s;
            }
            function tryStringify(x, defaultValue) {
              try {
                return JSON.stringify(x);
              } catch (e) {
                return defaultValue;
              }
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      23: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function liftAll(liftOne, combine, dst, src) {
              if (typeof combine === 'undefined') {
                combine = defaultCombine;
              }
              return Object.keys(src).reduce(function(dst, key) {
                var f = src[key];
                return typeof f === 'function' ? combine(dst, liftOne(f), key) : dst;
              }, typeof dst === 'undefined' ? defaultDst(src) : dst);
            };
            function defaultCombine(o, f, k) {
              o[k] = f;
              return o;
            }
            function defaultDst(src) {
              return typeof src === 'function' ? src.bind() : Object.create(src);
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      24: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return function makePromise(environment) {
              var tasks = environment.scheduler;
              var emitRejection = initEmitRejection();
              var objectCreate = Object.create || function(proto) {
                function Child() {}
                Child.prototype = proto;
                return new Child();
              };
              function Promise(resolver, handler) {
                this._handler = resolver === Handler ? handler : init(resolver);
              }
              function init(resolver) {
                var handler = new Pending();
                try {
                  resolver(promiseResolve, promiseReject, promiseNotify);
                } catch (e) {
                  promiseReject(e);
                }
                return handler;
                function promiseResolve(x) {
                  handler.resolve(x);
                }
                function promiseReject(reason) {
                  handler.reject(reason);
                }
                function promiseNotify(x) {
                  handler.notify(x);
                }
              }
              Promise.resolve = resolve;
              Promise.reject = reject;
              Promise.never = never;
              Promise._defer = defer;
              Promise._handler = getHandler;
              function resolve(x) {
                return isPromise(x) ? x : new Promise(Handler, new Async(getHandler(x)));
              }
              function reject(x) {
                return new Promise(Handler, new Async(new Rejected(x)));
              }
              function never() {
                return foreverPendingPromise;
              }
              function defer() {
                return new Promise(Handler, new Pending());
              }
              Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
                var parent = this._handler;
                var state = parent.join().state();
                if ((typeof onFulfilled !== 'function' && state > 0) || (typeof onRejected !== 'function' && state < 0)) {
                  return new this.constructor(Handler, parent);
                }
                var p = this._beget();
                var child = p._handler;
                parent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);
                return p;
              };
              Promise.prototype['catch'] = function(onRejected) {
                return this.then(void 0, onRejected);
              };
              Promise.prototype._beget = function() {
                return begetFrom(this._handler, this.constructor);
              };
              function begetFrom(parent, Promise) {
                var child = new Pending(parent.receiver, parent.join().context);
                return new Promise(Handler, child);
              }
              Promise.all = all;
              Promise.race = race;
              Promise._traverse = traverse;
              function all(promises) {
                return traverseWith(snd, null, promises);
              }
              function traverse(f, promises) {
                return traverseWith(tryCatch2, f, promises);
              }
              function traverseWith(tryMap, f, promises) {
                var handler = typeof f === 'function' ? mapAt : settleAt;
                var resolver = new Pending();
                var pending = promises.length >>> 0;
                var results = new Array(pending);
                for (var i = 0,
                    x; i < promises.length && !resolver.resolved; ++i) {
                  x = promises[i];
                  if (x === void 0 && !(i in promises)) {
                    --pending;
                    continue;
                  }
                  traverseAt(promises, handler, i, x, resolver);
                }
                if (pending === 0) {
                  resolver.become(new Fulfilled(results));
                }
                return new Promise(Handler, resolver);
                function mapAt(i, x, resolver) {
                  if (!resolver.resolved) {
                    traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
                  }
                }
                function settleAt(i, x, resolver) {
                  results[i] = x;
                  if (--pending === 0) {
                    resolver.become(new Fulfilled(results));
                  }
                }
              }
              function traverseAt(promises, handler, i, x, resolver) {
                if (maybeThenable(x)) {
                  var h = getHandlerMaybeThenable(x);
                  var s = h.state();
                  if (s === 0) {
                    h.fold(handler, i, void 0, resolver);
                  } else if (s > 0) {
                    handler(i, h.value, resolver);
                  } else {
                    resolver.become(h);
                    visitRemaining(promises, i + 1, h);
                  }
                } else {
                  handler(i, x, resolver);
                }
              }
              Promise._visitRemaining = visitRemaining;
              function visitRemaining(promises, start, handler) {
                for (var i = start; i < promises.length; ++i) {
                  markAsHandled(getHandler(promises[i]), handler);
                }
              }
              function markAsHandled(h, handler) {
                if (h === handler) {
                  return;
                }
                var s = h.state();
                if (s === 0) {
                  h.visit(h, void 0, h._unreport);
                } else if (s < 0) {
                  h._unreport();
                }
              }
              function race(promises) {
                if (typeof promises !== 'object' || promises === null) {
                  return reject(new TypeError('non-iterable passed to race()'));
                }
                return promises.length === 0 ? never() : promises.length === 1 ? resolve(promises[0]) : runRace(promises);
              }
              function runRace(promises) {
                var resolver = new Pending();
                var i,
                    x,
                    h;
                for (i = 0; i < promises.length; ++i) {
                  x = promises[i];
                  if (x === void 0 && !(i in promises)) {
                    continue;
                  }
                  h = getHandler(x);
                  if (h.state() !== 0) {
                    resolver.become(h);
                    visitRemaining(promises, i + 1, h);
                    break;
                  } else {
                    h.visit(resolver, resolver.resolve, resolver.reject);
                  }
                }
                return new Promise(Handler, resolver);
              }
              function getHandler(x) {
                if (isPromise(x)) {
                  return x._handler.join();
                }
                return maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);
              }
              function getHandlerMaybeThenable(x) {
                return isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
              }
              function getHandlerUntrusted(x) {
                try {
                  var untrustedThen = x.then;
                  return typeof untrustedThen === 'function' ? new Thenable(untrustedThen, x) : new Fulfilled(x);
                } catch (e) {
                  return new Rejected(e);
                }
              }
              function Handler() {}
              Handler.prototype.when = Handler.prototype.become = Handler.prototype.notify = Handler.prototype.fail = Handler.prototype._unreport = Handler.prototype._report = noop;
              Handler.prototype._state = 0;
              Handler.prototype.state = function() {
                return this._state;
              };
              Handler.prototype.join = function() {
                var h = this;
                while (h.handler !== void 0) {
                  h = h.handler;
                }
                return h;
              };
              Handler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {
                this.when({
                  resolver: to,
                  receiver: receiver,
                  fulfilled: fulfilled,
                  rejected: rejected,
                  progress: progress
                });
              };
              Handler.prototype.visit = function(receiver, fulfilled, rejected, progress) {
                this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
              };
              Handler.prototype.fold = function(f, z, c, to) {
                this.when(new Fold(f, z, c, to));
              };
              function FailIfRejected() {}
              inherit(Handler, FailIfRejected);
              FailIfRejected.prototype.become = function(h) {
                h.fail();
              };
              var failIfRejected = new FailIfRejected();
              function Pending(receiver, inheritedContext) {
                Promise.createContext(this, inheritedContext);
                this.consumers = void 0;
                this.receiver = receiver;
                this.handler = void 0;
                this.resolved = false;
              }
              inherit(Handler, Pending);
              Pending.prototype._state = 0;
              Pending.prototype.resolve = function(x) {
                this.become(getHandler(x));
              };
              Pending.prototype.reject = function(x) {
                if (this.resolved) {
                  return;
                }
                this.become(new Rejected(x));
              };
              Pending.prototype.join = function() {
                if (!this.resolved) {
                  return this;
                }
                var h = this;
                while (h.handler !== void 0) {
                  h = h.handler;
                  if (h === this) {
                    return this.handler = cycle();
                  }
                }
                return h;
              };
              Pending.prototype.run = function() {
                var q = this.consumers;
                var handler = this.handler;
                this.handler = this.handler.join();
                this.consumers = void 0;
                for (var i = 0; i < q.length; ++i) {
                  handler.when(q[i]);
                }
              };
              Pending.prototype.become = function(handler) {
                if (this.resolved) {
                  return;
                }
                this.resolved = true;
                this.handler = handler;
                if (this.consumers !== void 0) {
                  tasks.enqueue(this);
                }
                if (this.context !== void 0) {
                  handler._report(this.context);
                }
              };
              Pending.prototype.when = function(continuation) {
                if (this.resolved) {
                  tasks.enqueue(new ContinuationTask(continuation, this.handler));
                } else {
                  if (this.consumers === void 0) {
                    this.consumers = [continuation];
                  } else {
                    this.consumers.push(continuation);
                  }
                }
              };
              Pending.prototype.notify = function(x) {
                if (!this.resolved) {
                  tasks.enqueue(new ProgressTask(x, this));
                }
              };
              Pending.prototype.fail = function(context) {
                var c = typeof context === 'undefined' ? this.context : context;
                this.resolved && this.handler.join().fail(c);
              };
              Pending.prototype._report = function(context) {
                this.resolved && this.handler.join()._report(context);
              };
              Pending.prototype._unreport = function() {
                this.resolved && this.handler.join()._unreport();
              };
              function Async(handler) {
                this.handler = handler;
              }
              inherit(Handler, Async);
              Async.prototype.when = function(continuation) {
                tasks.enqueue(new ContinuationTask(continuation, this));
              };
              Async.prototype._report = function(context) {
                this.join()._report(context);
              };
              Async.prototype._unreport = function() {
                this.join()._unreport();
              };
              function Thenable(then, thenable) {
                Pending.call(this);
                tasks.enqueue(new AssimilateTask(then, thenable, this));
              }
              inherit(Pending, Thenable);
              function Fulfilled(x) {
                Promise.createContext(this);
                this.value = x;
              }
              inherit(Handler, Fulfilled);
              Fulfilled.prototype._state = 1;
              Fulfilled.prototype.fold = function(f, z, c, to) {
                runContinuation3(f, z, this, c, to);
              };
              Fulfilled.prototype.when = function(cont) {
                runContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);
              };
              var errorId = 0;
              function Rejected(x) {
                Promise.createContext(this);
                this.id = ++errorId;
                this.value = x;
                this.handled = false;
                this.reported = false;
                this._report();
              }
              inherit(Handler, Rejected);
              Rejected.prototype._state = -1;
              Rejected.prototype.fold = function(f, z, c, to) {
                to.become(this);
              };
              Rejected.prototype.when = function(cont) {
                if (typeof cont.rejected === 'function') {
                  this._unreport();
                }
                runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
              };
              Rejected.prototype._report = function(context) {
                tasks.afterQueue(new ReportTask(this, context));
              };
              Rejected.prototype._unreport = function() {
                if (this.handled) {
                  return;
                }
                this.handled = true;
                tasks.afterQueue(new UnreportTask(this));
              };
              Rejected.prototype.fail = function(context) {
                this.reported = true;
                emitRejection('unhandledRejection', this);
                Promise.onFatalRejection(this, context === void 0 ? this.context : context);
              };
              function ReportTask(rejection, context) {
                this.rejection = rejection;
                this.context = context;
              }
              ReportTask.prototype.run = function() {
                if (!this.rejection.handled && !this.rejection.reported) {
                  this.rejection.reported = true;
                  emitRejection('unhandledRejection', this.rejection) || Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
                }
              };
              function UnreportTask(rejection) {
                this.rejection = rejection;
              }
              UnreportTask.prototype.run = function() {
                if (this.rejection.reported) {
                  emitRejection('rejectionHandled', this.rejection) || Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
                }
              };
              Promise.createContext = Promise.enterContext = Promise.exitContext = Promise.onPotentiallyUnhandledRejection = Promise.onPotentiallyUnhandledRejectionHandled = Promise.onFatalRejection = noop;
              var foreverPendingHandler = new Handler();
              var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);
              function cycle() {
                return new Rejected(new TypeError('Promise cycle'));
              }
              function ContinuationTask(continuation, handler) {
                this.continuation = continuation;
                this.handler = handler;
              }
              ContinuationTask.prototype.run = function() {
                this.handler.join().when(this.continuation);
              };
              function ProgressTask(value, handler) {
                this.handler = handler;
                this.value = value;
              }
              ProgressTask.prototype.run = function() {
                var q = this.handler.consumers;
                if (q === void 0) {
                  return;
                }
                for (var c,
                    i = 0; i < q.length; ++i) {
                  c = q[i];
                  runNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);
                }
              };
              function AssimilateTask(then, thenable, resolver) {
                this._then = then;
                this.thenable = thenable;
                this.resolver = resolver;
              }
              AssimilateTask.prototype.run = function() {
                var h = this.resolver;
                tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);
                function _resolve(x) {
                  h.resolve(x);
                }
                function _reject(x) {
                  h.reject(x);
                }
                function _notify(x) {
                  h.notify(x);
                }
              };
              function tryAssimilate(then, thenable, resolve, reject, notify) {
                try {
                  then.call(thenable, resolve, reject, notify);
                } catch (e) {
                  reject(e);
                }
              }
              function Fold(f, z, c, to) {
                this.f = f;
                this.z = z;
                this.c = c;
                this.to = to;
                this.resolver = failIfRejected;
                this.receiver = this;
              }
              Fold.prototype.fulfilled = function(x) {
                this.f.call(this.c, this.z, x, this.to);
              };
              Fold.prototype.rejected = function(x) {
                this.to.reject(x);
              };
              Fold.prototype.progress = function(x) {
                this.to.notify(x);
              };
              function isPromise(x) {
                return x instanceof Promise;
              }
              function maybeThenable(x) {
                return (typeof x === 'object' || typeof x === 'function') && x !== null;
              }
              function runContinuation1(f, h, receiver, next) {
                if (typeof f !== 'function') {
                  return next.become(h);
                }
                Promise.enterContext(h);
                tryCatchReject(f, h.value, receiver, next);
                Promise.exitContext();
              }
              function runContinuation3(f, x, h, receiver, next) {
                if (typeof f !== 'function') {
                  return next.become(h);
                }
                Promise.enterContext(h);
                tryCatchReject3(f, x, h.value, receiver, next);
                Promise.exitContext();
              }
              function runNotify(f, x, h, receiver, next) {
                if (typeof f !== 'function') {
                  return next.notify(x);
                }
                Promise.enterContext(h);
                tryCatchReturn(f, x, receiver, next);
                Promise.exitContext();
              }
              function tryCatch2(f, a, b) {
                try {
                  return f(a, b);
                } catch (e) {
                  return reject(e);
                }
              }
              function tryCatchReject(f, x, thisArg, next) {
                try {
                  next.become(getHandler(f.call(thisArg, x)));
                } catch (e) {
                  next.become(new Rejected(e));
                }
              }
              function tryCatchReject3(f, x, y, thisArg, next) {
                try {
                  f.call(thisArg, x, y, next);
                } catch (e) {
                  next.become(new Rejected(e));
                }
              }
              function tryCatchReturn(f, x, thisArg, next) {
                try {
                  next.notify(f.call(thisArg, x));
                } catch (e) {
                  next.notify(e);
                }
              }
              function inherit(Parent, Child) {
                Child.prototype = objectCreate(Parent.prototype);
                Child.prototype.constructor = Child;
              }
              function snd(x, y) {
                return y;
              }
              function noop() {}
              function initEmitRejection() {
                if (typeof process !== 'undefined' && process !== null && typeof process.emit === 'function') {
                  return function(type, rejection) {
                    return type === 'unhandledRejection' ? process.emit(type, rejection.value, rejection) : process.emit(type, rejection);
                  };
                } else if (typeof self !== 'undefined' && typeof CustomEvent === 'function') {
                  return (function(noop, self, CustomEvent) {
                    var hasCustomEvent = false;
                    try {
                      var ev = new CustomEvent('unhandledRejection');
                      hasCustomEvent = ev instanceof CustomEvent;
                    } catch (e) {}
                    return !hasCustomEvent ? noop : function(type, rejection) {
                      var ev = new CustomEvent(type, {
                        detail: {
                          reason: rejection.value,
                          key: rejection
                        },
                        bubbles: false,
                        cancelable: true
                      });
                      return !self.dispatchEvent(ev);
                    };
                  }(noop, self, CustomEvent));
                }
                return noop;
              }
              return Promise;
            };
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      25: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function() {
            return {
              pending: toPendingState,
              fulfilled: toFulfilledState,
              rejected: toRejectedState,
              inspect: inspect
            };
            function toPendingState() {
              return {state: 'pending'};
            }
            function toRejectedState(e) {
              return {
                state: 'rejected',
                reason: e
              };
            }
            function toFulfilledState(x) {
              return {
                state: 'fulfilled',
                value: x
              };
            }
            function inspect(handler) {
              var state = handler.state();
              return state === 0 ? toPendingState() : state > 0 ? toFulfilledState(handler.value) : toRejectedState(handler.value);
            }
          });
        }(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory();
        }));
      }, {}],
      26: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var _liftAll = require('./lib/liftAll');
            var setTimer = require('./lib/env').setTimer;
            var slice = Array.prototype.slice;
            var _apply = require('./lib/apply')(when.Promise, dispatch);
            return {
              lift: lift,
              liftAll: liftAll,
              apply: apply,
              call: call,
              createCallback: createCallback,
              bindCallback: bindCallback,
              liftCallback: liftCallback
            };
            function apply(f, args) {
              return _apply(f, this, args || []);
            }
            function dispatch(f, thisArg, args, h) {
              var cb = createCallback(h);
              try {
                switch (args.length) {
                  case 2:
                    f.call(thisArg, args[0], args[1], cb);
                    break;
                  case 1:
                    f.call(thisArg, args[0], cb);
                    break;
                  case 0:
                    f.call(thisArg, cb);
                    break;
                  default:
                    args.push(cb);
                    f.apply(thisArg, args);
                }
              } catch (e) {
                h.reject(e);
              }
            }
            function call(f) {
              return _apply(f, this, slice.call(arguments, 1));
            }
            function lift(f) {
              var args1 = arguments.length > 1 ? slice.call(arguments, 1) : [];
              return function() {
                var l = args1.length;
                var al = arguments.length;
                var args = new Array(al + l);
                var i;
                for (i = 0; i < l; ++i) {
                  args[i] = args1[i];
                }
                for (i = 0; i < al; ++i) {
                  args[i + l] = arguments[i];
                }
                return _apply(f, this, args);
              };
            }
            function liftAll(src, combine, dst) {
              return _liftAll(lift, combine, dst, src);
            }
            function createCallback(resolver) {
              return function(err, value) {
                if (err) {
                  resolver.reject(err);
                } else if (arguments.length > 2) {
                  resolver.resolve(slice.call(arguments, 1));
                } else {
                  resolver.resolve(value);
                }
              };
            }
            function bindCallback(promise, callback) {
              promise = when(promise);
              if (callback) {
                promise.then(success, wrapped);
              }
              return promise;
              function success(value) {
                wrapped(null, value);
              }
              function wrapped(err, value) {
                setTimer(function() {
                  callback(err, value);
                }, 0);
              }
            }
            function liftCallback(callback) {
              return function(promise) {
                return bindCallback(promise, callback);
              };
            }
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./lib/apply": 11,
        "./lib/env": 21,
        "./lib/liftAll": 23,
        "./when": 32
      }],
      27: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var all = when.Promise.all;
            var slice = Array.prototype.slice;
            return function parallel(tasks) {
              return all(slice.call(arguments, 1)).then(function(args) {
                return when.map(tasks, function(task) {
                  return task.apply(void 0, args);
                });
              });
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      28: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var all = when.Promise.all;
            var slice = Array.prototype.slice;
            return function pipeline(tasks) {
              var runTask = function(args, task) {
                runTask = function(arg, task) {
                  return task(arg);
                };
                return task.apply(null, args);
              };
              return all(slice.call(arguments, 1)).then(function(args) {
                return when.reduce(tasks, function(arg, task) {
                  return runTask(arg, task);
                }, args);
              });
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      29: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var when = require('./when');
            var attempt = when['try'];
            var cancelable = require('./cancelable');
            return function poll(task, interval, verifier, delayInitialTask) {
              var deferred,
                  canceled,
                  reject;
              canceled = false;
              deferred = cancelable(when.defer(), function() {
                canceled = true;
              });
              reject = deferred.reject;
              verifier = verifier || function() {
                return false;
              };
              if (typeof interval !== 'function') {
                interval = (function(interval) {
                  return function() {
                    return when().delay(interval);
                  };
                })(interval);
              }
              function certify(result) {
                deferred.resolve(result);
              }
              function schedule(result) {
                attempt(interval).then(vote, reject);
                if (result !== void 0) {
                  deferred.notify(result);
                }
              }
              function vote() {
                if (canceled) {
                  return;
                }
                when(task(), function(result) {
                  when(verifier(result), function(verification) {
                    return verification ? certify(result) : schedule(result);
                  }, function() {
                    schedule(result);
                  });
                }, reject);
              }
              if (delayInitialTask) {
                schedule();
              } else {
                vote();
              }
              deferred.promise = Object.create(deferred.promise);
              deferred.promise.cancel = deferred.cancel;
              return deferred.promise;
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./cancelable": 3,
        "./when": 32
      }],
      30: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            var all = when.Promise.all;
            var slice = Array.prototype.slice;
            return function sequence(tasks) {
              var results = [];
              return all(slice.call(arguments, 1)).then(function(args) {
                return when.reduce(tasks, function(results, task) {
                  return when(task.apply(void 0, args), addResult);
                }, results);
              });
              function addResult(result) {
                results.push(result);
                return results;
              }
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      31: [function(require, module, exports) {
        (function(define) {
          define(function(require) {
            var when = require('./when');
            return function timeout(msec, trigger) {
              return when(trigger).timeout(msec);
            };
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {"./when": 32}],
      32: [function(require, module, exports) {
        (function(define) {
          'use strict';
          define(function(require) {
            var timed = require('./lib/decorators/timed');
            var array = require('./lib/decorators/array');
            var flow = require('./lib/decorators/flow');
            var fold = require('./lib/decorators/fold');
            var inspect = require('./lib/decorators/inspect');
            var generate = require('./lib/decorators/iterate');
            var progress = require('./lib/decorators/progress');
            var withThis = require('./lib/decorators/with');
            var unhandledRejection = require('./lib/decorators/unhandledRejection');
            var TimeoutError = require('./lib/TimeoutError');
            var Promise = [array, flow, fold, generate, progress, inspect, withThis, timed, unhandledRejection].reduce(function(Promise, feature) {
              return feature(Promise);
            }, require('./lib/Promise'));
            var apply = require('./lib/apply')(Promise);
            when.promise = promise;
            when.resolve = Promise.resolve;
            when.reject = Promise.reject;
            when.lift = lift;
            when['try'] = attempt;
            when.attempt = attempt;
            when.iterate = Promise.iterate;
            when.unfold = Promise.unfold;
            when.join = join;
            when.all = all;
            when.settle = settle;
            when.any = lift(Promise.any);
            when.some = lift(Promise.some);
            when.race = lift(Promise.race);
            when.map = map;
            when.filter = filter;
            when.reduce = lift(Promise.reduce);
            when.reduceRight = lift(Promise.reduceRight);
            when.isPromiseLike = isPromiseLike;
            when.Promise = Promise;
            when.defer = defer;
            when.TimeoutError = TimeoutError;
            function when(x, onFulfilled, onRejected, onProgress) {
              var p = Promise.resolve(x);
              if (arguments.length < 2) {
                return p;
              }
              return p.then(onFulfilled, onRejected, onProgress);
            }
            function promise(resolver) {
              return new Promise(resolver);
            }
            function lift(f) {
              return function() {
                for (var i = 0,
                    l = arguments.length,
                    a = new Array(l); i < l; ++i) {
                  a[i] = arguments[i];
                }
                return apply(f, this, a);
              };
            }
            function attempt(f) {
              for (var i = 0,
                  l = arguments.length - 1,
                  a = new Array(l); i < l; ++i) {
                a[i] = arguments[i + 1];
              }
              return apply(f, this, a);
            }
            function defer() {
              return new Deferred();
            }
            function Deferred() {
              var p = Promise._defer();
              function resolve(x) {
                p._handler.resolve(x);
              }
              function reject(x) {
                p._handler.reject(x);
              }
              function notify(x) {
                p._handler.notify(x);
              }
              this.promise = p;
              this.resolve = resolve;
              this.reject = reject;
              this.notify = notify;
              this.resolver = {
                resolve: resolve,
                reject: reject,
                notify: notify
              };
            }
            function isPromiseLike(x) {
              return x && typeof x.then === 'function';
            }
            function join() {
              return Promise.all(arguments);
            }
            function all(promises) {
              return when(promises, Promise.all);
            }
            function settle(promises) {
              return when(promises, Promise.settle);
            }
            function map(promises, mapFunc) {
              return when(promises, function(promises) {
                return Promise.map(promises, mapFunc);
              });
            }
            function filter(promises, predicate) {
              return when(promises, function(promises) {
                return Promise.filter(promises, predicate);
              });
            }
            return when;
          });
        })(typeof define === 'function' && define.amd ? define : function(factory) {
          module.exports = factory(require);
        });
      }, {
        "./lib/Promise": 8,
        "./lib/TimeoutError": 10,
        "./lib/apply": 11,
        "./lib/decorators/array": 12,
        "./lib/decorators/flow": 13,
        "./lib/decorators/fold": 14,
        "./lib/decorators/inspect": 15,
        "./lib/decorators/iterate": 16,
        "./lib/decorators/progress": 17,
        "./lib/decorators/timed": 18,
        "./lib/decorators/unhandledRejection": 19,
        "./lib/decorators/with": 20
      }]
    }, {}, [1])(1);
  });
  ;
})(require('process'));
