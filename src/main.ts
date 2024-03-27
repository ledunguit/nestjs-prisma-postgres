import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AllConfigTypes } from './types/config.type';
import * as morgan from 'morgan';
import { Environment } from './config/app.config';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { i18nValidationExceptionFilterOption } from './utils/i18n-validation-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  const configService = app.get(ConfigService<AllConfigTypes>);

  app.enableShutdownHooks();

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', {
      infer: true,
    }),
    {
      exclude: ['/'],
    },
  );

  app.use(compression());
  app.use(helmet());

  app.use(
    morgan(
      configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === Environment.DEV
        ? 'dev'
        : 'combined',
    ),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new I18nValidationExceptionFilter(i18nValidationExceptionFilterOption));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  const docsOption = new DocumentBuilder()
    .setTitle('LeDangDungAPI Documentation')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, docsOption);

  if (configService.get('app.nodeEnv', { infer: true }) === Environment.DEV) {
    SwaggerModule.setup('docs', app, docs);
  }

  await app.listen(configService.get('app.port', { infer: true }));
}

bootstrap();
