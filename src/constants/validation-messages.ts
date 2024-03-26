import { i18nValidationMessage } from 'nestjs-i18n';

export const VALIDATION_MESSAGE = {
  MIN: i18nValidationMessage('validation.common.min'),
  MAX: i18nValidationMessage('validation.common.max'),
  STRING: i18nValidationMessage('validation.common.string'),
  EXISTS: i18nValidationMessage('validation.common.exists'),
  NOT_EXISTS: i18nValidationMessage('validation.common.not-exists'),
  NOT_EMPTY: i18nValidationMessage('validation.common.not-empty'),
  EMAIL: i18nValidationMessage('validation.common.email'),
};
