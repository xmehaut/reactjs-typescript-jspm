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
  var baseURIObj = new URL(baseURI);
  hookConstructor(function(constructor) {
    return function() {
      constructor.call(this);
      this.baseURL = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
      this.warnings = false;
      this.defaultJSExtensions = false;
      this.globalEvaluationScope = true;
      this.pluginFirst = false;
      if (isWorker || isBrowser && window.chrome && window.chrome.extension || isBrowser && navigator.userAgent.match(/^Node\.js/))
        this.globalEvaluationScope = false;
      this.set('@empty', this.newModule({}));
      if (typeof require != 'undefined' && require.resolve && typeof process != 'undefined')
        this._nodeRequire = require;
    };
  });
  hook('normalize', function(normalize) {
    return function(name, parentName) {
      if (name.substr(0, 6) == '@node/') {
        if (!this._nodeRequire)
          throw new TypeError('Can only load node core modules in Node.');
        this.set(name, this.newModule(getESModule(this._nodeRequire(name.substr(6)))));
      }
      name = normalize.apply(this, arguments);
      if (name[0] == '.' || name[0] == '/') {
        if (parentName)
          return new URL(name, parentName.replace(/#/g, '%05')).href.replace(/%05/g, '#');
        else
          return new URL(name, baseURIObj).href;
      }
      return name;
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
        warn.call(this, 'System.import(name, { name: parentName }) is deprecated for System.import(name, parentName), while importing ' + name + ' from ' + parentName.name);
      return systemImport.call(this, name, parentName, parentAddress).then(function(module) {
        return module.__useDefault ? module['default'] : module;
      });
    };
  });
  SystemJSLoader.prototype.config = function(cfg) {
    if ('warnings' in cfg)
      this.warnings = cfg.warnings;
    if (cfg.baseURL) {
      var hasConfig = false;
      function checkHasConfig(obj) {
        for (var p in obj)
          return true;
      }
      if (checkHasConfig(this.packages) || checkHasConfig(this.meta) || checkHasConfig(this.depCache) || checkHasConfig(this.bundles) || checkHasConfig(this.packageConfigPaths))
        throw new TypeError('baseURL should only be configured once and must be configured first.');
      this.baseURL = cfg.baseURL;
      getBaseURLObj.call(this);
    }
    if (cfg.defaultJSExtensions) {
      this.defaultJSExtensions = cfg.defaultJSExtensions;
      warn.call(this, 'The defaultJSExtensions configuration option is deprecated, use packages configuration instead.');
    }
    if (cfg.pluginFirst)
      this.pluginFirst = cfg.pluginFirst;
    if (cfg.paths) {
      for (var p in cfg.paths)
        this.paths[p] = cfg.paths[p];
    }
    if (cfg.map) {
      var objMaps = '';
      for (var p in cfg.map) {
        var v = cfg.map[p];
        if (typeof v !== 'string') {
          objMaps += (objMaps.length ? ', ' : '') + '"' + p + '"';
          var normalized = this.normalizeSync(p);
          if (this.defaultJSExtensions && p.substr(p.length - 3, 3) != '.js')
            normalized = normalized.substr(0, normalized.length - 3);
          var pkgMatch = '';
          for (var pkg in this.packages) {
            if (normalized.substr(0, pkg.length) == pkg && (!normalized[pkg.length] || normalized[pkg.length] == '/') && pkgMatch.split('/').length < pkg.split('/').length)
              pkgMatch = pkg;
          }
          if (pkgMatch && this.packages[pkgMatch].main)
            normalized = normalized.substr(0, normalized.length - this.packages[pkgMatch].main.length - 1);
          var pkg = this.packages[normalized] = this.packages[normalized] || {};
          pkg.map = v;
        } else {
          this.map[p] = v;
        }
      }
      if (objMaps)
        warn.call(this, 'The map configuration for ' + objMaps + ' uses object submaps, which is deprecated in global map.\nUpdate this to use package contextual map with configs like System.config({ packages: { "' + p + '": { map: {...} } } }).');
    }
    if (cfg.packageConfigPaths) {
      var packageConfigPaths = [];
      for (var i = 0; i < cfg.packageConfigPaths.length; i++) {
        var path = cfg.packageConfigPaths[i];
        var packageLength = Math.max(path.lastIndexOf('*') + 1, path.lastIndexOf('/'));
        var normalized = this.normalizeSync(path.substr(0, packageLength) + '/');
        if (this.defaultJSExtensions && path.substr(path.length - 3, 3) != '.js')
          normalized = normalized.substr(0, normalized.length - 3);
        packageConfigPaths[i] = normalized.substr(0, normalized.length - 1) + path.substr(packageLength);
      }
      this.packageConfigPaths = packageConfigPaths;
    }
    if (cfg.packages) {
      for (var p in cfg.packages) {
        if (p.match(/^([^\/]+:)?\/\/$/))
          throw new TypeError('"' + p + '" is not a valid package name.');
        var prop = this.normalizeSync(p + (p[p.length - 1] != '/' ? '/' : ''));
        prop = prop.substr(0, prop.length - 1);
        if (!this.packages[prop] && this.defaultJSExtensions && p.substr(p.length - 3, 3) != '.js')
          prop = prop.substr(0, prop.length - 3);
        this.packages[prop] = this.packages[prop] || {};
        if (cfg.packages[p].meta) {
          warn.call(this, 'Package ' + p + ' is configured with meta, which is deprecated as it has been renamed to modules.');
          cfg.packages[p].modules = cfg.packages[p].meta;
          delete cfg.packages[p].meta;
        }
        for (var q in cfg.packages[p])
          if (indexOf.call(packageProperties, q) == -1)
            warn.call(this, '"' + q + '" is not a valid package configuration option in package ' + p);
        extendMeta(this.packages[prop], cfg.packages[p]);
      }
    }
    if (cfg.bundles) {
      for (var p in cfg.bundles) {
        var bundle = [];
        for (var i = 0; i < cfg.bundles[p].length; i++)
          bundle.push(this.normalizeSync(cfg.bundles[p][i]));
        this.bundles[p] = bundle;
      }
    }
    for (var c in cfg) {
      var v = cfg[c];
      var normalizeProp = false,
          normalizeValArray = false;
      if (c == 'baseURL' || c == 'map' || c == 'packages' || c == 'bundles' || c == 'paths' || c == 'warnings' || c == 'packageConfigPaths')
        continue;
      if (typeof v != 'object' || v instanceof Array) {
        this[c] = v;
      } else {
        this[c] = this[c] || {};
        if (c == 'meta' || c == 'depCache')
          normalizeProp = true;
        for (var p in v) {
          if (c == 'meta' && p[0] == '*')
            this[c][p] = v[p];
          else if (normalizeProp)
            this[c][this.normalizeSync(p)] = v[p];
          else
            this[c][p] = v[p];
        }
      }
    }
  };
})(require('process'));
