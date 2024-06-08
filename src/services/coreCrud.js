const { PrismaClient } = require('@prisma/client');
const pick = require('../utils/pick'); 

class DBService {
  constructor(tableName, uniqueFields, uniques) {
    this.tableName = tableName;
    this.uniqueFields = uniqueFields;
    this.uniques = uniques;
    this.prisma = new PrismaClient();
  }

  async create(data) {
    return this.prisma[this.tableName].create({
      data: {
        ...pick(data, this.uniqueFields),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async createMany(data) {
    return this.prisma[this.tableName].createMany({
      data: data.map((item) => ({
        ...pick(item, this.uniqueFields),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  async read(identifier, index = 0) {
    return this.prisma[this.tableName].findFirst({
      where: {
        [this.uniques[index]]: identifier,
      },
    });
  }

  async readByKey(where) {
    return this.prisma[this.tableName].findFirst({ where });
  }

  async query(filter, options) {
    const { sortBy = '', limit: pageSize = 10, page = 1, select = {}, include = {} } = options;

    const orderBy = sortBy.split(',').reduce((acc, sortOption) => {
      const [key, order] = sortOption.split(':');
      acc[key] = order === 'desc' ? 'desc' : 'asc';
      return acc;
    }, {});

    const whereConditions = Object.entries(filter).reduce((conditions, [key, value]) => {
      if (key.includes('.')) {
        const [field, operator] = key.split('.');
        conditions[field] = { [operator]: value };
      } else {
        conditions[key] = value;
      }
      return conditions;
    }, {});

    const offset = (page - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      this.prisma[this.tableName].findMany({
        orderBy,
        take: Number(pageSize),
        skip: offset,
        where: whereConditions,
        ...(Object.keys(select).length > 0 ? { select } : {}),
        ...(Object.keys(include).length > 0 ? { include } : {}),
      }),
      this.prisma[this.tableName].count({ where: whereConditions }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      results: items,
      totalPages,
      limit: pageSize,
      page,
      totalResults: totalCount,
    };
  }

  async update(identifier, data, index = 0) {
    return this.prisma[this.tableName].update({
      where: { [this.uniques[index]]: identifier },
      data: {
        ...pick(data, this.uniqueFields),
        updatedAt: new Date(),
      },
    });
  }

  async delete(identifier, index = 0) {
    await this.prisma[this.tableName].delete({
      where: { [this.uniques[index]]: identifier },
    });
    return { message: `${this.tableName} deleted successfully`, status: 200 };
  }

  module() {
    return {
      create: this.create.bind(this),
      read: this.read.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      query: this.query.bind(this),
      createMany: this.createMany.bind(this),
      readByKey: this.readByKey.bind(this),
    };
  }
}

module.exports = DBService;
