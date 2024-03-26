import prismaClient from '../src/prisma/prisma.client';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';
import * as process from 'process';

async function main() {
  const salt = 10 as const;
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'password@123';

  const users: Partial<User>[] = [
    {
      email: 'admin@example.com',
      password: bcrypt.hashSync(defaultPassword, salt),
      provider: 'EMAIL',
      fullName: 'Admin',
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'ledung@example.com',
      password: bcrypt.hashSync(defaultPassword, salt),
      provider: 'EMAIL',
      fullName: 'Le Dang Dung',
      role: Role.USER,
      emailVerifiedAt: new Date(),
    },
  ];

  for (const user of users) {
    await prismaClient.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}

main()
  .then(async () => {
    prismaClient.$disconnect();
    console.log('Database seeding completed');
  })
  .catch(async (error) => {
    console.error(error);
    await prismaClient.$disconnect();
    process.exit(1);
  });
