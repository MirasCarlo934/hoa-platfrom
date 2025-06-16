import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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
  const encoded = encodeURIComponent(JSON.stringify(qrPayload));
  const visitUrl = `http://localhost:3000/visit?data=${encoded}`;
  try {
    const url = await QRCode.toDataURL(visitUrl);
    res.json({ uuid, qr: url, visitUrl });
  } catch {
    res.status(500).send('Error generating QR');
  }
};

export default generateQrHandler;
