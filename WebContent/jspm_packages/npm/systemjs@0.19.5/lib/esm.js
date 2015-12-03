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
          if (load.metadata.format == 'esm' || load.metadata.format == 'es6' || !load.metadata.format && source.match(esmRegEx)) {
            if (load.metadata.format == 'es6')
              warn.call(loader, 'Module ' + load.name + ' has metadata setting its format to "es6", which is deprecated.\nThis should be updated to "esm".');
            load.metadata.format = 'esm';
            if (loader.transpiler === false)
              throw new TypeError('Unable to dynamically transpile ES module as System.transpiler set to false.');
            loader.loadedTranspiler_ = loader.loadedTranspiler_ || false;
            if (loader.pluginLoader)
              loader.pluginLoader.loadedTranspiler_ = loader.loadedTranspiler_ || false;
            if (loader.builder)
              load.metadata.originalSource = load.source;
            return transpile.call(loader, load).then(function(source) {
              load.metadata.sourceMap = undefined;
              return source;
            });
          }
          if (loader.loadedTranspiler_ === false && load.name == loader.normalizeSync(loader.transpiler)) {
            if (source.length > 100) {
              load.metadata.format = load.metadata.format || 'global';
              if (loader.transpiler === 'traceur')
                load.metadata.exports = 'traceur';
              if (loader.transpiler === 'typescript')
                load.metadata.exports = 'ts';
            }
            loader.loadedTranspiler_ = true;
          }
          if (loader.loadedTranspilerRuntime_ === false) {
            if (load.name == loader.normalizeSync('traceur-runtime') || load.name == loader.normalizeSync('babel/external-helpers*')) {
              if (source.length > 100)
                load.metadata.format = load.metadata.format || 'global';
              loader.loadedTranspilerRuntime_ = true;
            }
          }
          if ((load.metadata.format == 'register' || load.metadata.bundle) && loader.loadedTranspilerRuntime_ !== true) {
            if (!__global.$traceurRuntime && load.source.match(traceurRuntimeRegEx)) {
              loader.loadedTranspilerRuntime_ = loader.loadedTranspilerRuntime_ || false;
              return loader['import']('traceur-runtime').then(function() {
                return source;
              });
            }
            if (!__global.babelHelpers && load.source.match(babelHelpersRegEx)) {
              loader.loadedTranspilerRuntime_ = loader.loadedTranspilerRuntime_ || false;
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
