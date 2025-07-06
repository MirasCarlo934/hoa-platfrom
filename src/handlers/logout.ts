import { Request, Response } from 'express';

export function logoutHandler(req: Request, res: Response) {
  res.clearCookie('token');
  res.redirect('/login');
}
