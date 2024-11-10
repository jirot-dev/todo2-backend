import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, databaseConfig, healthConfig, localeConfig, logConfig, otelConfig } from './constants/config.constant';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [appConfig, healthConfig, databaseConfig, localeConfig, logConfig, otelConfig],
        })
    ]
})
export class AppConfigModule { }