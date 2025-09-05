import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvVars {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION_MINUTES: number;
  JWT_REFRESH_EXPIRATION_DAYS: number;
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number;
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USERNAME?: string;
  SMTP_PASSWORD?: string;
  EMAIL_FROM?: string;
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const validatedEnvVars: EnvVars = envVars;

interface Config {
  env: string;
  port: number;
  mongoose: {
    url: string;
    options: {
      useCreateIndex: boolean;
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
    };
  };
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  };
  email: {
    smtp: {
      host?: string;
      port?: number;
      auth: {
        user?: string;
        pass?: string;
      };
    };
    from?: string;
  };
}

const config: Config = {
  env: validatedEnvVars.NODE_ENV,
  port: validatedEnvVars.PORT,
  mongoose: {
    url: validatedEnvVars.MONGODB_URL + (validatedEnvVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: validatedEnvVars.JWT_SECRET,
    accessExpirationMinutes: validatedEnvVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: validatedEnvVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: validatedEnvVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: validatedEnvVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: validatedEnvVars.SMTP_HOST,
      port: validatedEnvVars.SMTP_PORT,
      auth: {
        user: validatedEnvVars.SMTP_USERNAME,
        pass: validatedEnvVars.SMTP_PASSWORD,
      },
    },
    from: validatedEnvVars.EMAIL_FROM,
  },
};

export default config;
