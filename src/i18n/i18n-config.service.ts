import { Injectable } from '@nestjs/common';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { AllConfigTypes } from '@/types/config.type';
import * as path from 'path';

@Injectable()
export class I18nConfigService {
  constructor(private readonly configService: ConfigService<AllConfigTypes>) {}

  createI18nOptions(): I18nOptionsWithoutResolvers {
    return {
      fallbackLanguage: this.configService.getOrThrow('app.fallbackLanguage', {
        infer: true,
      }),
      loaderOptions: {
        path: path.join(__dirname),
        watch: true,
      },
      // Use path from dist folder
      typesOutputPath: path.join(__dirname, '../../../src/i18n/i18n.generated.ts'),
    } as I18nOptionsWithoutResolvers;
  }
}
