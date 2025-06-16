const express = require('express');
const path = require('path');
const generateQrHandler = require('./src/routes/generate-qr');
const visitHandler = require('./src/routes/visit');
const visitorInfoHandler = require('./src/routes/visitor-info');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-qr', generateQrHandler);
app.get('/visit', visitHandler);
app.get('/visitor-info', visitorInfoHandler);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
