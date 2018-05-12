/* eslint-env node */

// -----------------------------------------------------------------------------
//   Cleans /dist before building
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import del from 'del';
import log from 'fancy-log';
import colors from 'ansi-colors';

gulp.task('clean', () => {

  return del(['dist', 'src/compiled-data.json']).then(() => {
    log('[' + colors.blue('clean') + '] ' + colors.green('Compiled output cleaned...'));
  });

});
