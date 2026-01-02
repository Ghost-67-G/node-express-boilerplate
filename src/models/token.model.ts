import mongoose, { Document, Schema, Model } from 'mongoose';
import { toJSON } from './plugins';
import { tokenTypes } from '../config/tokens';
import { IToken } from '../types/index';

export interface ITokenDocument extends Omit<IToken, '_id'>, Document {
  // Remove _id from IToken to avoid conflict with Document._id
}

type ITokenModel = Model<ITokenDocument>;

const tokenSchema = new Schema<ITokenDocument>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String, // Changed from mongoose.SchemaTypes.ObjectId to String to match IToken interface
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON as any);

const Token: ITokenModel = mongoose.model<ITokenDocument, ITokenModel>('Token', tokenSchema);

export default Token;
