import { Router } from 'express';
import authenticateHandler from '../handlers/authenticate';
import logoutHandler from '../handlers/logout';
import loginPageHandler from '../handlers/login-page';
import registerHandler from '../handlers/register';
import registerPageHandler from '../handlers/register-page';

export const authRouter = Router();

authRouter.get('/login', loginPageHandler);
authRouter.post('/authenticate', authenticateHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/register', registerHandler);
authRouter.get('/register', registerPageHandler);

export default authRouter;
