import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as notesController from './controller';
import * as notesValidation from './validation';

const router = express.Router();

router
  .route('/')
  .post(auth('createNote'), validate(notesValidation.createNote), notesController.create)
  .get(auth('getNotes'), validate(notesValidation.getNotes), notesController.getAll);

router
  .route('/:noteId')
  .get(auth('getNote'), validate(notesValidation.getNote), notesController.getOne)
  .patch(auth('manageNotes'), validate(notesValidation.updateNote), notesController.update)
  .delete(auth('manageNotes'), validate(notesValidation.deleteNote), notesController.remove);

export default router;
