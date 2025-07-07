import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { clearToken, getToken, JWT_SECRET } from '../utils/cookies';

/**
 * Middleware to require JWT authentication before accessing protected routes in the next middleware.
 * If JWT is invalid/missing, redirects to the login page.
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export function requireJwt(req: Request, res: Response, next: NextFunction) {
  // Ensure req.cookies is defined (cookie-parser must be used before this middleware)
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
