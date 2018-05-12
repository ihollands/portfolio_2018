/* eslint-env node */
/* eslint-disable global-require */

// -----------------------------------------------------------------------------
//   Creates Mock Server for API Testing
// -----------------------------------------------------------------------------
import gulp from 'gulp';
import log from 'fancy-log';
import colors from 'ansi-colors';

import jsonServer from 'json-server';
import _ from 'underscore';
import path from 'path';
import fs from 'fs';

gulp.task('mock-data', (done) => {

  const mockDir = 'src/api';
  const base = {};
  const files = fs.readdirSync(mockDir);

  files.forEach((file) => {
    _.extend(base, require(path.resolve(mockDir, file)));
  });

  const server = jsonServer.create();
  const router = jsonServer.router(base);
  const middlewares = jsonServer.defaults({
    'port': 3001,
    'static': 'dist'
  });

  server.use(middlewares);

  router.db.assign(require('require-uncached')('../src/api/search.json')).write();

  router.render = (req, res) => {

    if (req.url.search('search') !== -1) {
      res.jsonp({
        meta: {
          totalResults: res._headers['x-total-count'],
          totalPages: Math.ceil(res._headers['x-total-count'] / req._parsedUrl.query.match(/_limit=([^&]*)/)[1])
        },
        results: res.locals.data
      });
    } else {
      res.jsonp(res.locals.data);
    }

  };

  server.use('/api', router);

  server.listen(3001, () => {
    log('[' + colors.blue('json-server') + '] ' + colors.green('JSON Server is running...'));
  });

  done();

});
