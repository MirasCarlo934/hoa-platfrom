import { Request, Response } from 'express';

const indexHandler = async (req: Request, res: Response) => {
  const user = req.cookies['user'];
  res.render('index', {user: user});
};

export default indexHandler;