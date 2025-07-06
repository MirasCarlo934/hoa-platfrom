import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export function loginHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.cookie('user', {
      username: username,
    });
    res.redirect('/');
  } else {
    res.status(401).render('login', { error: 'Invalid username or password' });
  }
}

export function logoutHandler(req: Request, res: Response) {
  res.clearCookie('token');
  res.redirect('/login');
}