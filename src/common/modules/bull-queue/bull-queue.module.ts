import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('database.redis.host'),
          port: configService.get<number>('database.redis.port'),
          db: configService.get<number>('database.redis.database'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: 'chargingQueue',
    }),
  ],
  providers: [RedisService],
  exports: [BullModule],
})
export class BullQueueModule { }
