import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: VALIDATION_MESSAGE.EXISTS,
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsString()
  password: string;
}
