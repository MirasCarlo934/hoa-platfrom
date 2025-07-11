import { Request, Response } from 'express';
import prisma from '../utils/db';
import User, { UserType } from '../types/user';

export default async function registerHandler(req: Request, res: Response) {
  const { username, password, role, firstname, lastname } = req.body;
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).render('register', { error: 'Username already exists' });
    }
    // Create new user
    const userRaw: UserType = { username, password, role, firstname, lastname };
    await prisma.user.create({ data: userRaw });
    res.redirect('/login');
  } catch (error) {
    let errorMsg = error;
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    console.error('Registration failed:', errorMsg);
    res.status(500).render('register', { error: errorMsg });
  }
}
