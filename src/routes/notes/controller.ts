import httpStatus from 'http-status';
import pick from '../../utils/pick';
import catchAsync from '../../utils/catchAsync';
import * as noteService from './service';
import { Request, Response } from 'express';

export const create = catchAsync(async (req: Request, res: Response) => {
  const note = await noteService.createNote(req.body);
  res.status(httpStatus.CREATED).send(note);
});

export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'user_id', 'organization_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await noteService.queryNotes(filter, options);
  res.send(result);
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const note = await noteService.getNoteById(req.params.noteId);
  res.send(note);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const note = await noteService.updateNoteById(req.params.noteId, req.body);
  res.send(note);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await noteService.deleteNoteById(req.params.noteId);
  res.status(httpStatus.NO_CONTENT).send();
});
