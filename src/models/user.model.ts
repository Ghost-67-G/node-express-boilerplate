import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { roles, Role } from '../config/roles';
import { IUser } from '../types/index';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginate(filter: any, options: any): any;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user' as Role,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
(userSchema as any).plugin(toJSON);
(userSchema as any).plugin(paginate);

/**
 * Check if email is taken
 * @param email - The user's email
 * @param excludeUserId - The id of the user to be excluded
 * @returns Promise<boolean>
 */
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param password - Password to check
 * @returns Promise<boolean>
 */
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
