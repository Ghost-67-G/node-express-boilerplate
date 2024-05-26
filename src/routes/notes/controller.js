const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const service = require('./service');

const create = catchAsync(async (req, res) => {
  const data = await service.createNote({
    ...pick(req.body, ['user_id', 'family_id', 'class_id', 'title', 'content', 'organization_id']),
    // organization_id: req.auth.org_id,
  });
  res.status(httpStatus.CREATED).send(data);
});

const getAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'user_id', 'family_id', 'class_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (filter.title) {
    filter.title = { $regex: filter.title, $options: 'i' };
  }
  // filter.organization_id = req.auth.org_id;
  const results = await service.queryNotes(filter, options);
  res.send(results);
});

const getOne = catchAsync(async (req, res) => {
  const note = await service.getNoteById(req.params.id);
  if (!note) return res.status(httpStatus.NOT_FOUND).send({ message: 'Note not found' });
  res.send(note);
});

const update = catchAsync(async (req, res) => {
  const note = await service.updateNoteById(req.params.id, req.body);
  res.send(note);
});

const remove = catchAsync(async (req, res) => {
  await service.deleteNoteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
