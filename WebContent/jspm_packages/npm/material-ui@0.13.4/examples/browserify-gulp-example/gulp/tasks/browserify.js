/* */ 
var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;
var babelify = require('babelify');
gulp.task('browserify', function(callback) {
  var bundleQueue = config.bundleConfigs.length;
  var browserifyThis = function(bundleConfig) {
    var bundler = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: bundleConfig.entries,
      extensions: config.extensions,
      debug: config.debug
    });
    var bundle = function() {
      bundleLogger.start(bundleConfig.outputName);
      return bundler.bundle().on('error', handleErrors).pipe(source(bundleConfig.outputName)).pipe(gulp.dest(bundleConfig.dest)).on('end', reportFinished);
    };
    bundler.transform(babelify.configure({stage: 1}));
    if (global.isWatching) {
      bundler = watchify(bundler);
      bundler.on('update', bundle);
    }
    var reportFinished = function() {
      bundleLogger.end(bundleConfig.outputName);
      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          callback();
        }
      }
    };
    return bundle();
  };
  config.bundleConfigs.forEach(browserifyThis);
});
