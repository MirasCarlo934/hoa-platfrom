import { Request, Response } from 'express';

export default async function indexHandler(req: Request, res: Response) {
  const user = req.cookies['user'];
  res.render('index', {user: user});
};
