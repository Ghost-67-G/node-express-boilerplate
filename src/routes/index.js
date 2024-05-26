const express = require('express');
const fs = require('fs');
const path = require('path');
const docsRoute = require('./docs.route');
const config = require('../config/config');

const router = express.Router();

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];
const routesPath = path.join(__dirname);

const loadRoutes = (dirPath) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const routePath = path.join(fullPath, 'route.js');
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (fs.existsSync(routePath)) {
        // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require, global-require
        const route = require(routePath);
        router.use(`/${file}`, route);
      }
    }
  });
};
loadRoutes(routesPath);
/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
