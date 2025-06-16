import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import crypto from 'crypto';

const ENCRYPTION_KEY_HEX = process.env.QR_SECRET_KEY || '7b2f684c019dbc60084edbd3b972b82d6b8b3351880ea01bb6bb9ecd9a556573'; // 32 bytes hex
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const generateQrHandler = async (req: Request, res: Response) => {
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
  const visitUrl = `http://localhost:3000/visit?data=${encrypted}`;
  try {
    const url = await QRCode.toDataURL(visitUrl);
    res.json({ uuid, qr: url, visitUrl });
  } catch {
    res.status(500).send('Error generating QR');
  }
};

export default generateQrHandler;
