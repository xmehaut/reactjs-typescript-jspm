/* */ 
var gulp = require('gulp');
var config = require('../config');
gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch(config.markup.src, ['markup']);
});
