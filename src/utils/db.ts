import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

/**
 * NOT TO BE USED ON PRODUCTION! This function can be called during development or testing to populate the database with initial data.
 */
export async function seedDatabase() {
  await prisma.user.delete({ 
    where: { username: 'carlo' } 
  });
  await prisma.user.create({
    data: {
      username: 'carlo',
      password: 'pass',
      role: 'ADMIN',
      firstname: 'Carlo',
      lastname: 'Miras'
    }
  });
}

export default prisma;