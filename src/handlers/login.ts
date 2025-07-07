import { Request, Response, NextFunction } from 'express';
import { getToken } from '../utils/auth';

export default function loginHandler (req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) {
    res.render('login', { error: undefined });
  } else {
    res.redirect('/');
  }
};
