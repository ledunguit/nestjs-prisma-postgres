import { User } from '@prisma/client';

export type JwtPayloadType = Pick<User, 'id' | 'email'> & {
  iat: number;
  exp: number;
};
