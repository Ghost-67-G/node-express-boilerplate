import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    iat: number;
    exp: number;
    type: string;
  };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface INote {
  _id: string;
  user_id: string;
  family_id?: number;
  class_id?: number;
  title: string;
  content: string;
  organization_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IToken {
  _id: string;
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginateOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

export interface PaginateResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
  type: string;
}

export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}
