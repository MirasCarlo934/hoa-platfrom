import { Request, Response, NextFunction } from 'express';
import { clearToken, getToken } from '../utils/cookies';

export default function loginHandler (req: Request, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) {
    clearToken(res);
    res.render('login', { error: 'Please log in to continue.' });
  } else {
    res.redirect('/');
  }
};
