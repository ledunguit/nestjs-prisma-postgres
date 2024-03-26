import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

import { registerAs } from '@nestjs/config';
import { AppConfig } from 'src/types/config.type';
import validateConfigUtils from '../utils/validate-config.utils';

export enum Environment {
  DEV = 'development',
  PRODUCTION = 'production',
}

class EnvironmentVariableValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  BACKEND_DOMAIN: string;

  @IsString()
  API_PREFIX: string;

  @IsString()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  APP_HEADER_LANGUAGE: string;
}

export default registerAs<AppConfig>('app', (): AppConfig => {
  validateConfigUtils(process.env, EnvironmentVariableValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    queryLanguage: process.env.QUERY_LANGUAGE || 'lang',
  };
});
