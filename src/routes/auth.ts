import { Router } from 'express';
import authenticateHandler from '../handlers/authenticate';
import logoutHandler from '../handlers/logout';
import loginPageHandler from '../handlers/login-page';
import registerHandler from '../handlers/register';

export const authRouter = Router();

authRouter.get('/login', loginPageHandler);
authRouter.post('/authenticate', authenticateHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/register', registerHandler);

export default authRouter;
