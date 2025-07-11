import { Router } from 'express';
import authenticateHandler from '../handlers/authenticate';
import logoutHandler from '../handlers/logout';
import loginHandler from '../handlers/login';
import registerHandler from '../handlers/register';

export const authRouter = Router();

authRouter.get('/login', loginHandler);
authRouter.post('/authenticate', authenticateHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/register', registerHandler);

export default authRouter;
