import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { encrypt } from '../utils/crypto';
import getEnvVar from '../utils/env';
import { visitorInfoRoute } from '../routes/public';

const baseUrl = getEnvVar('BASE_URL');
const port = getEnvVar('APP_PORT');

export default async function generateQrHandler(req: Request, res: Response) {
  const data = req.body;
  // Validate required fields
  if (!data.visitorName || !data.carPlate || !data.personToVisit || !data.addressToVisit) {
    res.status(400).send('Missing required fields');
  }
  const uuid = uuidv4();
  const qrPayload = {
    uuid,
    visitorName: data.visitorName,
    carPlate: data.carPlate,
    personToVisit: data.personToVisit,
    addressToVisit: data.addressToVisit
  };
  const encrypted = encodeURIComponent(encrypt(JSON.stringify(qrPayload)));
  const visitUrl = `${baseUrl}:${port}${visitorInfoRoute}?data=${encrypted}`;
  try {
    const url = await QRCode.toDataURL(visitUrl);
    res.json({ uuid, qr: url, visitUrl });
  } catch {
    res.status(500).send('Error generating QR');
  }
};
