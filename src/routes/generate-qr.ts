import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

const generateQrHandler = (req: Request, res: Response) => {
  const data = req.body;
  if (data.qrUrl) {
    QRCode.toDataURL(`${data.qrUrl}`)
      .then((url: string) => res.json({ qr: url }))
      .catch(() => res.status(500).send('Error generating QR'));
    return;
  }
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
  QRCode.toDataURL(visitUrl)
    .then((url: string) => res.json({ uuid, qr: url, visitUrl }))
    .catch(() => res.status(500).send('Error generating QR'));
};

export default generateQrHandler;
