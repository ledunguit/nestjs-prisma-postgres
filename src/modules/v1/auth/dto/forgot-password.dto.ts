import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'bRnZa@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: VALIDATION_MESSAGE.EMAIL })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  email: string;
}
