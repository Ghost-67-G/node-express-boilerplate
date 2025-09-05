import Joi from 'joi';

export const createNote = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

export const getNotes = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
};

export const updateNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
    })
    .min(1),
};

export const deleteNote = {
  params: Joi.object().keys({
    noteId: Joi.string().required(),
  }),
};
