import mongoose, { Document, Schema, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

export interface INote {
  user_id: string;
  family_id?: number;
  class_id?: number;
  title: string;
  content: string;
  organization_id: string;
}

export interface INoteDocument extends INote, Document {}

interface INoteModel extends Model<INoteDocument> {
  paginate(filter: any, options: any): any;
}

const noteSchema = new Schema<INoteDocument>(
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

// Apply plugins with type assertions
(noteSchema as any).plugin(toJSON);
(noteSchema as any).plugin(paginate);

noteSchema.index({ user_id: 1 }, { name: 'idx_user_id' });
noteSchema.index({ organization_id: 1 }, { name: 'idx_organization_id' });

const Note = mongoose.model<INoteDocument, INoteModel>('Note', noteSchema);

export default Note;
