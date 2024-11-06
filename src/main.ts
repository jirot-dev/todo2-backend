import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppLogger } from './shared/logging/services/app-logger.logger';
import { AppConfig } from './shared/core/interfaces/config.interface';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.use(helmet());

  const configService: ConfigService = app.get(ConfigService);
  const appConfig: AppConfig = configService.get('app');

  app.setGlobalPrefix(appConfig.path);
  app.enableVersioning();

  const appLogger = await app.resolve(AppLogger);
  app.useLogger(appLogger);

  app.enableCors({
    origin: appConfig.cors.origin
  });

  const docConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setVersion(appConfig.version)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup(appConfig.docPath, app, documentFactory);

  await app.listen(appConfig.port);
}
bootstrap();
