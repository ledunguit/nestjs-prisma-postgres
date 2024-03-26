import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsNotExist, ['User'], {
    message: VALIDATION_MESSAGE.EXISTS,
  })
  @IsString({
    message: VALIDATION_MESSAGE.STRING,
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGE.NOT_EMPTY,
  })
  email: string;

  @ApiProperty({ example: 'Aa@123456' })
  @MinLength(6, {
    message: VALIDATION_MESSAGE.MIN,
  })
  password: string;
}
