import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/modules/v1/user/user.module';
import { AuthModule } from '@/modules/v1/auth/auth.module';
import database from './config/database.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from '@/mail/mail-config.service';
import mailConfig from '@/config/mail.config';
import { I18nConfigService } from '@/i18n/i18n-config.service';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from '@/guards/throttler.guard';
import { AuthModule as AuthModuleV2 } from '@/modules/v2/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, database, authConfig, mailConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return new I18nConfigService(configService).createI18nOptions();
      },
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService) => {
            return [configService.get('app.headerLanguage')];
          },
          inject: [ConfigService],
        },
        {
          use: QueryResolver,
          useFactory: (configService: ConfigService) => {
            return [configService.get('app.queryLanguage')];
          },
          inject: [ConfigService],
        },
      ],
      inject: [ConfigService],
    }),
    AuthModule,
    AuthModuleV2,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
