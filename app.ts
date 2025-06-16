// This needs to be at the top of the file to ensure environment variables are loaded before any other imports.
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import generateQrHandler from './src/routes/generate-qr';
import visitorInfoHandler from './src/routes/visitor-info';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-qr', generateQrHandler as express.RequestHandler);
app.get('/visitor-info', visitorInfoHandler as express.RequestHandler);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
