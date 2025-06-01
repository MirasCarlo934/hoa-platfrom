const fs = require('fs');
const path = require('path');

function serveIndex(req, res) {
  fs.readFile(path.join(__dirname, '../../public', 'index.html'), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error loading page');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
}

module.exports = serveIndex;
