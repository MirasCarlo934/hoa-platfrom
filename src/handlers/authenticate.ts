import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/cookies';
import prisma from '../utils/db';
import User, { UserType } from '../types/user';

export default async function authenticateHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const userRaw: UserType | null = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!userRaw) {
      throw new Error('User not found');
    }

    const user: User = new User(userRaw)
    if (!user.validatePassword(password)) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.cookie('user', user.toJSON());
    res.redirect('/');
    
  } catch (error) {
    let errorMsg = error;
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    console.error('Authentication failed:', errorMsg);
    res.status(401).render('login', { error: errorMsg });
  }
}
