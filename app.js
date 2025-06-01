const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-qr', (req, res) => {
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
  const visitUrl = `http://localhost:${port}/visit?data=${encoded}`;
  QRCode.toDataURL(visitUrl, (err, url) => {
    if (err) return res.status(500).send('Error generating QR');
    return res.json({ uuid, qr: url, visitUrl });
  });
});

app.get('/visit', (req, res) => {
  const encoded = req.query.data;
  let decoded = null;
  try {
    decoded = JSON.parse(decodeURIComponent(encoded));
  } catch (e) {}
  if (decoded) {
    return res.redirect(`/visitor-info?data=${encodeURIComponent(encoded)}`);
  } else {
    return res.status(400).send('<h1>Invalid or missing data in QR code.</h1>');
  }
});

app.get('/visitor-info', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visitor-info.html'));
});

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
