import { Request, Response } from 'express';

export default function registerPageHandler(req: Request, res: Response) {
  res.render('register', { error: undefined });
}
