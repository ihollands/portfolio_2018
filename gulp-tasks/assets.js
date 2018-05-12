/* eslint-env node */

// -----------------------------------------------------------------------------
//   Copies assets from /src to /dist
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
const $ = require('gulp-load-plugins')();

const browserSync = require('browser-sync').get('Local Server');

function copyAssets(type) {
  return gulp.src('src/assets/' + type + '/**/*')
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe(gulp.dest('dist/' + type + '/'))
    .on('end', browserSync.reload)
  ;
}

gulp.task('fonts', () => {
  return copyAssets('fonts');
});

gulp.task('images', () => {
  return copyAssets('images');
});

gulp.task('assets', gulp.parallel('fonts', 'images'));
