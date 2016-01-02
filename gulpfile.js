var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('reload', function() {
 return gulp.src('./client/**/*.js').pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./client/**/*.js', ['reload']);
});

gulp.task('default', ['watch'], function() {});