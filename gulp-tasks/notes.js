/* eslint-env node */
/* eslint-disable camelcase */

// -----------------------------------------------------------------------------
//   Log note comments to console
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import fixme from 'fixme';

gulp.task('notes', (done) => {

  fixme({
    path: 'src',
    file_patterns: ['**/*.js', '**/*.twig', '**/*.scss'],
    file_encoding: 'utf8',
    line_length_limit: 1000,
    skip: ['note']
  });

  done();

});
