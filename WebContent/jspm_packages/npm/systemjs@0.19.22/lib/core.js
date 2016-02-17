/* */ 
(function(process) {
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
})(require('process'));
