import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

import loggerConfig from '../../../config/logger.config';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loggerConfig],
      isGlobal: true
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        level: configService.get<string>('logger.logLevel'),
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          }),
        ),
        transports: [
          new transports.Console({
            level: 'info',
            format: format.combine(
              format.colorize(),
              format.simple(),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule { }
