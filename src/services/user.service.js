const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const DBService = require('./coreCrud');

const validFields = [
  'id',
  'email',
  'role',
  'photoURL',
  'address',
  'displayName',
  'given_name',
  'family_name',
  'username',
  'phone_number',
  'createdAt',
  'updatedAt',
];

const service = new DBService('user', validFields, ['id', 'email']);
const prisma = new PrismaClient();

const createUser = async (userBody) => {
  if (await prisma.user.findUnique({ where: { email: userBody.email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return service.create(userBody);
};

const queryUsers = async (filter, options) => {
  return service.query(filter, options);
};

const getUserById = async (id) => {
  return service.read(id);
};

const getUserByEmail = async (email) => {
  return service.readByKey({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await prisma.user.findUnique({ where: { email: updateBody.email } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return service.update(userId, updateBody);
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return service.delete(userId);
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
