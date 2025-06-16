const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');

module.exports = (req, res) => {
  const data = req.body;
  if (data.qrUrl) {
    QRCode.toDataURL(`${data.qrUrl}`, (err, url) => {
      if (err) return res.status(500).send('Error generating QR');
      return res.json({ qr: url });
    });
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
  QRCode.toDataURL(visitUrl, (err, url) => {
    if (err) return res.status(500).send('Error generating QR');
    return res.json({ uuid, qr: url, visitUrl });
  });
};
