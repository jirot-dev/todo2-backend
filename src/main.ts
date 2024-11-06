import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { API_PREFIX, API_VERSION, API_V1, API_DOCS } from './shared/core/constants/routes.constants';
import { AppModule } from './app.module';
import { AppLogger } from './shared/logging/services/app-logger.logger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['debug'],
  });

  const appLogger = await app.resolve(AppLogger);
  app.useLogger(appLogger);

  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('app.cors.origin')
  });

  const config = new DocumentBuilder()
    .setVersion(API_VERSION)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${API_PREFIX}${API_DOCS}`, app, documentFactory);

  await app.listen(configService.get('app'));
}
bootstrap();
