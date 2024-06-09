const { PrismaClient } = require('@prisma/client');
const pick = require('../utils/pick');

class DBService {
  constructor(tableName, validFields, uniques) {
    this.tableName = tableName;
    this.validFields = validFields;
    this.uniques = uniques;
    this.prisma = new PrismaClient();
  }

  async create(data) {
    return this.prisma[this.tableName].create({
      data: {
        ...pick(data, this.validFields),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async createMany(data) {
    return this.prisma[this.tableName].createMany({
      data: data.map((item) => ({
        ...pick(item, this.validFields),
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

    const whereConditions = Object.entries(filter).reduce((acc, [key, value]) => {
      if (key.includes('.')) {
        const [field, operator] = key.split('.');
        acc[field] = { [operator]: value };
      } else {
        acc[key] = value;
      }
      return acc;
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
        ...pick(data, this.validFields),
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
}

module.exports = DBService;
