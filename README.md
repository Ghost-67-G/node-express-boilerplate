# Node Express TypeScript Boilerplate with Notes API

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A production-ready Node.js Express boilerplate built with **TypeScript**, featuring authentication, notes management, and organizational features. Built using Node.js, Express, TypeScript, and MongoDB with Mongoose.

This boilerplate comes with comprehensive features including JWT authentication, request validation, error handling, logging, Docker support, and a complete Notes API with organizational structure support. Perfect for building scalable RESTful APIs quickly with full type safety.

## Quick Start

Clone the repository:

```bash
git clone https://github.com/Ghost-67-G/node-express-boilerplate.git
cd node-express-boilerplate
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Set up environment variables:

```bash
cp .env.example .env
# Edit .env file with your configuration
```

Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [Docker Support](#docker-support)
- [Contributing](#contributing)

## Features

- **TypeScript**: Full TypeScript support with strict type checking and modern ES features
- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Notes Management**: Complete CRUD operations for notes with organizational structure support
- **Authentication and authorization**: using [passport](http://www.passportjs.org) with JWT tokens
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration test setup using [Jest](https://jestjs.io) with ts-jest
- **Error handling**: centralized error handling mechanism with custom ApiError class
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Sanitizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**: complete Docker setup for development and production
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io) configured for TypeScript
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Rate limiting**: API rate limiting for authentication endpoints
- **Pagination**: built-in pagination support for API responses
- **Type Safety**: Strong typing throughout the application for better development experience

## Commands

Building TypeScript:

```bash
# Build TypeScript to JavaScript
npm run build
# or
yarn build
```

Running locally in development mode:

```bash
npm run dev
# or
yarn dev
```

Running in production:

```bash
# First build the project
npm run build
# Then start the production server
npm start
# or
yarn build && yarn start
```

Testing:

```bash
# run all tests
npm test
# or
yarn test

# run all tests in watch mode
npm run test:watch
# or
yarn test:watch

# run test coverage
npm run coverage
# or
yarn coverage
```

Docker:

```bash
# run docker container in development mode
npm run docker:dev
# or
yarn docker:dev

# run docker container in production mode
npm run docker:prod
# or
yarn docker:prod

# run all tests in a docker container
npm run docker:test
# or
yarn docker:test
```

Linting:

```bash
# run ESLint
npm run lint
# or
yarn lint

# fix ESLint errors
npm run lint:fix
# or
yarn lint:fix

# run prettier
npm run prettier
# or
yarn prettier

# fix prettier errors
npm run prettier:fix
# or
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |  |--config.ts    # Main configuration with type definitions
 |  |--logger.ts    # Winston logger configuration
 |  |--passport.ts  # Passport JWT strategy
 |  |--roles.ts     # User roles and permissions
 |  |--tokens.ts    # Token types enumeration
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer) with TypeScript interfaces
 |  |--plugins\     # Custom mongoose plugins
 |--routes\         # Routes with TypeScript
 |  |--auth\        # Authentication routes, controllers, services, validations
 |  |--notes\       # Notes routes, controllers, services, validations
 |--services\       # Business logic (service layer)
 |--types\          # TypeScript type definitions and interfaces
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.ts          # Express app with TypeScript
 |--index.ts        # App entry point
dist\               # Compiled JavaScript output (generated)
tsconfig.json       # TypeScript configuration
```

### Key Directories:

- **config/**: Contains configuration files for database, JWT, logging, roles, and Passport strategies with full TypeScript support
- **middlewares/**: Custom Express middlewares for authentication, validation, error handling, and rate limiting
- **models/**: Mongoose models including User, Note, and Token models with TypeScript interfaces and custom plugins
- **routes/**: API routes organized by feature (auth, notes) with modular TypeScript structure
- **services/**: Business logic layer separated from controllers with proper typing
- **types/**: TypeScript interfaces, types, and declarations for the entire application
- **utils/**: Utility functions for error handling, async operations, and request filtering with type safety
- **dist/**: Compiled JavaScript output directory (created after running `npm run build`)

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

## API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/auth/register` - register a new user\
`POST /api/auth/login` - login\
`POST /api/auth/logout` - logout\
`POST /api/auth/refresh-tokens` - refresh auth tokens\
`POST /api/auth/forgot-password` - send reset password email\
`POST /api/auth/reset-password` - reset password\
`POST /api/auth/send-verification-email` - send verification email\
`POST /api/auth/verify-email` - verify email

**Notes routes**:\
`POST /api/notes` - create a note (requires authentication and createNote permission)\
`GET /api/notes` - get all notes with filtering and pagination (requires authentication and getNotes permission)\
`GET /api/notes/:noteId` - get a specific note (requires authentication and getNote permission)\
`PATCH /api/notes/:noteId` - update a note (requires authentication and manageNotes permission)\
`DELETE /api/notes/:noteId` - delete a note (requires authentication and manageNotes permission)

### Notes API Features:

- **Organization Support**: Notes can be associated with organizations, families, and classes
- **User Association**: Each note is linked to a user
- **Search & Filter**: Notes can be filtered by title, user_id, family_id, and class_id
- **Pagination**: Built-in pagination support for large datasets
- **Full CRUD**: Complete Create, Read, Update, Delete operations

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth(), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const notesController = require('./controller');

const router = express.Router();

router.post('/notes', auth('createNote'), notesController.create);
```

In the example above, an authenticated user can access this route only if that user has the `createNote` permission.

The permissions are role-based. The current role structure includes:

- **user**: Basic user role with limited permissions
- **admin**: Administrative role with user management permissions

**Available Permissions:**
- `getUsers`: View user information
- `manageUsers`: Full user management (create, update, delete users)
- `createNote`: Create new notes
- `getNotes`: View notes list
- `getNote`: View specific note details  
- `manageNotes`: Full note management (update, delete notes)

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `User` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Docker Support

This project includes comprehensive Docker support for different environments:

### Docker Files:
- `Dockerfile`: Main Docker image configuration
- `docker-compose.yml`: Base Docker Compose configuration
- `docker-compose.dev.yml`: Development environment overrides
- `docker-compose.prod.yml`: Production environment overrides  
- `docker-compose.test.yml`: Testing environment overrides

### Usage:

**Development:**
```bash
npm run docker:dev
# or
yarn docker:dev
```

**Production:**
```bash
npm run docker:prod
# or
yarn docker:prod
```

**Testing:**
```bash
npm run docker:test
# or
yarn docker:test
```

The Docker setup uses Node.js Alpine image for smaller footprint and includes proper user permissions and security configurations.

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Repository Information

**Author**: Ayan Naseer (ayannaseerg67@gmail.com)  
**Repository**: [https://github.com/Ghost-67-G/node-express-boilerplate](https://github.com/Ghost-67-G/node-express-boilerplate)  
**License**: MIT

## Inspirations

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [madhums/node-express-mongoose](https://github.com/madhums/node-express-mongoose)

## License

[MIT](LICENSE)
