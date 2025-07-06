import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

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

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: undefined });
});

authRouter.post('/login', (req: Request, res: Response) => {
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
});

authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/login');
});

export default authRouter;
