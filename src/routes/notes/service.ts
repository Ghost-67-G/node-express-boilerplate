import httpStatus from 'http-status';
import Note from '../../models/note.model';
import ApiError from '../../utils/ApiError';

export const createNote = async (noteBody: any) => {
  return Note.create(noteBody);
};

export const queryNotes = async (filter: any, options: any) => {
  const notes = await Note.paginate(filter, options);
  return notes;
};

export const getNoteById = async (id: string) => {
  return Note.findById(id);
};

export const updateNoteById = async (noteId: string, updateBody: any) => {
  const note = await getNoteById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  Object.assign(note, updateBody);
  await note.save();
  return note;
};

export const deleteNoteById = async (noteId: string) => {
  const note = await getNoteById(noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  await note.remove();
  return note;
};
