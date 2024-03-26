import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import prismaClient from '@/prisma/prisma.client';
import Utils from '@/utils/utils';

export class BaseService {
  protected prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  throwError(status: HttpStatus, errors: unknown) {
    return Utils.throwError(status, errors);
  }

  t(key: string, args?: Record<string, unknown>): string {
    return Utils.t(key, args);
  }
}
