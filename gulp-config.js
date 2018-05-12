/* eslint-env node */

require('dotenv').config();
const $ = require('gulp-load-plugins')();
import beep from 'beeper';
import log from 'fancy-log';
import colors from 'ansi-colors';

// -----------------------------------------------------------------------------
//   Creates a Config Object to be Used Throughout Gulpfile and Tasks
// -----------------------------------------------------------------------------
export default {
  isDev: process.env.ENVIRONMENT === 'development',
  isStage: process.env.ENVIRONMENT === 'staging',
  isProd: process.env.ENVIRONMENT === 'production',
  searchEndpoint: process.env.SEARCH_ENDPOINT,
  searchURL: process.env.SEARCH_URL,
  useMockData: process.env.MOCK_DATA === 'true',
  reportError(error) {
    const lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    $.notify({
      title: 'Task Failed',
      message: lineNumber + 'Task Failed [' + error.plugin + ']',
      sound: 'Sosumi'
    }).write(error);

    beep();

    // Pretty error reporting
    let report = '';
    const chalk = (str) => {
      return colors.bgred(str);
    };

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) {
      report += chalk('LINE:') + ' ' + error.lineNumber + '\n';
    }
    if (error.fileName) {
      report += chalk('FILE:') + ' ' + error.fileName + '\n';
    }
    log.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
  }
};
