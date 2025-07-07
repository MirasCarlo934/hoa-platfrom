import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/cookies';
import { authenticate } from '../services/auth';

export default async function authenticateHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  if (await authenticate(username, password)) {
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
