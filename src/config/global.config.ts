import { registerAs } from '@nestjs/config';

import { GLOBAL_CONFIG } from '../common/constants/constants';

export default registerAs(GLOBAL_CONFIG, () => ({
  redisCacheEnabled: process.env.REDIS_CACHE_ENABLED === 'true',
  redisGlobalPrefix: process.env.REDIS_GLOBAL_PREFIX || 'myapp:',
}));