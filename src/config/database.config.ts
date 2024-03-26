import { IsNumber, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from '../types/config.type';
import validateConfigUtils from '../utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsNumber()
  DATABASE_PORT: number;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfigUtils(process.env, EnvironmentVariablesValidator);

  return {
    database_name: process.env.DATABASE_NAME,
    database_user: process.env.DATABASE_USER,
    database_password: process.env.DATABASE_PASSWORD,
    database_port: process.env.DATABASE_PORT,
    database_url: process.env.DATABASE_URL,
  };
});
