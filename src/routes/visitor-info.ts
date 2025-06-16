import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ENCRYPTION_KEY_HEX = process.env.QR_SECRET_KEY || '7b2f684c019dbc60084edbd3b972b82d6b8b3351880ea01bb6bb9ecd9a556573'; // 32 bytes hex
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const visitorInfoHandler = (req: Request, res: Response) => {
  const dataParam = req.query.data as string;
  let decoded: any = null;
  let error = false;
  if (dataParam) {
    try {
      // Try to decrypt, if fails, treat as plain JSON
      let decrypted: string;
      try {
        decrypted = decrypt(decodeURIComponent(dataParam));
      } catch {
        decrypted = decodeURIComponent(dataParam);
      }
      decoded = JSON.parse(decrypted);
    } catch (e) {
      error = true;
    }
  } else {
    error = true;
  }
  const htmlPath = path.join(__dirname, '../../public/visitor-info.html');
  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Error loading visitor info page.');
      return;
    }
    let renderedHtml = html;
    if (!error && decoded) {
      const visitorDetails = `
        <dt>UUID</dt><dd>${decoded.uuid}</dd>
        <dt>Name of Visitor</dt><dd>${decoded.visitorName}</dd>
        <dt>Car Plate Number</dt><dd>${decoded.carPlate}</dd>
        <dt>Person to Visit</dt><dd>${decoded.personToVisit}</dd>
        <dt>Address to Visit</dt><dd>${decoded.addressToVisit}</dd>
      `;
      renderedHtml = html.replace(
        /<dl id="visitor-details"><\/dl>/,
        `<dl id="visitor-details">${visitorDetails}</dl>`
      );
      renderedHtml = renderedHtml.replace(/<script>[\s\S]*?<\/script>/, '');
      res.send(renderedHtml);
    } else {
      renderedHtml = html.replace(
        /<dl id="visitor-details"><\/dl>/,
        '<dl id="visitor-details"><dt>Error</dt><dd>Invalid or missing data in QR code.</dd></dl>'
      );
      renderedHtml = renderedHtml.replace(/<script>[\s\S]*?<\/script>/, '');
      res.status(400).send(renderedHtml);
    }
  });
};

export default visitorInfoHandler;
