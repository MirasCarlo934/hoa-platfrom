import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { clearToken, getToken, JWT_SECRET } from '../utils/cookies';

/**
 * Middleware to require a valid JWT cookie token before accessing protected routes in the next middleware.
 * If JWT is invalid/missing, redirects to the login page.
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function requireJwtCookie(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) return res.redirect('/login');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    clearToken(res);
    res.redirect('/login');
  }
}

/**
 * Middleware to require a Bearer token in the Authorization header.
 * If the token is missing or invalid, responds with a 401 Unauthorized status.
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 * @returns 
 */
export function requireBearerToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
