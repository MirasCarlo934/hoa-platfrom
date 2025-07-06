import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { encrypt } from '../utils/crypto';

export default async function generateQrHandler (req: Request, res: Response) {
  const data = req.body;
  const uuid = uuidv4();
  const qrPayload = {
    uuid,
    visitorName: data.visitorName,
    carPlate: data.carPlate,
    personToVisit: data.personToVisit,
    addressToVisit: data.addressToVisit
  };
  const encrypted = encodeURIComponent(encrypt(JSON.stringify(qrPayload)));
  const visitUrl = `http://localhost:3000/visitor-info?data=${encrypted}`;
  try {
    const url = await QRCode.toDataURL(visitUrl);
    res.json({ uuid, qr: url, visitUrl });
  } catch {
    res.status(500).send('Error generating QR');
  }
};
