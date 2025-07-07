/**
 * Authentication-related utility functions and constants.
 */
import { Request, Response } from 'express';
export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export function getToken(req: Request): string | null {
  return req.cookies && req.cookies['token'];
}

export function clearToken(res: Response): void {
  res.clearCookie('token');
}