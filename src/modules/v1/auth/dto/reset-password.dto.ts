import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: VALIDATION_MESSAGE.EMAIL })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  email: string;

  @ApiProperty({ example: 'Aa@123456' })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  @MinLength(6, { message: VALIDATION_MESSAGE.MIN })
  password: string;

  @ApiProperty({ example: 'abc123' })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  reset_password_token: string;
}
