const gulp = require('gulp');
const minify = require('gulp-minify');
 
gulp.task('compress', async function() {
  await gulp.src([
    './src/**/*.css',
    './src/**/*.js',
    './src/**/*.html'])
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});