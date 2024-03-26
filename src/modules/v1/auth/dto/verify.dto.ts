import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGE } from '@/constants/validation-messages';

export class VerifyDto {
  @ApiProperty({
    example: 'b1f8f1334ffa31d76c42cd4b36cb38f75403e2d3a771572e6c114bf9f49a55ef',
  })
  @IsString({ message: VALIDATION_MESSAGE.STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGE.NOT_EMPTY })
  email_verification_token: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsString({ message: VALIDATION_MESSAGE.STRING })
  @IsEmail({}, { message: VALIDATION_MESSAGE.EMAIL })
  email: string;
}
