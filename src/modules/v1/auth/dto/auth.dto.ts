import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: VALIDATION_MESSAGE.EMAIL })
  email: string;

  @ApiProperty({ example: 'Aa@123456' })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  password: string;
}
