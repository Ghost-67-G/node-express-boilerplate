import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './tokens';
import { User } from '../models';
import { CustomJwtPayload } from '../types';

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: CustomJwtPayload, done: (error: any, user?: any) => void) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
export { jwtStrategy };
