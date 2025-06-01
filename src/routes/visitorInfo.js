const fs = require('fs');
const path = require('path');

function visitorInfoHandler(req, res) {
  fs.readFile(path.join(__dirname, '../../public/visitor-info.html'), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error loading visitor info page');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
}

module.exports = visitorInfoHandler;
