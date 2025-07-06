// This needs to be at the top of the file to ensure environment variables are loaded before any other imports.
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import generateQrHandler from './src/handlers/generate-qr';
import visitorInfoHandler from './src/handlers/visitor-info';
import indexHandler from './src/handlers/index';
import authRouter from './src/auth';
import { requireJwt } from './src/middleware/auth';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.use(authRouter);

app.get('/', requireJwt, indexHandler);

app.use(requireJwt, express.static(path.join(__dirname, 'public')));

app.post('/generate-qr', requireJwt, generateQrHandler as express.RequestHandler);
app.get('/visitor-info', requireJwt, visitorInfoHandler as express.RequestHandler);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
