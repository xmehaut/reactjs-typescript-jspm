/* */ 
"format cjs";
(function(process) {
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
})(require('process'));
