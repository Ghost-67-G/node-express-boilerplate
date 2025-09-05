import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const routesPath = path.join(__dirname);

const loadRoutes = (dirPath: string): void => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readdirSync(dirPath).forEach((file: string) => {
    const fullPath = path.join(dirPath, file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const routePath = path.join(fullPath, 'route.ts');
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (fs.existsSync(routePath)) {
        // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require, global-require
        const route = require(routePath);
        router.use(`/${file}`, route.default || route);
      }
    }
  });
};
loadRoutes(routesPath);

export default router;
