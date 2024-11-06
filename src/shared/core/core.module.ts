import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TerminusModule } from '@nestjs/terminus';

import { DateService } from './services/date.service';
import { appConfig, databaseConfig, healthConfig, localeConfig, logConfig, otlpConfig } from './constants/config.constants';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, healthConfig, databaseConfig, localeConfig, logConfig, otlpConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('database'),
        }),
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                generateId: true,
                idGenerator: (req: Request) => {
                return req.headers['x-correlation-id'] || uuidv4();
                },
            },
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
            path: path.join(__dirname, '../../i18n/'),
            watch: true,
            },
            resolvers: [
                { use: HeaderResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ],
        }),
        TerminusModule.forRoot({
            logger: false,
        }),
    ],
    controllers: [HealthController],
    providers: [DateService, HealthService],
    exports: []
})
export class CoreModule {}