import { ValidationError } from '@nestjs/common';

export const i18nValidationExceptionFilterOption = {
  errorFormatter(data: ValidationError[]) {
    const customErrors: any[] = [];
    data.forEach((error) => {
      const element = {} as any;

      element.field = error.property;

      const elementErrors = [];

      for (const type in error.constraints) {
        elementErrors.push(error.constraints[type]);
      }

      element.errors = elementErrors;

      customErrors.push(element);
    });

    return customErrors;
  },
};
