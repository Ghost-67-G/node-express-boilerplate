import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
}

interface IBookModel extends Model<IBook> {
  paginate(filter: any, options: any): any;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
(bookSchema as any).plugin(toJSON);
(bookSchema as any).plugin(paginate);

const Book: IBookModel = mongoose.model<IBook>('Book', bookSchema) as IBookModel;

export default Book;
