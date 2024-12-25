import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { GLOBAL_CONFIG } from '../../constants/constants';

@Injectable()
export class RedisService implements OnModuleInit {

  public redisEnabled: boolean;
  public redisGlobalPrefix: string;
  public redisClient: Redis;
  public redisSessionClient: Redis;
  public redis: any;

  constructor(
    private readonly config: ConfigService,
  ) {
    const globalConfig = this.config.get(GLOBAL_CONFIG);
    this.redisEnabled = globalConfig.redisCacheEnabled;
    this.redisGlobalPrefix = globalConfig.redisGlobalPrefix;
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async connect(): Promise<void> {
    this._createRedisClient('redisSessionClient');
    if (this.redisEnabled) {
      this._createRedisClient('redisClient');
    }
  }

  private _createRedisClient(clientName: string) {
    if (!this[clientName]) {
      this[clientName] = new Redis({
        host: this.config.get('database.redis.host'),
        port: this.config.get('database.redis.port'),
        db: this.config.get('database.redis.database'),
        keyPrefix: this.redisGlobalPrefix,
        keepAlive: 200,
        retryStrategy: (times) => {
          return Math.min(times * 50, 2000);
        }
      });
      this[clientName].on('error', (error) => {
        throw new UnauthorizedException(`Error accessing redis[${clientName}]: ${error.message}`);
      });
    }
  }

  // Add a value to a list (queue)
  async addToQueue(queueName: string, value: string): Promise<void> {
    await this.redisClient.rpush(queueName, value);
  }

  // Get the next value from the queue
  async popFromQueue(queueName: string): Promise<string | null> {
    return await this.redisClient.lpop(queueName);
  }

  // Get the length of the queue
  async getQueueLength(queueName: string): Promise<number> {
    return await this.redisClient.llen(queueName);
  }

  // Set a key with expiration time (e.g., 4 hours)
  async setWithExpiry(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.setex(key, ttl, value);
  }

  // Get a value by key
  async getValueByKey(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  // Delete a key
  async deleteKey(key: string): Promise<void> {
    await this.redisClient.del(key);
  }


}