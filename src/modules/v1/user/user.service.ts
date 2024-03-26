import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthProvider, User } from '@prisma/client';
import { BaseService } from '@/modules/base/base.service';
import * as bcrypt from 'bcrypt';

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

  // findManyWithPagination(
  //   paginationOptions: IPaginationOptions,
  // ): Promise<User[]> {
  //   return this.usersRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //   });
  // }
  //
  // findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
  //   return this.usersRepository.findOne({
  //     where: fields,
  //   });
  // }
  //
  // update(id: number, payload: DeepPartial<User>): Promise<User> {
  //   return this.usersRepository.save(
  //     this.usersRepository.create({
  //       id,
  //       ...payload,
  //     }),
  //   );
  // }
  //
  // async softDelete(id: number): Promise<void> {
  //   await this.usersRepository.softDelete(id);
  // }
}
