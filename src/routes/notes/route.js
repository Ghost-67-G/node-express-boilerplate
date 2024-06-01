const router = require('express').Router();
const validate = require('../../middlewares/validate');
const { validateAccessToken, checkRights } = require('../../middlewares/auth');
const notesController = require('./controller');
const notesValidation = require('./validation');

router
  .route('/')
  .post(validateAccessToken, checkRights(['manageNotes']), validate(notesValidation.createNote), notesController.create)
  .get(validateAccessToken, checkRights(['manageNotes']), validate(notesValidation.getNotes), notesController.getAll);

router
  .route('/:noteId')
  .get(validateAccessToken, checkRights(['manageNotes']), validate(notesValidation.getNote), notesController.getOne)
  .patch(validateAccessToken, checkRights(['manageNotes']), validate(notesValidation.updateNote), notesController.update)
  .delete(validateAccessToken, checkRights(['manageNotes']), validate(notesValidation.deleteNote), notesController.remove);

module.exports = router;
