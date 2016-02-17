/* */ 
"format cjs";
(function(process) {
  (function(global) {
    function URLPolyfill(url, baseURL) {
      if (typeof url != 'string')
        throw new TypeError('URL must be a string');
      var m = String(url).replace(/^\s+|\s+$/g, "").match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
      if (!m)
        throw new RangeError('Invalid URL format');
      var protocol = m[1] || "";
      var username = m[2] || "";
      var password = m[3] || "";
      var host = m[4] || "";
      var hostname = m[5] || "";
      var port = m[6] || "";
      var pathname = m[7] || "";
      var search = m[8] || "";
      var hash = m[9] || "";
      if (baseURL !== undefined) {
        var base = baseURL instanceof URLPolyfill ? baseURL : new URLPolyfill(baseURL);
        var flag = !protocol && !host && !username;
        if (flag && !pathname && !search)
          search = base.search;
        if (flag && pathname[0] !== "/")
          pathname = (pathname ? (((base.host || base.username) && !base.pathname ? "/" : "") + base.pathname.slice(0, base.pathname.lastIndexOf("/") + 1) + pathname) : base.pathname);
        var output = [];
        pathname.replace(/^(\.\.?(\/|$))+/, "").replace(/\/(\.(\/|$))+/g, "/").replace(/\/\.\.$/, "/../").replace(/\/?[^\/]*/g, function(p) {
          if (p === "/..")
            output.pop();
          else
            output.push(p);
        });
        pathname = output.join("").replace(/^\//, pathname[0] === "/" ? "/" : "");
        if (flag) {
          port = base.port;
          hostname = base.hostname;
          host = base.host;
          password = base.password;
          username = base.username;
        }
        if (!protocol)
          protocol = base.protocol;
      }
      if (protocol == 'file:')
        pathname = pathname.replace(/\\/g, '/');
      this.origin = host ? protocol + (protocol !== "" || host !== "" ? "//" : "") + host : "";
      this.href = protocol + (protocol && host || protocol == "file:" ? "//" : "") + (username !== "" ? username + (password !== "" ? ":" + password : "") + "@" : "") + host + pathname + search + hash;
      this.protocol = protocol;
      this.username = username;
      this.password = password;
      this.host = host;
      this.hostname = hostname;
      this.port = port;
      this.pathname = pathname;
      this.search = search;
      this.hash = hash;
    }
    global.URLPolyfill = URLPolyfill;
  })(typeof self != 'undefined' ? self : global);
  (function(__global) {
    var isWorker = typeof window == 'undefined' && typeof self != 'undefined' && typeof importScripts != 'undefined';
    var isBrowser = typeof window != 'undefined' && typeof document != 'undefined';
    var isWindows = typeof process != 'undefined' && typeof process.platform != 'undefined' && !!process.platform.match(/^win/);
    if (!__global.console)
      __global.console = {assert: function() {}};
    var indexOf = Array.prototype.indexOf || function(item) {
      for (var i = 0,
          thisLen = this.length; i < thisLen; i++) {
        if (this[i] === item) {
          return i;
        }
      }
      return -1;
    };
    var defineProperty;
    (function() {
      try {
        if (!!Object.defineProperty({}, 'a', {}))
          defineProperty = Object.defineProperty;
      } catch (e) {
        defineProperty = function(obj, prop, opt) {
          try {
            obj[prop] = opt.value || opt.get.call(obj);
          } catch (e) {}
        };
      }
    })();
    function addToError(err, msg) {
      if (err instanceof Error) {
        err.message = msg + '\n\t' + err.message;
        Error.call(err, err.message);
      } else {
        err = msg + '\n\t' + err;
      }
      return err;
    }
    function __eval(source, debugName, context) {
      try {
        new Function(source).call(context);
      } catch (e) {
        throw addToError(e, 'Evaluating ' + debugName);
      }
    }
    var baseURI;
    if (typeof document != 'undefined' && document.getElementsByTagName) {
      baseURI = document.baseURI;
      if (!baseURI) {
        var bases = document.getElementsByTagName('base');
        baseURI = bases[0] && bases[0].href || window.location.href;
      }
      baseURI = baseURI.split('#')[0].split('?')[0];
      baseURI = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
    } else if (typeof process != 'undefined' && process.cwd) {
      baseURI = 'file://' + (isWindows ? '/' : '') + process.cwd() + '/';
      if (isWindows)
        baseURI = baseURI.replace(/\\/g, '/');
    } else if (typeof location != 'undefined') {
      baseURI = __global.location.href;
    } else {
      throw new TypeError('No environment baseURI');
    }
    var URL = __global.URLPolyfill || __global.URL;
    function Module() {}
    defineProperty(Module.prototype, 'toString', {value: function() {
        return 'Module';
      }});
    function Loader(options) {
      this._loader = {
        loaderObj: this,
        loads: [],
        modules: {},
        importPromises: {},
        moduleRecords: {}
      };
      defineProperty(this, 'global', {get: function() {
          return __global;
        }});
    }
    (function() {
      function createLoaderLoad(object) {
        return {
          modules: {},
          loads: [],
          loaderObj: object
        };
      }
      function createLoad(name) {
        return {
          status: 'loading',
          name: name,
          linkSets: [],
          dependencies: [],
          metadata: {}
        };
      }
      function loadModule(loader, name, options) {
        return new Promise(asyncStartLoadPartwayThrough({
          step: options.address ? 'fetch' : 'locate',
          loader: loader,
          moduleName: name,
          moduleMetadata: options && options.metadata || {},
          moduleSource: options.source,
          moduleAddress: options.address
        }));
      }
      function requestLoad(loader, request, refererName, refererAddress) {
        return new Promise(function(resolve, reject) {
          resolve(loader.loaderObj.normalize(request, refererName, refererAddress));
        }).then(function(name) {
          var load;
          if (loader.modules[name]) {
            load = createLoad(name);
            load.status = 'linked';
            load.module = loader.modules[name];
            return load;
          }
          for (var i = 0,
              l = loader.loads.length; i < l; i++) {
            load = loader.loads[i];
            if (load.name != name)
              continue;
            console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded');
            return load;
          }
          load = createLoad(name);
          loader.loads.push(load);
          proceedToLocate(loader, load);
          return load;
        });
      }
      function proceedToLocate(loader, load) {
        proceedToFetch(loader, load, Promise.resolve().then(function() {
          return loader.loaderObj.locate({
            name: load.name,
            metadata: load.metadata
          });
        }));
      }
      function proceedToFetch(loader, load, p) {
        proceedToTranslate(loader, load, p.then(function(address) {
          if (load.status != 'loading')
            return;
          load.address = address;
          return loader.loaderObj.fetch({
            name: load.name,
            metadata: load.metadata,
            address: address
          });
        }));
      }
      var anonCnt = 0;
      function proceedToTranslate(loader, load, p) {
        p.then(function(source) {
          if (load.status != 'loading')
            return;
          return Promise.resolve(loader.loaderObj.translate({
            name: load.name,
            metadata: load.metadata,
            address: load.address,
            source: source
          })).then(function(source) {
            load.source = source;
            return loader.loaderObj.instantiate({
              name: load.name,
              metadata: load.metadata,
              address: load.address,
              source: source
            });
          }).then(function(instantiateResult) {
            if (instantiateResult === undefined) {
              load.address = load.address || '<Anonymous Module ' + ++anonCnt + '>';
              load.isDeclarative = true;
              return transpile.call(loader.loaderObj, load).then(function(transpiled) {
                var curSystem = __global.System;
                var curRegister = curSystem.register;
                curSystem.register = function(name, deps, declare) {
                  if (typeof name != 'string') {
                    declare = deps;
                    deps = name;
                  }
                  load.declare = declare;
                  load.depsList = deps;
                };
                __eval(transpiled, load.address, {});
                curSystem.register = curRegister;
              });
            } else if (typeof instantiateResult == 'object') {
              load.depsList = instantiateResult.deps || [];
              load.execute = instantiateResult.execute;
              load.isDeclarative = false;
            } else
              throw TypeError('Invalid instantiate return value');
          }).then(function() {
            load.dependencies = [];
            var depsList = load.depsList;
            var loadPromises = [];
            for (var i = 0,
                l = depsList.length; i < l; i++)
              (function(request, index) {
                loadPromises.push(requestLoad(loader, request, load.name, load.address).then(function(depLoad) {
                  load.dependencies[index] = {
                    key: request,
                    value: depLoad.name
                  };
                  if (depLoad.status != 'linked') {
                    var linkSets = load.linkSets.concat([]);
                    for (var i = 0,
                        l = linkSets.length; i < l; i++)
                      addLoadToLinkSet(linkSets[i], depLoad);
                  }
                }));
              })(depsList[i], i);
            return Promise.all(loadPromises);
          }).then(function() {
            console.assert(load.status == 'loading', 'is loading');
            load.status = 'loaded';
            var linkSets = load.linkSets.concat([]);
            for (var i = 0,
                l = linkSets.length; i < l; i++)
              updateLinkSetOnLoad(linkSets[i], load);
          });
        })['catch'](function(exc) {
          load.status = 'failed';
          load.exception = exc;
          var linkSets = load.linkSets.concat([]);
          for (var i = 0,
              l = linkSets.length; i < l; i++) {
            linkSetFailed(linkSets[i], load, exc);
          }
          console.assert(load.linkSets.length == 0, 'linkSets not removed');
        });
      }
      function asyncStartLoadPartwayThrough(stepState) {
        return function(resolve, reject) {
          var loader = stepState.loader;
          var name = stepState.moduleName;
          var step = stepState.step;
          if (loader.modules[name])
            throw new TypeError('"' + name + '" already exists in the module table');
          var existingLoad;
          for (var i = 0,
              l = loader.loads.length; i < l; i++) {
            if (loader.loads[i].name == name) {
              existingLoad = loader.loads[i];
              if (step == 'translate' && !existingLoad.source) {
                existingLoad.address = stepState.moduleAddress;
                proceedToTranslate(loader, existingLoad, Promise.resolve(stepState.moduleSource));
              }
              if (existingLoad.linkSets.length && existingLoad.linkSets[0].loads[0].name == existingLoad.name)
                return existingLoad.linkSets[0].done.then(function() {
                  resolve(existingLoad);
                });
            }
          }
          var load = existingLoad || createLoad(name);
          load.metadata = stepState.moduleMetadata;
          var linkSet = createLinkSet(loader, load);
          loader.loads.push(load);
          resolve(linkSet.done);
          if (step == 'locate')
            proceedToLocate(loader, load);
          else if (step == 'fetch')
            proceedToFetch(loader, load, Promise.resolve(stepState.moduleAddress));
          else {
            console.assert(step == 'translate', 'translate step');
            load.address = stepState.moduleAddress;
            proceedToTranslate(loader, load, Promise.resolve(stepState.moduleSource));
          }
        };
      }
      function createLinkSet(loader, startingLoad) {
        var linkSet = {
          loader: loader,
          loads: [],
          startingLoad: startingLoad,
          loadingCount: 0
        };
        linkSet.done = new Promise(function(resolve, reject) {
          linkSet.resolve = resolve;
          linkSet.reject = reject;
        });
        addLoadToLinkSet(linkSet, startingLoad);
        return linkSet;
      }
      function addLoadToLinkSet(linkSet, load) {
        if (load.status == 'failed')
          return;
        console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded on link set');
        for (var i = 0,
            l = linkSet.loads.length; i < l; i++)
          if (linkSet.loads[i] == load)
            return;
        linkSet.loads.push(load);
        load.linkSets.push(linkSet);
        if (load.status != 'loaded') {
          linkSet.loadingCount++;
        }
        var loader = linkSet.loader;
        for (var i = 0,
            l = load.dependencies.length; i < l; i++) {
          if (!load.dependencies[i])
            continue;
          var name = load.dependencies[i].value;
          if (loader.modules[name])
            continue;
          for (var j = 0,
              d = loader.loads.length; j < d; j++) {
            if (loader.loads[j].name != name)
              continue;
            addLoadToLinkSet(linkSet, loader.loads[j]);
            break;
          }
        }
      }
      function doLink(linkSet) {
        var error = false;
        try {
          link(linkSet, function(load, exc) {
            linkSetFailed(linkSet, load, exc);
            error = true;
          });
        } catch (e) {
          linkSetFailed(linkSet, null, e);
          error = true;
        }
        return error;
      }
      function updateLinkSetOnLoad(linkSet, load) {
        console.assert(load.status == 'loaded' || load.status == 'linked', 'loaded or linked');
        linkSet.loadingCount--;
        if (linkSet.loadingCount > 0)
          return;
        var startingLoad = linkSet.startingLoad;
        if (linkSet.loader.loaderObj.execute === false) {
          var loads = [].concat(linkSet.loads);
          for (var i = 0,
              l = loads.length; i < l; i++) {
            var load = loads[i];
            load.module = !load.isDeclarative ? {module: _newModule({})} : {
              name: load.name,
              module: _newModule({}),
              evaluated: true
            };
            load.status = 'linked';
            finishLoad(linkSet.loader, load);
          }
          return linkSet.resolve(startingLoad);
        }
        var abrupt = doLink(linkSet);
        if (abrupt)
          return;
        console.assert(linkSet.loads.length == 0, 'loads cleared');
        linkSet.resolve(startingLoad);
      }
      function linkSetFailed(linkSet, load, exc) {
        var loader = linkSet.loader;
        var requests;
        checkError: if (load) {
          if (linkSet.loads[0].name == load.name) {
            exc = addToError(exc, 'Error loading ' + load.name);
          } else {
            for (var i = 0; i < linkSet.loads.length; i++) {
              var pLoad = linkSet.loads[i];
              for (var j = 0; j < pLoad.dependencies.length; j++) {
                var dep = pLoad.dependencies[j];
                if (dep.value == load.name) {
                  exc = addToError(exc, 'Error loading ' + load.name + ' as "' + dep.key + '" from ' + pLoad.name);
                  break checkError;
                }
              }
            }
            exc = addToError(exc, 'Error loading ' + load.name + ' from ' + linkSet.loads[0].name);
          }
        } else {
          exc = addToError(exc, 'Error linking ' + linkSet.loads[0].name);
        }
        var loads = linkSet.loads.concat([]);
        for (var i = 0,
            l = loads.length; i < l; i++) {
          var load = loads[i];
          loader.loaderObj.failed = loader.loaderObj.failed || [];
          if (indexOf.call(loader.loaderObj.failed, load) == -1)
            loader.loaderObj.failed.push(load);
          var linkIndex = indexOf.call(load.linkSets, linkSet);
          console.assert(linkIndex != -1, 'link not present');
          load.linkSets.splice(linkIndex, 1);
          if (load.linkSets.length == 0) {
            var globalLoadsIndex = indexOf.call(linkSet.loader.loads, load);
            if (globalLoadsIndex != -1)
              linkSet.loader.loads.splice(globalLoadsIndex, 1);
          }
        }
        linkSet.reject(exc);
      }
      function finishLoad(loader, load) {
        if (loader.loaderObj.trace) {
          if (!loader.loaderObj.loads)
            loader.loaderObj.loads = {};
          var depMap = {};
          load.dependencies.forEach(function(dep) {
            depMap[dep.key] = dep.value;
          });
          loader.loaderObj.loads[load.name] = {
            name: load.name,
            deps: load.dependencies.map(function(dep) {
              return dep.key;
            }),
            depMap: depMap,
            address: load.address,
            metadata: load.metadata,
            source: load.source,
            kind: load.isDeclarative ? 'declarative' : 'dynamic'
          };
        }
        if (load.name) {
          console.assert(!loader.modules[load.name], 'load not in module table');
          loader.modules[load.name] = load.module;
        }
        var loadIndex = indexOf.call(loader.loads, load);
        if (loadIndex != -1)
          loader.loads.splice(loadIndex, 1);
        for (var i = 0,
            l = load.linkSets.length; i < l; i++) {
          loadIndex = indexOf.call(load.linkSets[i].loads, load);
          if (loadIndex != -1)
            load.linkSets[i].loads.splice(loadIndex, 1);
        }
        load.linkSets.splice(0, load.linkSets.length);
      }
      function doDynamicExecute(linkSet, load, linkError) {
        try {
          var module = load.execute();
        } catch (e) {
          linkError(load, e);
          return;
        }
        if (!module || !(module instanceof Module))
          linkError(load, new TypeError('Execution must define a Module instance'));
        else
          return module;
      }
      function createImportPromise(loader, name, promise) {
        var importPromises = loader._loader.importPromises;
        return importPromises[name] = promise.then(function(m) {
          importPromises[name] = undefined;
          return m;
        }, function(e) {
          importPromises[name] = undefined;
          throw e;
        });
      }
      Loader.prototype = {
        constructor: Loader,
        define: function(name, source, options) {
          if (this._loader.importPromises[name])
            throw new TypeError('Module is already loading.');
          return createImportPromise(this, name, new Promise(asyncStartLoadPartwayThrough({
            step: 'translate',
            loader: this._loader,
            moduleName: name,
            moduleMetadata: options && options.metadata || {},
            moduleSource: source,
            moduleAddress: options && options.address
          })));
        },
        'delete': function(name) {
          var loader = this._loader;
          delete loader.importPromises[name];
          delete loader.moduleRecords[name];
          return loader.modules[name] ? delete loader.modules[name] : false;
        },
        get: function(key) {
          if (!this._loader.modules[key])
            return;
          doEnsureEvaluated(this._loader.modules[key], [], this);
          return this._loader.modules[key].module;
        },
        has: function(name) {
          return !!this._loader.modules[name];
        },
        'import': function(name, parentName, parentAddress) {
          if (typeof parentName == 'object')
            parentName = parentName.name;
          var loaderObj = this;
          return Promise.resolve(loaderObj.normalize(name, parentName)).then(function(name) {
            var loader = loaderObj._loader;
            if (loader.modules[name]) {
              doEnsureEvaluated(loader.modules[name], [], loader._loader);
              return loader.modules[name].module;
            }
            return loader.importPromises[name] || createImportPromise(loaderObj, name, loadModule(loader, name, {}).then(function(load) {
              delete loader.importPromises[name];
              return evaluateLoadedModule(loader, load);
            }));
          });
        },
        load: function(name) {
          var loader = this._loader;
          if (loader.modules[name])
            return Promise.resolve();
          return loader.importPromises[name] || createImportPromise(this, name, new Promise(asyncStartLoadPartwayThrough({
            step: 'locate',
            loader: loader,
            moduleName: name,
            moduleMetadata: {},
            moduleSource: undefined,
            moduleAddress: undefined
          })).then(function() {
            delete loader.importPromises[name];
          }));
        },
        module: function(source, options) {
          var load = createLoad();
          load.address = options && options.address;
          var linkSet = createLinkSet(this._loader, load);
          var sourcePromise = Promise.resolve(source);
          var loader = this._loader;
          var p = linkSet.done.then(function() {
            return evaluateLoadedModule(loader, load);
          });
          proceedToTranslate(loader, load, sourcePromise);
          return p;
        },
        newModule: function(obj) {
          if (typeof obj != 'object')
            throw new TypeError('Expected object');
          var m = new Module();
          var pNames = [];
          if (Object.getOwnPropertyNames && obj != null)
            pNames = Object.getOwnPropertyNames(obj);
          else
            for (var key in obj)
              pNames.push(key);
          for (var i = 0; i < pNames.length; i++)
            (function(key) {
              defineProperty(m, key, {
                configurable: false,
                enumerable: true,
                get: function() {
                  return obj[key];
                },
                set: function() {
                  throw new Error('Module exports cannot be changed externally.');
                }
              });
            })(pNames[i]);
          if (Object.freeze)
            Object.freeze(m);
          return m;
        },
        set: function(name, module) {
          if (!(module instanceof Module))
            throw new TypeError('Loader.set(' + name + ', module) must be a module');
          this._loader.modules[name] = {module: module};
        },
        normalize: function(name, referrerName, referrerAddress) {
          return name;
        },
        locate: function(load) {
          return load.name;
        },
        fetch: function(load) {},
        translate: function(load) {
          return load.source;
        },
        instantiate: function(load) {}
      };
      var _newModule = Loader.prototype.newModule;
      function link(linkSet, linkError) {
        var loader = linkSet.loader;
        if (!linkSet.loads.length)
          return;
        var loads = linkSet.loads.concat([]);
        for (var i = 0; i < loads.length; i++) {
          var load = loads[i];
          var module = doDynamicExecute(linkSet, load, linkError);
          if (!module)
            return;
          load.module = {
            name: load.name,
            module: module
          };
          load.status = 'linked';
          finishLoad(loader, load);
        }
      }
      function evaluateLoadedModule(loader, load) {
        console.assert(load.status == 'linked', 'is linked ' + load.name);
        return load.module.module;
      }
      function doEnsureEvaluated() {}
      function transpile() {
        throw new TypeError('ES6 transpilation is only provided in the dev module loader build.');
      }
    })();
    var System;
    function SystemLoader() {
      Loader.call(this);
      this.paths = {};
    }
    function applyPaths(paths, name) {
      var pathMatch = '',
          wildcard,
          maxWildcardPrefixLen = 0;
      for (var p in paths) {
        var pathParts = p.split('*');
        if (pathParts.length > 2)
          throw new TypeError('Only one wildcard in a path is permitted');
        if (pathParts.length == 1) {
          if (name == p)
            return paths[p];
          else if (name.substr(0, p.length - 1) == p.substr(0, p.length - 1) && (name.length < p.length || name[p.length - 1] == p[p.length - 1]) && paths[p][paths[p].length - 1] == '/')
            return paths[p].substr(0, paths[p].length - 1) + (name.length > p.length ? '/' + name.substr(p.length) : '');
        } else {
          var wildcardPrefixLen = pathParts[0].length;
          if (wildcardPrefixLen >= maxWildcardPrefixLen && name.substr(0, pathParts[0].length) == pathParts[0] && name.substr(name.length - pathParts[1].length) == pathParts[1]) {
            maxWildcardPrefixLen = wildcardPrefixLen;
            pathMatch = p;
            wildcard = name.substr(pathParts[0].length, name.length - pathParts[1].length - pathParts[0].length);
          }
        }
      }
      var outPath = paths[pathMatch];
      if (typeof wildcard == 'string')
        outPath = outPath.replace('*', wildcard);
      return outPath;
    }
    function LoaderProto() {}
    LoaderProto.prototype = Loader.prototype;
    SystemLoader.prototype = new LoaderProto();
    var absURLRegEx = /^([^\/]+:\/\/|\/)/;
    SystemLoader.prototype.normalize = function(name, parentName, parentAddress) {
      if (!name.match(absURLRegEx) && name[0] != '.')
        name = new URL(applyPaths(this.paths, name) || name, baseURI).href;
      else
        name = new URL(name, parentName || baseURI).href;
      return name;
    };
    SystemLoader.prototype.locate = function(load) {
      return load.name;
    };
    SystemLoader.prototype.instantiate = function(load) {
      var self = this;
      return Promise.resolve(self.normalize(self.transpiler)).then(function(transpilerNormalized) {
        if (load.address === transpilerNormalized) {
          return {
            deps: [],
            execute: function() {
              var curSystem = __global.System;
              var curLoader = __global.Reflect.Loader;
              __eval('(function(require,exports,module){' + load.source + '})();', load.address, __global);
              __global.System = curSystem;
              __global.Reflect.Loader = curLoader;
              return self.newModule({
                'default': __global[self.transpiler],
                __useDefault: true
              });
            }
          };
        }
      });
    };
    var fetchTextFromURL;
    if (typeof XMLHttpRequest != 'undefined') {
      fetchTextFromURL = function(url, authorization, fulfill, reject) {
        var xhr = new XMLHttpRequest();
        var sameDomain = true;
        var doTimeout = false;
        if (!('withCredentials' in xhr)) {
          var domainCheck = /^(\w+:)?\/\/([^\/]+)/.exec(url);
          if (domainCheck) {
            sameDomain = domainCheck[2] === window.location.host;
            if (domainCheck[1])
              sameDomain &= domainCheck[1] === window.location.protocol;
          }
        }
        if (!sameDomain && typeof XDomainRequest != 'undefined') {
          xhr = new XDomainRequest();
          xhr.onload = load;
          xhr.onerror = error;
          xhr.ontimeout = error;
          xhr.onprogress = function() {};
          xhr.timeout = 0;
          doTimeout = true;
        }
        function load() {
          fulfill(xhr.responseText);
        }
        function error() {
          reject(new Error('XHR error' + (xhr.status ? ' (' + xhr.status + (xhr.statusText ? ' ' + xhr.statusText : '') + ')' : '') + ' loading ' + url));
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status == 0) {
              if (xhr.responseText) {
                load();
              } else {
                xhr.addEventListener('error', error);
                xhr.addEventListener('load', load);
              }
            } else if (xhr.status === 200) {
              load();
            } else {
              error();
            }
          }
        };
        xhr.open("GET", url, true);
        if (xhr.setRequestHeader) {
          xhr.setRequestHeader('Accept', 'application/x-es-module, */*');
          if (authorization) {
            if (typeof authorization == 'string')
              xhr.setRequestHeader('Authorization', authorization);
            xhr.withCredentials = true;
          }
        }
        if (doTimeout) {
          setTimeout(function() {
            xhr.send();
          }, 0);
        } else {
          xhr.send(null);
        }
      };
    } else if (typeof require != 'undefined' && typeof process != 'undefined') {
      var fs;
      fetchTextFromURL = function(url, authorization, fulfill, reject) {
        if (url.substr(0, 8) != 'file:///')
          throw new Error('Unable to fetch "' + url + '". Only file URLs of the form file:/// allowed running in Node.');
        fs = fs || require('fs');
        if (isWindows)
          url = url.replace(/\//g, '\\').substr(8);
        else
          url = url.substr(7);
        return fs.readFile(url, function(err, data) {
          if (err) {
            return reject(err);
          } else {
            var dataString = data + '';
            if (dataString[0] === '\ufeff')
              dataString = dataString.substr(1);
            fulfill(dataString);
          }
        });
      };
    } else if (typeof self != 'undefined' && typeof self.fetch != 'undefined') {
      fetchTextFromURL = function(url, authorization, fulfill, reject) {
        var opts = {headers: {'Accept': 'application/x-es-module, */*'}};
        if (authorization) {
          if (typeof authorization == 'string')
            opts.headers['Authorization'] = authorization;
          opts.credentials = 'include';
        }
        fetch(url, opts).then(function(r) {
          if (r.ok) {
            return r.text();
          } else {
            throw new Error('Fetch error: ' + r.status + ' ' + r.statusText);
          }
        }).then(fulfill, reject);
      };
    } else {
      throw new TypeError('No environment fetch API available.');
    }
    SystemLoader.prototype.fetch = function(load) {
      return new Promise(function(resolve, reject) {
        fetchTextFromURL(load.address, undefined, resolve, reject);
      });
    };
    if (typeof exports === 'object')
      module.exports = Loader;
    __global.Reflect = __global.Reflect || {};
    __global.Reflect.Loader = __global.Reflect.Loader || Loader;
    __global.Reflect.global = __global.Reflect.global || __global;
    __global.LoaderPolyfill = Loader;
    if (!System) {
      System = new SystemLoader();
      System.constructor = SystemLoader;
    }
    if (typeof exports === 'object')
      module.exports = System;
    __global.System = System;
  })(typeof self != 'undefined' ? self : global);
})(require('process'));
