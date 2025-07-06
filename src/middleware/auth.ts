import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/auth';

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  // Ensure req.cookies is defined (cookie-parser must be used before this middleware)
  const token = req.cookies && req.cookies['token'];
  if (!token) return res.redirect('/login');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    res.clearCookie('token');
    res.redirect('/login');
  }
}