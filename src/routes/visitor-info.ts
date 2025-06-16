import { Request, Response } from 'express';
import path from 'path';

const visitorInfoHandler = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public', 'visitor-info.html'));
};

export default visitorInfoHandler;
