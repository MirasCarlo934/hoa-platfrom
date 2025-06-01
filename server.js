const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    // Serve HTML page
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading page');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else if (req.url.startsWith('/generate-qr') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        // If qrUrl is present, generate QR for the visit URL
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
        QRCode.toDataURL(JSON.stringify(qrPayload), (err, url) => {
          if (err) {
            res.statusCode = 500;
            res.end('Error generating QR');
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ uuid, qr: url }));
        });
      } catch (e) {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else if (req.url.startsWith('/visit?data=')) {
    // Display the decoded QR data on a webpage
    const urlObj = new URL(req.url, `http://${hostname}:${port}`);
    const encoded = urlObj.searchParams.get('data');
    let decoded = null;
    try {
      decoded = JSON.parse(decodeURIComponent(encoded));
    } catch (e) {}
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (decoded) {
      res.end(`<!DOCTYPE html><html><head><title>Visitor Info</title><style>body{font-family:sans-serif;margin:2em;}dt{font-weight:bold;}dd{margin-bottom:1em;}</style></head><body><h1>Visitor Information</h1><dl><dt>UUID</dt><dd>${decoded.uuid}</dd><dt>Name of Visitor</dt><dd>${decoded.visitorName}</dd><dt>Car Plate Number</dt><dd>${decoded.carPlate}</dd><dt>Person to Visit</dt><dd>${decoded.personToVisit}</dd><dt>Address to Visit</dt><dd>${decoded.addressToVisit}</dd></dl></body></html>`);
    } else {
      res.end('<h1>Invalid or missing data in QR code.</h1>');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
