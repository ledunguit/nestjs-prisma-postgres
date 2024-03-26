import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class BaseController {
  throwError(status: HttpStatus, errors: unknown) {
    throw new HttpException(
      {
        status: status,
        errors: errors,
      },
      status,
    );
  }

  t(key: string): string {
    return I18nContext.current().translate(key, {
      lang: I18nContext.current().lang,
    });
  }
}
