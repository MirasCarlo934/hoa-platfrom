const http = require('http');
const path = require('path');
const serveIndex = require('./src/routes/index');
const generateQrHandler = require('./src/routes/generateQr');
const visitHandler = require('./src/routes/visit');
const visitorInfoHandler = require('./src/routes/visitorInfo');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    serveIndex(req, res);
  } else if (req.url.startsWith('/generate-qr') && req.method === 'POST') {
    generateQrHandler(req, res, hostname, port);
  } else if (req.url.startsWith('/visit?data=')) {
    visitHandler(req, res, hostname, port);
  } else if (req.url.startsWith('/visitor-info?data=')) {
    visitorInfoHandler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
