import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const routesPath = path.join(__dirname);

const loadRoutes = async (dirPath: string): Promise<void> => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const files = fs.readdirSync(dirPath);

  const routePromises = files.map((file) => {
    const fullPath = path.join(dirPath, file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const routePath = path.join(fullPath, 'route.ts');
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (fs.existsSync(routePath)) {
        return import(routePath).then((route) => {
          router.use(`/${file}`, route.default || route);
        });
      }
    }
    return Promise.resolve();
  });

  await Promise.all(routePromises);
};
loadRoutes(routesPath);

export default router;
