import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { POSTGRES_CONNECTION } from './common/constants/constants';
import { LoggerModule } from './common/modules/logger/logger.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: POSTGRES_CONNECTION,
          host: configService.get('database.postgres.host'),
          port: configService.get('database.postgres.port'),
          username: configService.get('database.postgres.user'),
          password: configService.get('database.postgres.pass'),
          database: configService.get('database.postgres.schema'),
          logging: configService.get('database.postgres.logging'),
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
