/**
 * Authentication-related utility functions and constants.
 */
import { Request } from 'express';
export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export function authenticate(username: string, password: string): boolean {
  return password === 'password';
}

export function getToken(req: Request): string | null {
  return req.cookies && req.cookies['token'];
}