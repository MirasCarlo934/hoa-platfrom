import { Router, Request, Response, NextFunction } from 'express';
import loginHandler from './handlers/login';
import logoutHandler from './handlers/logout';

const authRouter = Router();

authRouter.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: undefined });
});
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);

export default authRouter;
