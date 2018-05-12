/* eslint-env node */
/* eslint-disable camelcase, operator-linebreak */

// -----------------------------------------------------------------------------
//   Javascript Bundling / Transpiling
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').get('Local Server');

import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import envify from 'envify';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import merge from 'utils-merge';

import cond from 'gulp-cond';
import log from 'fancy-log';
import colors from 'ansi-colors';

gulp.task('js-lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
  ;
});

gulp.task('watchify', (done) => {
  const args = merge(watchify.args, { debug: true }),
        bundler = watchify(browserify('src/main.js', args))
          .transform(babelify, {
            presets: ['env'],
            extensions: ['.js']
          })
          .transform(envify)
          .transform('browserify-shim', {
            global: true}
          );

  bundle_js(bundler);

  bundler.on('update', () => {
    bundle_js(bundler);
    log('[' + colors.blue('browserify') + '] ' + colors.green('Rebundling JS...'));
  });
  done();
});

// Bundle without watchify
gulp.task('bundle', () => {
  return bundle_js(
    browserify('src/main.js', { debug: true })
      .transform(babelify, {
        presets: ['env'],
        extensions: ['.js']
      })
      .transform(envify)
      .transform('browserify-shim', { global: true })
  );
});

if (config.isDev) {
  gulp.task('js', gulp.series('js-lint', 'watchify'));
} else {
  gulp.task('js', gulp.series('bundle'));
}

function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', mapError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe($.rename('bundle.js'))
    .pipe(cond(!config.isProd, $.sourcemaps.init({ loadMaps: true })))
    .pipe(cond(!config.isProd,
      $.jsbeautifier({
        indent_size: 2,
        end_with_newline: true,
        preserve_newlines: true,
        max_preserve_newlines: 3
      }),
      $.uglify()
    ))
    .pipe(cond(!config.isProd, $.sourcemaps.write('/sourcemaps')))
    .pipe(gulp.dest('dist/js'))
    .on('end', browserSync.reload)
  ;
}

function mapError(err) {
  if (err.fileName) {
    // regular error
    log(colors.red(err.name)
      + ': '
      + colors.yellow(err.fileName.replace(__dirname, ''))
      + ': '
      + 'Line '
      + colors.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + colors.magenta(err.columnNumber || err.column)
      + ': '
      + colors.blue(err.description));
  } else {
    // browserify error..
    log(colors.red(err.name)
      + ': '
      + colors.yellow(err.message));
  }

  this.emit('end');
}
