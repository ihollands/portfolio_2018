/* eslint-env node */

// -----------------------------------------------------------------------------
//   Watch files for changes, execute tasks on change and stream into browser
// -----------------------------------------------------------------------------
//
//   NOTE:
//
//   The server option inside of browserSync is to use the built-in static
//   server. This is only useful for static HTML websites run locally on the
//   host machine. If you're using a VM (Docker, MAMP, Vagrant, etc.) or running
//   your own local server, comment out the 'server' option, and uncomment the proxy
//   option to wrap your vhost with a proxy URL to view your site.
//
//   For more information, consult the Browsersync docs.
//   https://www.browsersync.io/docs/options/
//
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';

import log from 'fancy-log';
import colors from 'ansi-colors';

const browserSync = require('browser-sync').get('Local Server');

const watchPreTasks = ['styleguide', 'js', 'sass', 'twig', 'assets', 'a11y'];

let browserSyncOptions;

if (config.useMockData) {
  watchPreTasks.push('mock-data');

  browserSyncOptions = {
    open: false,
    logPrefix: 'BrowserSync',
    proxy: {
      // port that json-server is using
      target: 'localhost:3001',
      // enables websockets
      ws: true
    }
  };
} else {
  browserSyncOptions = {
    open: false,
    logPrefix: 'BrowserSync',
    server: {
      baseDir: 'dist/'
    }
    // proxy: {
    //   target: 'localhost:8080',
    //   // enables websockets
    //   ws: true
    // }
  };
}

gulp.task('serve', (done) => {
  browserSync.init(browserSyncOptions);

  gulp.watch('src/**/*.js', gulp.series('js-lint'));

  gulp.watch('src/**/*.scss', gulp.series('styleguide')).on('change', () => {
    log('[' + colors.blue('sass') + '] ' + colors.green('Compiling SCSS...'));
  });

  gulp.watch('src/assets/images/**/*', gulp.series('images'));
  gulp.watch('src/assets/fonts/**/*', gulp.series('fonts'));

  gulp.watch('src/**/*.twig', gulp.series('twig')).on('change', () => {
    log('[' + colors.blue('twig') + '] ' + colors.green('Compiling Twig...'));
    setTimeout(browserSync.reload, 500);
  });

  gulp.watch(['src/components/**/*.json'], gulp.parallel('twig', 'styleguide-generate'));

  gulp.watch('styleguide-builder/kss-assets/**/*.scss', gulp.series('styleguide-sass'));

  gulp.watch(['styleguide-builder/index.twig', 'README.md'], gulp.series('styleguide-generate')).on('change', () => {
    setTimeout(browserSync.reload, 500);
  });

  gulp.watch(['accessibility-builder/index.twig'], gulp.series('a11y-compile')).on('change', () => {
    setTimeout(browserSync.reload, 500);
  });

  gulp.watch('accessibility-builder/a11y.scss', gulp.series('a11y-sass'));

  done();
});

gulp.task('watch', gulp.series(watchPreTasks, 'serve'));
