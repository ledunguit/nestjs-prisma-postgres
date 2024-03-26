import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

const Utils = {
  throwError: (status: HttpStatus, errors: unknown) => {
    throw new HttpException(
      {
        status,
        errors,
      },
      status,
    );
  },
  t: (key: string, args?: Record<string, unknown>): string => {
    console.log(I18nContext.current().lang);

    return I18nContext.current().translate(key, {
      lang: I18nContext.current().lang,
      args,
    });
  },
};

export default Utils;
