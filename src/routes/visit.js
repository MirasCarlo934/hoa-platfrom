function visitHandler(req, res, hostname, port) {
  const urlObj = new URL(req.url, `http://${hostname}:${port}`);
  const encoded = urlObj.searchParams.get('data');
  let decoded = null;
  try {
    decoded = JSON.parse(decodeURIComponent(encoded));
  } catch (e) {}
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if (decoded) {
    res.statusCode = 302;
    res.setHeader('Location', `/visitor-info?data=${encodeURIComponent(encoded)}`);
    res.end();
  } else {
    res.end('<h1>Invalid or missing data in QR code.</h1>');
  }
}

module.exports = visitHandler;
