import { Request, Response } from 'express';

export default async function homeHandler(req: Request, res: Response) {
  const user = req.cookies['user'];
  res.render('index', {user: user});
};
