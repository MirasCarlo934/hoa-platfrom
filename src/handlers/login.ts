import { Request, Response, NextFunction } from 'express';
import { authRouter } from '../routes/auth';

export default function loginHandler (req: Request, res: Response, next: NextFunction) {
  const token = req.cookies && req.cookies['token'];
  if (!token) {
    res.render('login', { error: undefined });
  } else {
    res.redirect('/');
  }
};
