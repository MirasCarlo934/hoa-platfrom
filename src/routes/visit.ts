import { Request, Response } from 'express';

const visitHandler = (req: Request, res: Response) => {
  const encoded = req.query.data as string;
  let decoded: any = null;
  try {
    decoded = JSON.parse(decodeURIComponent(encoded));
  } catch (e) {}
  if (decoded) {
    return res.redirect(`/visitor-info?data=${encodeURIComponent(encoded)}`);
  } else {
    return res.status(400).send('<h1>Invalid or missing data in QR code.</h1>');
  }
};

export default visitHandler;
