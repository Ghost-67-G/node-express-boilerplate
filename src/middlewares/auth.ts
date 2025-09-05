import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights, Permission } from '../config/roles';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const verifyCallback =
  (req: AuthenticatedRequest, resolve: () => void, reject: (error: ApiError) => void, requiredRights: Permission[]) =>
  async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights?.includes(requiredRight));
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: Permission[]) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
