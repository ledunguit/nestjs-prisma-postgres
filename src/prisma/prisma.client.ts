import { PrismaClient } from '@prisma/client';

// Create global Prisma Client
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

// Init Prisma Client
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

export default globalThis.prisma;
