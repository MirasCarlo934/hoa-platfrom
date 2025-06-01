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
        // Generate the visit URL and QR code for it
        const uuid = uuidv4();
        const qrPayload = {
          uuid,
          visitorName: data.visitorName,
          carPlate: data.carPlate,
          personToVisit: data.personToVisit,
          addressToVisit: data.addressToVisit
        };
        const encoded = encodeURIComponent(JSON.stringify(qrPayload));
        // Use the server's IP address for the visit URL
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
      // Redirect to a new endpoint that serves the visitor info page
      res.statusCode = 302;
      res.setHeader('Location', `/visitor-info?data=${encodeURIComponent(encoded)}`);
      res.end();
    } else {
      res.end('<h1>Invalid or missing data in QR code.</h1>');
    }
  } else if (req.url.startsWith('/visitor-info?data=')) {
    // Serve the visitor-info.html file and let it handle decoding
    fs.readFile(path.join(__dirname, 'visitor-info.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading visitor info page');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
