import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  enableDebugMessages: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: i18nValidationErrorFactory,
};

export default validationOptions;
