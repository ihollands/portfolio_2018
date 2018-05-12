/* eslint-env node */

// -----------------------------------------------------------------------------
//   Compile Sass
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
import cond from 'gulp-cond';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
const $ = require('gulp-load-plugins')();

const browserSync = require('browser-sync').get('Local Server');

const postcssPlugins = [
  autoprefixer({
    cascade: false
  })
];

if (config.isProd) {
  postcssPlugins.push(cssnano());
}

gulp.task('sass-lint', () => {
  return gulp.src('src/**/*.scss')
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
  ;
});

gulp.task('compile-sass', () => {
  return gulp.src('src/main.scss')
    .pipe(cond(!config.isProd,
      $.sourcemaps.init({
        debug: true
      })
    ))
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.sassGlob())
    .pipe($.sass({
      outputStyle: 'expanded',
      errLogToConsole: true,
      includePaths: ['node_modules/breakpoint-sass/stylesheets/']
    }))
    .on('error', config.reportError)
    .pipe($.postcss(postcssPlugins))
    .pipe(cond(config.isProd,
      $.combineMq({
        log: true,
        beautify: false
      })
    ))
    .pipe($.rename('style.css'))
    .pipe(cond(!config.isProd,
      $.sourcemaps.write('/sourcemaps')
    ))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream({match: '**/*.css'}))
  ;
});

gulp.task('sass', gulp.series('sass-lint', 'compile-sass'));
