import { Request, Response } from 'express';
import { User } from '../../users/entities/user.entity';

export type RequestType = Request;

export type ResponseType = Response;

export interface RequestTypeWithUser extends RequestType {
  user: User;
}

export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  mfaEnabled: boolean;
  mfaAuthenticated?: boolean;
}
