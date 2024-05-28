const router = require('express').Router();
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const notesController = require('./controller');
const notesValidation = require('./validation');

router
  .route('/')
  .post(auth('createNote'), validate(notesValidation.createNote), notesController.create)
  .get(auth('getNotes'), validate(notesValidation.getNotes), notesController.getAll);

router
  .route('/:noteId')
  .get(auth('getNote'), validate(notesValidation.getNote), notesController.getOne)
  .patch(auth('manageNotes'), validate(notesValidation.updateNote), notesController.update)
  .delete(auth('manageNotes'), validate(notesValidation.deleteNote), notesController.remove);

module.exports = router;
