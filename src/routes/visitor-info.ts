import { Request, Response } from 'express';
import { decrypt } from '../utils/crypto';

const visitorInfoHandler = (req: Request, res: Response) => {
  const dataParam = req.query.data as string;
  let decoded: any = null;
  let error = false;
  if (dataParam) {
    try {
      const decrypted = decrypt(decodeURIComponent(dataParam));
      decoded = JSON.parse(decrypted);
    } catch (e) {
      error = true;
    }
  } else {
    error = true;
  }
  res.render('visitor-info', { visitor: !error && decoded ? decoded : null });
};

export default visitorInfoHandler;
