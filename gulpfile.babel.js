/* eslint-env node */
/* eslint-disable no-unused-vars */

// -----------------------------------------------------------------------------
//   Load Gulp
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import fs from 'fs';
const $ = require('gulp-load-plugins')();

// -----------------------------------------------------------------------------
//   Load Gulp Config File
// -----------------------------------------------------------------------------
import config from './gulp-config';


// -----------------------------------------------------------------------------
//   Create a BrowserSync Instance
// -----------------------------------------------------------------------------
const browserSync = require('browser-sync').create('Local Server');


// import HubRegistry from 'gulp-hub';
// const hub = new HubRegistry(['gulp-tasks/**/*']);
// gulp.registry(hub);
// -----------------------------------------------------------------------------
//   Gets all of our tasks
// -----------------------------------------------------------------------------
require('require-dir')('./gulp-tasks');

// -----------------------------------------------------------------------------
//   Task: Default
// -----------------------------------------------------------------------------
if (config.isProd || config.isStage) {
  gulp.task('default', gulp.series('clean', 'styleguide', 'js', 'sass', 'twig', 'assets', 'a11y'));
} else {
  gulp.task('default', gulp.series('clean', 'notes', 'watch'));
}
