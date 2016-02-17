/* */ 
(function(process) {
  (function() {
    var esmRegEx = /(^\s*|[}\);\n]\s*)(import\s+(['"]|(\*\s+as\s+)?[^"'\(\)\n;]+\s+from\s+['"]|\{)|export\s+\*\s+from\s+["']|export\s+(\{|default|function|class|var|const|let|async\s+function))/;
    var traceurRuntimeRegEx = /\$traceurRuntime\s*\./;
    var babelHelpersRegEx = /babelHelpers\s*\./;
    hook('translate', function(translate) {
      return function(load) {
        var loader = this;
        return translate.call(loader, load).then(function(source) {
          if (load.metadata.format == 'esm' || load.metadata.format == 'es6' || !load.metadata.format && loader.transpiler !== false && source.match(esmRegEx)) {
            if (load.metadata.format == 'es6')
              warn.call(loader, 'Module ' + load.name + ' has metadata setting its format to "es6", which is deprecated.\nThis should be updated to "esm".');
            load.metadata.format = 'esm';
            if (loader.transpiler === false) {
              if (loader.builder)
                return source;
              throw new TypeError('Unable to dynamically transpile ES module as SystemJS.transpiler set to false.');
            }
            loader._loader.loadedTranspiler = loader._loader.loadedTranspiler || false;
            if (loader.pluginLoader)
              loader.pluginLoader._loader.loadedTranspiler = loader._loader.loadedTranspiler || false;
            return (loader._loader.transpilerPromise || (loader._loader.transpilerPromise = Promise.resolve(__global[loader.transpiler == 'typescript' ? 'ts' : loader.transpiler] || (loader.pluginLoader || loader)['import'](loader.transpiler)))).then(function(transpiler) {
              loader._loader.loadedTranspilerRuntime = true;
              if (transpiler.translate) {
                if (transpiler == load.metadata.loaderModule)
                  return load.source;
                if (typeof load.metadata.sourceMap == 'string')
                  load.metadata.sourceMap = JSON.parse(load.metadata.sourceMap);
                return Promise.resolve(transpiler.translate.call(loader, load)).then(function(source) {
                  var sourceMap = load.metadata.sourceMap;
                  if (sourceMap && typeof sourceMap == 'object') {
                    var originalName = load.name.split('!')[0];
                    sourceMap.file = originalName + '!transpiled';
                    if (!sourceMap.sources || sourceMap.sources.length <= 1)
                      sourceMap.sources = [originalName];
                  }
                  if (load.metadata.format == 'esm' && !loader.builder && detectRegisterFormat(source))
                    load.metadata.format = 'register';
                  return source;
                });
              }
              if (loader.builder)
                load.metadata.originalSource = load.source;
              return transpile.call(loader, load).then(function(source) {
                load.metadata.sourceMap = undefined;
                return source;
              });
            });
          }
          if (loader.transpiler === false)
            return source;
          if (loader._loader.loadedTranspiler === false && (loader.transpiler == 'traceur' || loader.transpiler == 'typescript' || loader.transpiler == 'babel') && load.name == loader.normalizeSync(loader.transpiler)) {
            if (source.length > 100 && !load.metadata.format) {
              load.metadata.format = 'global';
              if (loader.transpiler === 'traceur')
                load.metadata.exports = 'traceur';
              if (loader.transpiler === 'typescript')
                load.metadata.exports = 'ts';
            }
            loader._loader.loadedTranspiler = true;
          }
          if (loader._loader.loadedTranspilerRuntime === false) {
            if (load.name == loader.normalizeSync('traceur-runtime') || load.name == loader.normalizeSync('babel/external-helpers*')) {
              if (source.length > 100)
                load.metadata.format = load.metadata.format || 'global';
              loader._loader.loadedTranspilerRuntime = true;
            }
          }
          if ((load.metadata.format == 'register' || load.metadata.bundle) && loader._loader.loadedTranspilerRuntime !== true) {
            if (!__global.$traceurRuntime && load.source.match(traceurRuntimeRegEx)) {
              loader._loader.loadedTranspilerRuntime = loader._loader.loadedTranspilerRuntime || false;
              return loader['import']('traceur-runtime').then(function() {
                return source;
              });
            }
            if (!__global.babelHelpers && load.source.match(babelHelpersRegEx)) {
              loader._loader.loadedTranspilerRuntime = loader._loader.loadedTranspilerRuntime || false;
              return loader['import']('babel/external-helpers').then(function() {
                return source;
              });
            }
          }
          return source;
        });
      };
    });
  })();
})(require('process'));
