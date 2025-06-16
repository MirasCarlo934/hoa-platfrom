import { Request, Response } from 'express';
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

const visitHandler = (req: Request, res: Response) => {
  const encrypted = req.query.data as string;
  let decrypted: string;

  try {
    decrypted = decrypt(decodeURIComponent(encrypted));
    
    // Validate JSON structure
    JSON.parse(decrypted);

    return res.redirect(`/visitor-info?data=${encodeURIComponent(decrypted)}`);
  } catch (e) {
    decrypted = decrypt(decodeURIComponent(encrypted));
    
    // Validate JSON structure
    JSON.parse(decrypted);

    return res.redirect(`/visitor-info?data=${encodeURIComponent(decrypted)}`);
  }
};

export default visitHandler;
