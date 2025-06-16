module.exports = (req, res) => {
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
};
