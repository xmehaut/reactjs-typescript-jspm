/* */ 
(function(process) {
  var gulp = require('gulp');
  var eslint = require('gulp-eslint');
  gulp.task('eslint', function() {
    return gulp.src(['src/**', 'docs/src/**/*.{js,jsx}']).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failOnError());
  });
})(require('process'));
