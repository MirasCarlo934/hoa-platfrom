const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

function generateQrHandler(req, res, hostname, port) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.qrUrl) {
        QRCode.toDataURL(`${data.qrUrl}`, (err, url) => {
          if (err) {
            res.statusCode = 500;
            res.end('Error generating QR');
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ qr: url }));
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
      const visitUrl = `http://${hostname}:${port}/visit?data=${encoded}`;
      QRCode.toDataURL(visitUrl, (err, url) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error generating QR');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ uuid, qr: url, visitUrl }));
      });
    } catch (e) {
      res.statusCode = 400;
      res.end('Invalid JSON');
    }
  });
}

module.exports = generateQrHandler;
