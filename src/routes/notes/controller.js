const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { service } = require('./service');

const create = catchAsync(async (req, res) => {
  const createData = { ...req.body, user_id: req.user.id };
  const data = await service.create(createData);
  res.status(httpStatus.CREATED).send(data);
});

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'user_id', 'content', 'createdAt', 'updatedAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (filter.title) {
    filter.title = { contains: filter.title };
  }
  // filter.organization_id = req.auth.org_id;
  const results = await service.query(filter, options);
  res.send(results);
});

const getOne = catchAsync(async (req, res) => {
  const note = await service.read(+req.params.id);
  if (!note) return res.status(httpStatus.NOT_FOUND).send({ message: 'Note not found' });
  res.send(note);
});

const update = catchAsync(async (req, res) => {
  const note = await service.update(+req.params.id, req.body);
  res.send(note);
});

const remove = catchAsync(async (req, res) => {
  await service.delete(+req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
