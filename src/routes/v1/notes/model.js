const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('../../../models/plugins');

const noteSchema = new Schema(
  {
    user_id: {
      type: String,
      ref: 'User',
    },
    family_id: {
      type: Number,
      ref: 'Family',
    },
    class_id: {
      type: Number,
      ref: 'Class',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    organization_id: {
      type: String,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(toJSON);
noteSchema.plugin(paginate);

noteSchema.index({ user_id: 1 }, { name: 'idx_user_id' });
noteSchema.index({ organization_id: 1 }, { name: 'idx_organization_id' });
noteSchema.index({ family_id: 1 });
noteSchema.index({ class_id: 1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
