import { Schema, Document } from 'mongoose';

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj: Record<string, any>, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema: Schema): void => {
  let transform: any;
  if ((schema as any).options.toJSON && (schema as any).options.toJSON.transform) {
    transform = (schema as any).options.toJSON.transform;
  }

  (schema as any).options.toJSON = Object.assign((schema as any).options.toJSON || {}, {
    transform(doc: Document, ret: any, options: any) {
      Object.keys(schema.paths).forEach((path: string) => {
        if ((schema.paths[path] as any).options && (schema.paths[path] as any).options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
