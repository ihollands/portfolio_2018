/* eslint-env node */
/* eslint-disable camelcase, global-require */

// -----------------------------------------------------------------------------
//   Runs accessibility audit
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
const $ = require('gulp-load-plugins')();

import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
import autoprefixer from 'autoprefixer';
const browserSync = require('browser-sync').get('Local Server');

gulp.task('run-a11y-audit', () => {
  return gulp.src(['dist/*.html', '!dist/styleguide/*.html'])
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.accessibility({
      force: true,
      accessibilityLevel: 'WCAG2AAA',
      verbose: false
    }))
    .pipe($.accessibility.report({
      reportType: 'json'
    }))
    .pipe($.rename({
      extname: '.json'
    }))
    .pipe(gulp.dest('accessibility-builder/raw-reports/'))
  ;
});

gulp.task('build-a11y-report', () => {
  const reports = [];

  glob.sync('accessibility-builder/raw-reports/*.json').map((file) => {
    const fileObject = JSON.parse(fs.readFileSync(file, 'utf8'));
    const filename = Object.keys(fileObject)[0];
    const origReport = fileObject[filename];
    const report = {};
    report.filename = path.basename(filename);
    report.counters = origReport.counters;
    report.messageLog = origReport.messageLog;
    report.messageLog.map((message) => {
      message.link = 'http://squizlabs.github.io/HTML_CodeSniffer/Standards/WCAG2/' + message.issue.match(/.(\d+_\d+_\d+)/g)[0].substr(1);
    });

    const issuePriority = ['ERROR', 'WARNING', 'NOTICE'];
    report.messageLog.sort((a, b) => {
      return issuePriority.indexOf(a.heading) - issuePriority.indexOf(b.heading);
    });

    reports.push(report);
  });

  const finalReport = {
    reports
  };

  fs.outputFileSync('accessibility-builder/accessibility-report.json', JSON.stringify(finalReport));

  fs.copySync('accessibility-builder/is-logo.svg', 'dist/accessibility/is-logo.svg');

  return gulp.src('accessibility-builder/accessibility-report.json')
    .pipe($.jsbeautifier({
      'indent_size': 2
    }))
    .pipe(gulp.dest('accessibility-builder'))
  ;
});

// De-caching for Data files
function requireUncached($module) {
  delete require.cache[require.resolve($module)];
  return require($module);
}

gulp.task('a11y-compile', () => {
  return gulp.src('accessibility-builder/index.twig')
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.data(() => {
      return requireUncached('../accessibility-builder/accessibility-report.json');
    }))
    .pipe($.twig({
      base: 'accessibility-builder',
      errorLogToConsole: true
    }))
    .pipe($.jsbeautifier({
      indent_size: 2,
      preserve_newlines: true,
      unformatted: ['pre', 'code', 'p']
    }))
    .pipe(gulp.dest('dist/accessibility'))
  ;
});

gulp.task('a11y-sass', () => {
  return gulp.src('accessibility-builder/a11y.scss')
    .pipe($.sourcemaps.init({
      debug: true
    }))
    .pipe($.plumber({
      errorHandler: config.reportError
    }))
    .pipe($.sass({
      outputStyle: 'expanded',
      errLogToConsole: true,
      includePaths: ['node_modules/breakpoint-sass/stylesheets/']
    }))
    .on('error', config.reportError)
    .pipe($.postcss([
      autoprefixer({
        cascade: false
      })
    ]))
    .pipe($.sourcemaps.write('/sourcemaps'))
    .pipe(gulp.dest('dist/accessibility'))
    .pipe(browserSync.stream({match: '**/*.css'}))
  ;
});

gulp.task('a11y', gulp.series('run-a11y-audit', 'build-a11y-report', 'a11y-compile', 'a11y-sass'));
