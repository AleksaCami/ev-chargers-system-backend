import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { POSTGRES_CONNECTION } from './common/constants/constants';
import { BullQueueModule } from './common/modules/bull-queue/bull-queue.module';
import { LoggerModule } from './common/modules/logger/logger.module';
import { RedisModule } from './common/modules/redis/redis.module';
import { RedisService } from './common/modules/redis/redis.service';
import { ResponseService } from './common/services/response.service';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import globalConfig from './config/global.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, globalConfig, authConfig],
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
    LoggerModule,
    RedisModule,
    BullQueueModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, ResponseService],
})
export class AppModule { }
