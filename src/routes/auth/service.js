// server.js
const { PrismaClient } = require('@prisma/client');
const DBService = require('../../services/coreCrud');

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
const service = new DBService('users', validFields, ['id', 'email']);

const prisma = new PrismaClient();

module.exports = {
  service,
  prisma,
};
