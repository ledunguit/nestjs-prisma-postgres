import { HttpStatus, Injectable, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthProvider, User } from '@prisma/client';
import { BaseService } from '@/modules/base/base.service';
import * as bcrypt from 'bcrypt';
import { Request as ExpressRequest } from 'express';
import { GuardPayloadType } from '@/types/auth/guard-payload.type';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ResponseProfileDto } from '@/modules/v1/user/dto/response-profile.dto';

@Injectable()
export class UserService extends BaseService {
  constructor() {
    super();
  }

  async create(createUserDto: CreateUserDto, emailVerificationToken: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    return this.prismaClient.user.create({
      data: {
        email: createUserDto.email,
        password: passwordHash,
        provider: AuthProvider.EMAIL,
        emailVerificationToken,
      },
    });
  }

  async profile(@Request() request: ExpressRequest & GuardPayloadType): Promise<ResponseProfileDto> {
    const user: User = await this.prismaClient.user.findFirst({
      where: { email: request.guardPayload.email },
    });

    if (!user) {
      this.throwError(HttpStatus.UNAUTHORIZED, {
        message: this.t('auth.profile.unauthorized-token', { value: request.guardPayload.email }),
      });
    }

    return plainToInstance(ResponseProfileDto, user);
  }
}
