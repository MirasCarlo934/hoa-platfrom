import { Router, Request, Response, NextFunction } from 'express';
import loginHandler from '../handlers/login';
import logoutHandler from '../handlers/logout';
import { requireJwt } from '../middleware/auth';

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies && req.cookies['token'];
  if (!token) {
    res.render('login', { error: undefined });
  } else {
    res.redirect('/');
  }
});
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);

export default authRouter;
