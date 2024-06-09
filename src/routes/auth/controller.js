const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
// const { authService, tokenService, emailService } = require('../../services');
const { service: userService } = require('./service');

const register = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user });
});
module.exports = {
  register,
};
