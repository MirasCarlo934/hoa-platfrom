// This needs to be at the top of the file to ensure environment variables are loaded before any other imports.
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import generateQrHandler from './src/routes/generate-qr';
import visitorInfoHandler from './src/routes/visitor-info';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function requireJwt(req: Request, res: Response, next: Function) {
  const token = req.cookies['token'];
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

app.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: undefined });
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } else {
    res.status(401).render('login', { error: 'Invalid username or password' });
  }
});

app.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/', requireJwt, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(requireJwt, express.static(path.join(__dirname, 'public')));

app.post('/generate-qr', requireJwt, generateQrHandler as express.RequestHandler);
app.get('/visitor-info', requireJwt, visitorInfoHandler as express.RequestHandler);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
