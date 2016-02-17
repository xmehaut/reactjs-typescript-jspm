/* */ 
"format cjs";
(function(process) {
  (function() {
    function bootstrap() {
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
          if (err instanceof Error)
            err.message = err.message + '\n\t' + msg;
          else
            err += '\n\t' + msg;
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
        function SystemJSLoader() {
          SystemLoader.call(this);
          systemJSConstructor.call(this);
        }
        function SystemProto() {}
        ;
        SystemProto.prototype = SystemLoader.prototype;
        SystemJSLoader.prototype = new SystemProto();
        SystemJSLoader.prototype.constructor = SystemJSLoader;
        SystemJSLoader.prototype.instantiate = function() {};
        var systemJSConstructor;
        function hook(name, hook) {
          SystemJSLoader.prototype[name] = hook(SystemJSLoader.prototype[name] || function() {});
        }
        function hookConstructor(hook) {
          systemJSConstructor = hook(systemJSConstructor || function() {});
        }
        function dedupe(deps) {
          var newDeps = [];
          for (var i = 0,
              l = deps.length; i < l; i++)
            if (indexOf.call(newDeps, deps[i]) == -1)
              newDeps.push(deps[i]);
          return newDeps;
        }
        function group(deps) {
          var names = [];
          var indices = [];
          for (var i = 0,
              l = deps.length; i < l; i++) {
            var index = indexOf.call(names, deps[i]);
            if (index === -1) {
              names.push(deps[i]);
              indices.push([i]);
            } else {
              indices[index].push(i);
            }
          }
          return {
            names: names,
            indices: indices
          };
        }
        var getOwnPropertyDescriptor = true;
        try {
          Object.getOwnPropertyDescriptor({a: 0}, 'a');
        } catch (e) {
          getOwnPropertyDescriptor = false;
        }
        function getESModule(exports) {
          var esModule = {};
          if (typeof exports == 'object' || typeof exports == 'function') {
            if (getOwnPropertyDescriptor) {
              var d;
              for (var p in exports)
                if (d = Object.getOwnPropertyDescriptor(exports, p))
                  defineProperty(esModule, p, d);
            } else {
              var hasOwnProperty = exports && exports.hasOwnProperty;
              for (var p in exports) {
                if (!hasOwnProperty || exports.hasOwnProperty(p))
                  esModule[p] = exports[p];
              }
            }
          }
          esModule['default'] = exports;
          defineProperty(esModule, '__useDefault', {value: true});
          return esModule;
        }
        function extend(a, b, prepend) {
          for (var p in b) {
            if (!prepend || !(p in a))
              a[p] = b[p];
          }
          return a;
        }
        var packageProperties = ['main', 'format', 'defaultExtension', 'meta', 'map', 'basePath', 'depCache'];
        function extendMeta(a, b, prepend) {
          for (var p in b) {
            var val = b[p];
            if (!(p in a))
              a[p] = val;
            else if (val instanceof Array && a[p] instanceof Array)
              a[p] = [].concat(prepend ? val : a[p]).concat(prepend ? a[p] : val);
            else if (typeof val == 'object' && val !== null && typeof a[p] == 'object')
              a[p] = extend(extend({}, a[p]), val, prepend);
            else if (!prepend)
              a[p] = val;
          }
        }
        function warn(msg) {
          if (this.warnings && typeof console != 'undefined' && console.warn)
            console.warn(msg);
        }
        var absURLRegEx = /^[^\/]+:\/\//;
        function readMemberExpression(p, value) {
          var pParts = p.split('.');
          while (pParts.length)
            value = value[pParts.shift()];
          return value;
        }
        var baseURLCache = {};
        function getBaseURLObj() {
          if (baseURLCache[this.baseURL])
            return baseURLCache[this.baseURL];
          if (this.baseURL[this.baseURL.length - 1] != '/')
            this.baseURL += '/';
          var baseURL = new URL(this.baseURL, baseURI);
          this.baseURL = baseURL.href;
          return (baseURLCache[this.baseURL] = baseURL);
        }
        function getMapMatch(map, name) {
          var bestMatch,
              bestMatchLength = 0;
          for (var p in map) {
            if (name.substr(0, p.length) == p && (name.length == p.length || name[p.length] == '/')) {
              var curMatchLength = p.split('/').length;
              if (curMatchLength <= bestMatchLength)
                continue;
              bestMatch = p;
              bestMatchLength = curMatchLength;
            }
          }
          return bestMatch;
        }
        function setProduction(isProduction) {
          this.set('@system-env', this.newModule({
            browser: isBrowser,
            node: !!this._nodeRequire,
            production: isProduction
          }));
        }
        var baseURIObj = new URL(baseURI);
        hookConstructor(function(constructor) {
          return function() {
            constructor.call(this);
            this.baseURL = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
            this.map = {};
            this.paths = {};
            this.warnings = false;
            this.defaultJSExtensions = false;
            this.pluginFirst = false;
            this.set('@empty', this.newModule({}));
            setProduction.call(this, false);
          };
        });
        if (typeof require != 'undefined' && typeof process != 'undefined' && !process.browser)
          SystemJSLoader.prototype._nodeRequire = require;
        var nodeCoreModules = ['assert', 'buffer', 'child_process', 'cluster', 'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];
        function applyMap(name) {
          if (name[0] != '.' && name[0] != '/' && !name.match(absURLRegEx)) {
            var mapMatch = getMapMatch(this.map, name);
            if (mapMatch)
              return this.map[mapMatch] + name.substr(mapMatch.length);
          }
          return name;
        }
        hook('normalize', function(normalize) {
          return function(name, parentName, skipExt) {
            name = applyMap.call(this, name);
            if (name.substr(0, 6) == '@node/' && nodeCoreModules.indexOf(name.substr(6)) != -1) {
              if (!this._nodeRequire)
                throw new TypeError('Error loading ' + name + '. Can only load node core modules in Node.');
              this.set(name, this.newModule(getESModule(this._nodeRequire(name.substr(6)))));
            }
            if (name[0] == '.' || name[0] == '/') {
              if (parentName)
                name = new URL(name, parentName.replace(/#/g, '%05')).href.replace(/%05/g, '#');
              else
                name = new URL(name, baseURIObj).href;
            }
            if (this.has(name))
              return name;
            if (name.match(absURLRegEx)) {
              if (this.defaultJSExtensions && name.substr(name.length - 3, 3) != '.js' && !skipExt)
                name += '.js';
              return name;
            }
            name = applyPaths(this.paths, name) || name;
            if (this.defaultJSExtensions && name.substr(name.length - 3, 3) != '.js' && !skipExt)
              name += '.js';
            if (name[0] == '.' || name[0] == '/')
              return new URL(name, baseURIObj).href;
            else
              return new URL(name, getBaseURLObj.call(this)).href;
          };
        });
        var httpRequest = typeof XMLHttpRequest != 'undefined';
        hook('locate', function(locate) {
          return function(load) {
            return Promise.resolve(locate.call(this, load)).then(function(address) {
              if (httpRequest)
                return address.replace(/#/g, '%23');
              return address;
            });
          };
        });
        hook('fetch', function() {
          return function(load) {
            return new Promise(function(resolve, reject) {
              fetchTextFromURL(load.address, load.metadata.authorization, resolve, reject);
            });
          };
        });
        hook('import', function(systemImport) {
          return function(name, parentName, parentAddress) {
            if (parentName && parentName.name)
              warn.call(this, 'SystemJS.import(name, { name: parentName }) is deprecated for SystemJS.import(name, parentName), while importing ' + name + ' from ' + parentName.name);
            return systemImport.call(this, name, parentName, parentAddress).then(function(module) {
              return module.__useDefault ? module['default'] : module;
            });
          };
        });
        hook('translate', function(systemTranslate) {
          return function(load) {
            if (load.metadata.format == 'detect')
              load.metadata.format = undefined;
            return systemTranslate.call(this, load);
          };
        });
        hook('instantiate', function(instantiate) {
          return function(load) {
            if (load.metadata.format == 'json' && !this.builder) {
              var entry = load.metadata.entry = createEntry();
              entry.deps = [];
              entry.execute = function() {
                try {
                  return JSON.parse(load.source);
                } catch (e) {
                  throw new Error("Invalid JSON file " + load.name);
                }
              };
            }
          };
        });
        SystemJSLoader.prototype.env = 'development';
        SystemJSLoader.prototype.config = function(cfg) {
          var loader = this;
          if ('warnings' in cfg)
            loader.warnings = cfg.warnings;
          if (cfg.transpilerRuntime === false)
            loader._loader.loadedTranspilerRuntime = true;
          if (cfg.baseURL) {
            var hasConfig = false;
            function checkHasConfig(obj) {
              for (var p in obj)
                if (hasOwnProperty.call(obj, p))
                  return true;
            }
            if (checkHasConfig(loader.packages) || checkHasConfig(loader.meta) || checkHasConfig(loader.depCache) || checkHasConfig(loader.bundles) || checkHasConfig(loader.packageConfigPaths))
              throw new TypeError('Incorrect configuration order. The baseURL must be configured with the first SystemJS.config call.');
            loader.baseURL = cfg.baseURL;
            getBaseURLObj.call(loader);
          }
          if (cfg.defaultJSExtensions) {
            loader.defaultJSExtensions = cfg.defaultJSExtensions;
            warn.call(loader, 'The defaultJSExtensions configuration option is deprecated, use packages configuration instead.');
          }
          if (cfg.pluginFirst)
            loader.pluginFirst = cfg.pluginFirst;
          if (cfg.production)
            setProduction.call(loader, true);
          if (cfg.paths) {
            for (var p in cfg.paths)
              loader.paths[p] = cfg.paths[p];
          }
          if (cfg.map) {
            var objMaps = '';
            for (var p in cfg.map) {
              var v = cfg.map[p];
              if (typeof v !== 'string') {
                objMaps += (objMaps.length ? ', ' : '') + '"' + p + '"';
                var defaultJSExtension = loader.defaultJSExtensions && p.substr(p.length - 3, 3) != '.js';
                var prop = loader.decanonicalize(p);
                if (defaultJSExtension && prop.substr(prop.length - 3, 3) == '.js')
                  prop = prop.substr(0, prop.length - 3);
                var pkgMatch = '';
                for (var pkg in loader.packages) {
                  if (prop.substr(0, pkg.length) == pkg && (!prop[pkg.length] || prop[pkg.length] == '/') && pkgMatch.split('/').length < pkg.split('/').length)
                    pkgMatch = pkg;
                }
                if (pkgMatch && loader.packages[pkgMatch].main)
                  prop = prop.substr(0, prop.length - loader.packages[pkgMatch].main.length - 1);
                var pkg = loader.packages[prop] = loader.packages[prop] || {};
                pkg.map = v;
              } else {
                loader.map[p] = v;
              }
            }
            if (objMaps)
              warn.call(loader, 'The map configuration for ' + objMaps + ' uses object submaps, which is deprecated in global map.\nUpdate this to use package contextual map with configs like SystemJS.config({ packages: { "' + p + '": { map: {...} } } }).');
          }
          if (cfg.packageConfigPaths) {
            var packageConfigPaths = [];
            for (var i = 0; i < cfg.packageConfigPaths.length; i++) {
              var path = cfg.packageConfigPaths[i];
              var packageLength = Math.max(path.lastIndexOf('*') + 1, path.lastIndexOf('/'));
              var defaultJSExtension = loader.defaultJSExtensions && path.substr(packageLength - 3, 3) != '.js';
              var normalized = loader.decanonicalize(path.substr(0, packageLength));
              if (defaultJSExtension && normalized.substr(normalized.length - 3, 3) == '.js')
                normalized = normalized.substr(0, normalized.length - 3);
              packageConfigPaths[i] = normalized + path.substr(packageLength);
            }
            loader.packageConfigPaths = packageConfigPaths;
          }
          if (cfg.bundles) {
            for (var p in cfg.bundles) {
              var bundle = [];
              for (var i = 0; i < cfg.bundles[p].length; i++) {
                var defaultJSExtension = loader.defaultJSExtensions && cfg.bundles[p][i].substr(cfg.bundles[p][i].length - 3, 3) != '.js';
                var normalizedBundleDep = loader.decanonicalize(cfg.bundles[p][i]);
                if (defaultJSExtension && normalizedBundleDep.substr(normalizedBundleDep.length - 3, 3) == '.js')
                  normalizedBundleDep = normalizedBundleDep.substr(0, normalizedBundleDep.length - 3);
                bundle.push(normalizedBundleDep);
              }
              loader.bundles[p] = bundle;
            }
          }
          if (cfg.packages) {
            for (var p in cfg.packages) {
              if (p.match(/^([^\/]+:)?\/\/$/))
                throw new TypeError('"' + p + '" is not a valid package name.');
              var defaultJSExtension = loader.defaultJSExtensions && p.substr(p.length - 3, 3) != '.js';
              var prop = loader.decanonicalize(applyMap(p));
              if (defaultJSExtension && prop.substr(prop.length - 3, 3) == '.js')
                prop = prop.substr(0, prop.length - 3);
              if (prop[prop.length - 1] == '/')
                prop = prop.substr(0, prop.length - 1);
              loader.packages[prop] = loader.packages[prop] || {};
              if (cfg.packages[p].modules) {
                warn.call(loader, 'Package ' + p + ' is configured with "modules", which is deprecated as it has been renamed to "meta".');
                cfg.packages[p].meta = cfg.packages[p].modules;
                delete cfg.packages[p].modules;
              }
              for (var q in cfg.packages[p])
                if (indexOf.call(packageProperties, q) == -1)
                  warn.call(loader, '"' + q + '" is not a valid package configuration option in package ' + p);
              extendMeta(loader.packages[prop], cfg.packages[p]);
            }
          }
          for (var c in cfg) {
            var v = cfg[c];
            if (c == 'baseURL' || c == 'map' || c == 'packages' || c == 'bundles' || c == 'paths' || c == 'warnings' || c == 'packageConfigPaths')
              continue;
            if (typeof v != 'object' || v instanceof Array) {
              loader[c] = v;
            } else {
              loader[c] = loader[c] || {};
              for (var p in v) {
                if (c == 'meta' && p[0] == '*') {
                  loader[c][p] = v[p];
                } else if (c == 'meta') {
                  loader[c][loader.decanonicalize(applyMap(p))] = v[p];
                } else if (c == 'depCache') {
                  var defaultJSExtension = loader.defaultJSExtensions && p.substr(p.length - 3, 3) != '.js';
                  var prop = loader.decanonicalize(p);
                  if (defaultJSExtension && prop.substr(prop.length - 3, 3) == '.js')
                    prop = prop.substr(0, prop.length - 3);
                  loader[c][prop] = v[p];
                } else {
                  loader[c][p] = v[p];
                }
              }
            }
          }
        };
        (function() {
          hookConstructor(function(constructor) {
            return function() {
              constructor.call(this);
              this.packages = {};
              this.packageConfigPaths = [];
            };
          });
          function getPackage(loader, normalized) {
            var curPkg,
                curPkgLen = 0,
                pkgLen;
            for (var p in loader.packages) {
              if (normalized.substr(0, p.length) === p && (normalized.length === p.length || normalized[p.length] === '/')) {
                pkgLen = p.split('/').length;
                if (pkgLen > curPkgLen) {
                  curPkg = p;
                  curPkgLen = pkgLen;
                }
              }
            }
            return curPkg;
          }
          function getBasePath(pkg) {
            var basePath = pkg.basePath && pkg.basePath != '.' ? pkg.basePath : '';
            if (basePath) {
              if (basePath.substr(0, 2) == './')
                basePath = basePath.substr(2);
              if (basePath[basePath.length - 1] != '/')
                basePath += '/';
            }
            return basePath;
          }
          function addDefaultExtension(loader, pkg, pkgName, basePath, subPath, skipExtensions) {
            if (!subPath || subPath[subPath.length - 1] == '/' || skipExtensions || pkg.defaultExtension === false)
              return subPath;
            if (subPath.match(interpolationRegEx))
              return subPath;
            var metaMatch = false;
            if (pkg.meta)
              getMetaMatches(pkg.meta, subPath, function(metaPattern, matchMeta, matchDepth) {
                if (matchDepth == 0 || metaPattern.lastIndexOf('*') != metaPattern.length - 1)
                  return metaMatch = true;
              });
            if (!metaMatch && loader.meta)
              getMetaMatches(loader.meta, pkgName + '/' + basePath + subPath, function(metaPattern, matchMeta, matchDepth) {
                if (matchDepth == 0 || metaPattern.lastIndexOf('*') != metaPattern.length - 1)
                  return metaMatch = true;
              });
            if (metaMatch)
              return subPath;
            var defaultExtension = '.' + (pkg.defaultExtension || 'js');
            if (subPath.substr(subPath.length - defaultExtension.length) != defaultExtension)
              return subPath + defaultExtension;
            else
              return subPath;
          }
          function applyPackageConfigSync(loader, pkg, pkgName, subPath, skipExtensions) {
            if (!subPath) {
              if (pkg.main)
                subPath = pkg.main.substr(0, 2) == './' ? pkg.main.substr(2) : pkg.main;
              else
                return pkgName + (loader.defaultJSExtensions ? '.js' : '');
            }
            var basePath = getBasePath(pkg);
            if (pkg.map) {
              var mapPath = './' + subPath;
              var mapMatch = getMapMatch(pkg.map, mapPath);
              if (!mapMatch) {
                mapPath = './' + addDefaultExtension(loader, pkg, pkgName, basePath, subPath, skipExtensions);
                if (mapPath != './' + subPath)
                  mapMatch = getMapMatch(pkg.map, mapPath);
              }
              if (mapMatch)
                return doMapSync(loader, pkg, pkgName, basePath, mapMatch, mapPath, skipExtensions);
            }
            return pkgName + '/' + basePath + addDefaultExtension(loader, pkg, pkgName, basePath, subPath, skipExtensions);
          }
          function doMapSync(loader, pkg, pkgName, basePath, mapMatch, path, skipExtensions) {
            var mapped = pkg.map[mapMatch];
            if (typeof mapped != 'string')
              mapped = mapMatch = path;
            if (mapped == '.')
              mapped = pkgName;
            else if (mapped.substr(0, 2) == './')
              return pkgName + '/' + basePath + addDefaultExtension(loader, pkg, pkgName, basePath, mapped.substr(2) + path.substr(mapMatch.length), skipExtensions);
            return loader.normalizeSync(mapped + path.substr(mapMatch.length), pkgName + '/');
          }
          function applyPackageConfig(loader, pkg, pkgName, subPath, skipExtensions) {
            if (!subPath) {
              if (pkg.main)
                subPath = pkg.main.substr(0, 2) == './' ? pkg.main.substr(2) : pkg.main;
              else
                return Promise.resolve(pkgName + (loader.defaultJSExtensions ? '.js' : ''));
            }
            var basePath = getBasePath(pkg);
            var mapPath,
                mapMatch;
            if (pkg.map) {
              mapPath = './' + subPath;
              mapMatch = getMapMatch(pkg.map, mapPath);
              if (!mapMatch) {
                mapPath = './' + addDefaultExtension(loader, pkg, pkgName, basePath, subPath, skipExtensions);
                if (mapPath != './' + subPath)
                  mapMatch = getMapMatch(pkg.map, mapPath);
              }
            }
            return (mapMatch ? doMap(loader, pkg, pkgName, basePath, mapMatch, mapPath, skipExtensions) : Promise.resolve()).then(function(mapped) {
              if (mapped)
                return Promise.resolve(mapped);
              return Promise.resolve(pkgName + '/' + basePath + addDefaultExtension(loader, pkg, pkgName, basePath, subPath, skipExtensions));
            });
          }
          function doStringMap(loader, pkg, pkgName, basePath, mapMatch, mapped, path, skipExtensions) {
            if (mapped == '.')
              mapped = pkgName;
            else if (mapped.substr(0, 2) == './')
              return Promise.resolve(pkgName + '/' + basePath + addDefaultExtension(loader, pkg, pkgName, basePath, mapped.substr(2) + path.substr(mapMatch.length), skipExtensions)).then(function(name) {
                return interpolateConditional.call(loader, name, pkgName + '/');
              });
            return loader.normalize(mapped + path.substr(mapMatch.length), pkgName + '/');
          }
          function doMap(loader, pkg, pkgName, basePath, mapMatch, path, skipExtensions) {
            var mapped = pkg.map[mapMatch];
            if (typeof mapped == 'string')
              return doStringMap(loader, pkg, pkgName, basePath, mapMatch, mapped, path, skipExtensions);
            if (loader.builder)
              return Promise.resolve(pkgName + '/#:' + path);
            return loader['import'](pkg.map['@env'] || '@system-env', pkgName).then(function(env) {
              for (var e in mapped) {
                var negate = e[0] == '~';
                var value = readMemberExpression(negate ? e.substr(1) : e, env);
                if (!negate && value || negate && !value)
                  return mapped[e];
              }
            }).then(function(mapped) {
              if (mapped)
                return doStringMap(loader, pkg, pkgName, basePath, mapMatch, mapped, path, skipExtensions);
            });
          }
          SystemJSLoader.prototype.normalizeSync = SystemJSLoader.prototype.decanonicalize = SystemJSLoader.prototype.normalize;
          hook('decanonicalize', function(decanonicalize) {
            return function(name, parentName) {
              if (this.builder)
                return decanonicalize.call(this, name, parentName, true);
              var decanonicalized = decanonicalize.call(this, name, parentName);
              if (!this.defaultJSExtensions)
                return decanonicalized;
              var pkgName = getPackage(this, decanonicalized);
              var pkg = this.packages[pkgName];
              var defaultExtension = pkg && pkg.defaultExtension;
              if (defaultExtension == undefined && pkg && pkg.meta)
                getMetaMatches(pkg.meta, decanonicalized.substr(pkgName), function(metaPattern, matchMeta, matchDepth) {
                  if (matchDepth == 0 || metaPattern.lastIndexOf('*') != metaPattern.length - 1) {
                    defaultExtension = false;
                    return true;
                  }
                });
              if ((defaultExtension === false || defaultExtension && defaultExtension != '.js') && name.substr(name.length - 3, 3) != '.js' && decanonicalized.substr(decanonicalized.length - 3, 3) == '.js')
                decanonicalized = decanonicalized.substr(0, decanonicalized.length - 3);
              return decanonicalized;
            };
          });
          hook('normalizeSync', function(normalizeSync) {
            return function(name, parentName, isPlugin) {
              warn.call(this, 'SystemJS.normalizeSync has been deprecated for SystemJS.decanonicalize.');
              var loader = this;
              isPlugin = isPlugin === true;
              if (parentName)
                var parentPackageName = getPackage(loader, parentName) || loader.defaultJSExtensions && parentName.substr(parentName.length - 3, 3) == '.js' && getPackage(loader, parentName.substr(0, parentName.length - 3));
              var parentPackage = parentPackageName && loader.packages[parentPackageName];
              if (parentPackage) {
                var parentBasePath = getBasePath(parentPackage);
                if (parentBasePath && parentName.substr(parentPackageName.length + 1, parentBasePath.length) == parentBasePath)
                  parentName = parentPackageName + parentName.substr(parentPackageName.length + parentBasePath.length);
              }
              if (parentPackage && name[0] != '.') {
                var parentMap = parentPackage.map;
                var parentMapMatch = parentMap && getMapMatch(parentMap, name);
                if (parentMapMatch && typeof parentMap[parentMapMatch] == 'string')
                  return doMapSync(loader, parentPackage, parentPackageName, getBasePath(parentPackage), parentMapMatch, name, isPlugin);
              }
              var defaultJSExtension = loader.defaultJSExtensions && name.substr(name.length - 3, 3) != '.js';
              var normalized = normalizeSync.call(loader, name, parentName);
              if (defaultJSExtension && normalized.substr(normalized.length - 3, 3) != '.js')
                defaultJSExtension = false;
              if (defaultJSExtension)
                normalized = normalized.substr(0, normalized.length - 3);
              var pkgConfigMatch = getPackageConfigMatch(loader, normalized);
              var pkgName = pkgConfigMatch && pkgConfigMatch.packageName || getPackage(loader, normalized);
              if (!pkgName)
                return normalized + (defaultJSExtension ? '.js' : '');
              var subPath = normalized.substr(pkgName.length + 1);
              return applyPackageConfigSync(loader, loader.packages[pkgName] || {}, pkgName, subPath, isPlugin);
            };
          });
          hook('normalize', function(normalize) {
            return function(name, parentName, isPlugin) {
              var loader = this;
              isPlugin = isPlugin === true;
              return Promise.resolve().then(function() {
                if (parentName)
                  var parentPackageName = getPackage(loader, parentName) || loader.defaultJSExtensions && parentName.substr(parentName.length - 3, 3) == '.js' && getPackage(loader, parentName.substr(0, parentName.length - 3));
                var parentPackage = parentPackageName && loader.packages[parentPackageName];
                if (parentPackage) {
                  var parentBasePath = getBasePath(parentPackage);
                  if (parentBasePath && parentName.substr(parentPackageName.length + 1, parentBasePath.length) == parentBasePath)
                    parentName = parentPackageName + parentName.substr(parentPackageName.length + parentBasePath.length);
                }
                if (parentPackage && name.substr(0, 2) != './') {
                  var parentMap = parentPackage.map;
                  var parentMapMatch = parentMap && getMapMatch(parentMap, name);
                  if (parentMapMatch)
                    return doMap(loader, parentPackage, parentPackageName, parentBasePath, parentMapMatch, name, isPlugin);
                }
                return Promise.resolve();
              }).then(function(mapped) {
                if (mapped)
                  return mapped;
                var defaultJSExtension = loader.defaultJSExtensions && name.substr(name.length - 3, 3) != '.js';
                var normalized = normalize.call(loader, name, parentName);
                if (defaultJSExtension && normalized.substr(normalized.length - 3, 3) != '.js')
                  defaultJSExtension = false;
                if (defaultJSExtension)
                  normalized = normalized.substr(0, normalized.length - 3);
                var pkgConfigMatch = getPackageConfigMatch(loader, normalized);
                var pkgName = pkgConfigMatch && pkgConfigMatch.packageName || getPackage(loader, normalized);
                if (!pkgName)
                  return Promise.resolve(normalized + (defaultJSExtension ? '.js' : ''));
                var pkg = loader.packages[pkgName];
                var isConfigured = pkg && (pkg.configured || !pkgConfigMatch);
                return (isConfigured ? Promise.resolve(pkg) : loadPackageConfigPath(loader, pkgName, pkgConfigMatch.configPath)).then(function(pkg) {
                  var subPath = normalized.substr(pkgName.length + 1);
                  return applyPackageConfig(loader, pkg, pkgName, subPath, isPlugin);
                });
              });
            };
          });
          var packageConfigPaths = {};
          function createPkgConfigPathObj(path) {
            var lastWildcard = path.lastIndexOf('*');
            var length = Math.max(lastWildcard + 1, path.lastIndexOf('/'));
            return {
              length: length,
              regEx: new RegExp('^(' + path.substr(0, length).replace(/\*/g, '[^\\/]+') + ')(\\/|$)'),
              wildcard: lastWildcard != -1
            };
          }
          function getPackageConfigMatch(loader, normalized) {
            var pkgName,
                exactMatch = false,
                configPath;
            for (var i = 0; i < loader.packageConfigPaths.length; i++) {
              var packageConfigPath = loader.packageConfigPaths[i];
              var p = packageConfigPaths[packageConfigPath] || (packageConfigPaths[packageConfigPath] = createPkgConfigPathObj(packageConfigPath));
              if (normalized.length < p.length)
                continue;
              var match = normalized.match(p.regEx);
              if (match && (!pkgName || (!(exactMatch && p.wildcard) && pkgName.length < match[1].length))) {
                pkgName = match[1];
                exactMatch = !p.wildcard;
                configPath = pkgName + packageConfigPath.substr(p.length);
              }
            }
            if (!pkgName)
              return;
            return {
              packageName: pkgName,
              configPath: configPath
            };
          }
          function loadPackageConfigPath(loader, pkgName, pkgConfigPath) {
            var configLoader = loader.pluginLoader || loader;
            (configLoader.meta[pkgConfigPath] = configLoader.meta[pkgConfigPath] || {}).format = 'json';
            return configLoader.load(pkgConfigPath).then(function() {
              pkgConfig = configLoader.get(pkgConfigPath);
              var cfg = pkgConfig['default'];
              if (cfg.systemjs)
                cfg = cfg.systemjs;
              if (cfg.modules) {
                cfg.meta = cfg.modules;
                warn.call(loader, 'Package config file ' + pkgConfigPath + ' is configured with "modules", which is deprecated as it has been renamed to "meta".');
              }
              for (var p in cfg) {
                if (indexOf.call(packageProperties, p) == -1)
                  delete cfg[p];
              }
              var pkg = loader.packages[pkgName] = loader.packages[pkgName] || {};
              extendMeta(pkg, cfg, true);
              var basePath = getBasePath(pkg);
              if (cfg.depCache) {
                for (var d in cfg.depCache) {
                  var dNormalized;
                  if (d.substr(0, 2) == './')
                    dNormalized = pkgName + '/' + basePath + d.substr(2);
                  else
                    dNormalized = coreResolve.call(loader, d);
                  loader.depCache[dNormalized] = (loader.depCache[dNormalized] || []).concat(cfg.depCache[d]);
                }
                delete cfg.depCache;
              }
              return pkg;
            });
          }
          function getMetaMatches(pkgMeta, subPath, matchFn) {
            var meta = {};
            var wildcardIndex;
            for (var module in pkgMeta) {
              var dotRel = module.substr(0, 2) == './' ? './' : '';
              if (dotRel)
                module = module.substr(2);
              wildcardIndex = module.indexOf('*');
              if (wildcardIndex === -1)
                continue;
              if (module.substr(0, wildcardIndex) == subPath.substr(0, wildcardIndex) && module.substr(wildcardIndex + 1) == subPath.substr(subPath.length - module.length + wildcardIndex + 1)) {
                if (matchFn(module, pkgMeta[dotRel + module], module.split('/').length))
                  return;
              }
            }
            var exactMeta = pkgMeta[subPath] || pkgMeta['./' + subPath];
            if (exactMeta)
              matchFn(exactMeta, exactMeta, 0);
          }
          hook('locate', function(locate) {
            return function(load) {
              var loader = this;
              return Promise.resolve(locate.call(this, load)).then(function(address) {
                var pkgName = getPackage(loader, load.name);
                if (pkgName) {
                  var pkg = loader.packages[pkgName];
                  var basePath = getBasePath(pkg);
                  var subPath = load.name.substr(pkgName.length + basePath.length + 1);
                  if (pkg.format)
                    load.metadata.format = load.metadata.format || pkg.format;
                  var meta = {};
                  if (pkg.meta) {
                    var bestDepth = 0;
                    getMetaMatches(pkg.meta, subPath, function(metaPattern, matchMeta, matchDepth) {
                      if (matchDepth > bestDepth)
                        bestDepth = matchDepth;
                      extendMeta(meta, matchMeta, matchDepth && bestDepth > matchDepth);
                    });
                    if (meta.alias && meta.alias.substr(0, 2) == './')
                      meta.alias = pkgName + meta.alias.substr(1);
                    if (meta.loader && meta.loader.substr(0, 2) == './')
                      meta.loader = pkgName + meta.loader.substr(1);
                    extendMeta(load.metadata, meta);
                  }
                }
                return address;
              });
            };
          });
        })();
        (function() {
          if (typeof document != 'undefined')
            var head = document.getElementsByTagName('head')[0];
          var curSystem;
          var workerLoad = null;
          var ieEvents = head && (function() {
            var s = document.createElement('script');
            var isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]';
            return s.attachEvent && !(s.attachEvent.toString && s.attachEvent.toString().indexOf('[native code') < 0) && !isOpera;
          })();
          var interactiveLoadingScripts = [];
          var interactiveScript;
          function getInteractiveScriptLoad() {
            if (interactiveScript && interactiveScript.script.readyState === 'interactive')
              return interactiveScript.load;
            for (var i = 0; i < interactiveLoadingScripts.length; i++)
              if (interactiveLoadingScripts[i].script.readyState == 'interactive') {
                interactiveScript = interactiveLoadingScripts[i];
                return interactiveScript.load;
              }
          }
          var loadingCnt = 0;
          var registerQueue = [];
          hook('pushRegister_', function(pushRegister) {
            return function(register) {
              if (pushRegister.call(this, register))
                return false;
              if (workerLoad)
                this.reduceRegister_(workerLoad, register);
              else if (ieEvents)
                this.reduceRegister_(getInteractiveScriptLoad(), register);
              else if (loadingCnt)
                registerQueue.push(register);
              else
                this.reduceRegister_(null, register);
              return true;
            };
          });
          function webWorkerImport(loader, load) {
            return new Promise(function(resolve, reject) {
              if (load.metadata.integrity)
                reject(new Error('Subresource integrity checking is not supported in web workers.'));
              workerLoad = load;
              try {
                importScripts(load.address);
              } catch (e) {
                workerLoad = null;
                reject(e);
              }
              workerLoad = null;
              if (!load.metadata.entry)
                reject(new Error(load.address + ' did not call System.register or AMD define'));
              resolve('');
            });
          }
          hook('fetch', function(fetch) {
            return function(load) {
              var loader = this;
              if (load.metadata.format == 'json' || !load.metadata.scriptLoad || (!isBrowser && !isWorker))
                return fetch.call(this, load);
              if (isWorker)
                return webWorkerImport(loader, load);
              return new Promise(function(resolve, reject) {
                var s = document.createElement('script');
                s.async = true;
                if (load.metadata.integrity)
                  s.setAttribute('integrity', load.metadata.integrity);
                if (ieEvents) {
                  s.attachEvent('onreadystatechange', complete);
                  interactiveLoadingScripts.push({
                    script: s,
                    load: load
                  });
                } else {
                  s.addEventListener('load', complete, false);
                  s.addEventListener('error', error, false);
                }
                loadingCnt++;
                curSystem = __global.System;
                s.src = load.address;
                head.appendChild(s);
                function complete(evt) {
                  if (s.readyState && s.readyState != 'loaded' && s.readyState != 'complete')
                    return;
                  loadingCnt--;
                  if (!load.metadata.entry && !registerQueue.length) {
                    loader.reduceRegister_(load);
                  } else if (!ieEvents) {
                    for (var i = 0; i < registerQueue.length; i++)
                      loader.reduceRegister_(load, registerQueue[i]);
                    registerQueue = [];
                  }
                  cleanup();
                  if (!load.metadata.entry && !load.metadata.bundle)
                    reject(new Error(load.name + ' did not call System.register or AMD define. If loading a global module configure the global name via the meta exports property for script injection support.'));
                  resolve('');
                }
                function error(evt) {
                  cleanup();
                  reject(new Error('Unable to load script ' + load.address));
                }
                function cleanup() {
                  __global.System = curSystem;
                  if (s.detachEvent) {
                    s.detachEvent('onreadystatechange', complete);
                    for (var i = 0; i < interactiveLoadingScripts.length; i++)
                      if (interactiveLoadingScripts[i].script == s) {
                        if (interactiveScript && interactiveScript.script == s)
                          interactiveScript = null;
                        interactiveLoadingScripts.splice(i, 1);
                      }
                  } else {
                    s.removeEventListener('load', complete, false);
                    s.removeEventListener('error', error, false);
                  }
                  head.removeChild(s);
                }
              });
            };
          });
        })();
        var leadingCommentAndMetaRegEx = /^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)*\s*/;
        function detectRegisterFormat(source) {
          var leadingCommentAndMeta = source.match(leadingCommentAndMetaRegEx);
          return leadingCommentAndMeta && source.substr(leadingCommentAndMeta[0].length, 15) == 'System.register';
        }
        function createEntry() {
          return {
            name: null,
            deps: null,
            originalIndices: null,
            declare: null,
            execute: null,
            executingRequire: false,
            declarative: false,
            normalizedDeps: null,
            groupIndex: null,
            evaluated: false,
            module: null,
            esModule: null,
            esmExports: false
          };
        }
        (function() {
          SystemJSLoader.prototype.register = function(name, deps, declare) {
            if (typeof name != 'string') {
              declare = deps;
              deps = name;
              name = null;
            }
            if (typeof declare == 'boolean')
              return this.registerDynamic.apply(this, arguments);
            var entry = createEntry();
            entry.name = name && (this.decanonicalize || this.normalize).call(this, name);
            entry.declarative = true;
            entry.deps = deps;
            entry.declare = declare;
            this.pushRegister_({
              amd: false,
              entry: entry
            });
          };
          SystemJSLoader.prototype.registerDynamic = function(name, deps, declare, execute) {
            if (typeof name != 'string') {
              execute = declare;
              declare = deps;
              deps = name;
              name = null;
            }
            var entry = createEntry();
            entry.name = name && (this.decanonicalize || this.normalize).call(this, name);
            entry.deps = deps;
            entry.execute = execute;
            entry.executingRequire = declare;
            this.pushRegister_({
              amd: false,
              entry: entry
            });
          };
          hook('reduceRegister_', function() {
            return function(load, register) {
              if (!register)
                return;
              var entry = register.entry;
              var curMeta = load && load.metadata;
              if (entry.name) {
                if (!(entry.name in this.defined))
                  this.defined[entry.name] = entry;
                if (curMeta)
                  curMeta.bundle = true;
              }
              if (!entry.name || load && entry.name == load.name) {
                if (!curMeta)
                  throw new TypeError('Unexpected anonymous System.register call.');
                if (curMeta.entry) {
                  if (curMeta.format == 'register')
                    throw new Error('Multiple anonymous System.register calls in module ' + load.name + '. If loading a bundle, ensure all the System.register calls are named.');
                  else
                    throw new Error('Module ' + load.name + ' interpreted as ' + curMeta.format + ' module format, but called System.register.');
                }
                if (!curMeta.format)
                  curMeta.format = 'register';
                curMeta.entry = entry;
              }
            };
          });
          hookConstructor(function(constructor) {
            return function() {
              constructor.call(this);
              this.defined = {};
              this._loader.moduleRecords = {};
            };
          });
          function buildGroups(entry, loader, groups) {
            groups[entry.groupIndex] = groups[entry.groupIndex] || [];
            if (indexOf.call(groups[entry.groupIndex], entry) != -1)
              return;
            groups[entry.groupIndex].push(entry);
            for (var i = 0,
                l = entry.normalizedDeps.length; i < l; i++) {
              var depName = entry.normalizedDeps[i];
              var depEntry = loader.defined[depName];
              if (!depEntry || depEntry.evaluated)
                continue;
              var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);
              if (depEntry.groupIndex === null || depEntry.groupIndex < depGroupIndex) {
                if (depEntry.groupIndex !== null) {
                  groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);
                  if (groups[depEntry.groupIndex].length == 0)
                    throw new Error("Mixed dependency cycle detected");
                }
                depEntry.groupIndex = depGroupIndex;
              }
              buildGroups(depEntry, loader, groups);
            }
          }
          function link(name, loader) {
            var startEntry = loader.defined[name];
            if (startEntry.module)
              return;
            startEntry.groupIndex = 0;
            var groups = [];
            buildGroups(startEntry, loader, groups);
            var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
            for (var i = groups.length - 1; i >= 0; i--) {
              var group = groups[i];
              for (var j = 0; j < group.length; j++) {
                var entry = group[j];
                if (curGroupDeclarative)
                  linkDeclarativeModule(entry, loader);
                else
                  linkDynamicModule(entry, loader);
              }
              curGroupDeclarative = !curGroupDeclarative;
            }
          }
          function Module() {}
          defineProperty(Module, 'toString', {value: function() {
              return 'Module';
            }});
          function getOrCreateModuleRecord(name, moduleRecords) {
            return moduleRecords[name] || (moduleRecords[name] = {
              name: name,
              dependencies: [],
              exports: new Module(),
              importers: []
            });
          }
          function linkDeclarativeModule(entry, loader) {
            if (entry.module)
              return;
            var moduleRecords = loader._loader.moduleRecords;
            var module = entry.module = getOrCreateModuleRecord(entry.name, moduleRecords);
            var exports = entry.module.exports;
            var declaration = entry.declare.call(__global, function(name, value) {
              module.locked = true;
              if (typeof name == 'object') {
                for (var p in name)
                  exports[p] = name[p];
              } else {
                exports[name] = value;
              }
              for (var i = 0,
                  l = module.importers.length; i < l; i++) {
                var importerModule = module.importers[i];
                if (!importerModule.locked) {
                  var importerIndex = indexOf.call(importerModule.dependencies, module);
                  importerModule.setters[importerIndex](exports);
                }
              }
              module.locked = false;
              return value;
            }, {id: entry.name});
            module.setters = declaration.setters;
            module.execute = declaration.execute;
            if (!module.setters || !module.execute) {
              throw new TypeError('Invalid System.register form for ' + entry.name);
            }
            for (var i = 0,
                l = entry.normalizedDeps.length; i < l; i++) {
              var depName = entry.normalizedDeps[i];
              var depEntry = loader.defined[depName];
              var depModule = moduleRecords[depName];
              var depExports;
              if (depModule) {
                depExports = depModule.exports;
              } else if (depEntry && !depEntry.declarative) {
                depExports = depEntry.esModule;
              } else if (!depEntry) {
                depExports = loader.get(depName);
              } else {
                linkDeclarativeModule(depEntry, loader);
                depModule = depEntry.module;
                depExports = depModule.exports;
              }
              if (depModule && depModule.importers) {
                depModule.importers.push(module);
                module.dependencies.push(depModule);
              } else {
                module.dependencies.push(null);
              }
              var originalIndices = entry.originalIndices[i];
              for (var j = 0,
                  len = originalIndices.length; j < len; ++j) {
                var index = originalIndices[j];
                if (module.setters[index]) {
                  module.setters[index](depExports);
                }
              }
            }
          }
          function getModule(name, loader) {
            var exports;
            var entry = loader.defined[name];
            if (!entry) {
              exports = loader.get(name);
              if (!exports)
                throw new Error('Unable to load dependency ' + name + '.');
            } else {
              if (entry.declarative)
                ensureEvaluated(name, [], loader);
              else if (!entry.evaluated)
                linkDynamicModule(entry, loader);
              exports = entry.module.exports;
            }
            if ((!entry || entry.declarative) && exports && exports.__useDefault)
              return exports['default'];
            return exports;
          }
          function linkDynamicModule(entry, loader) {
            if (entry.module)
              return;
            var exports = {};
            var module = entry.module = {
              exports: exports,
              id: entry.name
            };
            if (!entry.executingRequire) {
              for (var i = 0,
                  l = entry.normalizedDeps.length; i < l; i++) {
                var depName = entry.normalizedDeps[i];
                var depEntry = loader.defined[depName];
                if (depEntry)
                  linkDynamicModule(depEntry, loader);
              }
            }
            entry.evaluated = true;
            var output = entry.execute.call(__global, function(name) {
              for (var i = 0,
                  l = entry.deps.length; i < l; i++) {
                if (entry.deps[i] != name)
                  continue;
                return getModule(entry.normalizedDeps[i], loader);
              }
              throw new Error('Module ' + name + ' not declared as a dependency.');
            }, exports, module);
            if (output)
              module.exports = output;
            exports = module.exports;
            if (exports && exports.__esModule)
              entry.esModule = exports;
            else if (entry.esmExports && exports !== __global)
              entry.esModule = getESModule(exports);
            else
              entry.esModule = {'default': exports};
          }
          function ensureEvaluated(moduleName, seen, loader) {
            var entry = loader.defined[moduleName];
            if (!entry || entry.evaluated || !entry.declarative)
              return;
            seen.push(moduleName);
            for (var i = 0,
                l = entry.normalizedDeps.length; i < l; i++) {
              var depName = entry.normalizedDeps[i];
              if (indexOf.call(seen, depName) == -1) {
                if (!loader.defined[depName])
                  loader.get(depName);
                else
                  ensureEvaluated(depName, seen, loader);
              }
            }
            if (entry.evaluated)
              return;
            entry.evaluated = true;
            entry.module.execute.call(__global);
          }
          hook('delete', function(del) {
            return function(name) {
              delete this._loader.moduleRecords[name];
              delete this.defined[name];
              return del.call(this, name);
            };
          });
          hook('fetch', function(fetch) {
            return function(load) {
              if (this.defined[load.name]) {
                load.metadata.format = 'defined';
                return '';
              }
              load.metadata.deps = load.metadata.deps || [];
              return fetch.call(this, load);
            };
          });
          hook('translate', function(translate) {
            return function(load) {
              load.metadata.deps = load.metadata.deps || [];
              return Promise.resolve(translate.call(this, load)).then(function(source) {
                if (load.metadata.format == 'register' || !load.metadata.format && detectRegisterFormat(load.source))
                  load.metadata.format = 'register';
                return source;
              });
            };
          });
          hook('instantiate', function(instantiate) {
            return function(load) {
              if (load.metadata.format == 'detect')
                load.metadata.format = undefined;
              instantiate.call(this, load);
              var loader = this;
              var entry;
              if (loader.defined[load.name]) {
                entry = loader.defined[load.name];
                if (!entry.declarative)
                  entry.deps = entry.deps.concat(load.metadata.deps);
              } else if (load.metadata.entry) {
                entry = load.metadata.entry;
                entry.deps = entry.deps.concat(load.metadata.deps);
              } else if (!(loader.builder && load.metadata.bundle) && (load.metadata.format == 'register' || load.metadata.format == 'esm' || load.metadata.format == 'es6')) {
                if (typeof __exec != 'undefined')
                  __exec.call(loader, load);
                if (!load.metadata.entry && !load.metadata.bundle)
                  throw new Error(load.name + ' detected as ' + load.metadata.format + ' but didn\'t execute.');
                entry = load.metadata.entry;
                if (entry && load.metadata.deps)
                  entry.deps = entry.deps.concat(load.metadata.deps);
              }
              if (!entry) {
                entry = createEntry();
                entry.deps = load.metadata.deps;
                entry.execute = function() {};
              }
              loader.defined[load.name] = entry;
              var grouped = group(entry.deps);
              entry.deps = grouped.names;
              entry.originalIndices = grouped.indices;
              entry.name = load.name;
              entry.esmExports = load.metadata.esmExports !== false;
              var normalizePromises = [];
              for (var i = 0,
                  l = entry.deps.length; i < l; i++)
                normalizePromises.push(Promise.resolve(loader.normalize(entry.deps[i], load.name)));
              return Promise.all(normalizePromises).then(function(normalizedDeps) {
                entry.normalizedDeps = normalizedDeps;
                return {
                  deps: entry.deps,
                  execute: function() {
                    link(load.name, loader);
                    ensureEvaluated(load.name, [], loader);
                    loader.defined[load.name] = undefined;
                    return loader.newModule(entry.declarative ? entry.module.exports : entry.esModule);
                  }
                };
              });
            };
          });
        })();
        hook('reduceRegister_', function(reduceRegister) {
          return function(load, register) {
            if (register || !load.metadata.exports)
              return reduceRegister.call(this, load, register);
            load.metadata.format = 'global';
            var entry = load.metadata.entry = createEntry();
            entry.deps = load.metadata.deps;
            var globalValue = readMemberExpression(load.metadata.exports, __global);
            entry.execute = function() {
              return globalValue;
            };
          };
        });
        hookConstructor(function(constructor) {
          return function() {
            var loader = this;
            constructor.call(loader);
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var ignoredGlobalProps = ['_g', 'sessionStorage', 'localStorage', 'clipboardData', 'frames', 'frameElement', 'external', 'mozAnimationStartTime', 'webkitStorageInfo', 'webkitIndexedDB', 'mozInnerScreenY', 'mozInnerScreenX'];
            var globalSnapshot;
            function forEachGlobal(callback) {
              if (Object.keys)
                Object.keys(__global).forEach(callback);
              else
                for (var g in __global) {
                  if (!hasOwnProperty.call(__global, g))
                    continue;
                  callback(g);
                }
            }
            function forEachGlobalValue(callback) {
              forEachGlobal(function(globalName) {
                if (indexOf.call(ignoredGlobalProps, globalName) != -1)
                  return;
                try {
                  var value = __global[globalName];
                } catch (e) {
                  ignoredGlobalProps.push(globalName);
                }
                callback(globalName, value);
              });
            }
            loader.set('@@global-helpers', loader.newModule({prepareGlobal: function(moduleName, exportName, globals) {
                var curDefine = __global.define;
                __global.define = undefined;
                __global.exports = undefined;
                if (__global.module && __global.module.exports)
                  __global.module = undefined;
                var oldGlobals;
                if (globals) {
                  oldGlobals = {};
                  for (var g in globals) {
                    oldGlobals[g] = __global[g];
                    __global[g] = globals[g];
                  }
                }
                if (!exportName) {
                  globalSnapshot = {};
                  forEachGlobalValue(function(name, value) {
                    globalSnapshot[name] = value;
                  });
                }
                return function() {
                  var globalValue;
                  if (exportName) {
                    globalValue = readMemberExpression(exportName, __global);
                  } else {
                    var singleGlobal;
                    var multipleExports;
                    var exports = {};
                    forEachGlobalValue(function(name, value) {
                      if (globalSnapshot[name] === value)
                        return;
                      if (typeof value == 'undefined')
                        return;
                      exports[name] = value;
                      if (typeof singleGlobal != 'undefined') {
                        if (!multipleExports && singleGlobal !== value)
                          multipleExports = true;
                      } else {
                        singleGlobal = value;
                      }
                    });
                    globalValue = multipleExports ? exports : singleGlobal;
                  }
                  if (oldGlobals) {
                    for (var g in oldGlobals)
                      __global[g] = oldGlobals[g];
                  }
                  __global.define = curDefine;
                  return globalValue;
                };
              }}));
          };
        });
        hookConstructor(function(constructor) {
          return function() {
            var loader = this;
            constructor.call(loader);
            if (typeof window != 'undefined' && typeof document != 'undefined' && window.location)
              var windowOrigin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
            loader.set('@@cjs-helpers', loader.newModule({getPathVars: function(moduleId) {
                var pluginIndex = moduleId.lastIndexOf('!');
                var filename;
                if (pluginIndex != -1)
                  filename = moduleId.substr(0, pluginIndex);
                else
                  filename = moduleId;
                var dirname = filename.split('/');
                dirname.pop();
                dirname = dirname.join('/');
                if (filename.substr(0, 8) == 'file:///') {
                  filename = filename.substr(7);
                  dirname = dirname.substr(7);
                  if (isWindows) {
                    filename = filename.substr(1);
                    dirname = dirname.substr(1);
                  }
                } else if (windowOrigin && filename.substr(0, windowOrigin.length) === windowOrigin) {
                  filename = filename.substr(windowOrigin.length);
                  dirname = dirname.substr(windowOrigin.length);
                }
                return {
                  filename: filename,
                  dirname: dirname
                };
              }}));
          };
        });
        hookConstructor(function(constructor) {
          return function() {
            var loader = this;
            constructor.call(this);
            var commentRegEx = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
            var cjsRequirePre = "(?:^|[^$_a-zA-Z\\xA0-\\uFFFF.])";
            var cjsRequirePost = "\\s*\\(\\s*(\"([^\"]+)\"|'([^']+)')\\s*\\)";
            var fnBracketRegEx = /\(([^\)]*)\)/;
            var wsRegEx = /^\s+|\s+$/g;
            var requireRegExs = {};
            function getCJSDeps(source, requireIndex) {
              source = source.replace(commentRegEx, '');
              var params = source.match(fnBracketRegEx);
              var requireAlias = (params[1].split(',')[requireIndex] || 'require').replace(wsRegEx, '');
              var requireRegEx = requireRegExs[requireAlias] || (requireRegExs[requireAlias] = new RegExp(cjsRequirePre + requireAlias + cjsRequirePost, 'g'));
              requireRegEx.lastIndex = 0;
              var deps = [];
              var match;
              while (match = requireRegEx.exec(source))
                deps.push(match[2] || match[3]);
              return deps;
            }
            function require(names, callback, errback, referer) {
              if (typeof names == 'object' && !(names instanceof Array))
                return require.apply(null, Array.prototype.splice.call(arguments, 1, arguments.length - 1));
              if (typeof names == 'string' && typeof callback == 'function')
                names = [names];
              if (names instanceof Array) {
                var dynamicRequires = [];
                for (var i = 0; i < names.length; i++)
                  dynamicRequires.push(loader['import'](names[i], referer));
                Promise.all(dynamicRequires).then(function(modules) {
                  if (callback)
                    callback.apply(null, modules);
                }, errback);
              } else if (typeof names == 'string') {
                var defaultJSExtension = loader.defaultJSExtensions && names.substr(names.length - 3, 3) != '.js';
                var normalized = loader.decanonicalize(names, referer);
                if (defaultJSExtension && normalized.substr(normalized.length - 3, 3) == '.js')
                  normalized = normalized.substr(0, normalized.length - 3);
                var module = loader.get(normalized);
                if (!module)
                  throw new Error('Module not already loaded loading "' + names + '" from "' + referer + '".');
                return module.__useDefault ? module['default'] : module;
              } else
                throw new TypeError('Invalid require');
            }
            function define(name, deps, factory) {
              if (typeof name != 'string') {
                factory = deps;
                deps = name;
                name = null;
              }
              if (!(deps instanceof Array)) {
                factory = deps;
                deps = ['require', 'exports', 'module'].splice(0, factory.length);
              }
              if (typeof factory != 'function')
                factory = (function(factory) {
                  return function() {
                    return factory;
                  };
                })(factory);
              if (deps[deps.length - 1] === undefined)
                deps.pop();
              var requireIndex,
                  exportsIndex,
                  moduleIndex;
              if ((requireIndex = indexOf.call(deps, 'require')) != -1) {
                deps.splice(requireIndex, 1);
                if (!name)
                  deps = deps.concat(getCJSDeps(factory.toString(), requireIndex));
              }
              if ((exportsIndex = indexOf.call(deps, 'exports')) != -1)
                deps.splice(exportsIndex, 1);
              if ((moduleIndex = indexOf.call(deps, 'module')) != -1)
                deps.splice(moduleIndex, 1);
              function execute(req, exports, module) {
                var depValues = [];
                for (var i = 0; i < deps.length; i++)
                  depValues.push(req(deps[i]));
                module.uri = module.id;
                module.config = function() {};
                if (moduleIndex != -1)
                  depValues.splice(moduleIndex, 0, module);
                if (exportsIndex != -1)
                  depValues.splice(exportsIndex, 0, exports);
                if (requireIndex != -1) {
                  function contextualRequire(names, callback, errback) {
                    if (typeof names == 'string' && typeof callback != 'function')
                      return req(names);
                    return require.call(loader, names, callback, errback, module.id);
                  }
                  contextualRequire.toUrl = function(name) {
                    var defaultJSExtension = loader.defaultJSExtensions && name.substr(name.length - 3, 3) != '.js';
                    var url = loader.decanonicalize(name, module.id);
                    if (defaultJSExtension && url.substr(url.length - 3, 3) == '.js')
                      url = url.substr(0, url.length - 3);
                    return url;
                  };
                  depValues.splice(requireIndex, 0, contextualRequire);
                }
                var curRequire = __global.require;
                __global.require = require;
                var output = factory.apply(exportsIndex == -1 ? __global : exports, depValues);
                __global.require = curRequire;
                if (typeof output == 'undefined' && module)
                  output = module.exports;
                if (typeof output != 'undefined')
                  return output;
              }
              var entry = createEntry();
              entry.name = name && (loader.decanonicalize || loader.normalize).call(loader, name);
              entry.deps = deps;
              entry.execute = execute;
              loader.pushRegister_({
                amd: true,
                entry: entry
              });
            }
            define.amd = {};
            hook('reduceRegister_', function(reduceRegister) {
              return function(load, register) {
                if (!register || !register.amd)
                  return reduceRegister.call(this, load, register);
                var curMeta = load && load.metadata;
                var entry = register.entry;
                if (curMeta)
                  curMeta.format = 'amd';
                if (!entry.name) {
                  if (!curMeta)
                    throw new TypeError('Unexpected anonymous AMD define.');
                  if (curMeta.entry)
                    throw new TypeError('Multiple defines for anonymous module ' + load.name);
                  curMeta.entry = entry;
                } else {
                  if (curMeta) {
                    if (!curMeta.entry && !curMeta.bundle)
                      curMeta.entry = entry;
                    else
                      curMeta.entry = undefined;
                    curMeta.bundle = true;
                  }
                  if (!(entry.name in this.defined))
                    this.defined[entry.name] = entry;
                }
              };
            });
            function createDefine() {
              var oldModule = __global.module;
              var oldExports = __global.exports;
              var oldDefine = __global.define;
              __global.module = undefined;
              __global.exports = undefined;
              __global.define = define;
              return function() {
                __global.define = oldDefine;
                __global.module = oldModule;
                __global.exports = oldExports;
              };
            }
            loader.set('@@amd-helpers', loader.newModule({
              createDefine: createDefine,
              require: require,
              define: define
            }));
            loader.amdDefine = define;
            loader.amdRequire = require;
          };
        });
        (function() {
          function getParentName(loader, parentName) {
            if (parentName) {
              var parentPluginIndex;
              if (loader.pluginFirst) {
                if ((parentPluginIndex = parentName.lastIndexOf('!')) != -1)
                  return parentName.substr(parentPluginIndex + 1);
              } else {
                if ((parentPluginIndex = parentName.indexOf('!')) != -1)
                  return parentName.substr(0, parentPluginIndex);
              }
              return parentName;
            }
          }
          function parsePlugin(loader, name) {
            var argumentName;
            var pluginName;
            var pluginIndex = name.lastIndexOf('!');
            if (pluginIndex == -1)
              return;
            if (loader.pluginFirst) {
              argumentName = name.substr(pluginIndex + 1);
              pluginName = name.substr(0, pluginIndex);
            } else {
              argumentName = name.substr(0, pluginIndex);
              pluginName = name.substr(pluginIndex + 1) || argumentName.substr(argumentName.lastIndexOf('.') + 1);
            }
            return {
              argument: argumentName,
              plugin: pluginName
            };
          }
          function combinePluginParts(loader, argumentName, pluginName, defaultExtension) {
            if (defaultExtension && argumentName.substr(argumentName.length - 3, 3) == '.js')
              argumentName = argumentName.substr(0, argumentName.length - 3);
            if (loader.pluginFirst) {
              return pluginName + '!' + argumentName;
            } else {
              return argumentName + '!' + pluginName;
            }
          }
          function checkDefaultExtension(loader, arg) {
            return loader.defaultJSExtensions && arg.substr(arg.length - 3, 3) != '.js';
          }
          function createNormalizeSync(normalizeSync) {
            return function(name, parentName, isPlugin) {
              var loader = this;
              parentName = getParentName(this, parentName);
              var parsed = parsePlugin(loader, name);
              if (!parsed)
                return normalizeSync.call(this, name, parentName, isPlugin);
              var argumentName = loader.normalizeSync(parsed.argument, parentName, true);
              var pluginName = loader.normalizeSync(parsed.plugin, parentName, true);
              return combinePluginParts(loader, argumentName, pluginName, checkDefaultExtension(loader, parsed.argument));
            };
          }
          hook('decanonicalize', createNormalizeSync);
          hook('normalizeSync', createNormalizeSync);
          hook('normalize', function(normalize) {
            return function(name, parentName, isPlugin) {
              var loader = this;
              parentName = getParentName(this, parentName);
              var parsed = parsePlugin(loader, name);
              if (!parsed)
                return normalize.call(loader, name, parentName, isPlugin);
              return Promise.all([loader.normalize(parsed.argument, parentName, true), loader.normalize(parsed.plugin, parentName)]).then(function(normalized) {
                return combinePluginParts(loader, normalized[0], normalized[1], checkDefaultExtension(loader, parsed.argument));
              });
            };
          });
          hook('locate', function(locate) {
            return function(load) {
              var loader = this;
              var name = load.name;
              var pluginSyntaxIndex;
              if (loader.pluginFirst) {
                if ((pluginSyntaxIndex = name.indexOf('!')) != -1) {
                  load.metadata.loader = name.substr(0, pluginSyntaxIndex);
                  load.name = name.substr(pluginSyntaxIndex + 1);
                }
              } else {
                if ((pluginSyntaxIndex = name.lastIndexOf('!')) != -1) {
                  load.metadata.loader = name.substr(pluginSyntaxIndex + 1);
                  load.name = name.substr(0, pluginSyntaxIndex);
                }
              }
              return locate.call(loader, load).then(function(address) {
                var plugin = load.metadata.loader;
                if (!plugin)
                  return address;
                if (loader.defined && loader.defined[name])
                  return address;
                var pluginLoader = loader.pluginLoader || loader;
                return pluginLoader['import'](plugin).then(function(loaderModule) {
                  load.metadata.loaderModule = loaderModule;
                  load.address = address;
                  if (loaderModule.locate)
                    return loaderModule.locate.call(loader, load);
                  return address;
                });
              });
            };
          });
          hook('fetch', function(fetch) {
            return function(load) {
              var loader = this;
              if (load.metadata.loaderModule && load.metadata.loaderModule.fetch && load.metadata.format != 'defined') {
                load.metadata.scriptLoad = false;
                return load.metadata.loaderModule.fetch.call(loader, load, function(load) {
                  return fetch.call(loader, load);
                });
              } else {
                return fetch.call(loader, load);
              }
            };
          });
          hook('translate', function(translate) {
            return function(load) {
              var loader = this;
              if (load.metadata.loaderModule && load.metadata.loaderModule.translate && load.metadata.format != 'defined') {
                return Promise.resolve(load.metadata.loaderModule.translate.call(loader, load)).then(function(result) {
                  var sourceMap = load.metadata.sourceMap;
                  if (sourceMap) {
                    if (typeof sourceMap != 'object')
                      throw new Error('load.metadata.sourceMap must be set to an object.');
                    var originalName = load.name.split('!')[0];
                    sourceMap.file = originalName + '!transpiled';
                    if (!sourceMap.sources || sourceMap.sources.length <= 1)
                      sourceMap.sources = [originalName];
                  }
                  if (typeof result == 'string')
                    load.source = result;
                  else
                    warn.call(this, 'Plugin ' + load.metadata.loader + ' should return the source in translate, instead of setting load.source directly. This support will be deprecated.');
                  return translate.call(loader, load);
                });
              } else {
                return translate.call(loader, load);
              }
            };
          });
          hook('instantiate', function(instantiate) {
            return function(load) {
              var loader = this;
              if (load.metadata.loaderModule && load.metadata.loaderModule.instantiate && !loader.builder && load.metadata.format != 'defined')
                return Promise.resolve(load.metadata.loaderModule.instantiate.call(loader, load)).then(function(result) {
                  load.metadata.entry = createEntry();
                  load.metadata.entry.execute = function() {
                    return result;
                  };
                  load.metadata.entry.deps = load.metadata.deps;
                  load.metadata.format = 'defined';
                  return instantiate.call(loader, load);
                });
              else
                return instantiate.call(loader, load);
            };
          });
        })();
        function parseCondition(condition) {
          var conditionExport,
              conditionModule,
              negation;
          var negation = condition[0] == '~';
          var conditionExportIndex = condition.lastIndexOf('|');
          if (conditionExportIndex != -1) {
            conditionExport = condition.substr(conditionExportIndex + 1);
            conditionModule = condition.substr(negation, conditionExportIndex - negation) || '@system-env';
          } else {
            conditionExport = null;
            conditionModule = condition.substr(negation);
          }
          return {
            module: conditionModule,
            prop: conditionExport,
            negate: negation
          };
        }
        function serializeCondition(conditionObj) {
          return (conditionObj.negate ? '~' : '') + conditionObj.module + (conditionObj.prop ? '|' + conditionObj.prop : '');
        }
        function resolveCondition(conditionObj, parentName, bool) {
          return this['import'](conditionObj.module, parentName).then(function(m) {
            if (conditionObj.prop)
              m = readMemberExpression(conditionObj.prop, m);
            else if (typeof m == 'object' && m + '' == 'Module')
              m = m['default'];
            if (bool && typeof m != 'boolean')
              throw new TypeError('Condition ' + serializeCondition(conditionObj) + ' did not resolve to a boolean.');
            return conditionObj.negate ? !m : m;
          });
        }
        var interpolationRegEx = /#\{[^\}]+\}/;
        function interpolateConditional(name, parentName) {
          var conditionalMatch = name.match(interpolationRegEx);
          if (!conditionalMatch)
            return Promise.resolve(name);
          var conditionObj = parseCondition(conditionalMatch[0].substr(2, conditionalMatch[0].length - 3));
          if (this.builder)
            return this['normalize'](conditionObj.module, parentName).then(function(conditionModule) {
              conditionObj.module = conditionModule;
              return name.replace(interpolationRegEx, '#{' + serializeCondition(conditionObj) + '}');
            });
          return resolveCondition.call(this, conditionObj, parentName, false).then(function(conditionValue) {
            if (typeof conditionValue !== 'string')
              throw new TypeError('The condition value for ' + name + ' doesn\'t resolve to a string.');
            if (conditionValue.indexOf('/') != -1)
              throw new TypeError('Unabled to interpolate conditional ' + name + (parentName ? ' in ' + parentName : '') + '\n\tThe condition value ' + conditionValue + ' cannot contain a "/" separator.');
            return name.replace(interpolationRegEx, conditionValue);
          });
        }
        function booleanConditional(name, parentName) {
          var booleanIndex = name.lastIndexOf('#?');
          if (booleanIndex == -1)
            return Promise.resolve(name);
          var conditionObj = parseCondition(name.substr(booleanIndex + 2));
          if (this.builder)
            return this['normalize'](conditionObj.module, parentName).then(function(conditionModule) {
              conditionObj.module = conditionModule;
              return name.substr(0, booleanIndex) + '#?' + serializeCondition(conditionObj);
            });
          return resolveCondition.call(this, conditionObj, parentName, true).then(function(conditionValue) {
            return conditionValue ? name.substr(0, booleanIndex) : '@empty';
          });
        }
        hook('normalize', function(normalize) {
          return function(name, parentName, parentAddress) {
            var loader = this;
            return booleanConditional.call(loader, name, parentName).then(function(name) {
              return normalize.call(loader, name, parentName, parentAddress);
            }).then(function(normalized) {
              return interpolateConditional.call(loader, normalized, parentName);
            });
          };
        });
        (function() {
          hook('fetch', function(fetch) {
            return function(load) {
              var alias = load.metadata.alias;
              var aliasDeps = load.metadata.deps || [];
              if (alias) {
                load.metadata.format = 'defined';
                var entry = createEntry();
                this.defined[load.name] = entry;
                entry.declarative = true;
                entry.deps = aliasDeps.concat([alias]);
                entry.declare = function(_export) {
                  return {
                    setters: [function(module) {
                      for (var p in module)
                        _export(p, module[p]);
                      if (module.__useDefault)
                        entry.module.exports.__useDefault = true;
                    }],
                    execute: function() {}
                  };
                };
                return '';
              }
              return fetch.call(this, load);
            };
          });
        })();
        (function() {
          hookConstructor(function(constructor) {
            return function() {
              this.meta = {};
              constructor.call(this);
            };
          });
          hook('locate', function(locate) {
            return function(load) {
              var meta = this.meta;
              var name = load.name;
              var bestDepth = 0;
              var wildcardIndex;
              for (var module in meta) {
                wildcardIndex = module.indexOf('*');
                if (wildcardIndex === -1)
                  continue;
                if (module.substr(0, wildcardIndex) === name.substr(0, wildcardIndex) && module.substr(wildcardIndex + 1) === name.substr(name.length - module.length + wildcardIndex + 1)) {
                  var depth = module.split('/').length;
                  if (depth > bestDepth)
                    bestDepth = depth;
                  extendMeta(load.metadata, meta[module], bestDepth != depth);
                }
              }
              if (meta[name])
                extendMeta(load.metadata, meta[name]);
              return locate.call(this, load);
            };
          });
          var metaRegEx = /^(\s*\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\s*\/\/[^\n]*|\s*"[^"]+"\s*;?|\s*'[^']+'\s*;?)+/;
          var metaPartRegEx = /\/\*[^\*]*(\*(?!\/)[^\*]*)*\*\/|\/\/[^\n]*|"[^"]+"\s*;?|'[^']+'\s*;?/g;
          function setMetaProperty(target, p, value) {
            var pParts = p.split('.');
            var curPart;
            while (pParts.length > 1) {
              curPart = pParts.shift();
              target = target[curPart] = target[curPart] || {};
            }
            curPart = pParts.shift();
            if (!(curPart in target))
              target[curPart] = value;
          }
          hook('translate', function(translate) {
            return function(load) {
              var meta = load.source.match(metaRegEx);
              if (meta) {
                var metaParts = meta[0].match(metaPartRegEx);
                for (var i = 0; i < metaParts.length; i++) {
                  var curPart = metaParts[i];
                  var len = curPart.length;
                  var firstChar = curPart.substr(0, 1);
                  if (curPart.substr(len - 1, 1) == ';')
                    len--;
                  if (firstChar != '"' && firstChar != "'")
                    continue;
                  var metaString = curPart.substr(1, curPart.length - 3);
                  var metaName = metaString.substr(0, metaString.indexOf(' '));
                  if (metaName) {
                    var metaValue = metaString.substr(metaName.length + 1, metaString.length - metaName.length - 1);
                    if (metaName.substr(metaName.length - 2, 2) == '[]') {
                      metaName = metaName.substr(0, metaName.length - 2);
                      load.metadata[metaName] = load.metadata[metaName] || [];
                      load.metadata[metaName].push(metaValue);
                    } else if (load.metadata[metaName] instanceof Array) {
                      warn.call(this, 'Module ' + load.name + ' contains deprecated "deps ' + metaValue + '" meta syntax.\nThis should be updated to "deps[] ' + metaValue + '" for pushing to array meta.');
                      load.metadata[metaName].push(metaValue);
                    } else {
                      setMetaProperty(load.metadata, metaName, metaValue);
                    }
                  } else {
                    load.metadata[metaString] = true;
                  }
                }
              }
              return translate.call(this, load);
            };
          });
        })();
        (function() {
          hookConstructor(function(constructor) {
            return function() {
              constructor.call(this);
              this.bundles = {};
              this._loader.loadedBundles = {};
            };
          });
          hook('locate', function(locate) {
            return function(load) {
              var loader = this;
              var matched = false;
              if (!(load.name in loader.defined))
                for (var b in loader.bundles) {
                  for (var i = 0; i < loader.bundles[b].length; i++) {
                    var curModule = loader.bundles[b][i];
                    if (curModule == load.name) {
                      matched = true;
                      break;
                    }
                    if (curModule.indexOf('*') != -1) {
                      var parts = curModule.split('*');
                      if (parts.length != 2) {
                        loader.bundles[b].splice(i--, 1);
                        continue;
                      }
                      if (load.name.substring(0, parts[0].length) == parts[0] && load.name.substr(load.name.length - parts[1].length, parts[1].length) == parts[1] && load.name.substr(parts[0].length, load.name.length - parts[1].length - parts[0].length).indexOf('/') == -1) {
                        matched = true;
                        break;
                      }
                    }
                  }
                  if (matched)
                    return loader['import'](b).then(function() {
                      return locate.call(loader, load);
                    });
                }
              return locate.call(loader, load);
            };
          });
        })();
        (function() {
          hookConstructor(function(constructor) {
            return function() {
              constructor.call(this);
              this.depCache = {};
            };
          });
          hook('locate', function(locate) {
            return function(load) {
              var loader = this;
              var deps = loader.depCache[load.name];
              if (deps)
                for (var i = 0; i < deps.length; i++)
                  loader['import'](deps[i], load.name);
              return locate.call(loader, load);
            };
          });
        })();
        hookConstructor(function(constructor) {
          return function() {
            constructor.apply(this, arguments);
            if (this.has('@@amd-helpers'))
              this.get('@@amd-helpers').createDefine();
          };
        });
        hook('fetch', function(fetch) {
          return function(load) {
            load.metadata.scriptLoad = true;
            return fetch.call(this, load);
          };
        });
        System = new SystemJSLoader();
        __global.SystemJS = System;
        System.version = '0.19.22 CSP';
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
    }
    try {
      var hasURL = typeof URLPolyfill != 'undefined' || new URL('test:///').protocol == 'test:';
    } catch (e) {}
    if (typeof Promise === 'undefined' || !hasURL) {
      if (typeof document !== 'undefined') {
        var scripts = document.getElementsByTagName('script');
        $__curScript = scripts[scripts.length - 1];
        var curPath = $__curScript.src;
        var basePath = curPath.substr(0, curPath.lastIndexOf('/') + 1);
        window.systemJSBootstrap = bootstrap;
        document.write('<' + 'script type="text/javascript" src="' + basePath + 'system-polyfills.js">' + '<' + '/script>');
      } else if (typeof importScripts !== 'undefined') {
        var basePath = '';
        try {
          throw new Error('_');
        } catch (e) {
          e.stack.replace(/(?:at|@).*(http.+):[\d]+:[\d]+/, function(m, url) {
            basePath = url.replace(/\/[^\/]*$/, '/');
          });
        }
        importScripts(basePath + 'system-polyfills.js');
        bootstrap();
      } else {
        bootstrap();
      }
    } else {
      bootstrap();
    }
  })();
})(require('process'));
