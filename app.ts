// This needs to be at the top of the file to ensure environment variables are loaded before any other imports.
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRouter from './src/routes/auth';
import indexRouter from './src/routes';
import { seedDatabase } from './src/utils/db';

// Setup app
if (!process.env.APP_PORT) {
  throw new Error('APP_PORT environment variable must be set.');
}
const app = express();
const port = process.env.APP_PORT;
if (process.env.ENVIRONMENT !== 'PROD') {
  seedDatabase();
}

// Setup app configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Setup routes
app.use(authRouter);
app.use(indexRouter);
app.use(express.static(path.join(__dirname, 'public'))); // for access to public files

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
