/* */ 
"format cjs";
(function(process) {
  !function() {
    function e() {
      !function(e) {
        function t(e, t) {
          var n;
          if (e instanceof Error) {
            var n = new Error(e.message, e.fileName, e.lineNumber);
            O ? (n.message = e.message + "\n	" + t, n.stack = e.stack) : (n.message = e.message, n.stack = e.stack + "\n	" + t);
          } else
            n = e + "\n	" + t;
          return n;
        }
        function n(e, n, r) {
          try {
            new Function(e).call(r);
          } catch (a) {
            throw t(a, "Evaluating " + n);
          }
        }
        function r() {}
        function a(t) {
          this._loader = {
            loaderObj: this,
            loads: [],
            modules: {},
            importPromises: {},
            moduleRecords: {}
          }, R(this, "global", {get: function() {
              return e;
            }});
        }
        function o() {
          a.call(this), this.paths = {};
        }
        function s(e, t) {
          var n,
              r = "",
              a = 0;
          for (var o in e) {
            var s = o.split("*");
            if (s.length > 2)
              throw new TypeError("Only one wildcard in a path is permitted");
            if (1 == s.length) {
              if (t == o) {
                r = o;
                break;
              }
            } else {
              var i = s[0].length;
              i >= a && t.substr(0, s[0].length) == s[0] && t.substr(t.length - s[1].length) == s[1] && (a = i, r = o, n = t.substr(s[0].length, t.length - s[1].length - s[0].length));
            }
          }
          var l = e[r] || t;
          return "string" == typeof n && (l = l.replace("*", n)), l;
        }
        function i() {}
        function l() {
          o.call(this), C.call(this);
        }
        function u() {}
        function d(e, t) {
          l.prototype[e] = t(l.prototype[e] || function() {});
        }
        function c(e) {
          C = e(C || function() {});
        }
        function f(e) {
          for (var t = [],
              n = [],
              r = 0,
              a = e.length; a > r; r++) {
            var o = z.call(t, e[r]);
            -1 === o ? (t.push(e[r]), n.push([r])) : n[o].push(r);
          }
          return {
            names: t,
            indices: n
          };
        }
        function m(e) {
          var t = {};
          if ("object" == typeof e || "function" == typeof e)
            if (T) {
              var n;
              for (var r in e)
                (n = Object.getOwnPropertyDescriptor(e, r)) && R(t, r, n);
            } else {
              var a = e && e.hasOwnProperty;
              for (var r in e)
                (!a || e.hasOwnProperty(r)) && (t[r] = e[r]);
            }
          return t["default"] = e, R(t, "__useDefault", {value: !0}), t;
        }
        function h(e, t, n) {
          for (var r in t)
            n && r in e || (e[r] = t[r]);
          return e;
        }
        function p(e, t, n) {
          for (var r in t) {
            var a = t[r];
            r in e ? a instanceof Array && e[r] instanceof Array ? e[r] = [].concat(n ? a : e[r]).concat(n ? e[r] : a) : "object" == typeof a && "object" == typeof e[r] ? e[r] = h(h({}, e[r]), a, n) : n || (e[r] = a) : e[r] = a;
          }
        }
        function g(e) {
          this.warnings && "undefined" != typeof console && console.warn;
        }
        function v(e, t) {
          for (var n = e.split("."); n.length; )
            t = t[n.shift()];
          return t;
        }
        function y() {
          if (q[this.baseURL])
            return q[this.baseURL];
          "/" != this.baseURL[this.baseURL.length - 1] && (this.baseURL += "/");
          var e = new L(this.baseURL, M);
          return this.baseURL = e.href, q[this.baseURL] = e;
        }
        function b() {
          return {
            name: null,
            deps: null,
            declare: null,
            execute: null,
            executingRequire: !1,
            declarative: !1,
            normalizedDeps: null,
            groupIndex: null,
            evaluated: !1,
            module: null,
            esModule: null,
            esmExports: !1
          };
        }
        function w(e) {
          var t,
              n,
              r,
              r = "~" == e[0],
              a = e.lastIndexOf("|");
          return -1 != a ? (t = e.substr(a + 1), n = e.substr(r, a - r) || "@system-env") : (t = null, n = e.substr(r)), {
            module: n,
            prop: t,
            negate: r
          };
        }
        function x(e) {
          return (e.negate ? "~" : "") + e.module + (e.prop ? "|" + e.prop : "");
        }
        function k(e, t, n) {
          return this["import"](e.module, t).then(function(t) {
            return e.prop ? t = v(e.prop, t) : "object" == typeof t && t + "" == "Module" && (t = t["default"]), e.negate ? !t : t;
          });
        }
        function S(e, t) {
          var n = e.match(B);
          if (!n)
            return Promise.resolve(e);
          var r = w(n[0].substr(2, n[0].length - 3));
          return this.builder ? this.normalize(r.module, t).then(function(t) {
            return r.module = t, e.replace(B, "#{" + x(r) + "}");
          }) : k.call(this, r, t, !1).then(function(n) {
            if ("string" != typeof n)
              throw new TypeError("The condition value for " + e + " doesn't resolve to a string.");
            if (-1 != n.indexOf("/"))
              throw new TypeError("Unabled to interpolate conditional " + e + (t ? " in " + t : "") + "\n	The condition value " + n + ' cannot contain a "/" separator.');
            return e.replace(B, n);
          });
        }
        function E(e, t) {
          var n = e.lastIndexOf("#?");
          if (-1 == n)
            return Promise.resolve(e);
          var r = w(e.substr(n + 2));
          return this.builder ? this.normalize(r.module, t).then(function(t) {
            return r.module = t, e.substr(0, n) + "#?" + x(r);
          }) : k.call(this, r, t, !0).then(function(t) {
            return t ? e.substr(0, n) : "@empty";
          });
        }
        function P(e, t) {
          for (var n in e.loadedBundles_)
            if (-1 != z.call(e.bundles[n], t))
              return Promise.resolve(n);
          for (var n in e.bundles)
            if (-1 != z.call(e.bundles[n], t))
              return e.normalize(n).then(function(t) {
                return e.bundles[t] = e.bundles[n], e.loadedBundles_[t] = !0, t;
              });
          return Promise.resolve();
        }
        var j = "undefined" == typeof window && "undefined" != typeof self && "undefined" != typeof importScripts,
            O = "undefined" != typeof window && "undefined" != typeof document,
            _ = "undefined" != typeof process && !!process.platform.match(/^win/);
        e.console || (e.console = {assert: function() {}});
        var R,
            z = Array.prototype.indexOf || function(e) {
              for (var t = 0,
                  n = this.length; n > t; t++)
                if (this[t] === e)
                  return t;
              return -1;
            };
        !function() {
          try {
            Object.defineProperty({}, "a", {}) && (R = Object.defineProperty);
          } catch (e) {
            R = function(e, t, n) {
              try {
                e[t] = n.value || n.get.call(e);
              } catch (r) {}
            };
          }
        }();
        var M;
        if ("undefined" != typeof document && document.getElementsByTagName) {
          if (M = document.baseURI, !M) {
            var I = document.getElementsByTagName("base");
            M = I[0] && I[0].href || window.location.href;
          }
          M = M.split("#")[0].split("?")[0], M = M.substr(0, M.lastIndexOf("/") + 1);
        } else if ("undefined" != typeof process && process.cwd)
          M = "file://" + (_ ? "/" : "") + process.cwd() + "/", _ && (M = M.replace(/\\/g, "/"));
        else {
          if ("undefined" == typeof location)
            throw new TypeError("No environment baseURI");
          M = e.location.href;
        }
        var L = e.URLPolyfill || e.URL;
        R(r.prototype, "toString", {value: function() {
            return "Module";
          }}), function() {
          function o(e) {
            return {
              status: "loading",
              name: e,
              linkSets: [],
              dependencies: [],
              metadata: {}
            };
          }
          function s(e, t, n) {
            return new Promise(c({
              step: n.address ? "fetch" : "locate",
              loader: e,
              moduleName: t,
              moduleMetadata: n && n.metadata || {},
              moduleSource: n.source,
              moduleAddress: n.address
            }));
          }
          function i(e, t, n, r) {
            return new Promise(function(a, o) {
              a(e.loaderObj.normalize(t, n, r));
            }).then(function(t) {
              var n;
              if (e.modules[t])
                return n = o(t), n.status = "linked", n.module = e.modules[t], n;
              for (var r = 0,
                  a = e.loads.length; a > r; r++)
                if (n = e.loads[r], n.name == t)
                  return n;
              return n = o(t), e.loads.push(n), l(e, n), n;
            });
          }
          function l(e, t) {
            u(e, t, Promise.resolve().then(function() {
              return e.loaderObj.locate({
                name: t.name,
                metadata: t.metadata
              });
            }));
          }
          function u(e, t, n) {
            d(e, t, n.then(function(n) {
              return "loading" == t.status ? (t.address = n, e.loaderObj.fetch({
                name: t.name,
                metadata: t.metadata,
                address: n
              })) : void 0;
            }));
          }
          function d(t, r, a) {
            a.then(function(a) {
              return "loading" == r.status ? Promise.resolve(t.loaderObj.translate({
                name: r.name,
                metadata: r.metadata,
                address: r.address,
                source: a
              })).then(function(e) {
                return r.source = e, t.loaderObj.instantiate({
                  name: r.name,
                  metadata: r.metadata,
                  address: r.address,
                  source: e
                });
              }).then(function(a) {
                if (void 0 === a)
                  return r.address = r.address || "<Anonymous Module " + ++E + ">", r.isDeclarative = !0, S.call(t.loaderObj, r).then(function(t) {
                    var a = e.System,
                        o = a.register;
                    a.register = function(e, t, n) {
                      "string" != typeof e && (n = t, t = e), r.declare = n, r.depsList = t;
                    }, n(t, r.address, {}), a.register = o;
                  });
                if ("object" != typeof a)
                  throw TypeError("Invalid instantiate return value");
                r.depsList = a.deps || [], r.execute = a.execute, r.isDeclarative = !1;
              }).then(function() {
                r.dependencies = [];
                for (var e = r.depsList,
                    n = [],
                    a = 0,
                    o = e.length; o > a; a++)
                  (function(e, a) {
                    n.push(i(t, e, r.name, r.address).then(function(t) {
                      if (r.dependencies[a] = {
                        key: e,
                        value: t.name
                      }, "linked" != t.status)
                        for (var n = r.linkSets.concat([]),
                            o = 0,
                            s = n.length; s > o; o++)
                          m(n[o], t);
                    }));
                  })(e[a], a);
                return Promise.all(n);
              }).then(function() {
                r.status = "loaded";
                for (var e = r.linkSets.concat([]),
                    t = 0,
                    n = e.length; n > t; t++)
                  p(e[t], r);
              }) : void 0;
            })["catch"](function(e) {
              r.status = "failed", r.exception = e;
              for (var t = r.linkSets.concat([]),
                  n = 0,
                  a = t.length; a > n; n++)
                g(t[n], r, e);
            });
          }
          function c(e) {
            return function(t, n) {
              var r = e.loader,
                  a = e.moduleName,
                  s = e.step;
              if (r.modules[a])
                throw new TypeError('"' + a + '" already exists in the module table');
              for (var i,
                  c = 0,
                  m = r.loads.length; m > c; c++)
                if (r.loads[c].name == a && (i = r.loads[c], "translate" != s || i.source || (i.address = e.moduleAddress, d(r, i, Promise.resolve(e.moduleSource))), i.linkSets.length))
                  return i.linkSets[0].done.then(function() {
                    t(i);
                  });
              var h = i || o(a);
              h.metadata = e.moduleMetadata;
              var p = f(r, h);
              r.loads.push(h), t(p.done), "locate" == s ? l(r, h) : "fetch" == s ? u(r, h, Promise.resolve(e.moduleAddress)) : (h.address = e.moduleAddress, d(r, h, Promise.resolve(e.moduleSource)));
            };
          }
          function f(e, t) {
            var n = {
              loader: e,
              loads: [],
              startingLoad: t,
              loadingCount: 0
            };
            return n.done = new Promise(function(e, t) {
              n.resolve = e, n.reject = t;
            }), m(n, t), n;
          }
          function m(e, t) {
            if ("failed" != t.status) {
              for (var n = 0,
                  r = e.loads.length; r > n; n++)
                if (e.loads[n] == t)
                  return;
              e.loads.push(t), t.linkSets.push(e), "loaded" != t.status && e.loadingCount++;
              for (var a = e.loader,
                  n = 0,
                  r = t.dependencies.length; r > n; n++)
                if (t.dependencies[n]) {
                  var o = t.dependencies[n].value;
                  if (!a.modules[o])
                    for (var s = 0,
                        i = a.loads.length; i > s; s++)
                      if (a.loads[s].name == o) {
                        m(e, a.loads[s]);
                        break;
                      }
                }
            }
          }
          function h(e) {
            var t = !1;
            try {
              w(e, function(n, r) {
                g(e, n, r), t = !0;
              });
            } catch (n) {
              g(e, null, n), t = !0;
            }
            return t;
          }
          function p(e, t) {
            if (e.loadingCount--, !(e.loadingCount > 0)) {
              var n = e.startingLoad;
              if (e.loader.loaderObj.execute === !1) {
                for (var r = [].concat(e.loads),
                    a = 0,
                    o = r.length; o > a; a++) {
                  var t = r[a];
                  t.module = t.isDeclarative ? {
                    name: t.name,
                    module: P({}),
                    evaluated: !0
                  } : {module: P({})}, t.status = "linked", v(e.loader, t);
                }
                return e.resolve(n);
              }
              var s = h(e);
              s || e.resolve(n);
            }
          }
          function g(e, n, r) {
            var a = e.loader;
            e: if (n)
              if (e.loads[0].name == n.name)
                r = t(r, "Error loading " + n.name);
              else {
                for (var o = 0; o < e.loads.length; o++)
                  for (var s = e.loads[o],
                      i = 0; i < s.dependencies.length; i++) {
                    var l = s.dependencies[i];
                    if (l.value == n.name) {
                      r = t(r, "Error loading " + n.name + ' as "' + l.key + '" from ' + s.name);
                      break e;
                    }
                  }
                r = t(r, "Error loading " + n.name + " from " + e.loads[0].name);
              }
            else
              r = t(r, "Error linking " + e.loads[0].name);
            for (var u = e.loads.concat([]),
                o = 0,
                d = u.length; d > o; o++) {
              var n = u[o];
              a.loaderObj.failed = a.loaderObj.failed || [], -1 == z.call(a.loaderObj.failed, n) && a.loaderObj.failed.push(n);
              var c = z.call(n.linkSets, e);
              if (n.linkSets.splice(c, 1), 0 == n.linkSets.length) {
                var f = z.call(e.loader.loads, n);
                -1 != f && e.loader.loads.splice(f, 1);
              }
            }
            e.reject(r);
          }
          function v(e, t) {
            if (e.loaderObj.trace) {
              e.loaderObj.loads || (e.loaderObj.loads = {});
              var n = {};
              t.dependencies.forEach(function(e) {
                n[e.key] = e.value;
              }), e.loaderObj.loads[t.name] = {
                name: t.name,
                deps: t.dependencies.map(function(e) {
                  return e.key;
                }),
                depMap: n,
                address: t.address,
                metadata: t.metadata,
                source: t.source,
                kind: t.isDeclarative ? "declarative" : "dynamic"
              };
            }
            t.name && (e.modules[t.name] = t.module);
            var r = z.call(e.loads, t);
            -1 != r && e.loads.splice(r, 1);
            for (var a = 0,
                o = t.linkSets.length; o > a; a++)
              r = z.call(t.linkSets[a].loads, t), -1 != r && t.linkSets[a].loads.splice(r, 1);
            t.linkSets.splice(0, t.linkSets.length);
          }
          function y(e, t, n) {
            try {
              var a = t.execute();
            } catch (o) {
              return void n(t, o);
            }
            return a && a instanceof r ? a : void n(t, new TypeError("Execution must define a Module instance"));
          }
          function b(e, t, n) {
            var r = e._loader.importPromises;
            return r[t] = n.then(function(e) {
              return r[t] = void 0, e;
            }, function(e) {
              throw r[t] = void 0, e;
            });
          }
          function w(e, t) {
            var n = e.loader;
            if (e.loads.length)
              for (var r = e.loads.concat([]),
                  a = 0; a < r.length; a++) {
                var o = r[a],
                    s = y(e, o, t);
                if (!s)
                  return;
                o.module = {
                  name: o.name,
                  module: s
                }, o.status = "linked", v(n, o);
              }
          }
          function x(e, t) {
            return t.module.module;
          }
          function k() {}
          function S() {
            throw new TypeError("ES6 transpilation is only provided in the dev module loader build.");
          }
          var E = 0;
          a.prototype = {
            constructor: a,
            define: function(e, t, n) {
              if (this._loader.importPromises[e])
                throw new TypeError("Module is already loading.");
              return b(this, e, new Promise(c({
                step: "translate",
                loader: this._loader,
                moduleName: e,
                moduleMetadata: n && n.metadata || {},
                moduleSource: t,
                moduleAddress: n && n.address
              })));
            },
            "delete": function(e) {
              var t = this._loader;
              return delete t.importPromises[e], delete t.moduleRecords[e], t.modules[e] ? delete t.modules[e] : !1;
            },
            get: function(e) {
              return this._loader.modules[e] ? (k(this._loader.modules[e], [], this), this._loader.modules[e].module) : void 0;
            },
            has: function(e) {
              return !!this._loader.modules[e];
            },
            "import": function(e, t, n) {
              "object" == typeof t && (t = t.name);
              var r = this;
              return Promise.resolve(r.normalize(e, t)).then(function(e) {
                var t = r._loader;
                return t.modules[e] ? (k(t.modules[e], [], t._loader), t.modules[e].module) : t.importPromises[e] || b(r, e, s(t, e, {}).then(function(n) {
                  return delete t.importPromises[e], x(t, n);
                }));
              });
            },
            load: function(e, t) {
              var n = this._loader;
              return n.modules[e] ? (k(n.modules[e], [], n), Promise.resolve(n.modules[e].module)) : n.importPromises[e] || b(this, e, s(n, e, {}).then(function(t) {
                return delete n.importPromises[e], x(n, t);
              }));
            },
            module: function(e, t) {
              var n = o();
              n.address = t && t.address;
              var r = f(this._loader, n),
                  a = Promise.resolve(e),
                  s = this._loader,
                  i = r.done.then(function() {
                    return x(s, n);
                  });
              return d(s, n, a), i;
            },
            newModule: function(e) {
              if ("object" != typeof e)
                throw new TypeError("Expected object");
              var t = new r,
                  n = [];
              if (Object.getOwnPropertyNames && null != e)
                n = Object.getOwnPropertyNames(e);
              else
                for (var a in e)
                  n.push(a);
              for (var o = 0; o < n.length; o++)
                (function(n) {
                  R(t, n, {
                    configurable: !1,
                    enumerable: !0,
                    get: function() {
                      return e[n];
                    }
                  });
                })(n[o]);
              return t;
            },
            set: function(e, t) {
              if (!(t instanceof r))
                throw new TypeError("Loader.set(" + e + ", module) must be a module");
              this._loader.modules[e] = {module: t};
            },
            normalize: function(e, t, n) {
              return e;
            },
            locate: function(e) {
              return e.name;
            },
            fetch: function(e) {},
            translate: function(e) {
              return e.source;
            },
            instantiate: function(e) {}
          };
          var P = a.prototype.newModule;
        }();
        var D;
        i.prototype = a.prototype, o.prototype = new i, u.prototype = o.prototype, l.prototype = new u, l.prototype.constructor = l;
        var C,
            T = !0;
        try {
          Object.getOwnPropertyDescriptor({a: 0}, "a");
        } catch (N) {
          T = !1;
        }
        var U = ["main", "format", "defaultExtension", "modules", "map", "basePath", "depCache"];
        c(function(e) {
          return function() {
            e.call(this), this.map = {};
          };
        }), d("normalize", function() {
          return function(e, t) {
            if ("." != e.substr(0, 1) && "/" != e.substr(0, 1) && !e.match(A)) {
              var n,
                  r = 0;
              for (var a in this.map)
                if (e.substr(0, a.length) == a && (e.length == a.length || "/" == e[a.length])) {
                  var o = a.split("/").length;
                  if (r >= o)
                    continue;
                  n = a, r = o;
                }
              n && (e = this.map[n] + e.substr(n.length));
            }
            return e;
          };
        });
        var A = /^[^\/]+:\/\//,
            q = {},
            J = new L(M);
        c(function(e) {
          return function() {
            e.call(this), this.baseURL = M.substr(0, M.lastIndexOf("/") + 1), this.warnings = !1, this.defaultJSExtensions = !1, this.globalEvaluationScope = !0, this.pluginFirst = !1, (j || O && window.chrome && window.chrome.extension || O && navigator.userAgent.match(/^Node\.js/)) && (this.globalEvaluationScope = !1), this.set("@empty", this.newModule({})), "undefined" != typeof require && require.resolve && "undefined" != typeof process && (this._nodeRequire = require);
          };
        }), d("normalize", function(e) {
          return function(t, n) {
            if ("@node/" == t.substr(0, 6)) {
              if (!this._nodeRequire)
                throw new TypeError("Can only load node core modules in Node.");
              this.set(t, this.newModule(m(this._nodeRequire(t.substr(6)))));
            }
            return t = e.apply(this, arguments), "." == t[0] || "/" == t[0] ? n ? new L(t, n.replace(/#/g, "%05")).href.replace(/%05/g, "#") : new L(t, J).href : t;
          };
        });
        var F = "undefined" != typeof XMLHttpRequest;
        d("locate", function(e) {
          return function(t) {
            return Promise.resolve(e.call(this, t)).then(function(e) {
              return F ? e.replace(/#/g, "%23") : e;
            });
          };
        }), d("fetch", function() {
          return function(e) {
            return new Promise(function(t, n) {
              fetchTextFromURL(e.address, e.metadata.authorization, t, n);
            });
          };
        }), d("import", function(e) {
          return function(t, n, r) {
            return n && n.name && g.call(this, "System.import(name, { name: parentName }) is deprecated for System.import(name, parentName), while importing " + t + " from " + n.name), e.call(this, t, n, r).then(function(e) {
              return e.__useDefault ? e["default"] : e;
            });
          };
        }), l.prototype.config = function(e) {
          function t(e) {
            for (var t in e)
              return !0;
          }
          if ("warnings" in e && (this.warnings = e.warnings), e.baseURL) {
            if (t(this.packages) || t(this.meta) || t(this.depCache) || t(this.bundles) || t(this.packageConfigPaths))
              throw new TypeError("baseURL should only be configured once and must be configured first.");
            this.baseURL = e.baseURL, y.call(this);
          }
          if (e.defaultJSExtensions && (this.defaultJSExtensions = e.defaultJSExtensions, g.call(this, "The defaultJSExtensions configuration option is deprecated, use packages configuration instead.")), e.pluginFirst && (this.pluginFirst = e.pluginFirst), e.paths)
            for (var n in e.paths)
              this.paths[n] = e.paths[n];
          if (e.map) {
            var r = "";
            for (var n in e.map) {
              var a = e.map[n];
              if ("string" != typeof a) {
                r += (r.length ? ", " : "") + '"' + n + '"';
                var o = this.normalizeSync(n);
                this.defaultJSExtensions && ".js" != n.substr(n.length - 3, 3) && (o = o.substr(0, o.length - 3));
                var s = "";
                for (var i in this.packages)
                  o.substr(0, i.length) == i && (!o[i.length] || "/" == o[i.length]) && s.split("/").length < i.split("/").length && (s = i);
                s && this.packages[s].main && (o = o.substr(0, o.length - this.packages[s].main.length - 1));
                var i = this.packages[o] = this.packages[o] || {};
                i.map = a;
              } else
                this.map[n] = a;
            }
            r && g.call(this, "The map configuration for " + r + ' uses object submaps, which is deprecated in global map.\nUpdate this to use package contextual map with configs like System.config({ packages: { "' + n + '": { map: {...} } } }).');
          }
          if (e.packageConfigPaths) {
            for (var l = [],
                u = 0; u < e.packageConfigPaths.length; u++) {
              var d = e.packageConfigPaths[u],
                  c = Math.max(d.lastIndexOf("*") + 1, d.lastIndexOf("/")),
                  o = this.normalizeSync(d.substr(0, c) + "/");
              this.defaultJSExtensions && ".js" != d.substr(d.length - 3, 3) && (o = o.substr(0, o.length - 3)), l[u] = o.substr(0, o.length - 1) + d.substr(c);
            }
            this.packageConfigPaths = l;
          }
          if (e.packages)
            for (var n in e.packages) {
              if (n.match(/^([^\/]+:)?\/\/$/))
                throw new TypeError('"' + n + '" is not a valid package name.');
              var f = this.normalizeSync(n + ("/" != n[n.length - 1] ? "/" : ""));
              f = f.substr(0, f.length - 1), !this.packages[f] && this.defaultJSExtensions && ".js" != n.substr(n.length - 3, 3) && (f = f.substr(0, f.length - 3)), this.packages[f] = this.packages[f] || {}, e.packages[n].meta && (g.call(this, "Package " + n + " is configured with meta, which is deprecated as it has been renamed to modules."), e.packages[n].modules = e.packages[n].meta, delete e.packages[n].meta);
              for (var m in e.packages[n])
                -1 == z.call(U, m) && g.call(this, '"' + m + '" is not a valid package configuration option in package ' + n);
              p(this.packages[f], e.packages[n]);
            }
          if (e.bundles)
            for (var n in e.bundles) {
              for (var h = [],
                  u = 0; u < e.bundles[n].length; u++)
                h.push(this.normalizeSync(e.bundles[n][u]));
              this.bundles[n] = h;
            }
          for (var v in e) {
            var a = e[v],
                b = !1;
            if ("baseURL" != v && "map" != v && "packages" != v && "bundles" != v && "paths" != v && "warnings" != v && "packageConfigPaths" != v)
              if ("object" != typeof a || a instanceof Array)
                this[v] = a;
              else {
                this[v] = this[v] || {}, ("meta" == v || "depCache" == v) && (b = !0);
                for (var n in a)
                  "meta" == v && "*" == n[0] ? this[v][n] = a[n] : b ? this[v][this.normalizeSync(n)] = a[n] : this[v][n] = a[n];
              }
          }
        }, d("normalize", function(e) {
          return function(t, n) {
            var r = e.apply(this, arguments);
            return this.has(r) ? r : r.match(A) ? (this.defaultJSExtensions && ".js" != r.substr(r.length - 3, 3) && (r += ".js"), r) : (r = s(this.paths, r) || r, this.defaultJSExtensions && ".js" != r.substr(r.length - 3, 3) && (r += ".js"), "." == r[0] || "/" == r[0] ? new L(r, J).href : new L(r, y.call(this)).href);
          };
        }), function() {
          function e(e) {
            var t,
                n,
                r = 0;
            for (var a in this.packages)
              e.substr(0, a.length) !== a || e.length !== a.length && "/" !== e[a.length] || (n = a.split("/").length, n > r && (t = a, r = n));
            return t;
          }
          function t(e, t) {
            var n,
                r = 0;
            for (var a in e)
              if (t.substr(0, a.length) == a && (t.length == a.length || "/" == t[a.length])) {
                var o = a.split("/").length;
                if (r >= o)
                  continue;
                n = a, r = o;
              }
            return n;
          }
          function n(e) {
            var t = e.basePath && "." != e.basePath ? e.basePath : "";
            return t && ("./" == t.substr(0, 2) && (t = t.substr(2)), "/" != t[t.length - 1] && (t += "/")), t;
          }
          function r(e, t, n, r, o, s, i) {
            var l = !(!i && -1 == o.indexOf("#?") && !o.match(B));
            !l && n.modules && f(n.modules, t, o, function(e, t, n) {
              (0 == n || e.lastIndexOf("*") != e.length - 1) && (l = !0);
            });
            var u = t + "/" + r + o + (l ? "" : a(n, o));
            return s ? u : E.call(e, u, t + "/").then(function(n) {
              return S.call(e, n, t + "/");
            });
          }
          function a(e, t) {
            if ("/" != t[t.length - 1] && e.defaultExtension !== !1) {
              var n = "." + (e.defaultExtension || "js");
              if (t.substr(t.length - n.length) != n)
                return n;
            }
            return "";
          }
          function o(e, o, s, i, l) {
            function u(e) {
              return "." == e ? o : "./" == e.substr(0, 2) ? r(d, o, s, c, e.substr(2), i, l) : (i ? d.normalizeSync : d.normalize).call(d, e);
            }
            var d = this,
                c = n(s);
            if (o === e && s.main && (e += "/" + ("./" == s.main.substr(0, 2) ? s.main.substr(2) : s.main)), e.length == o.length + 1 && "/" == e[o.length])
              return e;
            if (e.length == o.length)
              return e + (d.defaultJSExtensions && ".js" != e.substr(e.length - 3, 3) ? ".js" : "");
            if (s.map)
              var f = "." + e.substr(o.length),
                  m = t(s.map, f) || !l && t(s.map, f += a(s, f.substr(2))),
                  h = s.map[m];
            return "string" == typeof h ? u(h + f.substr(m.length)) : i || !h ? r(d, o, s, c, e.substr(o.length + 1), i, l) : d.builder ? o + "#:" + m.substr(2) : d["import"](s.map["@env"] || "@system-env", o).then(function(e) {
              for (var t in h) {
                var n = "~" == t[0],
                    r = v(n ? t.substr(1) : t, e);
                if (!n && r || n && !r)
                  return h[t] + f.substr(m.length);
              }
            }).then(function(t) {
              return t ? u(t) : r(d, o, s, c, e.substr(o.length + 1), i, l);
            });
          }
          function s(r, a) {
            return function(s, l, d) {
              function c(t, n, r) {
                n = n || e.call(b, t);
                var r = r || n && b.packages[n];
                return r ? o.call(b, t, n, r, a, d) : t + (v ? ".js" : "");
              }
              if (d = d === !0, l)
                var f = e.call(this, l) || this.defaultJSExtensions && ".js" == l.substr(l.length - 3, 3) && e.call(this, l.substr(0, l.length - 3));
              if (f) {
                var h = n(this.packages[f]);
                if (h && l.substr(f.length + 1, h.length) == h && (l = f + l.substr(f.length + h.length)), "." !== s[0]) {
                  var p = this.packages[f].map;
                  if (p) {
                    var g = t(p, s);
                    g && (s = p[g] + s.substr(g.length), "." === s[0] && (l = f + "/"));
                  }
                }
              }
              var v = this.defaultJSExtensions && ".js" != s.substr(s.length - 3, 3),
                  y = r.call(this, s, l);
              v && ".js" != y.substr(y.length - 3, 3) && (v = !1), v && (y = y.substr(0, y.length - 3)), f && "." == s[0] && y == f + "/" && (y = f);
              var b = this;
              if (a)
                return c(y);
              var w = e.call(this, y),
                  x = w && this.packages[w];
              if (x && x.configured)
                return c(y, w, x);
              var k = i(b, y);
              return k.pkgName ? Promise.resolve(P(b, y)).then(function(e) {
                if (e || m[k.pkgName]) {
                  var t = m[k.pkgName] = m[k.pkgName] || {
                    bundles: [],
                    promise: Promise.resolve()
                  };
                  return e && -1 == z.call(t.bundles, e) && (t.bundles.push(e), t.promise = Promise.all([t.promise, b.load(e)])), t.promise;
                }
              }).then(function() {
                return c(y, k.pkgName);
              }).then(function(e) {
                return e in b.defined ? e : u(b, k).then(function() {
                  return c(y);
                });
              }) : c(y, w, x);
            };
          }
          function i(e, t) {
            for (var n,
                r = [],
                a = 0; a < e.packageConfigPaths.length; a++) {
              var o = e.packageConfigPaths[a],
                  s = Math.max(o.lastIndexOf("*") + 1, o.lastIndexOf("/")),
                  i = t.match(h[o] || (h[o] = new RegExp("^(" + o.substr(0, s).replace(/\*/g, "[^\\/]+") + ")(/|$)")));
              !i || n && n != i[1] || (n = i[1], r.push(n + o.substr(s)));
            }
            return {
              pkgName: n,
              configPaths: r
            };
          }
          function u(e, t) {
            var n = e.packages[t.pkgName];
            return n && n.configured ? Promise.resolve() : y[t.pkgName] || (y[t.pkgName] = Promise.resolve().then(function() {
              for (var r = [],
                  a = 0; a < t.configPaths.length; a++)
                (function(a) {
                  r.push(e.fetch({
                    name: a,
                    address: a,
                    metadata: {}
                  }).then(function(e) {
                    try {
                      return JSON.parse(e);
                    } catch (t) {
                      throw new Error("Invalid JSON in package configuration file " + a);
                    }
                  }).then(function(r) {
                    r.systemjs && (r = r.systemjs), r.meta && (r.modules = r.meta, g.call(e, "Package config file " + a + " is configured with meta, which is deprecated as it has been renamed to modules."));
                    for (var o in r)
                      -1 == z.call(U, o) && delete r[o];
                    if (r.main instanceof Array && (r.main = r.main[0]), n && p(r, n), r.depCache)
                      for (var s in r.depCache)
                        if ("./" != s.substr(0, 2)) {
                          var i = e.normalizeSync(s);
                          e.depCache[i] = (e.depCache[i] || []).concat(r.depCache[s]);
                        }
                    n = e.packages[t.pkgName] = r;
                  }));
                })(t.configPaths[a]);
              return Promise.all(r);
            }));
          }
          function f(e, t, n, r) {
            var a;
            for (var o in e) {
              var s = "./" == o.substr(0, 2) ? "./" : "";
              s && (o = o.substr(2)), a = o.indexOf("*"), -1 !== a && o.substr(0, a) == n.substr(0, a) && o.substr(a + 1) == n.substr(n.length - o.length + a + 1) && r(o, e[s + o], o.split("/").length);
            }
            var i = e[n] || e["./" + n];
            i && r(i, i, 0);
          }
          c(function(e) {
            return function() {
              e.call(this), this.packages = {}, this.packageConfigPaths = {};
            };
          });
          var m = {},
              h = {},
              y = {};
          l.prototype.normalizeSync = l.prototype.normalize, d("normalizeSync", function(e) {
            return s(e, !0);
          }), d("normalize", function(e) {
            return s(e, !1);
          }), d("locate", function(t) {
            return function(r) {
              var a = this;
              return Promise.resolve(t.call(this, r)).then(function(t) {
                var o = e.call(a, r.name);
                if (o) {
                  var s = a.packages[o],
                      i = n(s),
                      l = r.name.substr(o.length + i.length + 1);
                  if (s.format && (r.metadata.format = r.metadata.format || s.format), s.depCache)
                    for (var u in s.depCache)
                      if (u == "./" + l)
                        for (var d = s.depCache[u],
                            c = 0; c < d.length; c++)
                          a["import"](d[c], o + "/");
                  var m = {};
                  if (s.modules) {
                    var h = 0;
                    f(s.modules, o, l, function(e, t, n) {
                      n > h && (h = n), p(m, t, n && h > n);
                    }), m.alias && "./" == m.alias.substr(0, 2) && (m.alias = o + m.alias.substr(1)), m.loader && "./" == m.loader.substr(0, 2) && (m.loader = o + m.loader.substr(1)), p(r.metadata, m);
                  }
                }
                return t;
              });
            };
          });
        }(), function() {
          function t() {
            if (o && "interactive" === o.script.readyState)
              return o.load;
            for (var e = 0; e < l.length; e++)
              if ("interactive" == l[e].script.readyState)
                return o = l[e], o.load;
          }
          function n(e, t) {
            return new Promise(function(e, n) {
              t.metadata.integrity && n(new Error("Subresource integrity checking is not supported in web workers.")), s = t;
              try {
                importScripts(t.address);
              } catch (r) {
                s = null, n(r);
              }
              s = null, t.metadata.entry || n(new Error(t.address + " did not call System.register or AMD define")), e("");
            });
          }
          if ("undefined" != typeof document)
            var r = document.getElementsByTagName("head")[0];
          var a,
              o,
              s = null,
              i = r && function() {
                var e = document.createElement("script"),
                    t = "undefined" != typeof opera && "[object Opera]" === opera.toString();
                return e.attachEvent && !(e.attachEvent.toString && e.attachEvent.toString().indexOf("[native code") < 0) && !t;
              }(),
              l = [],
              u = 0,
              c = [];
          d("pushRegister_", function(e) {
            return function(n) {
              return e.call(this, n) ? !1 : (s ? this.reduceRegister_(s, n) : i ? this.reduceRegister_(t(), n) : u ? c.push(n) : this.reduceRegister_(null, n), !0);
            };
          }), d("fetch", function(t) {
            return function(s) {
              var d = this;
              return s.metadata.scriptLoad && (O || j) ? j ? n(d, s) : new Promise(function(t, n) {
                function f(e) {
                  if (!p.readyState || "loaded" == p.readyState || "complete" == p.readyState) {
                    if (u--, s.metadata.entry || c.length) {
                      if (!i) {
                        for (var r = 0; r < c.length; r++)
                          d.reduceRegister_(s, c[r]);
                        c = [];
                      }
                    } else
                      d.reduceRegister_(s);
                    h(), s.metadata.entry || s.metadata.bundle || n(new Error(s.name + " did not call System.register or AMD define")), t("");
                  }
                }
                function m(e) {
                  h(), n(new Error("Unable to load script " + s.address));
                }
                function h() {
                  if (e.System = a, p.detachEvent) {
                    p.detachEvent("onreadystatechange", f);
                    for (var t = 0; t < l.length; t++)
                      l[t].script == p && (o && o.script == p && (o = null), l.splice(t, 1));
                  } else
                    p.removeEventListener("load", f, !1), p.removeEventListener("error", m, !1);
                  r.removeChild(p);
                }
                var p = document.createElement("script");
                p.async = !0, s.metadata.integrity && p.setAttribute("integrity", s.metadata.integrity), i ? (p.attachEvent("onreadystatechange", f), l.push({
                  script: p,
                  load: s
                })) : (p.addEventListener("load", f, !1), p.addEventListener("error", m, !1)), u++, a = e.System, p.src = s.address, r.appendChild(p);
              }) : t.call(this, s);
            };
          });
        }(), function() {
          function t(e, n, r) {
            if (r[e.groupIndex] = r[e.groupIndex] || [], -1 == z.call(r[e.groupIndex], e)) {
              r[e.groupIndex].push(e);
              for (var a = 0,
                  o = e.normalizedDeps.length; o > a; a++) {
                var s = e.normalizedDeps[a],
                    i = n.defined[s];
                if (i && !i.evaluated) {
                  var l = e.groupIndex + (i.declarative != e.declarative);
                  if (null === i.groupIndex || i.groupIndex < l) {
                    if (null !== i.groupIndex && (r[i.groupIndex].splice(z.call(r[i.groupIndex], i), 1), 0 == r[i.groupIndex].length))
                      throw new Error("Mixed dependency cycle detected");
                    i.groupIndex = l;
                  }
                  t(i, n, r);
                }
              }
            }
          }
          function n(e, n) {
            var r = n.defined[e];
            if (!r.module) {
              r.groupIndex = 0;
              var a = [];
              t(r, n, a);
              for (var s = !!r.declarative == a.length % 2,
                  l = a.length - 1; l >= 0; l--) {
                for (var u = a[l],
                    d = 0; d < u.length; d++) {
                  var c = u[d];
                  s ? o(c, n) : i(c, n);
                }
                s = !s;
              }
            }
          }
          function r() {}
          function a(e, t) {
            return t[e] || (t[e] = {
              name: e,
              dependencies: [],
              exports: new r,
              importers: []
            });
          }
          function o(t, n) {
            if (!t.module) {
              var r = n._loader.moduleRecords,
                  s = t.module = a(t.name, r),
                  i = t.module.exports,
                  l = t.declare.call(e, function(e, t) {
                    if (s.locked = !0, "object" == typeof e)
                      for (var n in e)
                        i[n] = e[n];
                    else
                      i[e] = t;
                    for (var r = 0,
                        a = s.importers.length; a > r; r++) {
                      var o = s.importers[r];
                      if (!o.locked) {
                        var l = z.call(o.dependencies, s);
                        o.setters[l](i);
                      }
                    }
                    return s.locked = !1, t;
                  });
              if (s.setters = l.setters, s.execute = l.execute, !s.setters || !s.execute)
                throw new TypeError("Invalid System.register form for " + t.name);
              for (var u = 0,
                  d = t.normalizedDeps.length; d > u; u++) {
                var c,
                    f = t.normalizedDeps[u],
                    m = n.defined[f],
                    h = r[f];
                h ? c = h.exports : m && !m.declarative ? c = m.esModule : m ? (o(m, n), h = m.module, c = h.exports) : c = n.get(f), h && h.importers ? (h.importers.push(s), s.dependencies.push(h)) : s.dependencies.push(null);
                for (var p = t.originalIndices[u],
                    g = 0,
                    v = p.length; v > g; ++g) {
                  var y = p[g];
                  s.setters[y] && s.setters[y](c);
                }
              }
            }
          }
          function s(e, t) {
            var n,
                r = t.defined[e];
            if (r)
              r.declarative ? u(e, [], t) : r.evaluated || i(r, t), n = r.module.exports;
            else if (n = t.get(e), !n)
              throw new Error("Unable to load dependency " + e + ".");
            return (!r || r.declarative) && n && n.__useDefault ? n["default"] : n;
          }
          function i(t, n) {
            if (!t.module) {
              var r = {},
                  a = t.module = {
                    exports: r,
                    id: t.name
                  };
              if (!t.executingRequire)
                for (var o = 0,
                    l = t.normalizedDeps.length; l > o; o++) {
                  var u = t.normalizedDeps[o],
                      d = n.defined[u];
                  d && i(d, n);
                }
              t.evaluated = !0;
              var c = t.execute.call(e, function(e) {
                for (var r = 0,
                    a = t.deps.length; a > r; r++)
                  if (t.deps[r] == e)
                    return s(t.normalizedDeps[r], n);
                throw new Error("Module " + e + " not declared as a dependency.");
              }, r, a);
              c && (a.exports = c), r = a.exports, r && r.__esModule ? t.esModule = r : t.esmExports ? t.esModule = m(r) : t.esModule = {"default": r};
            }
          }
          function u(t, n, r) {
            var a = r.defined[t];
            if (a && !a.evaluated && a.declarative) {
              n.push(t);
              for (var o = 0,
                  s = a.normalizedDeps.length; s > o; o++) {
                var i = a.normalizedDeps[o];
                -1 == z.call(n, i) && (r.defined[i] ? u(i, n, r) : r.get(i));
              }
              a.evaluated || (a.evaluated = !0, a.module.execute.call(e));
            }
          }
          function h(e) {
            var t = e.match(p);
            return t && "System.register" == e.substr(t[0].length, 15);
          }
          l.prototype.register = function(e, t, n) {
            if ("string" != typeof e && (n = t, t = e, e = null), "boolean" == typeof n)
              return this.registerDynamic.apply(this, arguments);
            var r = b();
            r.name = e && (this.normalizeSync || this.normalize).call(this, e), r.declarative = !0, r.deps = t, r.declare = n, this.pushRegister_({
              amd: !1,
              entry: r
            });
          }, l.prototype.registerDynamic = function(e, t, n, r) {
            "string" != typeof e && (r = n, n = t, t = e, e = null);
            var a = b();
            a.name = e && (this.normalizeSync || this.normalize).call(this, e), a.deps = t, a.execute = r, a.executingRequire = n, this.pushRegister_({
              amd: !1,
              entry: a
            });
          }, d("reduceRegister_", function() {
            return function(e, t) {
              if (t) {
                var n = t.entry,
                    r = e && e.metadata;
                if (n.name && (n.name in this.defined || (this.defined[n.name] = n), r && (r.bundle = !0)), !n.name || e && n.name == e.name) {
                  if (!r)
                    throw new TypeError("Unexpected anonymous System.register call.");
                  if (r.entry)
                    throw "register" == r.format ? new Error("Multiple anonymous System.register calls in module " + e.name + ". If loading a bundle, ensure all the System.register calls are named.") : new Error("Module " + e.name + " interpreted as " + r.format + " module format, but called System.register.");
                  r.format || (r.format = "register"), r.entry = n;
                }
              }
            };
          }), c(function(e) {
            return function() {
              e.call(this), this.defined = {}, this._loader.moduleRecords = {};
            };
          }), R(r, "toString", {value: function() {
              return "Module";
            }}), d("delete", function(e) {
            return function(t) {
              return delete this._loader.moduleRecords[t], delete this.defined[t], e.call(this, t);
            };
          });
          var p = /^\s*(\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)*\s*/;
          d("fetch", function(e) {
            return function(t) {
              return this.defined[t.name] ? (t.metadata.format = "defined", "") : ("register" != t.metadata.format || t.metadata.authorization || t.metadata.scriptLoad === !1 || (t.metadata.scriptLoad = !0), t.metadata.deps = t.metadata.deps || [], e.call(this, t));
            };
          }), d("translate", function(e) {
            return function(t) {
              return t.metadata.deps = t.metadata.deps || [], Promise.resolve(e.call(this, t)).then(function(e) {
                return ("register" == t.metadata.format || !t.metadata.format && h(t.source)) && (t.metadata.format = "register"), e;
              });
            };
          }), d("instantiate", function(e) {
            return function(e) {
              var t,
                  r = this;
              if (r.defined[e.name])
                t = r.defined[e.name], t.deps = t.deps.concat(e.metadata.deps);
              else if (e.metadata.entry)
                t = e.metadata.entry, t.deps = t.deps.concat(e.metadata.deps);
              else if (!(r.builder && e.metadata.bundle || "register" != e.metadata.format && "esm" != e.metadata.format && "es6" != e.metadata.format)) {
                if ("undefined" != typeof __exec && __exec.call(r, e), !e.metadata.entry && !e.metadata.bundle)
                  throw new Error(e.name + " detected as " + e.metadata.format + " but didn't execute.");
                t = e.metadata.entry, t && e.metadata.deps && (t.deps = t.deps.concat(e.metadata.deps));
              }
              t || (t = b(), t.deps = e.metadata.deps, t.execute = function() {}), r.defined[e.name] = t;
              var a = f(t.deps);
              t.deps = a.names, t.originalIndices = a.indices, t.name = e.name, t.esmExports = e.metadata.esmExports !== !1;
              for (var o = [],
                  s = 0,
                  i = t.deps.length; i > s; s++)
                o.push(Promise.resolve(r.normalize(t.deps[s], e.name)));
              return Promise.all(o).then(function(a) {
                return t.normalizedDeps = a, {
                  deps: t.deps,
                  execute: function() {
                    return n(e.name, r), u(e.name, [], r), r.defined[e.name] = void 0, r.newModule(t.declarative ? t.module.exports : t.esModule);
                  }
                };
              });
            };
          });
        }(), c(function(t) {
          return function() {
            function n(t) {
              if (Object.keys)
                Object.keys(e).forEach(t);
              else
                for (var n in e)
                  s.call(e, n) && t(n);
            }
            function r(t) {
              n(function(n) {
                if (-1 == z.call(i, n)) {
                  try {
                    var r = e[n];
                  } catch (a) {
                    i.push(n);
                  }
                  t(n, r);
                }
              });
            }
            var a = this;
            t.call(a);
            var o,
                s = Object.prototype.hasOwnProperty,
                i = ["_g", "sessionStorage", "localStorage", "clipboardData", "frames", "external", "mozAnimationStartTime", "webkitStorageInfo", "webkitIndexedDB"];
            a.set("@@global-helpers", a.newModule({prepareGlobal: function(t, n, a) {
                var s = e.define;
                e.define = void 0, e.exports = void 0, e.module && e.module.exports && (e.module = void 0);
                var i;
                if (a) {
                  i = {};
                  for (var l in a)
                    i[l] = e[l], e[l] = a[l];
                }
                return n || (o = {}, r(function(e, t) {
                  o[e] = t;
                })), function() {
                  var t;
                  if (n)
                    t = v(n, e);
                  else {
                    var a,
                        l,
                        u = {};
                    r(function(e, t) {
                      o[e] !== t && "undefined" != typeof t && (u[e] = t, "undefined" != typeof a ? l || a === t || (l = !0) : a = t);
                    }), t = l ? u : a;
                  }
                  if (i)
                    for (var d in i)
                      e[d] = i[d];
                  return e.define = s, t;
                };
              }}));
          };
        }), c(function(t) {
          return function() {
            function n(e, t) {
              e = e.replace(i, "");
              var n = e.match(c),
                  r = (n[1].split(",")[t] || "require").replace(f, ""),
                  a = m[r] || (m[r] = new RegExp(l + r + u, "g"));
              a.lastIndex = 0;
              for (var o,
                  s = []; o = a.exec(e); )
                s.push(o[2] || o[3]);
              return s;
            }
            function r(e, t, n, a) {
              if ("object" == typeof e && !(e instanceof Array))
                return r.apply(null, Array.prototype.splice.call(arguments, 1, arguments.length - 1));
              if ("string" == typeof e && "function" == typeof t && (e = [e]), !(e instanceof Array)) {
                if ("string" == typeof e) {
                  var o = s.get(s.normalizeSync(e, a));
                  if (!o)
                    throw new Error('Module not already loaded loading "' + e + '" from "' + a + '".');
                  return o.__useDefault ? o["default"] : o;
                }
                throw new TypeError("Invalid require");
              }
              for (var i = [],
                  l = 0; l < e.length; l++)
                i.push(s["import"](e[l], a));
              Promise.all(i).then(function(e) {
                t && t.apply(null, e);
              }, n);
            }
            function a(t, a, o) {
              function i(t, n, i) {
                function c(e, n, a) {
                  return "string" == typeof e && "function" != typeof n ? t(e) : r.call(s, e, n, a, i.id);
                }
                for (var f = [],
                    m = 0; m < a.length; m++)
                  f.push(t(a[m]));
                i.uri = i.id, i.config = function() {}, -1 != d && f.splice(d, 0, i), -1 != u && f.splice(u, 0, n), -1 != l && (c.toUrl = function(e) {
                  var t = s.defaultJSExtensions && ".js" != e.substr(e.length - 3, 3),
                      n = s.normalizeSync(e, i.id);
                  return t && ".js" == n.substr(n.length - 3, 3) && (n = n.substr(0, n.length - 3)), n;
                }, f.splice(l, 0, c));
                var h = e.require;
                e.require = r;
                var p = o.apply(-1 == u ? e : n, f);
                return e.require = h, "undefined" == typeof p && i && (p = i.exports), "undefined" != typeof p ? p : void 0;
              }
              "string" != typeof t && (o = a, a = t, t = null), a instanceof Array || (o = a, a = ["require", "exports", "module"].splice(0, o.length)), "function" != typeof o && (o = function(e) {
                return function() {
                  return e;
                };
              }(o)), void 0 === a[a.length - 1] && a.pop();
              var l,
                  u,
                  d;
              -1 != (l = z.call(a, "require")) && (a.splice(l, 1), t || (a = a.concat(n(o.toString(), l)))), -1 != (u = z.call(a, "exports")) && a.splice(u, 1), -1 != (d = z.call(a, "module")) && a.splice(d, 1);
              var c = b();
              c.name = t && (s.normalizeSync || s.normalize).call(s, t), c.deps = a, c.execute = i, s.pushRegister_({
                amd: !0,
                entry: c
              });
            }
            function o() {
              var t = e.module,
                  n = e.exports,
                  r = e.define;
              return e.module = void 0, e.exports = void 0, e.define = a, function() {
                e.define = r, e.module = t, e.exports = n;
              };
            }
            var s = this;
            t.call(this);
            var i = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
                l = "(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])",
                u = "\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)",
                c = /\(([^\)]*)\)/,
                f = /^\s+|\s+$/g,
                m = {};
            a.amd = {}, d("reduceRegister_", function(e) {
              return function(t, n) {
                if (!n || !n.amd)
                  return e.call(this, t, n);
                var r = t && t.metadata,
                    a = n.entry;
                if (r && (r.format = "amd"), a.name)
                  r && (r.entry || r.bundle ? r.entry = void 0 : r.entry = a, r.bundle = !0), a.name in this.defined || (this.defined[a.name] = a);
                else {
                  if (!r)
                    throw new TypeError("Unexpected anonymous AMD define.");
                  if (r.entry)
                    throw new TypeError("Multiple defines for anonymous module " + t.name);
                  r.entry = a;
                }
              };
            }), s.set("@@amd-helpers", s.newModule({
              createDefine: o,
              require: r,
              define: a
            })), s.amdDefine = a, s.amdRequire = r;
          };
        }), function() {
          function e(e, t, n, r, a) {
            function o(e, t) {
              return c && ".js" == e.substr(e.length - 3, 3) && (e = e.substr(0, e.length - 3)), s.pluginFirst ? t + "!" + e : e + "!" + t;
            }
            var s = this;
            if (n) {
              var i;
              s.pluginFirst ? -1 != (i = n.lastIndexOf("!")) && (n = n.substr(i + 1)) : -1 != (i = n.indexOf("!")) && (n = n.substr(0, i));
            }
            var l = t.lastIndexOf("!");
            if (-1 != l) {
              var u,
                  d;
              s.pluginFirst ? (u = t.substr(l + 1), d = t.substr(0, l)) : (u = t.substr(0, l), d = t.substr(l + 1) || u.substr(u.lastIndexOf(".") + 1));
              var c = s.defaultJSExtensions && ".js" != u.substr(u.length - 3, 3);
              return a ? (u = s.normalizeSync(u, n), d = s.normalizeSync(d, n), o(u, d)) : Promise.all([s.normalize(u, n, !0), s.normalize(d, n, !0)]).then(function(e) {
                return o(e[0], e[1]);
              });
            }
            return e.call(s, t, n, r);
          }
          d("normalize", function(t) {
            return function(n, r, a) {
              return e.call(this, t, n, r, a, !1);
            };
          }), d("normalizeSync", function(t) {
            return function(n, r, a) {
              return e.call(this, t, n, r, a, !0);
            };
          }), d("locate", function(e) {
            return function(t) {
              var n,
                  r = this,
                  a = t.name;
              return r.pluginFirst ? -1 != (n = a.indexOf("!")) && (t.metadata.loader = a.substr(0, n), t.name = a.substr(n + 1)) : -1 != (n = a.lastIndexOf("!")) && (t.metadata.loader = a.substr(n + 1), t.name = a.substr(0, n)), e.call(r, t).then(function(e) {
                var n = t.metadata.loader;
                if (!n)
                  return e;
                if (r.defined && r.defined[a])
                  return e;
                var o = r.pluginLoader || r;
                return o["import"](n).then(function(n) {
                  return t.metadata.loaderModule = n, t.address = e, n.locate ? n.locate.call(r, t) : e;
                });
              });
            };
          }), d("fetch", function(e) {
            return function(t) {
              var n = this;
              return t.metadata.loaderModule && t.metadata.loaderModule.fetch ? (t.metadata.scriptLoad = !1, t.metadata.loaderModule.fetch.call(n, t, function(t) {
                return e.call(n, t);
              })) : e.call(n, t);
            };
          }), d("translate", function(e) {
            return function(t) {
              var n = this;
              return t.metadata.loaderModule && t.metadata.loaderModule.translate ? Promise.resolve(t.metadata.loaderModule.translate.call(n, t)).then(function(r) {
                return "string" == typeof r && (t.source = r), e.call(n, t);
              }) : e.call(n, t);
            };
          }), d("instantiate", function(e) {
            return function(t) {
              var n = this,
                  r = t.metadata.sourceMap;
              if (r && "object" == typeof r) {
                var a = t.name.split("!")[0];
                r.file = a + "!transpiled", r.sources && 1 != r.sources.length || (r.sources = [a]), t.metadata.sourceMap = JSON.stringify(r);
              }
              return t.metadata.loaderModule && t.metadata.loaderModule.instantiate ? Promise.resolve(t.metadata.loaderModule.instantiate.call(n, t)).then(function(r) {
                return t.metadata.entry = b(), t.metadata.entry.execute = function() {
                  return r;
                }, t.metadata.entry.deps = t.metadata.deps, t.metadata.format = "defined", e.call(n, t);
              }) : e.call(n, t);
            };
          });
        }();
        var B = /#\{[^\}]+\}/;
        c(function(e) {
          return function() {
            e.call(this), this.set("@system-env", this.newModule({
              browser: O,
              node: !!this._nodeRequire
            }));
          };
        }), d("normalize", function(e) {
          return function(t, n, r) {
            var a = this;
            return E.call(a, t, n).then(function(t) {
              return e.call(a, t, n, r);
            }).then(function(e) {
              return S.call(a, e, n);
            });
          };
        }), function() {
          d("fetch", function(e) {
            return function(t) {
              var n = t.metadata.alias,
                  r = t.metadata.deps || [];
              return n ? (t.metadata.format = "defined", this.defined[t.name] = {
                declarative: !0,
                deps: r.concat([n]),
                declare: function(e) {
                  return {
                    setters: [function(t) {
                      for (var n in t)
                        e(n, t[n]);
                    }],
                    execute: function() {}
                  };
                }
              }, "") : e.call(this, t);
            };
          });
        }(), function() {
          function e(e, t, n) {
            for (var r,
                a = t.split("."); a.length > 1; )
              r = a.shift(), e = e[r] = e[r] || {};
            r = a.shift(), r in e || (e[r] = n);
          }
          c(function(e) {
            return function() {
              this.meta = {}, e.call(this);
            };
          }), d("locate", function(e) {
            return function(t) {
              var n,
                  r = this.meta,
                  a = t.name,
                  o = 0;
              for (var s in r)
                if (n = s.indexOf("*"), -1 !== n && s.substr(0, n) === a.substr(0, n) && s.substr(n + 1) === a.substr(a.length - s.length + n + 1)) {
                  var i = s.split("/").length;
                  i > o && (o = i), p(t.metadata, r[s], o != i);
                }
              return r[a] && p(t.metadata, r[a]), e.call(this, t);
            };
          });
          var t = /^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)+/,
              n = /\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\/\/[^\n]*|"[^"]+"\s*;?|'[^']+'\s*;?/g;
          d("translate", function(r) {
            return function(a) {
              var o = a.source.match(t);
              if (o)
                for (var s = o[0].match(n),
                    i = 0; i < s.length; i++) {
                  var l = s[i],
                      u = l.length,
                      d = l.substr(0, 1);
                  if (";" == l.substr(u - 1, 1) && u--, '"' == d || "'" == d) {
                    var c = l.substr(1, l.length - 3),
                        f = c.substr(0, c.indexOf(" "));
                    if (f) {
                      var m = c.substr(f.length + 1, c.length - f.length - 1);
                      "[]" == f.substr(f.length - 2, 2) ? (f = f.substr(0, f.length - 2), a.metadata[f] = a.metadata[f] || [], a.metadata[f].push(m)) : a.metadata[f] instanceof Array ? (g.call(this, "Module " + a.name + ' contains deprecated "deps ' + m + '" meta syntax.\nThis should be updated to "deps[] ' + m + '" for pushing to array meta.'), a.metadata[f].push(m)) : e(a.metadata, f, m);
                    } else
                      a.metadata[c] = !0;
                  }
                }
              return r.call(this, a);
            };
          });
        }(), function() {
          c(function(e) {
            return function() {
              e.call(this), this.bundles = {}, this.loadedBundles_ = {};
            };
          }), d("locate", function(e) {
            return function(t) {
              var n = this;
              return (t.name in n.loadedBundles_ || t.name in n.bundles) && (t.metadata.bundle = !0), t.name in n.defined ? e.call(this, t) : P(n, t.name).then(function(e) {
                return e ? n.load(e) : void 0;
              }).then(function() {
                return e.call(n, t);
              });
            };
          });
        }(), function() {
          c(function(e) {
            return function() {
              e.call(this), this.depCache = {};
            };
          }), d("locate", function(e) {
            return function(t) {
              var n = this,
                  r = n.depCache[t.name];
              if (r)
                for (var a = 0; a < r.length; a++)
                  n["import"](r[a]);
              return e.call(n, t);
            };
          });
        }(), c(function(e) {
          return function() {
            e.apply(this, arguments), this.has("@@amd-helpers") && this.get("@@amd-helpers").createDefine();
          };
        }), d("fetch", function(e) {
          return function(t) {
            return t.metadata.scriptLoad = !0, e.call(this, t);
          };
        }), D = new l, D.version = "0.19.5 CSP", "object" == typeof exports && (module.exports = a), e.Reflect = e.Reflect || {}, e.Reflect.Loader = e.Reflect.Loader || a, e.Reflect.global = e.Reflect.global || e, e.LoaderPolyfill = a, D || (D = new o, D.constructor = o), "object" == typeof exports && (module.exports = D), e.System = D;
      }("undefined" != typeof self ? self : global);
    }
    try {
      var t = "undefined" != typeof URLPolyfill || "test:" == new URL("test:///").protocol;
    } catch (n) {}
    if ("undefined" != typeof Promise && t)
      e();
    else if ("undefined" != typeof document) {
      var r = document.getElementsByTagName("script");
      $__curScript = r[r.length - 1];
      var a = $__curScript.src,
          o = a.substr(0, a.lastIndexOf("/") + 1);
      window.systemJSBootstrap = e, document.write('<script type="text/javascript" src="' + o + 'system-polyfills.js"></script>');
    } else if ("undefined" != typeof importScripts) {
      var o = "";
      try {
        throw new Error("_");
      } catch (n) {
        n.stack.replace(/(?:at|@).*(http.+):[\d]+:[\d]+/, function(e, t) {
          o = t.replace(/\/[^\/]*$/, "/");
        });
      }
      importScripts(o + "system-polyfills.js"), e();
    } else
      e();
  }();
})(require('process'));
