import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TerminusModule } from '@nestjs/terminus';

import { DateService } from './services/date.service';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';


@Module({
    imports: [
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