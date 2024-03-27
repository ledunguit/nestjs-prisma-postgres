import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { RedisConfig } from 'src/types/config.type';
import validateConfigUtils from '../utils/validate-config.utils';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsString()
  REDIS_PORT: string;

  @IsString()
  REDIS_USERNAME: string;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  REDIS_MONITOR_PORT: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfigUtils(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    monitorPort: process.env.REDIS_MONITOR_PORT,
  };
});
