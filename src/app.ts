import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import httpStatus from 'http-status';
import config from './config/config';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';

const app: Express = express();

// set security HTTP headers
app.use(helmet());

// http request logger middleware
if (config.env !== 'test') {
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.options(
  '*',
  cors({
    origin: true,
    credentials: true,
  })
);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/auth', authLimiter);
}

// status route (before api routes)
app.get('/status', (_req: Request, res: Response) => {
  res.status(200).send('World');
});

// test error route for debugging
app.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.BAD_REQUEST, 'This is a test error'));
});

// v1 api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
