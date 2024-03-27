import { AuthProvider, Role, UserStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ResponseProfileDto {
  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  bio: string;

  @Expose()
  role: Role;

  @Expose()
  avatar: string;

  @Expose()
  provider: AuthProvider;

  @Expose()
  lastLoginAt: Date;

  @Expose()
  lastLoginIp: string;

  @Expose()
  status: UserStatus;
}
