import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { DATABASE_CONFIG } from '../common/constants/constants';

dotenv.config();

export default registerAs(DATABASE_CONFIG, () => ({
  postgres: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD,
    schema: process.env.POSTGRES_DB,
    logging: process.env.DATABASE_LOGGING === 'true'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    database: process.env.REDIS_DB || 0,
  },
}))
