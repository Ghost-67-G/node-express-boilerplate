import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  // Only log errors that are not common client errors
  if (config.env === 'development') {
    if (statusCode >= 500) {
      // Server errors - log with full details
      logger.error(err);
    } else if (statusCode === 404) {
      // 404 errors - just log the path that was not found
      logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    } else if (statusCode >= 400) {
      // Other client errors - log basic info
      logger.warn(`${statusCode} ${message}: ${req.method} ${req.path}`);
    }
  } else if (statusCode >= 500) {
    // Production - only log server errors
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
