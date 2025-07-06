import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loginHandler, logoutHandler } from './handlers/auth';

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
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);

export default authRouter;
