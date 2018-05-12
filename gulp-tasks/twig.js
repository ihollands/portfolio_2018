/* eslint-env node */
/* eslint-disable camelcase, global-require */

// -----------------------------------------------------------------------------
//   Compile Twig templates with data
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').get('Local Server');

gulp.task('twig-data', () => {
  return gulp.src('src/components/**/*.json')
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.mergeJson({
      fileName: 'compiled-data.json',
      jsonSpace: '  '
    }))
    .pipe(gulp.dest('src'))
  ;
});

// De-caching for Data files
function requireUncached($module) {
  delete require.cache[require.resolve($module)];
  return require($module);
}

gulp.task('twig-compile', () => {
  return gulp.src('src/pages/**/*.twig')
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.data(() => {
      return requireUncached('../src/compiled-data.json');
    }))
    .pipe($.twig({
      base: 'src',
      errorLogToConsole: true,
      filters: [{
        name: 'dasherize',
        func(str) {
          return str.trim()
            .replace(/[-_\s]+/g, '-')
            .toLowerCase()
          ;
        }
      }]
    }))
    .pipe($.jsbeautifier({
      preserve_newlines: true,
      indent_size: 2,
      unformatted: ['pre', 'code', 'p']
    }))
    .pipe(gulp.dest('dist'))
    .on('end', browserSync.reload)
  ;
});

gulp.task('twig', gulp.series('twig-data', 'twig-compile'));
