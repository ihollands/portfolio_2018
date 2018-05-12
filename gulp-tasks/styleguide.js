/* eslint-env node */

// -----------------------------------------------------------------------------
//   Create Living Styleguide
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import config from './../gulp-config';
import kss from 'kss';
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

gulp.task('styleguide-sass', () => {
  return gulp.src('styleguide-builder/kss-assets/css/kss.scss')
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
    .pipe($.rename('kss.css'))
    .pipe(cond(!config.isProd,
      $.sourcemaps.write('/sourcemaps')
    ))
    .pipe(gulp.dest('styleguide-builder/kss-assets/css/'))
    .pipe(browserSync.stream({match: '**/*.css'}))
  ;
});

gulp.task('styleguide-generate', () => {

  return kss({

    // Title of the styleguide
    title: 'Falcore Styleguide',

    // Source directory to recursively parse for KSS comments
    source: 'src',

    // Destination directory of styleguide
    destination: 'dist/styleguide',

    //  File name of the homepage's Markdown file (relative to source)
    homepage: '../../README.md',

    // Location of compiled css to include with the styleguide (relative to destination)
    css: '../css/style.css',

    // Location of transpiled js to include with the styleguide (relative to destination)
    js: '../js/bundle.js',

    // Builder to use when building the styleguide (don't change this!)
    builder: 'styleguide-builder',

    // Location of modules to extend Twig (for icons and colors)
    extend: 'styleguide-builder/extend',

    // Placeholder text to use for modifier classes
    placeholder: '{{modifier_class}}',

    // Processes custom property names when parsing KSS comments
    custom: [
      'Icons',
      'Colors',
      'Usage',
      'Compiled',
      'Function',
      'Definition',
      'Mixin',
      'Map',
      'Wrapper'
    ]
  });

});

gulp.task('styleguide', gulp.series('sass', 'styleguide-sass', 'styleguide-generate'));
