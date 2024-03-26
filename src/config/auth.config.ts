import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { AuthConfig } from 'src/types/config.type';
import validateConfigUtils from '../utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfigUtils(process.env, EnvironmentVariablesValidator);

  return {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    jwtRefreshSecret: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshExpiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  };
});
