import prisma from '../utils/db';

export async function authenticate(username: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username: username }
  });

  if (!user) {
    return false;
  }

  return user.password === password;
}