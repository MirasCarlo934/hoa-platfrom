import { Router, Request, Response, NextFunction } from 'express';
import authenticateHandler from '../handlers/authenticate';
import logoutHandler from '../handlers/logout';

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies && req.cookies['token'];
  if (!token) {
    res.render('login', { error: undefined });
  } else {
    res.redirect('/');
  }
});
authRouter.post('/authenticate', authenticateHandler);
authRouter.post('/logout', logoutHandler);

export default authRouter;
