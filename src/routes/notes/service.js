// server.js
const { PrismaClient } = require('@prisma/client');
const DBService = require('../../services/coreCrud');

const validFields = ['id', 'user_id', 'title', 'content', 'createdAt', 'updatedAt'];
const service = new DBService('notes', validFields, ['id', 'user_id']);

const prisma = new PrismaClient();

module.exports = {
  service,
  prisma,
};
