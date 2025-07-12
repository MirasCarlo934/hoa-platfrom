/**
 * Authentication-related utility functions and constants.
 */
import { Request, Response } from 'express';
import getEnvVar from './env';

export const JWT_SECRET = getEnvVar('JWT_SECRET_KEY');

export function getToken(req: Request): string | null {
  return req.cookies && req.cookies['token'];
}

export function clearToken(res: Response): void {
  res.clearCookie('token');
}